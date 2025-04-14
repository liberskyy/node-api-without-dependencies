import { IncomingMessage, ServerResponse } from "node:http";
import { parse } from "node:url";

type RouteHandler = (
  req: IncomingMessage,
  res: ServerResponse,
  params: Record<string, unknown>,
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
}

export function createRouter(): Router {
  const routes: Route[] = [];

  return {
    get(path: string, handler: RouteHandler): void {
      // Convert path parameters like :currency to named regex capture groups
      const patternString = path
        .replace(/\/:([^/]+)/g, "/(?<$1>[^/]+)")
        .replace(/\//g, "\\/");

      const pattern = new RegExp(`^${patternString}$`);
      routes.push({ method: "GET", pattern, handler, path });
    },

    async handleRequest(
      req: IncomingMessage,
      res: ServerResponse,
    ): Promise<void> {
      const method = req.method || "GET";
      const url = req.url || "/";

      try {
        const { pathname, query } = parse(url, true);

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
