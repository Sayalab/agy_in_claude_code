# hermes-cli-mcp

[![npm version](https://img.shields.io/npm/v/hermes-cli-mcp.svg)](https://www.npmjs.com/package/hermes-cli-mcp)

MCP server wrapping the `hermes` (Meta Hermes Agent) CLI. Exposes ping, ask-hermes, search-web, and write-file to any MCP client (Claude Code, Kilo, OpenCode, Codex, Cline, etc.).

## Prerequisites

- [Bun](https://bun.sh) v1.0+
- `hermes` installed and on PATH (or set `HERMES_PATH` env var)

## Installation

```bash
npm install -g hermes-cli-mcp
# or
bunx hermes-cli-mcp
```

## Register with Claude Code

```bash
claude mcp add hermes-mcp -- npx hermes-cli-mcp
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `HERMES_PATH` | `hermes` | Path to the `hermes` binary |
| `HERMES_TIMEOUT_MS` | `300000` | Request timeout in ms |
| `HERMES_WORKSPACE_ROOT` | `process.cwd()` | Workspace root for file operations |

## Tools

| Tool | Description |
|------|-------------|
| `ping` | Health check — shows version and binary path |
| `ask-hermes` | Run a prompt non-interactively |
| `search-web` | Web search via `hermes` |
| `write-file` | Write files within workspace |

## License

MIT
