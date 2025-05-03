import { AsyncLocalStorage } from "node:async_hooks";
import { IncomingMessage, ServerResponse } from "node:http";
import crypto from "node:crypto";

// Define the context type
export interface RequestContext {
  traceId: string;
  timestamp: number;
}

// Create an AsyncLocalStorage instance to hold our context
export const asyncLocalStorage = new AsyncLocalStorage<RequestContext>();

/**
 * Generates a random trace ID for request tracking
 */
function generateTraceId(): string {
  return crypto.randomUUID();
}

/**
 * Creates a middleware that sets up a context with traceId for each request
 */
export function createContextMiddleware() {
  return async (
    req: IncomingMessage,
    res: ServerResponse,
    next: () => Promise<void> | void,
  ) => {
    // Create a new context for this request
    const context: RequestContext = {
      traceId: generateTraceId(),
      timestamp: Date.now(),
    };

    // Add trace ID as response header
    res.setHeader("X-Trace-ID", context.traceId);

    // Run the request handler within the context
    await asyncLocalStorage.run(context, async () => {
      await next();
    });
  };
}

/**
 * Helper function to get the current request context
 */
export function getContext(): RequestContext {
  return asyncLocalStorage.getStore()!;
}
