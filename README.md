# Sayalabs MCP

![Sayalabs Protocol](https://img.shields.io/badge/Sayalabs-Cyber_Samurai-blueviolet)

An advanced, production-ready MCP (Model Context Protocol) server designed to supercharge your AI agents. 

This MCP securely wraps the `agy` (Antigravity) engine, injecting a dedicated team of subagent interns, powerful web-search capabilities, and high-quality image generation protocols directly into Claude Code.

## 🚀 One-Line Installation

To automatically install the Sayalabs MCP, inject the Intern Protocol, and hook everything into Claude Code globally, run this single command in your terminal:

```bash
curl -sSL https://raw.githubusercontent.com/Sayalab/agy_in_claude_code/main/public/install-agy.sh | bash
```

Once installed, simply open Claude Code and type:  
*"Use ask-agy to generate an image of a futuristic city"*  
or  
*"Delegate this heavy refactoring task to your agy intern."*

---

## 🗑️ Removal & Cleanup

If you ever need to completely remove the Sayalabs MCP and wipe the injected protocols from your system, execute these commands in your terminal:

```bash
# 1. Remove the MCP from Claude's global configuration
claude mcp remove -g agy

# 2. Delete the downloaded repository
rm -rf ~/.agy_in_claude_code

# 3. Delete the injected Sayalabs Intern & Image Generation skills
rm -rf ~/.gemini/config/skills/sayalabs_intern
rm CLAUDE.md

# 4. Clean up the background log files
rm -rf ~/.antigravity/logs/intern-thoughts.log
```

*(Note: If the MCP still appears in Claude Code under your "Project MCPs", simply open the `.mcp.json` file in your active folder and delete the `agy` block from the list.)*
