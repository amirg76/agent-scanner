# OthmanAdi/planning-with-files @ 3b7690e — what runs without asking

732 files listed. 76 findings: 0 high, 76 attention, 0 info.

## Hooks (run by the agent when an event fires)

- **ATTENTION** `UserPromptSubmit`: `SH="${CLAUDE_SKILL_DIR}/scripts/skill-hook.sh"; [ -f "$SH" ] || SH=$(ls "$HOME/.claude/skills/planning-with-files/scrip…`  
  `.agents/skills/planning-with-files/SKILL.md` — Declared in a skill: registered when the skill is invoked, then runs for the rest of the session. Runs on every prompt the user sends and can add text to it.
- **ATTENTION** `PreToolUse` [matcher: `Write|Edit|Bash|Read|Glob|Grep`]: `SH="${CLAUDE_SKILL_DIR}/scripts/skill-hook.sh"; [ -f "$SH" ] || SH=$(ls "$HOME/.claude/skills/planning-with-files/scrip…`  
  `.agents/skills/planning-with-files/SKILL.md` — Declared in a skill: registered when the skill is invoked, then runs for the rest of the session. Runs on PreToolUse for tools matching "Write\|Edit\|Bash\|Read\|Glob\|Grep".
- **ATTENTION** `PostToolUse` [matcher: `Write|Edit`]: `SH="${CLAUDE_SKILL_DIR}/scripts/skill-hook.sh"; [ -f "$SH" ] || SH=$(ls "$HOME/.claude/skills/planning-with-files/scrip…`  
  `.agents/skills/planning-with-files/SKILL.md` — Declared in a skill: registered when the skill is invoked, then runs for the rest of the session. Runs on PostToolUse for tools matching "Write\|Edit".
- **ATTENTION** `Stop`: `SH="${CLAUDE_SKILL_DIR}/scripts/skill-hook.sh"; [ -f "$SH" ] || SH=$(ls "$HOME/.claude/skills/planning-with-files/scrip…`  
  `.agents/skills/planning-with-files/SKILL.md` — Declared in a skill: registered when the skill is invoked, then runs for the rest of the session. Runs on every Stop event.
- **ATTENTION** `PreCompact` [matcher: `*`]: `SH="${CLAUDE_SKILL_DIR}/scripts/skill-hook.sh"; [ -f "$SH" ] || SH=$(ls "$HOME/.claude/skills/planning-with-files/scrip…`  
  `.agents/skills/planning-with-files/SKILL.md` — Declared in a skill: registered when the skill is invoked, then runs for the rest of the session. Runs on every PreCompact event.
- **ATTENTION** `UserPromptSubmit`: `SH=""; for c in "${PWF_SCRIPT_DIR}/skill-hook.sh" "${CLAUDE_SKILL_DIR}/scripts/skill-hook.sh" "${CODEBUDDY_PLUGIN_ROOT}…`  
  `.codebuddy/skills/planning-with-files/SKILL.md` — Declared in a skill: registered when the skill is invoked, then runs for the rest of the session. Runs on every prompt the user sends and can add text to it.
- **ATTENTION** `PreToolUse` [matcher: `Write|Edit|Bash|Read|Glob|Grep`]: `SH=""; for c in "${PWF_SCRIPT_DIR}/skill-hook.sh" "${CLAUDE_SKILL_DIR}/scripts/skill-hook.sh" "${CODEBUDDY_PLUGIN_ROOT}…`  
  `.codebuddy/skills/planning-with-files/SKILL.md` — Declared in a skill: registered when the skill is invoked, then runs for the rest of the session. Runs on PreToolUse for tools matching "Write\|Edit\|Bash\|Read\|Glob\|Grep".
- **ATTENTION** `PostToolUse` [matcher: `Write|Edit`]: `SH=""; for c in "${PWF_SCRIPT_DIR}/skill-hook.sh" "${CLAUDE_SKILL_DIR}/scripts/skill-hook.sh" "${CODEBUDDY_PLUGIN_ROOT}…`  
  `.codebuddy/skills/planning-with-files/SKILL.md` — Declared in a skill: registered when the skill is invoked, then runs for the rest of the session. Runs on PostToolUse for tools matching "Write\|Edit".
- **ATTENTION** `Stop`: `SH=""; for c in "${PWF_SCRIPT_DIR}/skill-hook.sh" "${CLAUDE_SKILL_DIR}/scripts/skill-hook.sh" "${CODEBUDDY_PLUGIN_ROOT}…`  
  `.codebuddy/skills/planning-with-files/SKILL.md` — Declared in a skill: registered when the skill is invoked, then runs for the rest of the session. Runs on every Stop event.
