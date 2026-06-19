# sayalabs-mcp

[![npm version](https://img.shields.io/npm/v/sayalabs-mcp.svg)](https://www.npmjs.com/package/sayalabs-mcp)

An MCP (Model Context Protocol) server wrapping the `agy` (antigravity) CLI. This server exposes the capabilities of the `agy` tool to MCP clients like Claude Code, Codex, OpenCode, Cline, Kilocode, Kilo, and other stdio JSON-RPC compatible LLM interfaces.

## Features

- Exposes 4 core tools: `ping`, `ask-agy`, `search-web`, and `write-file`.
- Manages subprocess execution using Bun's fast `Bun.spawn` engine.
- Implements concurrency limits and resource constraints (timeout, max memory/output bytes, workspace directory confinement).
- Emits real-time streaming progress notifications back to the LLM client using MCP `notifications/progress` protocol.
- Strict path validation to ensure file access does not escape the workspace.

## Verified Integrations

| Client | Verified |
| :--- | :---: |
| Claude Code | ✓ |
| Codex CLI | ✓ |
| OpenCode | ✓ |
| Cline | ✓ |
| Kilo CLI | ✓ |

---

## Installation & Registration

### Prerequisites

- **Bun** (v1.0.0 or higher) installed.
- **agy** (antigravity CLI) binary installed on your system.

### Installation

1. Install globally via npm/bun:
```bash
npm install -g sayalabs-mcp
# or
bun add -g sayalabs-mcp
```

2. Or use directly with npx/bunx without installing:
```bash
npx sayalabs-mcp
# or
bunx sayalabs-mcp
```

### Registering with Claude Code

```bash
# Using npm (after global install or via npx)
claude mcp add sayalabs-mcp -- npx sayalabs-mcp

# Development mode (from source)
claude mcp add sayalabs-mcp -- bun /path/to/sayalabs-mcp/src/index.ts
```

### Registering with Codex CLI

#### Option A: Project-scoped Config (Automatic)

Codex will automatically load the server if you start it from inside this project directory, thanks to the included `.codex/config.toml` file:

```toml
[mcp_servers.sayalabs-mcp]
command = "bun"
args = ["src/index.ts"]
```

#### Option B: Global CLI Registration

To register the server globally so it is available across all directories:

```bash
# Using npm (after global install or via npx)
codex mcp add sayalabs-mcp -- npx sayalabs-mcp

# Development mode (from source)
codex mcp add sayalabs-mcp -- bun /path/to/sayalabs-mcp/src/index.ts
```

### Registering with Cline / Kilocode

> [!NOTE]
> This section is for the **Kilocode VS Code extension** (`kilocode.kilo-code`). If you are using the standalone **Kilo CLI** tool, please refer to the [Registering with Kilo](#registering-with-kilo) section.

Cline and Kilocode store MCP server config in a `cline_mcp_settings.json` file inside their VS Code extension's global storage directory.

**Cline** (`saoudrizwan.claude-dev`):
```
~/Library/Application Support/Code/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json
```

**Kilocode** (`kilocode.kilo-code`):
```
~/Library/Application Support/Code/User/globalStorage/kilocode.kilo-code/settings/cline_mcp_settings.json
```

Add the following entry to the `mcpServers` object in the appropriate file:

**Using npm (after global install or via npx):**

```json
{
  "mcpServers": {
    "sayalabs-mcp": {
      "command": "npx",
      "args": ["-y", "sayalabs-mcp"],
      "disabled": false,
      "autoApprove": []
    }
  }
}
```

**Development mode (from source):**

```json
{
  "mcpServers": {
    "sayalabs-mcp": {
      "command": "bun",
      "args": ["/path/to/sayalabs-mcp/src/index.ts"],
      "disabled": false,
      "autoApprove": []
    }
  }
}
```

Replace `/path/to/sayalabs-mcp` with the absolute path to this repository. After saving, reload the VS Code window (`Cmd+Shift+P` → `Developer: Reload Window`) for the changes to take effect.

### Registering with Kilo

Kilo is a standalone CLI tool installed at `/opt/homebrew/bin/kilo` (separate from the Kilocode VS Code extension).

To register the server with Kilo:

```bash
# Using npm (after global install or via npx)
kilo mcp add sayalabs-mcp -- npx sayalabs-mcp

# Development mode (from source)
kilo mcp add sayalabs-mcp -- bun /path/to/sayalabs-mcp/src/index.ts
```

#### Verification

Verify that the server has been added successfully:

```bash
kilo mcp list
```

### Registering with OpenCode

Add to `~/.opencode/opencode.json` (OpenCode reads global config from there):

**Using npm (after global install or via npx):**
```json
{
  "mcp": {
    "sayalabs-mcp": {
      "type": "local",
      "command": ["npx", "-y", "sayalabs-mcp"]
    }
  }
}
```

**Development mode (from source):**
```json
{
  "mcp": {
    "sayalabs-mcp": {
      "type": "local",
      "command": ["bun", "/path/to/sayalabs-mcp/src/index.ts"]
    }
  }
}
```

Verify with:

```bash
opencode mcp list
# sayalabs-mcp  connected
```

---

## Configuration

You can configure the MCP server by setting the following environment variables:

| Environment Variable | Default Value | Description |
|---|---|---|
| `AGY_PATH` | `~/.local/bin/agy` | The absolute path to the `agy` CLI binary. |
| `AGY_TIMEOUT_MS` | `300000` (5 minutes) | Timeout in milliseconds for general `ask-agy` prompts. |
| `AGY_SEARCH_TIMEOUT_MS` | `60000` (1 minute) | Timeout in milliseconds specifically for `search-web` queries. |
| `AGY_WORKSPACE_ROOT` | `process.cwd()` | The root directory for file validation and execution context. |
| `AGY_MAX_CONCURRENT` | `3` | Maximum number of concurrent `agy` processes allowed to run. |
| `AGY_MAX_OUTPUT_BYTES` | `1000000` (1MB) | Maximum stdout size allowed from `agy` before truncating. |
| `AGY_DEBUG` | `0` (or unset) | Set to `1` to enable verbose debugging logs on `stderr`. |

---

## Tools

The server registers 4 MCP tools:

### 1. `ping`
- **Description**: Check `agy` health, version, binary path, and active workspace root.
- **Input Schema**: `{}` (none)
- **Response**: Details of the `agy` binary version and execution capabilities.

### 2. `ask-agy`
- **Description**: Runs a prompt non-interactively with `agy`.
- **Input Schema**:
  - `prompt` (string, max 10k chars): The prompt to send to `agy`.
  - `cwd` (string, optional): Override the working directory.
  - `timeout_ms` (integer, optional): Override default execution timeout.
  - `add_dirs` (array of strings, optional): Extra directories to register for prompt context.
  - `skip_permissions` (boolean, optional): Skip safety/permission prompts by adding `--dangerously-skip-permissions` to the binary invocation.

### 3. `search-web`
- **Description**: Perform web search queries via `agy`. Results come from `agy`'s search integration.
- **Input Schema**:
  - `query` (string, max 500 chars): The search query.

### 4. `write-file`
- **Description**: Write exact text content to a file inside the workspace root (does not call the `agy` binary).
- **Input Schema**:
  - `path` (string): The destination path (relative to the workspace root).
  - `content` (string, max 500k chars): The content to write.
  - `create_parents` (boolean, default `false`): If true, creates parent directories if they don't exist.

---

## Streaming / Progress Notifications

For long-running CLI invocations, the `ask-agy` and `search-web` tools support progress updates. When an MCP client provides a `progressToken` in the tool call metadata:

1. The server listens to the raw stdout chunks from `Bun.spawn()`.
2. It sends `notifications/progress` JSON-RPC updates containing the token, incremental sequence number, and the raw text output chunk as the message.
3. This allows compatible clients (such as Claude Code) to render output dynamically to the user while `agy` is still processing.

---

## Development

All standard lifecycle scripts are managed through `bun`:

### Running Tests
Execute the unit and integration test suite:
```bash
bun test
```

### Type Checking
Validate the TypeScript codebase:
```bash
bun run typecheck
```

### Building the Project
Compile the TypeScript code into a single executable bundle at `dist/index.js`:
```bash
bun run build
```

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Getting Started

1. **Clone the repository:**
   ```bash
   git clone git@github.com:Sayalab/agy_in_claude_code.git
   cd sayalabs-mcp
   ```

2. **Install dependencies:**
   ```bash
   bun install
   ```

### Quality & Build Verification

Before submitting your PR, please verify your changes:

- **Run tests:**
  ```bash
  bun test
  ```
- **Typecheck code:**
  ```bash
  bun run typecheck
  ```
- **Build the project:**
  ```bash
  bun run build
  ```

