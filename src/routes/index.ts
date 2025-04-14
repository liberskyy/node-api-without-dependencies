import type { Router } from "../router.ts";
import { bitcoinRoutes } from "./bitcoinRoutes.ts";
import { versionRoutes } from "./versionRoutes.ts";

export function registerRoutes(router: Router) {
  bitcoinRoutes(router);
  versionRoutes(router);
}
