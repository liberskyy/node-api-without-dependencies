import { DatabaseSync } from "node:sqlite";
import type { BitcoinRates, CurrencyRate } from "../services/bitcoinService.ts";
import { getContext } from "../middlewares/contextMiddleware.ts";

const database = new DatabaseSync(":memory:");

database.exec(`
    CREATE TABLE bitcoinRates(
      symbol TEXT PRIMARY KEY,
      last REAL,
      buy REAL,
      sell REAL,
      "15m" REAL,
      timestamp INTEGER
    ) STRICT
  `);

const BITCOIN_RATES_TABLE = "bitcoinRates";
const BITCOIN_RATE_TTL_MINUTES = 10;
const BITCOIN_RATE_TTL_MS = BITCOIN_RATE_TTL_MINUTES * 60 * 1000;

export function saveBitcoinRates(rates: BitcoinRates): Promise<number> {
  const rateEntries = Object.entries(rates);
  if (!rateEntries.length) {
    return Promise.resolve(0);
  }

  return new Promise<number>((resolve) => {
    const valuePlaceholders = rateEntries
      .map(() => "(?, ?, ?, ?, ?, ?)")
      .join(", ");

    const context = getContext();

    const stmt = database.prepare(
      `INSERT OR REPLACE INTO ${BITCOIN_RATES_TABLE} (symbol, last, buy, sell, "15m", timestamp) VALUES ${valuePlaceholders}`,
    );

    const values = rateEntries.flatMap(([symbol, rate]) => [
      symbol,
      rate.last,
      rate.buy,
      rate.sell,
      rate["15m"],
      context.timestamp,
    ]);

    const result = stmt.run(...values);

    resolve(result.changes as number);
  });
}

export function findAllBitcoinRates(): CurrencyRate[] {
  const context = getContext();
  const currentTimestamp = context.timestamp;

  const expirationTimestamp = currentTimestamp - BITCOIN_RATE_TTL_MS;
  const query = database.prepare(
    `SELECT symbol, last, buy, sell, "15m", timestamp FROM ${BITCOIN_RATES_TABLE} WHERE timestamp >= ?`,
  );

  // Can't pass the expected type to the query
  const result = query.all(expirationTimestamp);
  if (result.length === 0) {
    return [];
  }

  return result.map((row) => row as unknown as CurrencyRate);
}

export function findBitcoinRatesBySymbol(symbol: string): CurrencyRate | null {
  const query = database.prepare(
    `SELECT symbol, last, buy, sell, "15m", timestamp FROM ${BITCOIN_RATES_TABLE} WHERE symbol = ?`,
  );

  // Can't pass the expected type to the query
  const result = query.all(symbol);

  if (result.length === 0 || !result[0]) {
    return null;
  }

  return result[0] as unknown as CurrencyRate;
}
