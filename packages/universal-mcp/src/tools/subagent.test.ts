import { describe, test, expect, beforeEach } from "bun:test";
import { makeSubHandler, getResultHandler, jobs } from "./subagent.js";

const F = import.meta.dir + "/../../test-fixtures";

const config = {
  paths: {
    agy: `${F}/fake-agy.sh`,
    kilo: `${F}/fake-kilo.sh`,
    opencode: `${F}/fake-opencode.sh`,
    codex: `${F}/fake-codex.sh`,
    hermes: `${F}/fake-hermes.sh`,
  },
  timeoutMs: 10_000,
  workspaceRoot: "/tmp",
  maxConcurrent: 5,
  debug: false,
};

function text(result: ReturnType<typeof getResultHandler>): string {
  const item = result.content[0];
  if (item.type !== "text") throw new Error("expected text content");
  return item.text;
}

function extractJobId(subText: string): string {
  const match = subText.match(/Job (\S+) started/);
  if (!match) throw new Error(`no job ID in: ${subText}`);
  return match[1];
}

beforeEach(() => {
  jobs.clear();
});

describe("makeSubHandler + getResultHandler", () => {
  test("successful job → status done, result text returned", async () => {
    const handler = makeSubHandler("agy", config);
    const subResult = handler({ prompt: "hello" }, undefined);
    const jobId = extractJobId(text(subResult));

    await new Promise((r) => setTimeout(r, 500));

    const result = getResultHandler(jobId);
    expect(text(result)).toContain("Hello from fake agy: hello");
  }, 10_000);

  test("failed job (missing binary) → status error, 'failed' in result", async () => {
    const badConfig = { ...config, paths: { ...config.paths, agy: "/nonexistent/agy" } };
    const handler = makeSubHandler("agy", badConfig);
    const subResult = handler({ prompt: "hello" }, undefined);
    const jobId = extractJobId(text(subResult));

    await new Promise((r) => setTimeout(r, 500));

    const result = getResultHandler(jobId);
    expect(text(result)).toContain("failed");
  }, 10_000);

  test("running job → 'still running' message, job stays in map", async () => {
    const handler = makeSubHandler("agy", config);
    const subResult = handler({ prompt: "hello" }, undefined);
    const jobId = extractJobId(text(subResult));

    const result = getResultHandler(jobId);
    expect(text(result)).toContain("still running");
  }, 10_000);

  test("get-result on unknown job → 'not found' message", () => {
    const result = getResultHandler("nonexistent-id");
    expect(text(result)).toContain("not found");
  });

  test("completed job is deleted from map after get-result", async () => {
    const handler = makeSubHandler("agy", config);
    const subResult = handler({ prompt: "hello" }, undefined);
    const jobId = extractJobId(text(subResult));

    await new Promise((r) => setTimeout(r, 500));

    getResultHandler(jobId);
    expect(jobs.has(jobId)).toBe(false);
  }, 10_000);
});
