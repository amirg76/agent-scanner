import { isPinned } from './mcp.mjs';
import { clip } from '../text.mjs';

// Events on which a hook's "if" condition is evaluated (hooks documentation).
const TOOL_EVENTS = new Set(['PreToolUse', 'PostToolUse', 'PostToolUseFailure', 'PermissionRequest', 'PermissionDenied']);

// Claude Code hooks: commands the agent runs on its own when an event fires.
// Sources: plugin hooks/hooks.json, project .claude/settings(.local).json,
// and an inline "hooks" object in .claude-plugin/plugin.json.

// File names are matched without regard to case: on Windows and macOS file
// systems ".Claude/settings.json" is the file Claude Code reads (release gate).
export function isHookSource(rel) {
  const r = rel.toLowerCase();
  return r === 'hooks/hooks.json' || r.endsWith('/hooks/hooks.json') || isSettingsFile(rel) || isPluginManifest(rel);
}

export function isSettingsFile(rel) {
  return /(^|\/)\.claude\/settings(\.local)?\.json$/i.test(rel);
}

export function isPluginManifest(rel) {
  return /(^|\/)\.claude-plugin\/plugin\.json$/i.test(rel);
}

// oddKeys (optional): receives event keys whose value is not a list of groups.
export function detectHooks(rel, json, oddKeys = []) {
  const hooks = json && typeof json.hooks === 'object' && !Array.isArray(json.hooks) ? json.hooks : null;
  if (!hooks) return [];
  const findings = [];
  for (const [event, groups] of Object.entries(hooks)) {
    if (!Array.isArray(groups)) {
      // Not the documented shape (a list of groups): not a hook Claude Code
      // would run, so not counted as one, but reported per file by the caller
      // so it does not vanish (e.g. another tool's "pre"/"post" keys, or "__proto__").
      if (groups !== null && groups !== undefined) oddKeys.push(event);
      continue;
    }
    for (const group of groups) {
      const inner = Array.isArray(group?.hooks) ? group.hooks : [];
      for (const h of inner) {
        // Hooks may split the program and its arguments: { command: "sh", args: ["x.sh"] }.
        // Showing only "sh" hid the script in planning-with-files (docs/ENGINEERING-NOTES.md #11).
        const args = Array.isArray(h?.args) ? h.args.filter((a) => typeof a === 'string') : [];
        const command = typeof h?.command === 'string' ? [h.command, ...args].join(' ') : undefined;
        const f = {
          kind: 'hook',
          event,
          level: 'attention',
          file: rel,
          command,
          hookType: h?.type,
          why: whyHook(event, group?.matcher),
        };
        if (typeof group?.matcher === 'string') f.matcher = group.matcher;
        // Hooks documentation: "if" filters with permission-rule syntax and is
        // "only evaluated on tool events ... On other events, a hook with if set never runs."
        if (typeof h?.if === 'string' && h.if.trim()) {
          f.condition = h.if;
          f.why = TOOL_EVENTS.has(event)
            ? `Runs on ${clip(event, 60)} only when the tool call matches "${clip(h.if, 120)}".`
            : `Has an "if" condition on a non-tool event (${clip(event, 60)}); per the hooks documentation it never runs.`;
        }
        if (h?.once === true) f.once = true;
        if (f.command && isInlineCode(f.command)) {
          f.inlineCode = true;
          f.why += ` The code is inline in the command (${f.command.length} characters), not in a separate file.`;
        }
        const pkg = f.command ? registryPackage(f.command) : null;
        if (pkg) {
          f.package = pkg.name;
          f.pinned = isPinned(pkg.name, pkg.runner);
          if (!f.pinned) f.why += ` ${unpinnedNote(pkg)}`;
        }
        findings.push(f);
      }
    }
  }
  return findings;
}

// `npx @scope/cli@latest hooks pre-edit` inside a hook: registry code on every
// tool call (seen in ruflo; docs/ENGINEERING-NOTES.md #13). First package after the runner and flags.
export function registryPackage(command) {
  // Command position only: start, or after ; & | ( or then/do/exec. "echo npx is" is not a run.
  const m = /(?:^\s*|[;&|(]\s*|\b(?:then|do|exec)\s+)(npx|bunx|pnpx|uvx|pnpm\s+dlx)\s+((?:-{1,2}[\w-]+(?:=\S+)?\s+)*)([^\s;&|)'"-][^\s;&|)'"]*)/.exec(command);
  if (!m) return null;
  return { runner: m[1].replace(/\s+dlx$/, ''), name: m[3] };
}

// npx prefers a locally installed package; only a dist-tag such as @latest makes
// it resolve the registry on every run. Say which case applies (docs/ENGINEERING-NOTES.md #17:
// "npx tsc" in a project template is not the same as "npx @scope/cli@latest").
export function unpinnedNote(pkg) {
  const at = pkg.name.lastIndexOf('@');
  const tag = at > 0 ? pkg.name.slice(at + 1) : '';
  if (tag) return `Runs ${pkg.name}: the "${tag}" tag is resolved from the registry on each run.`;
  // Only npx and bunx look for a local install first; for uvx and pnpm dlx the
  // scanner does not claim how the release is chosen (fourth review).
  if (pkg.runner === 'npx' || pkg.runner === 'bunx') {
    return `Runs ${pkg.name} with no version: a local install is used if present, otherwise the current release is fetched.`;
  }
  return `Runs ${pkg.name} with no version: which release runs is decided by ${pkg.runner} at run time, not by this file.`;
}

// `node -e "..."`, `python -c "..."`, `bash -c "..."`: code that lives in the
// command string itself and is easy to miss when reviewing a plugin's files.
export function isInlineCode(command) {
  return /\b(node|python3?|py|bun|deno|bash|sh|zsh|pwsh|powershell|ruby|perl|php)(\.exe)?\s+(-e|-c|-r|--eval|-Command)\b/i.test(command);
}

function whyHook(rawEvent, matcher) {
  // Event names and matchers come from the scanned file: clipped in prose.
  const event = clip(rawEvent, 60);
  if (event === 'SessionStart') return 'Runs at session start (startup, resume, clear or compact), before the user types anything.';
  if (event === 'UserPromptSubmit') return 'Runs on every prompt the user sends and can add text to it.';
  // Matchers are regular expressions; "*" is also accepted by Claude Code as "all".
  const all = matcher === '*' || matcher === '.*' || matcher === '' || matcher === undefined;
  if (!TOOL_EVENTS.has(event)) return all ? `Runs on every ${event} event.` : `Runs on ${event} events matching "${clip(matcher, 120)}".`;
  return all ? `Runs on every ${event} event, for every tool.` : `Runs on ${event} for tools matching "${clip(matcher, 120)}".`;
}
