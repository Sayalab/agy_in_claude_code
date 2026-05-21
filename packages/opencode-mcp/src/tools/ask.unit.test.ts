import { describe, test, expect } from "bun:test";
import { buildArgs } from "./ask.js";

describe("buildArgs", () => {
  test("basic prompt → run subcommand", () => {
    expect(buildArgs("hi")).toEqual(["run", "hi"]);
  });

  test("with model → appends --model", () => {
    expect(buildArgs("hi", { model: "gpt-4o" })).toEqual(["run", "hi", "--model", "gpt-4o"]);
  });

  test("no opts → no extra args", () => {
    expect(buildArgs("hello world")).toEqual(["run", "hello world"]);
  });
});
