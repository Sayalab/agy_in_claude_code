# kilo-cli-mcp

[![npm version](https://img.shields.io/npm/v/kilo-cli-mcp.svg)](https://www.npmjs.com/package/kilo-cli-mcp)

MCP server wrapping the `kilo` (Kilocode) CLI. Exposes ping, ask-kilo, search-web, and write-file to any MCP client (Claude Code, Kilo, OpenCode, Codex, Cline, etc.).

## Prerequisites

- [Bun](https://bun.sh) v1.0+
- `kilo` installed and on PATH (or set `KILO_PATH` env var)

## Installation

```bash
npm install -g kilo-cli-mcp
# or
bunx kilo-cli-mcp
```

## Register with Claude Code

```bash
claude mcp add kilo-mcp -- npx kilo-cli-mcp
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `KILO_PATH` | `kilo` | Path to the `kilo` binary |
| `KILO_TIMEOUT_MS` | `300000` | Request timeout in ms |
| `KILO_WORKSPACE_ROOT` | `process.cwd()` | Workspace root for file operations |

## Tools

| Tool | Description |
|------|-------------|
| `ping` | Health check — shows version and binary path |
| `ask-kilo` | Run a prompt non-interactively |
| `search-web` | Web search via `kilo` |
| `write-file` | Write files within workspace |

## License

MIT
