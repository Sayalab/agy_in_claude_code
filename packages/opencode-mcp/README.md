# opencode-cli-mcp

[![npm version](https://img.shields.io/npm/v/opencode-cli-mcp.svg)](https://www.npmjs.com/package/opencode-cli-mcp)

MCP server wrapping the `opencode` CLI. Exposes ping, ask-opencode, search-web, and write-file to any MCP client (Claude Code, Kilo, OpenCode, Codex, Cline, etc.).

## Prerequisites

- [Bun](https://bun.sh) v1.0+
- `opencode` installed and on PATH (or set `OPENCODE_PATH` env var)

## Installation

```bash
npm install -g opencode-cli-mcp
# or
bunx opencode-cli-mcp
```

## Register with Claude Code

```bash
claude mcp add opencode-mcp -- npx opencode-cli-mcp
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `OPENCODE_PATH` | `opencode` | Path to the `opencode` binary |
| `OPENCODE_TIMEOUT_MS` | `300000` | Request timeout in ms |
| `OPENCODE_WORKSPACE_ROOT` | `process.cwd()` | Workspace root for file operations |

## Tools

| Tool | Description |
|------|-------------|
| `ping` | Health check — shows version and binary path |
| `ask-opencode` | Run a prompt non-interactively |
| `search-web` | Web search via `opencode` |
| `write-file` | Write files within workspace |

## License

MIT