- **ATTENTION** `PreCompact` [matcher: `*`]: `SH=""; for c in "${PWF_SCRIPT_DIR}/skill-hook.sh" "${CLAUDE_SKILL_DIR}/scripts/skill-hook.sh" "${CODEBUDDY_PLUGIN_ROOT}…`  
  `.codebuddy/skills/planning-with-files/SKILL.md` — Declared in a skill: registered when the skill is invoked, then runs for the rest of the session. Runs on every PreCompact event.
- **ATTENTION** `UserPromptSubmit`: `SH=""; for c in "${PWF_SCRIPT_DIR}/skill-hook.sh" "${CLAUDE_SKILL_DIR}/scripts/skill-hook.sh" "$HOME/.codex/skills/plan…`  
  `.codex/skills/planning-with-files/SKILL.md` — Declared in a skill: registered when the skill is invoked, then runs for the rest of the session. Runs on every prompt the user sends and can add text to it.
- **ATTENTION** `PreToolUse` [matcher: `Write|Edit|Bash|Read|Glob|Grep`]: `SH=""; for c in "${PWF_SCRIPT_DIR}/skill-hook.sh" "${CLAUDE_SKILL_DIR}/scripts/skill-hook.sh" "$HOME/.codex/skills/plan…`  
  `.codex/skills/planning-with-files/SKILL.md` — Declared in a skill: registered when the skill is invoked, then runs for the rest of the session. Runs on PreToolUse for tools matching "Write\|Edit\|Bash\|Read\|Glob\|Grep".
- **ATTENTION** `PostToolUse` [matcher: `Write|Edit`]: `SH=""; for c in "${PWF_SCRIPT_DIR}/skill-hook.sh" "${CLAUDE_SKILL_DIR}/scripts/skill-hook.sh" "$HOME/.codex/skills/plan…`  
  `.codex/skills/planning-with-files/SKILL.md` — Declared in a skill: registered when the skill is invoked, then runs for the rest of the session. Runs on PostToolUse for tools matching "Write\|Edit".
- **ATTENTION** `Stop`: `SH=""; for c in "${PWF_SCRIPT_DIR}/skill-hook.sh" "${CLAUDE_SKILL_DIR}/scripts/skill-hook.sh" "$HOME/.codex/skills/plan…`  
  `.codex/skills/planning-with-files/SKILL.md` — Declared in a skill: registered when the skill is invoked, then runs for the rest of the session. Runs on every Stop event.
- **ATTENTION** `PreCompact` [matcher: `*`]: `SH=""; for c in "${PWF_SCRIPT_DIR}/skill-hook.sh" "${CLAUDE_SKILL_DIR}/scripts/skill-hook.sh" "$HOME/.codex/skills/plan…`  
  `.codex/skills/planning-with-files/SKILL.md` — Declared in a skill: registered when the skill is invoked, then runs for the rest of the session. Runs on every PreCompact event.
- **ATTENTION** `UserPromptSubmit`: `SH=""; for c in "${PWF_SCRIPT_DIR}/skill-hook.sh" "${CLAUDE_SKILL_DIR}/scripts/skill-hook.sh" "$HOME/.cursor/skills/pla…`  
  `.cursor/skills/planning-with-files/SKILL.md` — Declared in a skill: registered when the skill is invoked, then runs for the rest of the session. Runs on every prompt the user sends and can add text to it.
- **ATTENTION** `PreToolUse` [matcher: `Write|Edit|Bash|Read|Glob|Grep`]: `SH=""; for c in "${PWF_SCRIPT_DIR}/skill-hook.sh" "${CLAUDE_SKILL_DIR}/scripts/skill-hook.sh" "$HOME/.cursor/skills/pla…`  
  `.cursor/skills/planning-with-files/SKILL.md` — Declared in a skill: registered when the skill is invoked, then runs for the rest of the session. Runs on PreToolUse for tools matching "Write\|Edit\|Bash\|Read\|Glob\|Grep".
- **ATTENTION** `PostToolUse` [matcher: `Write|Edit`]: `SH=""; for c in "${PWF_SCRIPT_DIR}/skill-hook.sh" "${CLAUDE_SKILL_DIR}/scripts/skill-hook.sh" "$HOME/.cursor/skills/pla…`  
  `.cursor/skills/planning-with-files/SKILL.md` — Declared in a skill: registered when the skill is invoked, then runs for the rest of the session. Runs on PostToolUse for tools matching "Write\|Edit".
