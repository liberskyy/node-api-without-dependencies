import { Server, createServer } from "http";
import { registerRoutes } from "./routes/index.ts";
import { createContextMiddleware } from "./middlewares/contextMiddleware.ts";
import { createRouter } from "./router.ts";

export function createApp(): {
  server: Server;
  router: ReturnType<typeof createRouter>;
} {
  const router = createRouter();

  router.use(createContextMiddleware());

  registerRoutes(router);

  const server = createServer((req, res) => {
    router.handleRequest(req, res);
  });

  return { server, router };
}
