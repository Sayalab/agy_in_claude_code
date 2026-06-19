#!/bin/bash

set -e

ORIGINAL_DIR="$PWD"

if ! command -v agy >/dev/null 2>&1; then
    echo -e "\033[1;31m[ERROR] The 'agy' CLI is not installed or not in your PATH.\033[0m"
    echo -e "Please install the Antigravity CLI first before running this setup."
    exit 1
fi

if ! agy --version >/dev/null 2>&1; then
    echo -e "\033[1;31m[ERROR] The 'agy' CLI is not functioning correctly.\033[0m"
    echo -e "Please run 'agy' in your terminal and ensure you are authenticated and setup."
    exit 1
fi

if [ ! -d "$HOME/.agy_in_claude_code" ]; then
    git clone https://github.com/Sayalab/agy_in_claude_code.git "$HOME/.agy_in_claude_code" -q
    cd "$HOME/.agy_in_claude_code"
    bun install --silent
else
    cd "$HOME/.agy_in_claude_code"
    git pull origin main -q
    bun install --silent
fi

mkdir -p "$HOME/.antigravity/logs"
touch "$HOME/.antigravity/logs/intern-thoughts.log"

cat << 'EOF' > "$HOME/.agy_in_claude_code/wrapper.sh"
#!/bin/bash
export AGY_LOG_FILE="$HOME/.antigravity/logs/intern-thoughts.log"
exec bun run "$HOME/.agy_in_claude_code/src/index.ts" 2>> "$HOME/.antigravity/logs/intern-thoughts.log"
EOF

chmod +x "$HOME/.agy_in_claude_code/wrapper.sh"

echo -e "\033[1;34m[INFO] Registering agy MCP to your local Claude Code project...\033[0m"
cd "$ORIGINAL_DIR"
if ! claude mcp add agy -- "$HOME/.agy_in_claude_code/wrapper.sh"; then
    echo -e "\033[1;31m[WARNING] Failed to automatically add the MCP to Claude Code.\033[0m"
    echo -e "You may need to add it manually by running:"
    echo -e "  claude mcp add agy -- \"$HOME/.agy_in_claude_code/wrapper.sh\""
fi

cat << 'EOF' > "$PWD/CLAUDE.md"
# Sayalabs Principal Architect & Intern Protocol

You are operating as a Principal Architect managing a team of AI interns.
You must actively delegate sub-tasks, background execution, and research to the `ask-agy` MCP tool.

## Image Generation Skill
Whenever the user asks for image generation, designs, or mockups:
1. DO NOT try to describe it in text.
2. Immediately call `ask-agy` with the prompt: "Generate an image for: [User's Request]"

## Intern Delegation Skill
For any repetitive coding, boilerplate, or extensive file modifications:
1. Treat `ask-agy` as your junior intern.
2. Send the exact requirements via `ask-agy` and let it do the manual labor.
EOF

# Inject Gemini Skill globally just in case
mkdir -p "$HOME/.gemini/config/skills/sayalabs_intern"
cat << 'EOF' > "$HOME/.gemini/config/skills/sayalabs_intern/SKILL.md"
---
name: Sayalabs Intern & Image Generator
description: Automatically delegates grunt work to interns and handles image generation.
---
# Sayalabs Protocol
Whenever you need to do tedious work, generate images, or act as an intern, use your tools or delegate via terminal commands to complete the task efficiently.
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
echo -e "\033[1;32m[+] Intern & Image Generation Skills INJECTED.\033[0m\n"
echo -e "\033[1;33m[ LIVE THOUGHT STREAM ]\033[0m"
echo -e "Open a new terminal split and run:"
echo -e "  \033[1;32mtail -f ~/.antigravity/logs/intern-thoughts.log\033[0m\n"
echo -e "\033[1;33m[ MCP REMOVAL ]\033[0m"
echo -e "To cleanly detach the agy node, run:"
echo -e "  \033[1;31mclaude mcp remove agy -g\033[0m"
echo ""
