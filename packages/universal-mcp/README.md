# universal-ai-cli-mcp

[![npm version](https://img.shields.io/npm/v/universal-ai-cli-mcp.svg)](https://www.npmjs.com/package/universal-ai-cli-mcp)

MCP server wrapping multiple CLIs (agy/kilo/opencode/codex/hermes). Exposes ping, ask, search-web, and write-file to any MCP client (Claude Code, Kilo, OpenCode, Codex, Cline, etc.).

## Prerequisites

- [Bun](https://bun.sh) v1.0+
- One or more of `agy`, `kilo`, `opencode`, `codex`, `hermes` installed and on PATH (or set the corresponding PATH env vars)

## Installation

```bash
npm install -g universal-ai-cli-mcp
# or
bunx universal-ai-cli-mcp
```

## Register with Claude Code

```bash
claude mcp add ai-mcp -- npx universal-ai-cli-mcp
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `AGY_PATH` | `agy` | Path to the `agy` binary |
| `KILO_PATH` | `kilo` | Path to the `kilo` binary |
| `OPENCODE_PATH` | `opencode` | Path to the `opencode` binary |
| `CODEX_PATH` | `codex` | Path to the `codex` binary |
| `HERMES_PATH` | `hermes` | Path to the `hermes` binary |
| `AI_CLI_WORKSPACE_ROOT` | `process.cwd()` | Workspace root for file operations |

## Tools

| Tool | Description |
|------|-------------|
| `ping` | Health check — shows version and binary path |
| `ask` | Run a prompt non-interactively |
| `search-web` | Web search via configured CLI |
| `write-file` | Write files within workspace |

## License

MIT
