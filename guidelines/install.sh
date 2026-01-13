#!/bin/bash

# dotLottie Guidelines Installer
# https://github.com/LottieFiles/dotlottie-web

set -e

# Colors (only if stdout is a TTY)
if [ -t 1 ]; then
  GREEN='\033[32m'
  CYAN='\033[36m'
  DIM='\033[2m'
  RESET='\033[0m'
else
  GREEN=''
  CYAN=''
  DIM=''
  RESET=''
fi

REPO_URL="https://raw.githubusercontent.com/LottieFiles/dotlottie-web/main/guidelines"
COMMAND_FILE="command.md"
INSTALL_NAME="dotlottie-guidelines.md"
INSTALLED=0

echo ""
printf "${CYAN}●${RESET} Installing dotLottie Guidelines…\n"
echo ""

# Claude Code
if [ -d "$HOME/.claude" ]; then
  mkdir -p "$HOME/.claude/commands"
  curl -sL -o "$HOME/.claude/commands/$INSTALL_NAME" "$REPO_URL/$COMMAND_FILE"
  printf "  ${GREEN}✓${RESET} Claude Code\n"
  INSTALLED=$((INSTALLED + 1))
fi

# Cursor (1.6+)
if [ -d "$HOME/.cursor" ]; then
  mkdir -p "$HOME/.cursor/commands"
  curl -sL -o "$HOME/.cursor/commands/$INSTALL_NAME" "$REPO_URL/$COMMAND_FILE"
  printf "  ${GREEN}✓${RESET} Cursor\n"
  INSTALLED=$((INSTALLED + 1))
fi

# OpenCode
if command -v opencode &> /dev/null || [ -d "$HOME/.config/opencode" ]; then
  mkdir -p "$HOME/.config/opencode/command"
  curl -sL -o "$HOME/.config/opencode/command/$INSTALL_NAME" "$REPO_URL/$COMMAND_FILE"
  printf "  ${GREEN}✓${RESET} OpenCode\n"
  INSTALLED=$((INSTALLED + 1))
fi

# Windsurf - appends to global_rules.md
MARKER="# dotLottie Implementation Guidelines"
if [ -d "$HOME/.codeium" ] || [ -d "$HOME/Library/Application Support/Windsurf" ]; then
  mkdir -p "$HOME/.codeium/windsurf/memories"
  RULES_FILE="$HOME/.codeium/windsurf/memories/global_rules.md"
  if [ -f "$RULES_FILE" ] && grep -q "$MARKER" "$RULES_FILE"; then
    printf "  ${GREEN}✓${RESET} Windsurf ${DIM}(already installed)${RESET}\n"
  else
    if [ -f "$RULES_FILE" ]; then
      echo "" >> "$RULES_FILE"
    fi
    echo "$MARKER" >> "$RULES_FILE"
    echo "" >> "$RULES_FILE"
    curl -sL "$REPO_URL/$COMMAND_FILE" >> "$RULES_FILE"
    printf "  ${GREEN}✓${RESET} Windsurf\n"
  fi
  INSTALLED=$((INSTALLED + 1))
fi

# Gemini CLI - uses TOML command format
if command -v gemini &> /dev/null || [ -d "$HOME/.gemini" ]; then
  mkdir -p "$HOME/.gemini/commands"
  TOML_FILE="$HOME/.gemini/commands/dotlottie-guidelines.toml"

  # Download markdown and convert to TOML
  CONTENT=$(curl -sL "$REPO_URL/$COMMAND_FILE" | sed '1,/^---$/d' | sed '1,/^---$/d')
  cat > "$TOML_FILE" << 'TOMLEOF'
description = "Guidelines for implementing dotLottie animations in web applications"
prompt = """
TOMLEOF
  echo "$CONTENT" >> "$TOML_FILE"
  echo '"""' >> "$TOML_FILE"

  printf "  ${GREEN}✓${RESET} Gemini CLI\n"
  INSTALLED=$((INSTALLED + 1))
fi

# Codex CLI
if command -v codex &> /dev/null || [ -d "$HOME/.codex" ]; then
  mkdir -p "$HOME/.codex/commands"
  curl -sL -o "$HOME/.codex/commands/$INSTALL_NAME" "$REPO_URL/$COMMAND_FILE"
  printf "  ${GREEN}✓${RESET} Codex CLI\n"
  INSTALLED=$((INSTALLED + 1))
fi

echo ""

if [ $INSTALLED -eq 0 ]; then
  echo "No supported AI coding tools detected."
  echo ""
  echo "Supported tools:"
  echo "  • Claude Code: https://claude.ai/code"
  echo "  • Cursor: https://cursor.com"
  echo "  • OpenCode: https://opencode.ai"
  echo "  • Windsurf: https://codeium.com/windsurf"
  echo "  • Gemini CLI: https://github.com/google-gemini/gemini-cli"
  echo "  • Codex CLI: https://github.com/openai/codex"
  echo ""
  echo "Alternatively, add the guidelines to your project:"
  echo "  curl -sL $REPO_URL/$COMMAND_FILE > DOTLOTTIE.md"
  exit 1
else
  printf "${GREEN}Done!${RESET} Installed for $INSTALLED tool(s).\n"
  echo ""
  echo "Usage:"
  echo "  • Claude Code: /dotlottie or ask about dotLottie"
  echo "  • Cursor: @dotlottie-guidelines in chat"
  echo "  • Other tools: Reference dotlottie-guidelines in prompts"
  echo ""
  echo "Learn more: https://developers.lottiefiles.com/docs/dotlottie-player"
fi
