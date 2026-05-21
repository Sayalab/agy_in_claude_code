import { describe, test, expect } from "bun:test";
import { buildArgs } from "./ask.js";

describe("buildArgs", () => {
  test("agy: --print flag", () => {
    expect(buildArgs("hi", "agy")).toEqual(["--print", "hi"]);
  });

  test("kilo: run subcommand", () => {
    expect(buildArgs("hi", "kilo")).toEqual(["run", "hi"]);
  });

  test("kilo: with model appends --model", () => {
    expect(buildArgs("hi", "kilo", { model: "claude-sonnet" })).toEqual([
      "run", "hi", "--model", "claude-sonnet",
    ]);
  });

  test("opencode: run subcommand", () => {
    expect(buildArgs("hi", "opencode")).toEqual(["run", "hi"]);
  });

  test("opencode: with model appends --model", () => {
    expect(buildArgs("hi", "opencode", { model: "gpt-4o" })).toEqual([
      "run", "hi", "--model", "gpt-4o",
    ]);
  });

  test("codex: exec subcommand", () => {
    expect(buildArgs("hi", "codex")).toEqual(["exec", "hi"]);
  });

  test("codex: with model appends -c model=", () => {
    expect(buildArgs("hi", "codex", { model: "o3" })).toEqual([
      "exec", "hi", "-c", 'model="o3"',
    ]);
  });

  test("hermes: chat -q -Q flags", () => {
    expect(buildArgs("hi", "hermes")).toEqual(["chat", "-q", "hi", "-Q"]);
  });

  test("hermes: with model appends --model", () => {
    expect(buildArgs("hi", "hermes", { model: "MiniMax" })).toEqual([
      "chat", "-q", "hi", "-Q", "--model", "MiniMax",
    ]);
  });

  test("hermes: with max_turns appends --max-turns", () => {
    expect(buildArgs("hi", "hermes", { max_turns: 5 })).toEqual([
      "chat", "-q", "hi", "-Q", "--max-turns", "5",
    ]);
  });

  test("hermes: model and max_turns both appended", () => {
    expect(buildArgs("hi", "hermes", { model: "MiniMax", max_turns: 3 })).toEqual([
      "chat", "-q", "hi", "-Q", "--model", "MiniMax", "--max-turns", "3",
    ]);
  });
});
