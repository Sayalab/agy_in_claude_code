import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { runCli, CliNotFoundError, mcpText, mcpError } from "mcp-cli-core";

interface PingConfig {
  cliCmdPath: string;
  workspaceRoot: string;
}

export async function pingHandler(config: PingConfig): Promise<CallToolResult> {
  try {
    const result = await runCli(["--version"], { cliCmdPath: config.cliCmdPath });
    const version = result.stdout.trim();
    return mcpText(
      [
        `kilo version: ${version}`,
        `binary path: ${config.cliCmdPath}`,
        `executable: true`,
        `workspace root: ${config.workspaceRoot}`,
      ].join("\n")
    );
  } catch (e) {
    if (e instanceof CliNotFoundError) {
      return mcpError(`kilo binary not found: ${config.cliCmdPath}`);
    }
    const message = e instanceof Error ? e.message : String(e);
    return mcpError(`ping failed: ${message}`);
  }
}
