import { describe, test, expect } from "bun:test";
import { buildArgs } from "./ask.js";

describe("buildArgs", () => {
  test("basic prompt → chat -q -Q flags", () => {
    expect(buildArgs("hi")).toEqual(["chat", "-q", "hi", "-Q"]);
  });

  test("with model → appends --model", () => {
    expect(buildArgs("hi", { model: "MiniMax" })).toEqual([
      "chat", "-q", "hi", "-Q", "--model", "MiniMax",
    ]);
  });

  test("with max_turns → appends --max-turns", () => {
    expect(buildArgs("hi", { max_turns: 5 })).toEqual([
      "chat", "-q", "hi", "-Q", "--max-turns", "5",
    ]);
  });

  test("with model and max_turns → both appended", () => {
    expect(buildArgs("hi", { model: "MiniMax", max_turns: 3 })).toEqual([
      "chat", "-q", "hi", "-Q", "--model", "MiniMax", "--max-turns", "3",
    ]);
  });
});
