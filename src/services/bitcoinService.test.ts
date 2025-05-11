import { describe, test, beforeEach, mock } from "node:test";
import { fetchBitcoinRates } from "./bitcoinService.ts";
import assert from "assert/strict";

describe("Bitcoin Service", () => {
  beforeEach(() => {
    mock.reset();
    mock.restoreAll();
  });

  describe("fetchBitcoinRates", () => {
    test("should throw an error if the response is not ok", (ctx) => {
      ctx.mock.method(global, "fetch", () => {
        return Promise.resolve({
          ok: false,
          status: 404,
          json: () => Promise.resolve({}),
        });
      });

      assert.rejects(async () => {
        await fetchBitcoinRates();
      }, new Error("HTTP error! Status: 404"));
    });

    test("should return Bitcoin rates", async (ctx) => {
      const mockResponse = {
        USD: {
          "15m": 10000,
          last: 10000,
          buy: 10000,
          sell: 10000,
          symbol: "$",
        },
      };

      ctx.mock.method(global, "fetch", () => {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve(mockResponse),
        });
      });

      const rates = await fetchBitcoinRates();
      assert.deepEqual(rates, mockResponse);
    });
  });
});