- **ATTENTION** `Stop`: `SH=""; for c in "${PWF_SCRIPT_DIR}/skill-hook.sh" "${CLAUDE_SKILL_DIR}/scripts/skill-hook.sh" "$HOME/.cursor/skills/pla…`  
  `.cursor/skills/planning-with-files/SKILL.md` — Declared in a skill: registered when the skill is invoked, then runs for the rest of the session. Runs on every Stop event.
- **ATTENTION** `PreCompact` [matcher: `*`]: `SH=""; for c in "${PWF_SCRIPT_DIR}/skill-hook.sh" "${CLAUDE_SKILL_DIR}/scripts/skill-hook.sh" "$HOME/.cursor/skills/pla…`  
  `.cursor/skills/planning-with-files/SKILL.md` — Declared in a skill: registered when the skill is invoked, then runs for the rest of the session. Runs on every PreCompact event.
- **ATTENTION** `UserPromptSubmit`: `SH=""; for c in "${PWF_SCRIPT_DIR}/skill-hook.sh" "${CLAUDE_SKILL_DIR}/scripts/skill-hook.sh" "$HOME/.factory/skills/pl…`  
  `.factory/skills/planning-with-files/SKILL.md` — Declared in a skill: registered when the skill is invoked, then runs for the rest of the session. Runs on every prompt the user sends and can add text to it.
- **ATTENTION** `PreToolUse` [matcher: `Write|Edit|Bash|Read|Glob|Grep`]: `SH=""; for c in "${PWF_SCRIPT_DIR}/skill-hook.sh" "${CLAUDE_SKILL_DIR}/scripts/skill-hook.sh" "$HOME/.factory/skills/pl…`  
  `.factory/skills/planning-with-files/SKILL.md` — Declared in a skill: registered when the skill is invoked, then runs for the rest of the session. Runs on PreToolUse for tools matching "Write\|Edit\|Bash\|Read\|Glob\|Grep".
- **ATTENTION** `PostToolUse` [matcher: `Write|Edit`]: `SH=""; for c in "${PWF_SCRIPT_DIR}/skill-hook.sh" "${CLAUDE_SKILL_DIR}/scripts/skill-hook.sh" "$HOME/.factory/skills/pl…`  
  `.factory/skills/planning-with-files/SKILL.md` — Declared in a skill: registered when the skill is invoked, then runs for the rest of the session. Runs on PostToolUse for tools matching "Write\|Edit".
- **ATTENTION** `Stop`: `SH=""; for c in "${PWF_SCRIPT_DIR}/skill-hook.sh" "${CLAUDE_SKILL_DIR}/scripts/skill-hook.sh" "$HOME/.factory/skills/pl…`  
  `.factory/skills/planning-with-files/SKILL.md` — Declared in a skill: registered when the skill is invoked, then runs for the rest of the session. Runs on every Stop event.
- **ATTENTION** `PreCompact` [matcher: `*`]: `SH=""; for c in "${PWF_SCRIPT_DIR}/skill-hook.sh" "${CLAUDE_SKILL_DIR}/scripts/skill-hook.sh" "$HOME/.factory/skills/pl…`  
  `.factory/skills/planning-with-files/SKILL.md` — Declared in a skill: registered when the skill is invoked, then runs for the rest of the session. Runs on every PreCompact event.
- **ATTENTION** `UserPromptSubmit`: `SH=""; for c in "${PWF_SCRIPT_DIR}/skill-hook.sh" "${CLAUDE_SKILL_DIR}/scripts/skill-hook.sh" "$HOME/.mastracode/skills…`  
  `.mastracode/skills/planning-with-files/SKILL.md` — Declared in a skill: registered when the skill is invoked, then runs for the rest of the session. Runs on every prompt the user sends and can add text to it.
- **ATTENTION** `PreToolUse` [matcher: `Write|Edit|Bash|Read|Glob|Grep`]: `SH=""; for c in "${PWF_SCRIPT_DIR}/skill-hook.sh" "${CLAUDE_SKILL_DIR}/scripts/skill-hook.sh" "$HOME/.mastracode/skills…`  
  `.mastracode/skills/planning-with-files/SKILL.md` — Declared in a skill: registered when the skill is invoked, then runs for the rest of the session. Runs on PreToolUse for tools matching "Write\|Edit\|Bash\|Read\|Glob\|Grep".
- **ATTENTION** `PostToolUse` [matcher: `Write|Edit`]: `SH=""; for c in "${PWF_SCRIPT_DIR}/skill-hook.sh" "${CLAUDE_SKILL_DIR}/scripts/skill-hook.sh" "$HOME/.mastracode/skills…`  
  `.mastracode/skills/planning-with-files/SKILL.md` — Declared in a skill: registered when the skill is invoked, then runs for the rest of the session. Runs on PostToolUse for tools matching "Write\|Edit".
