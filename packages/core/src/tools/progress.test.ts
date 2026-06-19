import { describe, test, expect } from "bun:test";
import { makeProgressEmitter } from "../index.js";

describe("makeProgressEmitter", () => {
  test("undefined progressToken → returns null", () => {
    const result = makeProgressEmitter(undefined, async () => {});
    expect(result).toBeNull();
  });

  test("defined progressToken → returns a function", () => {
    const result = makeProgressEmitter("tok", async () => {});
    expect(typeof result).toBe("function");
  });

  test("calling emitter → sendNotification called with correct payload", async () => {
    const calls: unknown[] = [];
    const emitter = makeProgressEmitter("tok", async (n) => { calls.push(n); });
    await emitter!("chunk");
    expect(calls).toHaveLength(1);
    expect(calls[0]).toEqual({
      method: "notifications/progress",
      params: { progressToken: "tok", progress: 1, message: "chunk" },
    });
  });

  test("calling emitter twice → progress increments", async () => {
    const calls: unknown[] = [];
    const emitter = makeProgressEmitter("tok", async (n) => { calls.push(n); });
    await emitter!("first");
    await emitter!("second");
    expect((calls[1] as any).params.progress).toBe(2);
  });

  test("sendNotification throws → emitter swallows error", async () => {
    const emitter = makeProgressEmitter("tok", async () => { throw new Error("boom"); });
    await expect(emitter!("chunk")).resolves.toBeUndefined();
  });
});
