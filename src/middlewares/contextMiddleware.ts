import { AsyncLocalStorage } from "node:async_hooks";
import { IncomingMessage, ServerResponse } from "node:http";
import crypto from "node:crypto";

export interface RequestContext {
  traceId: string;
  timestamp: number;
}

export const asyncLocalStorage = new AsyncLocalStorage<RequestContext>();

function generateTraceId(): string {
  return crypto.randomUUID();
}

export function createContextMiddleware() {
  return async (
    req: IncomingMessage,
    res: ServerResponse,
    next: () => Promise<void> | void,
  ) => {
    const context: RequestContext = {
      traceId: generateTraceId(),
      timestamp: Date.now(),
    };

    res.setHeader("X-Trace-ID", context.traceId);

    await asyncLocalStorage.run(context, async () => {
      await next();
    });
  };
}

export function getContext(): RequestContext {
  return asyncLocalStorage.getStore()!;
}
