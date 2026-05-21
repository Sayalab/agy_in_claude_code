import { describe, test, expect } from "bun:test";
import { askHandler, type AskConfig } from "./ask.js";

const F = import.meta.dir + "/../../test-fixtures";

const config: AskConfig = {
  cliCmdPath: `${F}/fake-codex.sh`,
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

describe("askHandler (codex)", () => {
  test("basic prompt → exec subcommand output", async () => {
    const result = await askHandler({ prompt: "hello" }, config);
    expect(result.isError).toBeUndefined();
    expect(text(result)).toContain("Hello from fake codex: hello");
  }, 10_000);

  test("with model → succeeds (model passed via -c flag)", async () => {
    const result = await askHandler({ prompt: "hello", model: "o3" }, config);
    expect(result.isError).toBeUndefined();
    expect(text(result)).toContain("Hello from fake codex: hello");
  }, 10_000);

  test("missing binary → isError", async () => {
    const result = await askHandler(
      { prompt: "hello" },
      { ...config, cliCmdPath: "/nonexistent/codex" }
    );
    expect(result.isError).toBe(true);
  }, 10_000);

  test("timeout → isError with timed out message", async () => {
    const result = await askHandler({ prompt: "hello", timeout_ms: 1 }, config);
    expect(result.isError).toBe(true);
    expect(text(result)).toMatch(/timed out/i);
  }, 10_000);
});
