import { describe, test, beforeEach, mock, afterEach } from "node:test";
import assert from "assert/strict";
import {
  createContextMiddleware,
  getContext,
  asyncLocalStorage,
} from "./contextMilddleware.ts";
import type { RequestContext } from "./contextMilddleware.ts";
import { IncomingMessage, ServerResponse } from "node:http";

describe("Context Middleware", () => {
  beforeEach(() => {
    // Reset mocks if any were used with node:test's mock API
    mock.reset();

    // Ensure context is clear before each test
    if (asyncLocalStorage.getStore()) {
      // This scenario shouldn't happen if tests are isolated, but as a safeguard
      asyncLocalStorage.disable();
    }
  });

  afterEach(() => {
    // Ensure context is cleared after test runs
    if (asyncLocalStorage.getStore()) {
      asyncLocalStorage.disable();
    }
  });

  describe("createContextMiddleware", () => {
    test("should set context, header, call next, and provide context via getContext", async () => {
      // Mock dependencies
      const mockReq = {} as IncomingMessage;
      const mockSetHeader = mock.fn();
      const mockRes = {
        setHeader: mockSetHeader,
      } as unknown as ServerResponse;

      let contextInsideNext: RequestContext | undefined;
      const next = mock.fn(async () => {
        contextInsideNext = getContext();
      });

      const middleware = createContextMiddleware();
      await middleware(mockReq, mockRes, next);

      // Assert setHeader was called correctly
      assert.strictEqual(
        mockSetHeader.mock.calls.length,
        1,
        "setHeader should be called once",
      );
      assert.strictEqual(
        typeof mockSetHeader.mock.calls[0].arguments[0],
        "string",
        "setHeader first argument should be a string",
      );

      // Assert next was called
      assert.strictEqual(
        next.mock.calls.length,
        1,
        "next should be called once",
      );

      // Assert context was available and correct inside next
      assert.ok(contextInsideNext);
    });
  });
});
