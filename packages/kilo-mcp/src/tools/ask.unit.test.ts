import { describe, test, expect } from "bun:test";
import { buildArgs } from "./ask.js";

describe("buildArgs", () => {
  test("basic prompt → run subcommand", () => {
    expect(buildArgs("hi")).toEqual(["run", "hi"]);
  });

  test("with model → appends --model", () => {
    expect(buildArgs("hi", { model: "claude" })).toEqual(["run", "hi", "--model", "claude"]);
  });

  test("no opts → no extra args", () => {
    expect(buildArgs("hello world")).toEqual(["run", "hello world"]);
  });
});
