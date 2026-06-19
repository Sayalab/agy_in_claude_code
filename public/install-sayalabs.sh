#!/bin/bash

set -e

if [ ! -d "$HOME/.sayalabs-mcp" ]; then
    git clone https://github.com/sayalabs/sayalabs-mcp.git "$HOME/.sayalabs-mcp" -q
    cd "$HOME/.sayalabs-mcp"
    bun install --silent
else
    cd "$HOME/.sayalabs-mcp"
    git pull origin main -q
    bun install --silent
fi

mkdir -p "$HOME/.sayalabs/logs"
touch "$HOME/.sayalabs/logs/intern-thoughts.log"

cat << 'EOF' > "$HOME/.sayalabs-mcp/wrapper.sh"
#!/bin/bash
export SAYA_LOG_FILE="$HOME/.sayalabs/logs/intern-thoughts.log"
exec bun run "$HOME/.sayalabs-mcp/src/index.ts" 2>> "$HOME/.sayalabs/logs/intern-thoughts.log"
EOF

chmod +x "$HOME/.sayalabs-mcp/wrapper.sh"

claude mcp add sayalabs --scope local -- "$HOME/.sayalabs-mcp/wrapper.sh" > /dev/null 2>&1 || true

cat << 'EOF' > "$PWD/CLAUDE.md"
# Sayalabs Principal Architect Protocol

You are operating as a Principal Architect.
You must actively delegate sub-tasks and background execution to the `sayalabs` MCP tool.
Do not perform manual redundant work if the `sayalabs` subagent can handle it.
Stream your thoughts and progress.
EOF

echo -e "\033[0;35m"
echo "    __  ___  __  ___  __  ___  __  ___  "
echo "   /  |/  / /  |/  / /  |/  / /  |/  /  "
echo "  / /|_/ / / /|_/ / / /|_/ / / /|_/ /   "
echo " / /  / / / /  / / / /  / / / /  / /    "
echo "/_/  /_/ /_/  /_/ /_/  /_/ /_/  /_/     "
echo -e "\033[1;36m"
echo ">> S A Y A L A B S   M C P   I N S T A L L E D <<"
echo -e "\033[0m"
echo -e "The cyber-samurai is ready. Your subagent will log its thoughts quietly.\n"
echo -e "\033[1;33m[ LIVE THOUGHT STREAM ]\033[0m"
echo -e "Open a new terminal split and run:"
echo -e "  \033[1;32mtail -f ~/.sayalabs/logs/intern-thoughts.log\033[0m\n"
echo -e "\033[1;33m[ MCP REMOVAL ]\033[0m"
echo -e "To cleanly detach the sayalabs node, run:"
echo -e "  \033[1;31mclaude mcp remove sayalabs --scope local\033[0m"
echo ""
