import { Server, createServer } from "http";
import { registerRoutes } from "./routes/index.ts";
import { createContextMiddleware } from "./middlewares/contextMilddleware.ts";
import { createRouter } from "./router.ts";

// Export a function to create and configure the server

export function createApp(): {
  server: Server;
  router: ReturnType<typeof createRouter>;
} {
  // Initialize the router
  const router = createRouter();

  router.use(createContextMiddleware());

  // Register bitcoin routes
  registerRoutes(router);

  // Create HTTP server
  const server = createServer((req, res) => {
    router.handleRequest(req, res);
  });

  return { server, router };
}