- **ATTENTION** `Stop`: `SH=""; for c in "${PWF_SCRIPT_DIR}/skill-hook.sh" "${CLAUDE_SKILL_DIR}/scripts/skill-hook.sh" "$HOME/.mastracode/skills…`  
  `.mastracode/skills/planning-with-files/SKILL.md` — Declared in a skill: registered when the skill is invoked, then runs for the rest of the session. Runs on every Stop event.
- **ATTENTION** `PreCompact` [matcher: `*`]: `SH=""; for c in "${PWF_SCRIPT_DIR}/skill-hook.sh" "${CLAUDE_SKILL_DIR}/scripts/skill-hook.sh" "$HOME/.mastracode/skills…`  
  `.mastracode/skills/planning-with-files/SKILL.md` — Declared in a skill: registered when the skill is invoked, then runs for the rest of the session. Runs on every PreCompact event.
- **ATTENTION** `UserPromptSubmit`: `SH=""; for c in "${PWF_SCRIPT_DIR}/skill-hook.sh" "${CLAUDE_SKILL_DIR}/scripts/skill-hook.sh" "$HOME/.config/opencode/s…`  
  `.opencode/skills/planning-with-files/SKILL.md` — Declared in a skill: registered when the skill is invoked, then runs for the rest of the session. Runs on every prompt the user sends and can add text to it.
- **ATTENTION** `PreToolUse` [matcher: `Write|Edit|Bash|Read|Glob|Grep`]: `SH=""; for c in "${PWF_SCRIPT_DIR}/skill-hook.sh" "${CLAUDE_SKILL_DIR}/scripts/skill-hook.sh" "$HOME/.config/opencode/s…`  
  `.opencode/skills/planning-with-files/SKILL.md` — Declared in a skill: registered when the skill is invoked, then runs for the rest of the session. Runs on PreToolUse for tools matching "Write\|Edit\|Bash\|Read\|Glob\|Grep".
- **ATTENTION** `PostToolUse` [matcher: `Write|Edit`]: `SH=""; for c in "${PWF_SCRIPT_DIR}/skill-hook.sh" "${CLAUDE_SKILL_DIR}/scripts/skill-hook.sh" "$HOME/.config/opencode/s…`  
  `.opencode/skills/planning-with-files/SKILL.md` — Declared in a skill: registered when the skill is invoked, then runs for the rest of the session. Runs on PostToolUse for tools matching "Write\|Edit".
- **ATTENTION** `Stop`: `SH=""; for c in "${PWF_SCRIPT_DIR}/skill-hook.sh" "${CLAUDE_SKILL_DIR}/scripts/skill-hook.sh" "$HOME/.config/opencode/s…`  
  `.opencode/skills/planning-with-files/SKILL.md` — Declared in a skill: registered when the skill is invoked, then runs for the rest of the session. Runs on every Stop event.
- **ATTENTION** `PreCompact` [matcher: `*`]: `SH=""; for c in "${PWF_SCRIPT_DIR}/skill-hook.sh" "${CLAUDE_SKILL_DIR}/scripts/skill-hook.sh" "$HOME/.config/opencode/s…`  
  `.opencode/skills/planning-with-files/SKILL.md` — Declared in a skill: registered when the skill is invoked, then runs for the rest of the session. Runs on every PreCompact event.
- **ATTENTION** `UserPromptSubmit`: `[ -n "${CLAUDE_PLUGIN_ROOT:-}" ] && exit 0; SH="${CLAUDE_SKILL_DIR}/scripts/skill-hook.sh"; [ -f "$SH" ] || SH=$(ls "$H…`  
  `.pi/skills/planning-with-files/SKILL.md` — Declared in a skill: registered when the skill is invoked, then runs for the rest of the session. Runs on every prompt the user sends and can add text to it.
- **ATTENTION** `PreToolUse` [matcher: `Write|Edit|Bash|Read|Glob|Grep`]: `[ -n "${CLAUDE_PLUGIN_ROOT:-}" ] && exit 0; SH="${CLAUDE_SKILL_DIR}/scripts/skill-hook.sh"; [ -f "$SH" ] || SH=$(ls "$H…`  
  `.pi/skills/planning-with-files/SKILL.md` — Declared in a skill: registered when the skill is invoked, then runs for the rest of the session. Runs on PreToolUse for tools matching "Write\|Edit\|Bash\|Read\|Glob\|Grep".
