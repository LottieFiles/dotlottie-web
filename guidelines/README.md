# dotLottie Guidelines for AI Coding Tools

Install dotLottie implementation guidelines as a skill/command for your AI coding assistant.

## Quick Install

```bash
curl -fsSL https://raw.githubusercontent.com/LottieFiles/dotlottie-web/main/guidelines/install.sh | bash
```

## Supported Tools

| Tool | Location | Usage |
|------|----------|-------|
| Claude Code | `~/.claude/commands/` | `/dotlottie` or ask naturally |
| Cursor | `~/.cursor/commands/` | `@dotlottie-guidelines` |
| OpenCode | `~/.config/opencode/command/` | Reference in prompts |
| Windsurf | `~/.codeium/windsurf/memories/` | Automatic context |
| Gemini CLI | `~/.gemini/commands/` | `/dotlottie-guidelines` |
| Codex CLI | `~/.codex/commands/` | Reference in prompts |

## Manual Installation

If you prefer manual installation or want to add to a project:

```bash
# Download to current directory
curl -sL https://raw.githubusercontent.com/LottieFiles/dotlottie-web/main/guidelines/command.md > DOTLOTTIE.md

# Or add to your project's AGENTS.md / CLAUDE.md
```

## What's Included

The guidelines cover:

- **Package Selection** - When to use `dotlottie-web` vs `dotlottie-react`
- **Basic Implementation** - Setup for vanilla JS and React
- **State Machines** - Interactive animations without code
- **Theming** - Runtime customization with slots
- **Markers & Segments** - Playing specific parts of animations
- **Performance** - Lazy loading, freezing, cleanup
- **Common Patterns** - Hover, click, scroll interactions
- **Debugging** - Inspecting animation state

## Contributing

Found an issue or want to improve the guidelines? PRs welcome!

## Resources

- [dotLottie Documentation](https://developers.lottiefiles.com/docs/dotlottie-player)
- [dotlottie-web GitHub](https://github.com/LottieFiles/dotlottie-web)
- [dotLottie Format](https://dotlottie.io)
- [LottieFiles Creator](https://creators.lottiefiles.com)
