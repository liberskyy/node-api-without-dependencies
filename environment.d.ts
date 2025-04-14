export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      BITCOIN_TICKER_URL: string;
      PORT: string;
    }
  }
}