- **ATTENTION** `PostToolUse` [matcher: `Write|Edit`]: `[ -n "${CLAUDE_PLUGIN_ROOT:-}" ] && exit 0; SH="${CLAUDE_SKILL_DIR}/scripts/skill-hook.sh"; [ -f "$SH" ] || SH=$(ls "$H…`  
  `.pi/skills/planning-with-files/SKILL.md` — Declared in a skill: registered when the skill is invoked, then runs for the rest of the session. Runs on PostToolUse for tools matching "Write\|Edit".
- **ATTENTION** `Stop`: `[ -n "${CLAUDE_PLUGIN_ROOT:-}" ] && exit 0; SH="${CLAUDE_SKILL_DIR}/scripts/skill-hook.sh"; [ -f "$SH" ] || SH=$(ls "$H…`  
  `.pi/skills/planning-with-files/SKILL.md` — Declared in a skill: registered when the skill is invoked, then runs for the rest of the session. Runs on every Stop event.
- **ATTENTION** `PreCompact` [matcher: `*`]: `[ -n "${CLAUDE_PLUGIN_ROOT:-}" ] && exit 0; SH="${CLAUDE_SKILL_DIR}/scripts/skill-hook.sh"; [ -f "$SH" ] || SH=$(ls "$H…`  
  `.pi/skills/planning-with-files/SKILL.md` — Declared in a skill: registered when the skill is invoked, then runs for the rest of the session. Runs on every PreCompact event.
- **ATTENTION** [`planning-with-files`] `SessionStart` [matcher: `startup|resume|clear|compact`]: `sh ${CLAUDE_PLUGIN_ROOT}/hooks/claude-hook.sh session-start`  
  `hooks/hooks.json` — Runs at session start (startup, resume, clear or compact), before the user types anything.
- **ATTENTION** [`planning-with-files`] `UserPromptSubmit`: `sh ${CLAUDE_PLUGIN_ROOT}/hooks/claude-hook.sh user-prompt-submit`  
  `hooks/hooks.json` — Runs on every prompt the user sends and can add text to it.
- **ATTENTION** [`planning-with-files`] `PreToolUse` [matcher: `Write|Edit|Bash|Read|Glob|Grep`]: `sh ${CLAUDE_PLUGIN_ROOT}/hooks/claude-hook.sh pre-tool-use`  
  `hooks/hooks.json` — Runs on PreToolUse for tools matching "Write\|Edit\|Bash\|Read\|Glob\|Grep".
- **ATTENTION** [`planning-with-files`] `PostToolUse` [matcher: `Write|Edit`]: `sh ${CLAUDE_PLUGIN_ROOT}/hooks/claude-hook.sh post-tool-use`  
  `hooks/hooks.json` — Runs on PostToolUse for tools matching "Write\|Edit".
- **ATTENTION** [`planning-with-files`] `PreCompact` [matcher: `*`]: `sh ${CLAUDE_PLUGIN_ROOT}/hooks/claude-hook.sh pre-compact`  
  `hooks/hooks.json` — Runs on every PreCompact event.
- **ATTENTION** [`planning-with-files`] `Stop`: `sh ${CLAUDE_PLUGIN_ROOT}/hooks/claude-hook.sh stop`  
  `hooks/hooks.json` — Runs on every Stop event.
- **ATTENTION** `UserPromptSubmit`: `SH=""; for c in "${PWF_SCRIPT_DIR}/skill-hook.sh" "${CLAUDE_SKILL_DIR}/scripts/skill-hook.sh" "$HOME/.claude/skills/pla…`  
  `skills/i18n/planning-with-files-ar/SKILL.md` — Declared in a skill: registered when the skill is invoked, then runs for the rest of the session. Runs on every prompt the user sends and can add text to it.
- **ATTENTION** `PreToolUse` [matcher: `Write|Edit|Bash|Read|Glob|Grep`]: `SH=""; for c in "${PWF_SCRIPT_DIR}/skill-hook.sh" "${CLAUDE_SKILL_DIR}/scripts/skill-hook.sh" "$HOME/.claude/skills/pla…`  
  `skills/i18n/planning-with-files-ar/SKILL.md` — Declared in a skill: registered when the skill is invoked, then runs for the rest of the session. Runs on PreToolUse for tools matching "Write\|Edit\|Bash\|Read\|Glob\|Grep".
- **ATTENTION** `PostToolUse` [matcher: `Write|Edit`]: `SH=""; for c in "${PWF_SCRIPT_DIR}/skill-hook.sh" "${CLAUDE_SKILL_DIR}/scripts/skill-hook.sh" "$HOME/.claude/skills/pla…`  
  `skills/i18n/planning-with-files-ar/SKILL.md` — Declared in a skill: registered when the skill is invoked, then runs for the rest of the session. Runs on PostToolUse for tools matching "Write\|Edit".
