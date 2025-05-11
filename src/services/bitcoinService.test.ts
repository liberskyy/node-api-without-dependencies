import { describe, test, beforeEach, mock, afterEach } from "node:test";
import {
  fetchBitcoinRates,
  getBitcoinRates,
  getBitcoinRatesByCurrency,
} from "./bitcoinService.ts";
import assert from "assert/strict";
import * as bitcoinRepository from "../repositories/bitcoinRepository.ts";
import { asyncLocalStorage } from "../middlewares/contextMilddleware.ts";

describe("Bitcoin Service", () => {
  beforeEach(() => {
    mock.reset();
    mock.restoreAll();
  });

  afterEach(() => {
    // Ensure context is cleared after test runs
    if (asyncLocalStorage.getStore()) {
      asyncLocalStorage.disable();
    }
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

  describe("getBitcoinRates", () => {
    const mockBitcoinApiResponse = {
      USD: {
        "15m": 10000,
        last: 10000,
        buy: 10000,
        sell: 10000,
        symbol: "USD",
      },
    };
    beforeEach(() => {
      mock.method(global, "fetch", () => {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve(mockBitcoinApiResponse),
        });
      });
    });

    test("should return cached rates if available", async () => {
      // Needs to wrap tests in asyncLocalStorage.run callback to simulate the context
      asyncLocalStorage.run(
        {
          traceId: "test-trace-id",
          timestamp: 123456789,
        },
        async () => {
          await getBitcoinRates();

          const rates = await getBitcoinRates();
          assert.partialDeepStrictEqual(rates[0], {
            ...mockBitcoinApiResponse.USD,
            timestamp: 123456789,
          });
        },
      );
    });

    test("should fetch rates from API if cache is empty", async () => {
      asyncLocalStorage.run(
        {
          traceId: "test-trace-id",
          timestamp: 123456789,
        },
        async () => {
          const result = await getBitcoinRates();
          const expected = {
            ...mockBitcoinApiResponse.USD,
            timestamp: 123456789,
          };
          assert.partialDeepStrictEqual(result[0], expected);
        },
      );
    });
  });

  describe("getBitcoinRatesByCurrency", () => {
    test("should fetch rates and update the cache", async () => {
      asyncLocalStorage.run(
        {
          traceId: "test-trace-id",
          timestamp: 123456789,
        },
        async () => {
          const result = await getBitcoinRatesByCurrency("USD");

          const expected = {
            "15m": 10000,
            last: 10000,
            buy: 10000,
            sell: 10000,
            symbol: "USD",
            timestamp: 123456789,
          };
          assert.partialDeepStrictEqual(result, expected);

          const cachedRates = bitcoinRepository.findAllBitcoinRates();
          assert.partialDeepStrictEqual(cachedRates[0], expected);
        },
      );
    });
  });
});
