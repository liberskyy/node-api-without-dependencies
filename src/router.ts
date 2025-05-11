import { IncomingMessage, ServerResponse } from "node:http";
import { parse } from "node:url";

type RouteHandler = (
  req: IncomingMessage,
  res: ServerResponse,
  params: Record<string, unknown>,
) => Promise<void> | void;

type Middleware = (
  req: IncomingMessage,
  res: ServerResponse,
  next: () => Promise<void> | void,
) => Promise<void> | void;

interface Route {
  method: string;
  pattern: RegExp;
  path: string;
  handler: RouteHandler;
}

export interface Router {
  get(path: string, handler: RouteHandler): void;
  handleRequest(req: IncomingMessage, res: ServerResponse): Promise<void>;
  getRoutes(): Route[];
  use(middleware: Middleware): void;
}

export function createRouter(): Router {
  const routes: Route[] = [];
  const middlewares: Middleware[] = [];

  return {
    get(path: string, handler: RouteHandler): void {
      // Convert path parameters like :currency to named regex capture groups
      const patternString = path
        .replace(/\/:([^/]+)/g, "/(?<$1>[^/]+)")
        .replace(/\//g, "\\/");

      const pattern = new RegExp(`^${patternString}$`);
      routes.push({ method: "GET", pattern, handler, path });
    },

    use(middleware: Middleware): void {
      middlewares.push(middleware);
    },

    async handleRequest(
      req: IncomingMessage,
      res: ServerResponse,
    ): Promise<void> {
      const method = req.method || "GET";
      const url = req.url || "/";

      try {
        const { pathname, query } = parse(url, true);

        // Create a middleware chain with the route handler at the end
        let currentMiddlewareIndex = 0;

        const runMiddlewareStack = async (): Promise<void> => {
          // If we've gone through all middleware, look for a route
          if (currentMiddlewareIndex >= middlewares.length) {
            // Find matching route
            for (const route of routes) {
              if (route.method !== method) continue;

              const match = pathname?.match(route.pattern);
              if (match) {
                const params = match.groups || {};

                // Set default headers
                res.setHeader("Content-Type", "application/json");

                // Pass query parameters along with route params
                await route.handler(req, res, { ...params, query });
                return;
              }
            }

            // No route found
            res.statusCode = 404;
            res.end(JSON.stringify({ error: "Not Found" }));
            return;
          }

          // Get the current middleware
          const middleware = middlewares[currentMiddlewareIndex];
          currentMiddlewareIndex++;

          // Execute the middleware with the next function
          await middleware(req, res, runMiddlewareStack);
        };

        // Start running the middleware stack
        await runMiddlewareStack();
      } catch (error) {
        console.error("Error handling request:", error);
        res.statusCode = 500;
        res.end(JSON.stringify({ error: "Internal Server Error" }));
      }
    },

    getRoutes(): Route[] {
      return routes;
    },
  };
}