- **ATTENTION** `Stop`: `SH=""; for c in "${PWF_SCRIPT_DIR}/skill-hook.sh" "${CLAUDE_SKILL_DIR}/scripts/skill-hook.sh" "$HOME/.claude/skills/pla…`  
  `skills/i18n/planning-with-files-ar/SKILL.md` — Declared in a skill: registered when the skill is invoked, then runs for the rest of the session. Runs on every Stop event.
- **ATTENTION** `PreCompact` [matcher: `*`]: `SH=""; for c in "${PWF_SCRIPT_DIR}/skill-hook.sh" "${CLAUDE_SKILL_DIR}/scripts/skill-hook.sh" "$HOME/.claude/skills/pla…`  
  `skills/i18n/planning-with-files-ar/SKILL.md` — Declared in a skill: registered when the skill is invoked, then runs for the rest of the session. Runs on every PreCompact event.
- **ATTENTION** `UserPromptSubmit`: `SH=""; for c in "${PWF_SCRIPT_DIR}/skill-hook.sh" "${CLAUDE_SKILL_DIR}/scripts/skill-hook.sh" "$HOME/.claude/skills/pla…`  
  `skills/i18n/planning-with-files-de/SKILL.md` — Declared in a skill: registered when the skill is invoked, then runs for the rest of the session. Runs on every prompt the user sends and can add text to it.
- **ATTENTION** `PreToolUse` [matcher: `Write|Edit|Bash|Read|Glob|Grep`]: `SH=""; for c in "${PWF_SCRIPT_DIR}/skill-hook.sh" "${CLAUDE_SKILL_DIR}/scripts/skill-hook.sh" "$HOME/.claude/skills/pla…`  
  `skills/i18n/planning-with-files-de/SKILL.md` — Declared in a skill: registered when the skill is invoked, then runs for the rest of the session. Runs on PreToolUse for tools matching "Write\|Edit\|Bash\|Read\|Glob\|Grep".
- **ATTENTION** `PostToolUse` [matcher: `Write|Edit`]: `SH=""; for c in "${PWF_SCRIPT_DIR}/skill-hook.sh" "${CLAUDE_SKILL_DIR}/scripts/skill-hook.sh" "$HOME/.claude/skills/pla…`  
  `skills/i18n/planning-with-files-de/SKILL.md` — Declared in a skill: registered when the skill is invoked, then runs for the rest of the session. Runs on PostToolUse for tools matching "Write\|Edit".
- **ATTENTION** `Stop`: `SH=""; for c in "${PWF_SCRIPT_DIR}/skill-hook.sh" "${CLAUDE_SKILL_DIR}/scripts/skill-hook.sh" "$HOME/.claude/skills/pla…`  
  `skills/i18n/planning-with-files-de/SKILL.md` — Declared in a skill: registered when the skill is invoked, then runs for the rest of the session. Runs on every Stop event.
- **ATTENTION** `PreCompact` [matcher: `*`]: `SH=""; for c in "${PWF_SCRIPT_DIR}/skill-hook.sh" "${CLAUDE_SKILL_DIR}/scripts/skill-hook.sh" "$HOME/.claude/skills/pla…`  
  `skills/i18n/planning-with-files-de/SKILL.md` — Declared in a skill: registered when the skill is invoked, then runs for the rest of the session. Runs on every PreCompact event.
- **ATTENTION** `UserPromptSubmit`: `SH=""; for c in "${PWF_SCRIPT_DIR}/skill-hook.sh" "${CLAUDE_SKILL_DIR}/scripts/skill-hook.sh" "$HOME/.claude/skills/pla…`  
  `skills/i18n/planning-with-files-es/SKILL.md` — Declared in a skill: registered when the skill is invoked, then runs for the rest of the session. Runs on every prompt the user sends and can add text to it.
- **ATTENTION** `PreToolUse` [matcher: `Write|Edit|Bash|Read|Glob|Grep`]: `SH=""; for c in "${PWF_SCRIPT_DIR}/skill-hook.sh" "${CLAUDE_SKILL_DIR}/scripts/skill-hook.sh" "$HOME/.claude/skills/pla…`  
  `skills/i18n/planning-with-files-es/SKILL.md` — Declared in a skill: registered when the skill is invoked, then runs for the rest of the session. Runs on PreToolUse for tools matching "Write\|Edit\|Bash\|Read\|Glob\|Grep".
