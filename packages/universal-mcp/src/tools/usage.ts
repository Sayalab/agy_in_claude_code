import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { runCli, CliExitError, mcpText } from "mcp-cli-core";
import type { RunCliOpts, RunCliResult } from "mcp-cli-core";

export interface StatsResult {
  ok: boolean;
  output: string;
}

interface UsagePaths {
  agy: string;
  kilo: string;
  opencode: string;
  codex: string;
  hermes: string;
}

const NO_TRACKING =
  "⚠ No balance tracking — this CLI does not expose usage or cost statistics.\n" +
  "   Check your provider dashboard directly.";

export function freeTierWarning(output: string): string {
  const match = output.match(/Total Cost\s+\$?([\d.]+)/);
  if (match && parseFloat(match[1]) === 0) {
    return (
      "ℹ  Free tier detected (Total Cost $0.00). " +
      "Token limits may apply — if prompts start failing, check your provider's free quota."
    );
  }
  return "";
}

function balanceSection(result: StatsResult): string {
  if (!result.ok) return `✗ Free token limit likely exhausted or auth error:\n${result.output}`;
  const warn = freeTierWarning(result.output);
  return warn ? `${result.output}\n\n${warn}` : result.output;
}

export function buildUsageReport(
  kilo: StatsResult,
  opencode: StatsResult,
  hermes: StatsResult
): string {
  const hermesBody = hermes.ok
    ? hermes.output
    : `✗ Failed to fetch insights:\n${hermes.output}`;

  return [
    `═══ agy ═══\n${NO_TRACKING}`,
    `═══ kilo ═══\n${balanceSection(kilo)}`,
    `═══ opencode ═══\n${balanceSection(opencode)}`,
    `═══ codex ═══\n${NO_TRACKING}`,
    `═══ hermes ═══\n${hermesBody}`,
  ].join("\n\n");
}

type Runner = (args: string[], opts: RunCliOpts) => Promise<RunCliResult>;

export async function fetchStats(
  name: string,
  cliPath: string,
  args: string[],
  runner: Runner = runCli
): Promise<StatsResult> {
  try {
    const result = await runner(args, { cliCmdPath: cliPath, timeoutMs: 10_000, maxConcurrent: 10 });
    return { ok: true, output: result.stdout.trim() };
  } catch (e) {
    if (e instanceof CliExitError) {
      const combined = [e.stdout, e.stderr].filter(Boolean).join("\n").trim();
      return { ok: false, output: combined || `${name} stats exited with code ${e.exitCode}` };
    }
    return { ok: false, output: e instanceof Error ? e.message : String(e) };
  }
}

export async function usageHandler(paths: UsagePaths): Promise<CallToolResult> {
  const [kilo, opencode, hermes] = await Promise.all([
    fetchStats("kilo", paths.kilo, ["stats"]),
    fetchStats("opencode", paths.opencode, ["stats"]),
    fetchStats("hermes", paths.hermes, ["insights"]),
  ]);
  return mcpText(buildUsageReport(kilo, opencode, hermes));
}
