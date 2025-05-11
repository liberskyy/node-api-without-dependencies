import { IncomingMessage, ServerResponse } from "node:http";
import {
  getBitcoinRates,
  getBitcoinRatesByCurrency,
} from "../services/bitcoinService.ts";
import type { Router } from "../router.ts";

export function bitcoinRoutes(router: Router): void {
  router.get(
    "/v1/bitcoin/rates",
    async (_req: IncomingMessage, res: ServerResponse) => {
      const rates = await getBitcoinRates();
      res.statusCode = 200;
      res.end(JSON.stringify(rates));
    },
  );

  router.get(`/v1/bitcoin/rates/:currency`, async (req, res, params) => {
    const currency = params.currency as string;
    if (!currency) {
      res.statusCode = 400;
      res.end(JSON.stringify({ error: "Currency is required" }));
      return;
    }

    const rates = await getBitcoinRatesByCurrency(currency);
    if (!rates) {
      res.statusCode = 404;
      res.end(JSON.stringify({ error: "Currency not found" }));
      return;
    }

    res.statusCode = 200;
    res.end(JSON.stringify(rates));
  });
}