- **ATTENTION** `PostToolUse` [matcher: `Write|Edit`]: `SH=""; for c in "${PWF_SCRIPT_DIR}/skill-hook.sh" "${CLAUDE_SKILL_DIR}/scripts/skill-hook.sh" "$HOME/.claude/skills/pla…`  
  `skills/i18n/planning-with-files-es/SKILL.md` — Declared in a skill: registered when the skill is invoked, then runs for the rest of the session. Runs on PostToolUse for tools matching "Write\|Edit".
- **ATTENTION** `Stop`: `SH=""; for c in "${PWF_SCRIPT_DIR}/skill-hook.sh" "${CLAUDE_SKILL_DIR}/scripts/skill-hook.sh" "$HOME/.claude/skills/pla…`  
  `skills/i18n/planning-with-files-es/SKILL.md` — Declared in a skill: registered when the skill is invoked, then runs for the rest of the session. Runs on every Stop event.
- **ATTENTION** `PreCompact` [matcher: `*`]: `SH=""; for c in "${PWF_SCRIPT_DIR}/skill-hook.sh" "${CLAUDE_SKILL_DIR}/scripts/skill-hook.sh" "$HOME/.claude/skills/pla…`  
  `skills/i18n/planning-with-files-es/SKILL.md` — Declared in a skill: registered when the skill is invoked, then runs for the rest of the session. Runs on every PreCompact event.
- **ATTENTION** `UserPromptSubmit`: `SH=""; for c in "${PWF_SCRIPT_DIR}/skill-hook.sh" "${CLAUDE_SKILL_DIR}/scripts/skill-hook.sh" "$HOME/.claude/skills/pla…`  
  `skills/i18n/planning-with-files-zh/SKILL.md` — Declared in a skill: registered when the skill is invoked, then runs for the rest of the session. Runs on every prompt the user sends and can add text to it.
- **ATTENTION** `PreToolUse` [matcher: `Write|Edit|Bash|Read|Glob|Grep`]: `SH=""; for c in "${PWF_SCRIPT_DIR}/skill-hook.sh" "${CLAUDE_SKILL_DIR}/scripts/skill-hook.sh" "$HOME/.claude/skills/pla…`  
  `skills/i18n/planning-with-files-zh/SKILL.md` — Declared in a skill: registered when the skill is invoked, then runs for the rest of the session. Runs on PreToolUse for tools matching "Write\|Edit\|Bash\|Read\|Glob\|Grep".
- **ATTENTION** `PostToolUse` [matcher: `Write|Edit`]: `SH=""; for c in "${PWF_SCRIPT_DIR}/skill-hook.sh" "${CLAUDE_SKILL_DIR}/scripts/skill-hook.sh" "$HOME/.claude/skills/pla…`  
  `skills/i18n/planning-with-files-zh/SKILL.md` — Declared in a skill: registered when the skill is invoked, then runs for the rest of the session. Runs on PostToolUse for tools matching "Write\|Edit".
- **ATTENTION** `Stop`: `SH=""; for c in "${PWF_SCRIPT_DIR}/skill-hook.sh" "${CLAUDE_SKILL_DIR}/scripts/skill-hook.sh" "$HOME/.claude/skills/pla…`  
  `skills/i18n/planning-with-files-zh/SKILL.md` — Declared in a skill: registered when the skill is invoked, then runs for the rest of the session. Runs on every Stop event.
- **ATTENTION** `PreCompact` [matcher: `*`]: `SH=""; for c in "${PWF_SCRIPT_DIR}/skill-hook.sh" "${CLAUDE_SKILL_DIR}/scripts/skill-hook.sh" "$HOME/.claude/skills/pla…`  
  `skills/i18n/planning-with-files-zh/SKILL.md` — Declared in a skill: registered when the skill is invoked, then runs for the rest of the session. Runs on every PreCompact event.
- **ATTENTION** `UserPromptSubmit`: `SH=""; for c in "${PWF_SCRIPT_DIR}/skill-hook.sh" "${CLAUDE_SKILL_DIR}/scripts/skill-hook.sh" "$HOME/.claude/skills/pla…`  
  `skills/i18n/planning-with-files-zht/SKILL.md` — Declared in a skill: registered when the skill is invoked, then runs for the rest of the session. Runs on every prompt the user sends and can add text to it.
