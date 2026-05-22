import { describe, test, expect } from "bun:test";
import { askHandler, type AskConfig, type McpExtra } from "./ask.js";

const F = import.meta.dir + "/../../test-fixtures";

const config: AskConfig = {
  cliCmdPath: `${F}/fake-hermes.sh`,
  timeoutMs: 10_000,
  workspaceRoot: "/tmp",
  maxConcurrent: 5,
  debug: false,
};

function text(result: Awaited<ReturnType<typeof askHandler>>): string {
  const item = result.content[0];
  if (item.type !== "text") throw new Error("expected text content");
  return item.text;
}

describe("askHandler (hermes)", () => {
  test("basic prompt → chat -q output", async () => {
    const result = await askHandler({ prompt: "hello" }, config);
    expect(result.isError).toBeUndefined();
    expect(text(result)).toContain("Hello from fake hermes: hello");
  }, 10_000);

  test("with model → succeeds", async () => {
    const result = await askHandler({ prompt: "hello", model: "MiniMax" }, config);
    expect(result.isError).toBeUndefined();
    expect(text(result)).toContain("Hello from fake hermes: hello");
  }, 10_000);

  test("with max_turns → succeeds", async () => {
    const result = await askHandler({ prompt: "hello", max_turns: 5 }, config);
    expect(result.isError).toBeUndefined();
    expect(text(result)).toContain("Hello from fake hermes: hello");
  }, 10_000);

  test("missing binary → isError", async () => {
    const result = await askHandler(
      { prompt: "hello" },
      { ...config, cliCmdPath: "/nonexistent/hermes" }
    );
    expect(result.isError).toBe(true);
  }, 10_000);

  test("timeout → isError with timed out message", async () => {
    const result = await askHandler({ prompt: "hello", timeout_ms: 1 }, config);
    expect(result.isError).toBe(true);
    expect(text(result)).toMatch(/timed out/i);
  }, 10_000);

  test("progress notifications emitted when extra has progressToken", async () => {
    const notifications: unknown[] = [];
    const mockExtra = {
      _meta: { progressToken: "tok-1" },
      sendNotification: async (n: unknown) => { notifications.push(n); },
    } as unknown as McpExtra;
    const result = await askHandler({ prompt: "hello" }, config, mockExtra);
    expect(result.isError).toBeUndefined();
    expect(notifications.length).toBeGreaterThan(0);
    const first = notifications[0] as { method: string; params: { progressToken: string } };
    expect(first.method).toBe("notifications/progress");
    expect(first.params.progressToken).toBe("tok-1");
  }, 10_000);
});
