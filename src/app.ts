import { Server, createServer } from "http";
import { createRouter } from "./router";
import { registerRoutes } from "./routes";

// Export a function to create and configure the server

export function createApp(): {
  server: Server;
  router: ReturnType<typeof createRouter>;
} {
  // Initialize the router
  const router = createRouter();

  // Register bitcoin routes
  registerRoutes(router);

  // Create HTTP server
  const server = createServer((req, res) => {
    router.handleRequest(req, res);
  });

  return { server, router };
}
