import { describe, test, expect } from "bun:test";
import { buildArgs } from "./ask.js";

describe("buildArgs", () => {
  test("basic prompt → exec subcommand", () => {
    expect(buildArgs("hi")).toEqual(["exec", "hi"]);
  });

  test("with model → appends -c model=", () => {
    expect(buildArgs("hi", { model: "o3" })).toEqual(["exec", "hi", "-c", 'model="o3"']);
  });

  test("no opts → no extra args", () => {
    expect(buildArgs("hello world")).toEqual(["exec", "hello world"]);
  });
});
