import { describe, test, expect } from "bun:test";
import { pingHandler } from "./ping.js";

const F = import.meta.dir + "/../../test-fixtures";

function text(result: Awaited<ReturnType<typeof pingHandler>>): string {
  const item = result.content[0];
  if (item.type !== "text") throw new Error("expected text content");
  return item.text;
}

describe("pingHandler (codex)", () => {
  test("binary found → version and workspace in output", async () => {
    const result = await pingHandler({
      cliCmdPath: `${F}/fake-codex.sh`,
      workspaceRoot: "/my/workspace",
    });
    expect(result.isError).toBeUndefined();
    expect(text(result)).toContain("codex-cli 0.130.0");
    expect(text(result)).toContain("/my/workspace");
  }, 10_000);

  test("missing binary → isError", async () => {
    const result = await pingHandler({
      cliCmdPath: "/nonexistent/codex",
      workspaceRoot: "/tmp",
    });
    expect(result.isError).toBe(true);
  }, 10_000);
});
