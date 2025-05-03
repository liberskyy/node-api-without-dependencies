import { IncomingMessage, ServerResponse } from "node:http";
import {
  getBitcoinRates,
  fetchBitcoinRatesByCurrency,
} from "../services/bitcoinService.ts";
import type { Router } from "../router.ts";

export function bitcoinRoutes(router: Router): void {
  router.get(
    "/v1/bitcoin/rate",
    async (_req: IncomingMessage, res: ServerResponse) => {
      const rates = await getBitcoinRates();
      res.statusCode = 200;
      res.end(JSON.stringify(rates));
    },
  );

  router.get(`/v1/bitcoin/rate/:currency`, async (req, res, params) => {
    const currency = params.currency as string;
    if (!currency) {
      res.statusCode = 400;
      res.end(JSON.stringify({ error: "Currency is required" }));
      return;
    }

    const rates = await fetchBitcoinRatesByCurrency(currency);
    if (!rates) {
      res.statusCode = 404;
      res.end(JSON.stringify({ error: "Currency not found" }));
      return;
    }

    res.statusCode = 200;
    res.end(JSON.stringify(rates));
  });
}
