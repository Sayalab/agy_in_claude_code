import { describe, test, expect, afterAll } from "bun:test";
import { mkdir, rm } from "fs/promises";
import { writeHandler } from "../index.js";

const ROOT = `/tmp/write-handler-test-${Date.now()}`;

afterAll(async () => {
  await rm(ROOT, { recursive: true, force: true });
});

function text(result: Awaited<ReturnType<typeof writeHandler>>): string {
  const item = result.content[0];
  if (item.type !== "text") throw new Error("expected text content");
  return item.text;
}

describe("writeHandler", () => {
  test("path traversal → mcpError mentioning escapes workspace", async () => {
    await mkdir(ROOT, { recursive: true });
    const result = await writeHandler({ path: "../../etc/passwd", content: "x" }, ROOT);
    expect(result.isError).toBe(true);
    expect(text(result)).toContain("escapes workspace");
  });

  test("missing parent dir, create_parents=false → mcpError", async () => {
    await mkdir(ROOT, { recursive: true });
    const result = await writeHandler(
      { path: "nonexistent/sub/file.txt", content: "x", create_parents: false },
      ROOT
    );
    expect(result.isError).toBe(true);
  });

  test("create_parents=true creates dirs and writes file", async () => {
    await mkdir(ROOT, { recursive: true });
    const result = await writeHandler(
      { path: "new/sub/file.txt", content: "hello", create_parents: true },
      ROOT
    );
    expect(result.isError).toBeUndefined();
    expect(await Bun.file(`${ROOT}/new/sub/file.txt`).text()).toBe("hello");
  });

  test("valid path → reports byte count", async () => {
    await mkdir(ROOT, { recursive: true });
    const result = await writeHandler({ path: "direct.txt", content: "world" }, ROOT);
    expect(result.isError).toBeUndefined();
    expect(text(result)).toContain("Written");
    expect(await Bun.file(`${ROOT}/direct.txt`).text()).toBe("world");
  });
});
