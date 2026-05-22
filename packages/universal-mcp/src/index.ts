import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { writeHandler } from "mcp-cli-core";
import {
  TIMEOUT_MS,
  SEARCH_TIMEOUT_MS,
  WORKSPACE_ROOT,
  MAX_CONCURRENT,
  DEBUG,
  AGY_PATH,
  KILO_PATH,
  OPENCODE_PATH,
  CODEX_PATH,
  HERMES_PATH,
} from "./config.js";
import { pingHandler } from "./tools/ping.js";
import { askHandler, type CliName } from "./tools/ask.js";
import { usageHandler } from "./tools/usage.js";

const server = new McpServer({ name: "universal-ai-cli-mcp", version: "1.0.2" });

const paths = {
  agy: AGY_PATH,
  kilo: KILO_PATH,
  opencode: OPENCODE_PATH,
  codex: CODEX_PATH,
  hermes: HERMES_PATH,
};

const askConfig = {
  paths,
  timeoutMs: TIMEOUT_MS,
  workspaceRoot: WORKSPACE_ROOT,
  maxConcurrent: MAX_CONCURRENT,
  debug: DEBUG,
};

const sharedAskInput = {
  prompt: z.string().max(10_000).describe("The prompt to send"),
  cwd: z.string().optional().describe("Working directory override"),
  timeout_ms: z.number().int().min(1000).max(600_000).optional().describe("Timeout in ms"),
  model: z.string().optional().describe("Model override (e.g. 'anthropic/claude-sonnet-4' for kilo/opencode/hermes, 'o3' for codex)"),
};

function makeAskHandler(via: CliName) {
  return (input: { prompt: string; cwd?: string; timeout_ms?: number; model?: string; max_turns?: number }, extra: unknown) =>
    askHandler({ ...input, via }, askConfig, extra as Parameters<typeof askHandler>[2]);
}

server.registerTool("get-usage", {
  description: "Get token usage and cost statistics for kilo, opencode, and hermes. codex and agy do not expose usage data.",
  inputSchema: {},
}, () => usageHandler(paths));

server.registerTool("ping", {
  description: "Check health and version of all AI CLI tools (agy, kilo, opencode, codex, hermes)",
  inputSchema: {},
}, () => pingHandler({ ...paths, workspaceRoot: WORKSPACE_ROOT }));

server.registerTool("ask-agy", {
  description: "Run a prompt with agy (antigravity) non-interactively.",
  inputSchema: sharedAskInput,
}, makeAskHandler("agy"));

server.registerTool("ask-kilo", {
  description: "Run a prompt with kilo (kilocode) non-interactively.",
  inputSchema: { ...sharedAskInput, model: z.string().optional().describe("Model override (e.g. 'anthropic/claude-sonnet-4')") },
}, makeAskHandler("kilo"));

server.registerTool("ask-opencode", {
  description: "Run a prompt with opencode non-interactively.",
  inputSchema: { ...sharedAskInput, model: z.string().optional().describe("Model override (e.g. 'anthropic/claude-sonnet-4')") },
}, makeAskHandler("opencode"));

server.registerTool("ask-codex", {
  description: "Run a prompt with codex (OpenAI Codex CLI) non-interactively.",
  inputSchema: { ...sharedAskInput, model: z.string().optional().describe("Model override (e.g. 'o3', 'o4-mini')") },
}, makeAskHandler("codex"));

server.registerTool("ask-hermes", {
  description: "Run a prompt with hermes non-interactively.",
  inputSchema: {
    ...sharedAskInput,
    model: z.string().optional().describe("Model override (e.g. 'anthropic/claude-sonnet-4')"),
    max_turns: z.number().int().min(1).max(200).optional().describe("Max tool-calling iterations"),
  },
}, (input, extra) => makeAskHandler("hermes")(input, extra));

server.registerTool("search-web", {
  description: "Search the web using agy. Results are AI-generated.",
  inputSchema: {
    query: z.string().max(500).describe("The search query"),
  },
}, (input, extra) =>
  askHandler(
    { prompt: `Search the web for: ${input.query}`, via: "agy", timeout_ms: SEARCH_TIMEOUT_MS },
    askConfig,
    extra as Parameters<typeof askHandler>[2]
  )
);

server.registerTool("write-file", {
  description: "Write exact content to a file within the workspace. Path must be relative or within the workspace root.",
  inputSchema: {
    path: z.string().describe("File path (relative to workspace root)"),
    content: z.string().max(500_000).describe("Exact content to write"),
    create_parents: z.boolean().default(false).describe("Create parent directories if missing"),
  },
}, (input) =>
  writeHandler({ path: input.path, content: input.content, create_parents: input.create_parents }, WORKSPACE_ROOT)
);

const transport = new StdioServerTransport();
await server.connect(transport);
