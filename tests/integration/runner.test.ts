import { describe, test, expect, afterAll } from "bun:test";
import { runCli, CliExitError, CliNotFoundError, writeHandler } from "mcp-cli-core";
import { mkdtempSync, rmSync } from "fs";
import { tmpdir } from "os";
import { getTextContent } from "../helpers.js";

const FAKE_AGY = import.meta.dir + "/../../test-fixtures/fake-agy.sh";
const SLOW_AGY = import.meta.dir + "/../../test-fixtures/fake-agy-slow.sh";
const workspace = mkdtempSync(tmpdir() + "/agy-int-");

afterAll(() => {
  try { rmSync(workspace, { recursive: true }); } catch {}
});

describe("integration: runCli with real fake-agy.sh", () => {
  test("returns real stdout from --version", async () => {
    const result = await runCli(["--version"], { cliCmdPath: FAKE_AGY });
    expect(result.stdout.trim()).toBe("1.0.0");
    expect(result.exitCode).toBe(0);
    expect(result.timedOut).toBe(false);
  });

  test("returns real stdout from --print", async () => {
    const result = await runCli(["--print", "world"], { cliCmdPath: FAKE_AGY });
    expect(result.stdout).toContain("Hello from fake agy: world");
  });

  test("throws CliExitError with real exit code 1", async () => {
    try {
      await runCli(["--bad"], { cliCmdPath: FAKE_AGY });
      expect(true).toBe(false);
    } catch (e) {
      expect(e).toBeInstanceOf(CliExitError);
      expect((e as CliExitError).exitCode).toBe(1);
    }
  });

  test("throws CliNotFoundError for missing binary", async () => {
    await expect(
      runCli(["--version"], { cliCmdPath: "/no/such/binary" })
    ).rejects.toBeInstanceOf(CliNotFoundError);
  });
});

describe("integration: streaming onChunk with real subprocess", () => {
  test("receives multiple chunks from slow agy", async () => {
    const chunks: string[] = [];
    await runCli(["--print", "x"], {
      cliCmdPath: SLOW_AGY,
      onChunk: (c) => chunks.push(c),
    });
    const text = chunks.join("");
    expect(text).toContain("chunk one");
    expect(text).toContain("chunk two");
    expect(text).toContain("chunk three");
    expect(chunks.length).toBeGreaterThanOrEqual(1);
  }, 5_000);

  test("final result matches accumulated chunks", async () => {
    const chunks: string[] = [];
    const result = await runCli(["--print", "x"], {
      cliCmdPath: SLOW_AGY,
      onChunk: (c) => chunks.push(c),
    });
    expect(result.stdout).toBe(chunks.join(""));
  }, 5_000);
});

describe("integration: writeHandler with real filesystem", () => {
  test("creates real file on disk", async () => {
    const result = await writeHandler(
      { path: "hello.txt", content: "integration test", create_parents: false },
      workspace
    );
    expect(result.isError).toBeUndefined();
    expect(getTextContent(result)).toContain("Written");
    const text = await Bun.file(workspace + "/hello.txt").text();
    expect(text).toBe("integration test");
  });

  test("creates nested dirs and file when create_parents=true", async () => {
    const result = await writeHandler(
      { path: "a/b/c.txt", content: "nested", create_parents: true },
      workspace
    );
    expect(result.isError).toBeUndefined();
    const text = await Bun.file(workspace + "/a/b/c.txt").text();
    expect(text).toBe("nested");
  });

  test("rejects path outside workspace", async () => {
    const result = await writeHandler(
      { path: "../escape.txt", content: "x" },
      workspace
    );
    expect(result.isError).toBe(true);
  });
});
