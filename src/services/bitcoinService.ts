interface CurrencyRate {
  "15m": number;
  last: number;
  buy: number;
  sell: number;
  symbol: string;
}

interface BitcoinRates {
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

export async function fetchBitcoinRatesByCurrency(
  currency: string,
): Promise<CurrencyRate | null> {
  const rates = await fetchBitcoinRates();
  return rates[currency] || null;
}