- **ATTENTION** `PreToolUse` [matcher: `Write|Edit|Bash|Read|Glob|Grep`]: `SH=""; for c in "${PWF_SCRIPT_DIR}/skill-hook.sh" "${CLAUDE_SKILL_DIR}/scripts/skill-hook.sh" "$HOME/.claude/skills/pla…`  
  `skills/i18n/planning-with-files-zht/SKILL.md` — Declared in a skill: registered when the skill is invoked, then runs for the rest of the session. Runs on PreToolUse for tools matching "Write\|Edit\|Bash\|Read\|Glob\|Grep".
- **ATTENTION** `PostToolUse` [matcher: `Write|Edit`]: `SH=""; for c in "${PWF_SCRIPT_DIR}/skill-hook.sh" "${CLAUDE_SKILL_DIR}/scripts/skill-hook.sh" "$HOME/.claude/skills/pla…`  
  `skills/i18n/planning-with-files-zht/SKILL.md` — Declared in a skill: registered when the skill is invoked, then runs for the rest of the session. Runs on PostToolUse for tools matching "Write\|Edit".
- **ATTENTION** `Stop`: `SH=""; for c in "${PWF_SCRIPT_DIR}/skill-hook.sh" "${CLAUDE_SKILL_DIR}/scripts/skill-hook.sh" "$HOME/.claude/skills/pla…`  
  `skills/i18n/planning-with-files-zht/SKILL.md` — Declared in a skill: registered when the skill is invoked, then runs for the rest of the session. Runs on every Stop event.
- **ATTENTION** `PreCompact` [matcher: `*`]: `SH=""; for c in "${PWF_SCRIPT_DIR}/skill-hook.sh" "${CLAUDE_SKILL_DIR}/scripts/skill-hook.sh" "$HOME/.claude/skills/pla…`  
  `skills/i18n/planning-with-files-zht/SKILL.md` — Declared in a skill: registered when the skill is invoked, then runs for the rest of the session. Runs on every PreCompact event.
- **ATTENTION** [`planning-with-files`] `UserPromptSubmit`: `[ -n "${CLAUDE_PLUGIN_ROOT:-}" ] && exit 0; SH="${CLAUDE_SKILL_DIR}/scripts/skill-hook.sh"; [ -f "$SH" ] || SH=$(ls "$H…`  
  `skills/planning-with-files/SKILL.md` — Declared in a skill: registered when the skill is invoked, then runs for the rest of the session. Runs on every prompt the user sends and can add text to it.
- **ATTENTION** [`planning-with-files`] `PreToolUse` [matcher: `Write|Edit|Bash|Read|Glob|Grep`]: `[ -n "${CLAUDE_PLUGIN_ROOT:-}" ] && exit 0; SH="${CLAUDE_SKILL_DIR}/scripts/skill-hook.sh"; [ -f "$SH" ] || SH=$(ls "$H…`  
  `skills/planning-with-files/SKILL.md` — Declared in a skill: registered when the skill is invoked, then runs for the rest of the session. Runs on PreToolUse for tools matching "Write\|Edit\|Bash\|Read\|Glob\|Grep".
- **ATTENTION** [`planning-with-files`] `PostToolUse` [matcher: `Write|Edit`]: `[ -n "${CLAUDE_PLUGIN_ROOT:-}" ] && exit 0; SH="${CLAUDE_SKILL_DIR}/scripts/skill-hook.sh"; [ -f "$SH" ] || SH=$(ls "$H…`  
  `skills/planning-with-files/SKILL.md` — Declared in a skill: registered when the skill is invoked, then runs for the rest of the session. Runs on PostToolUse for tools matching "Write\|Edit".
- **ATTENTION** [`planning-with-files`] `Stop`: `[ -n "${CLAUDE_PLUGIN_ROOT:-}" ] && exit 0; SH="${CLAUDE_SKILL_DIR}/scripts/skill-hook.sh"; [ -f "$SH" ] || SH=$(ls "$H…`  
  `skills/planning-with-files/SKILL.md` — Declared in a skill: registered when the skill is invoked, then runs for the rest of the session. Runs on every Stop event.
- **ATTENTION** [`planning-with-files`] `PreCompact` [matcher: `*`]: `[ -n "${CLAUDE_PLUGIN_ROOT:-}" ] && exit 0; SH="${CLAUDE_SKILL_DIR}/scripts/skill-hook.sh"; [ -f "$SH" ] || SH=$(ls "$H…`  
  `skills/planning-with-files/SKILL.md` — Declared in a skill: registered when the skill is invoked, then runs for the rest of the session. Runs on every PreCompact event.

## Limits

- Static reading of declared configuration. Nothing was installed or executed.
- Scripts called by a hook are listed by command, not analysed.
- Tool descriptions and skill text are not checked for prompt injection; use a content scanner for that.

