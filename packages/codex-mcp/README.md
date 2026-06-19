# codex-cli-mcp

[![npm version](https://img.shields.io/npm/v/codex-cli-mcp.svg)](https://www.npmjs.com/package/codex-cli-mcp)

MCP server wrapping the `codex` (OpenAI Codex CLI) CLI. Exposes ping, ask-codex, search-web, and write-file to any MCP client (Claude Code, Kilo, OpenCode, Codex, Cline, etc.).

## Prerequisites

- [Bun](https://bun.sh) v1.0+
- `codex` installed and on PATH (or set `CODEX_PATH` env var)

## Installation

```bash
npm install -g codex-cli-mcp
# or
bunx codex-cli-mcp
```

## Register with Claude Code

```bash
claude mcp add codex-mcp -- npx codex-cli-mcp
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `CODEX_PATH` | `codex` | Path to the `codex` binary |
| `CODEX_TIMEOUT_MS` | `300000` | Request timeout in ms |
| `CODEX_WORKSPACE_ROOT` | `process.cwd()` | Workspace root for file operations |

## Tools

| Tool | Description |
|------|-------------|
| `ping` | Health check — shows version and binary path |
| `ask-codex` | Run a prompt non-interactively |
| `search-web` | Web search via `codex` |
| `write-file` | Write files within workspace |

## License

MIT
