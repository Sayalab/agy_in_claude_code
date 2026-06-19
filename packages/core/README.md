# mcp-cli-core

Shared core library for AI CLI MCP servers. Provides subprocess runner, path security, error types, progress notifications, and file write handler.

## Usage

```ts
import { runCli, validatePath, writeHandler, makeProgressEmitter } from "mcp-cli-core";
import { mcpText, mcpError, CliNotFoundError, CliTimeoutError, CliExitError } from "mcp-cli-core";
```

Used internally by `kilo-cli-mcp`, `opencode-cli-mcp`, `codex-cli-mcp`, `hermes-cli-mcp`, and `universal-ai-cli-mcp`.

## License

MIT
