import { IncomingMessage, ServerResponse } from "http";
import type { Router } from "../router.ts";

export function versionRoutes(router: Router): void {
  router.get(
    "/v1/version",
    async (_req: IncomingMessage, res: ServerResponse) => {
      const packageInfo = await import("../../package.json", {
        with: { type: "json" },
      });

      res.statusCode = 200;
      res.end(JSON.stringify({ version: packageInfo.default.version }));
    },
  );
}
