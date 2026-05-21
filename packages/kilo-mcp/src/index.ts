import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { writeHandler } from "mcp-cli-core";
import {
  KILO_PATH,
  KILO_TIMEOUT_MS,
  KILO_SEARCH_TIMEOUT_MS,
  KILO_WORKSPACE_ROOT,
  KILO_MAX_CONCURRENT,
  KILO_DEBUG,
} from "./config.js";
import { pingHandler } from "./tools/ping.js";
import { askHandler } from "./tools/ask.js";

const server = new McpServer({ name: "kilo-cli-mcp", version: "1.0.0" });

const askConfig = {
  cliCmdPath: KILO_PATH,
  timeoutMs: KILO_TIMEOUT_MS,
  workspaceRoot: KILO_WORKSPACE_ROOT,
  maxConcurrent: KILO_MAX_CONCURRENT,
  debug: KILO_DEBUG,
};

server.registerTool(
  "ping",
  {
    description: "Check kilo health and version",
    inputSchema: {},
  },
  () => pingHandler({ cliCmdPath: KILO_PATH, workspaceRoot: KILO_WORKSPACE_ROOT })
);

server.registerTool(
  "ask-kilo",
  {
    description: "Run a prompt with kilo non-interactively. Results are AI-generated.",
    inputSchema: {
      prompt: z.string().max(10_000).describe("The prompt to send to kilo"),
      cwd: z.string().optional().describe("Working directory override"),
      timeout_ms: z.number().int().min(1000).max(600_000).optional().describe("Timeout in ms"),
      model: z.string().optional().describe("Model override (e.g. anthropic/claude-sonnet-4)"),
    },
  },
  (input, extra) => askHandler({ ...input }, askConfig, extra)
);

server.registerTool(
  "search-web",
  {
    description:
      "Search the web via kilo. Results come from kilo's AI + web access — not a deterministic search API.",
    inputSchema: {
      query: z.string().max(500).describe("The search query"),
    },
  },
  (input, extra) =>
    askHandler(
      { prompt: `Search the web for: ${input.query}` },
      { ...askConfig, timeoutMs: KILO_SEARCH_TIMEOUT_MS },
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
      KILO_WORKSPACE_ROOT
    )
);

const transport = new StdioServerTransport();
await server.connect(transport);
