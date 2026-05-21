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

const server = new McpServer({ name: "universal-ai-cli-mcp", version: "1.0.0" });

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

const CLI_NAMES = ["agy", "kilo", "opencode", "codex", "hermes"] as const;

server.registerTool(
  "get-usage",
  {
    description:
      "Get token usage and cost statistics for all AI CLI tools. " +
      "Shows stats for kilo, opencode, and hermes. " +
      "Warns when free tier tokens are exhausted. " +
      "codex and agy do not expose usage data.",
    inputSchema: {},
  },
  () => usageHandler(paths)
);

server.registerTool(
  "ping",
  {
    description: "Check health and version of all AI CLI tools (agy, kilo, opencode, codex, hermes)",
    inputSchema: {},
  },
  () => pingHandler({ ...paths, workspaceRoot: WORKSPACE_ROOT })
);

server.registerTool(
  "ask",
  {
    description:
      "Run a prompt with any AI CLI tool non-interactively. Choose `via` to select which tool to use.",
    inputSchema: {
      prompt: z.string().max(10_000).describe("The prompt to send"),
      via: z
        .enum(CLI_NAMES)
        .describe(
          "Which AI CLI to use: agy (antigravity), kilo (kilocode), opencode, codex (OpenAI), hermes"
        ),
      cwd: z.string().optional().describe("Working directory override"),
      timeout_ms: z.number().int().min(1000).max(600_000).optional().describe("Timeout in ms"),
      model: z
        .string()
        .optional()
        .describe("Model override — syntax varies by tool (e.g. 'anthropic/claude-sonnet-4' for kilo/opencode/hermes, 'o3' for codex)"),
      max_turns: z
        .number()
        .int()
        .min(1)
        .max(200)
        .optional()
        .describe("Max tool-calling iterations (hermes only)"),
    },
  },
  (input, extra) =>
    askHandler(
      {
        prompt: input.prompt,
        via: input.via as CliName,
        cwd: input.cwd,
        timeout_ms: input.timeout_ms,
        model: input.model,
        max_turns: input.max_turns,
      },
      askConfig,
      extra
    )
);

server.registerTool(
  "search-web",
  {
    description: "Search the web using any AI CLI tool. Results are AI-generated, not a deterministic API.",
    inputSchema: {
      query: z.string().max(500).describe("The search query"),
      via: z
        .enum(CLI_NAMES)
        .default("agy")
        .describe("Which AI CLI to use for the search"),
    },
  },
  (input, extra) =>
    askHandler(
      {
        prompt: `Search the web for: ${input.query}`,
        via: (input.via ?? "agy") as CliName,
        timeout_ms: SEARCH_TIMEOUT_MS,
      },
      askConfig,
      extra
    )
);

server.registerTool(
  "write-file",
  {
    description:
      "Write exact content to a file within the workspace. Path must be relative or within the workspace root.",
    inputSchema: {
      path: z.string().describe("File path (relative to workspace root)"),
      content: z.string().max(500_000).describe("Exact content to write"),
      create_parents: z.boolean().default(false).describe("Create parent directories if missing"),
    },
  },
  (input) =>
    writeHandler(
      { path: input.path, content: input.content, create_parents: input.create_parents },
      WORKSPACE_ROOT
    )
);

const transport = new StdioServerTransport();
await server.connect(transport);
