import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { runCli, CliNotFoundError, mcpText, mcpError } from "mcp-cli-core";

interface PingConfig {
  agyCmdPath: string;
  workspaceRoot: string;
}

export async function pingHandler(config: PingConfig): Promise<CallToolResult> {
  try {
    const result = await runCli(["--version"], { cliCmdPath: config.agyCmdPath });
    const version = result.stdout.trim();
    const text = [
      `agy version: ${version}`,
      `binary path: ${config.agyCmdPath}`,
      `executable: true`,
      `workspace root: ${config.workspaceRoot}`,
    ].join("\n");
    return mcpText(text);
  } catch (e) {
    if (e instanceof CliNotFoundError) {
      return mcpError(`agy binary not found: ${config.agyCmdPath}`);
    }
    const message = e instanceof Error ? e.message : String(e);
    return mcpError(`ping failed: ${message}`);
  }
}
