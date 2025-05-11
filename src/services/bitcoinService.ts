import {
  findAllBitcoinRates,
  findBitcoinRatesBySymbol,
  saveBitcoinRates,
} from "../repositories/bitcoinRepository.ts";

export interface CurrencyRate {
  "15m": number;
  last: number;
  buy: number;
  sell: number;
  symbol: string;
  timestamp: number;
}

export interface BitcoinRates {
  [currency: string]: CurrencyRate;
}

const BITCOIN_TICKER_URL = process.env.BITCOIN_TICKER_URL;

export async function fetchBitcoinRates(): Promise<BitcoinRates> {
  const response = await fetch(BITCOIN_TICKER_URL, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  return (await response.json()) as BitcoinRates;
}

export async function getBitcoinRates(): Promise<CurrencyRate[]> {
  const cachedRates = findAllBitcoinRates();
  if (cachedRates.length) {
    return cachedRates;
  }

  const fetchedRates = await fetchBitcoinRates();
  if (!fetchedRates) {
    throw new Error("Failed to fetch Bitcoin rates");
  }

  // Don't wait for the save to finish
  // This is a fire-and-forget operation
  saveBitcoinRates(fetchedRates);

  return Object.values(fetchedRates);
}

export async function getBitcoinRatesByCurrency(
  currency: string,
): Promise<CurrencyRate | null> {
  const cachedRate = findBitcoinRatesBySymbol(currency);
  if (cachedRate) {
    return cachedRate;
  }

  const rates = await getBitcoinRates();
  return rates[currency] || null;
}
