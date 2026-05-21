import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";

export function mcpText(text: string): CallToolResult {
  return { content: [{ type: "text", text }] };
}

export function mcpError(text: string): CallToolResult {
  return { content: [{ type: "text", text }], isError: true };
}

export interface RunCliResult {
  stdout: string;
  stderr: string;
  exitCode: number;
  timedOut: boolean;
}

export class CliNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CliNotFoundError";
  }
}

export class CliTimeoutError extends Error {
  stdout: string;
  stderr: string;
  constructor(message: string, stdout: string, stderr: string) {
    super(message);
    this.name = "CliTimeoutError";
    this.stdout = stdout;
    this.stderr = stderr;
  }
}

export class CliExitError extends Error {
  exitCode: number;
  stdout: string;
  stderr: string;
  constructor(message: string, exitCode: number, stdout: string, stderr: string) {
    super(message);
    this.name = "CliExitError";
    this.exitCode = exitCode;
    this.stdout = stdout;
    this.stderr = stderr;
  }
}

export class CliConcurrencyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CliConcurrencyError";
  }
}

export class CliPathError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CliPathError";
  }
}
