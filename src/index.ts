import { createServer } from "node:http";
import { createRouter } from "./router.ts";
import { registerRoutes } from "./routes/index.ts";

const PORT = parseInt(process.env.PORT) || 3000;

// Initialize the router
const router = createRouter();

// Register bitcoin routes
registerRoutes(router);

// Create HTTP server
const server = createServer((req, res) => {
  router.handleRequest(req, res);
});

// Start server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  router.getRoutes().forEach((route) => {
    console.log(`${route.method} ${route.path} registered`);
  });
});
