# Engineering notes: what real repos taught the scanner

A scanner that passes its own fixtures proves only that it agrees with its author. This file records
every problem found **after** the fixtures were green — by running on real extensions, by a code review,
and by AI-assisted security and reader reviews before publication — and what changed because of it.
Every code fix has a test (fixture or unit test); the exceptions are wording changes (#16, #17's text,
#27, #33).

## How the scanner was built

1. **Fixtures before code.** 8 inert fixtures (each plugin only runs `echo`) with an `expected.json`,
   and a test harness that failed with "scanner not found". Then the scanner, until all passed.
2. **Exact mode.** A fixture can require an exact finding count, so an extra finding fails the build.
   That is how false positives are measured, not only misses.
3. **Calibration.** Three real repos first, then twenty. Every surprise became a fixture or a unit test
   before it was fixed.
4. **AI-assisted review passes before publishing.** Separate AI-assisted passes playing a security
   reviewer, a code reviewer, and three readers (a first-time reader, a senior engineer, a maintainer of
   an audited project), run four times on the finished repo, then a release gate. No audited project's maintainer has been
   contacted yet.

Final state: 24 fixtures, 121 tests, CI on Linux, Windows and macOS.

## Caught by fixtures and unit tests, before any real repo (3)

1. **The word "backup" in a comment counted as a backup step.** A fixture said `# no backup` and the
   installer detector concluded there was one. Comments are stripped before the check.
2. **The backup folder was reported as an install target.** `~/.claude/skills.bak` came out as a second
   target. Backup-named segments are skipped.
3. **`echo npx is great` was read as running a package.** Package detection now requires `npx` in
   command position (start, or after `;`, `&&`, `|`, `(`).

## Found by running on real repos (15)

### Pilot: three repos

4. **Test files reported as installers.** `tests/scripts/install-sh.test.js` and two others in ECC.
   Test paths are excluded.
5. **The real installer was missed.** ECC builds the target path in one module and copies in another.
   A per-file heuristic cannot see both. Instead of guessing, such an installer is now reported with
   `traced: false` and `backup: null`, and the audit checks it by hand (ECC: `copyFileSync`, no backup,
   confirmed).
6. **9 of 14 MCP servers in the official marketplace were invisible.** Plugin `.mcp.json` files often
   omit the `mcpServers` wrapper. Both shapes are read now.
7. **The regex matcher `.*` was not described as "every tool".** Only `*` was.

### Diff mode, on ECC v2.1.0 → current

8. **16 hooks shown as removed and 16 as added.** ECC changed its matchers from `*` to `.*`, which mean
   the same thing. Matchers are normalised before comparison: 19 added / 16 removed became
   4 added / 9 changed / 1 removed.
9. **"Changed" commands looked identical.** Every ECC hook starts with the same ~1,000-character
   bootstrap, so a truncated before/after showed nothing. The diff now shows a window around the first
   differing character (they differed at characters 974 and 15).

### Twenty repos

10. **The audit drafts searched zero scripts in 4 repos that have hooks**, so "no network calls found"
    meant nothing. Three path shapes were not resolved: a quote between variable and path
    (`"${CLAUDE_PLUGIN_ROOT}"/hooks/x.sh`), the plugin root copied into another variable
    (`HOOK_ROOT=...; node "$HOOK_ROOT/src/x.js"`), and the next item.
11. **Hooks can split program and arguments** (`"command": "sh", "args": ["x.sh"]`). The scanner showed
    only `sh`. Command and args are joined now.
12. **Shell one-liners in settings files were not searched** for network calls, only inline `-e`/`-c`
    code. Every command string is searched now.
13. **Hooks that run `npx @scope/cli@latest` were not flagged.** They now carry the package name and
    whether it is pinned.
14. **A minified bundle flooded an audit** with 15 unreadable 110-character slices. Minified files now
    get one summary line.
15. **`\.claude\b` in a JavaScript regex was read as a folder named `b`.** A one-letter segment after a
    backslash is an escape, not a path.
16. **"Backup step found" overstated the evidence.** It meant the word "backup" appeared in the code.
    The wording now says "backup-related code (heuristic)".
17. **"Each run fetches the current version" overstated it too.** `npx tsc` uses a local install when
    one exists; only a dist-tag such as `@latest` resolves the registry on every run. The two cases are
    worded differently now.
18. **The audit index showed 0 "installer, no backup" for ECC**, whose overwrite was confirmed by hand,
    because its installer is `traced: false`. The index has a separate "not traced" column.

## Found by code review (1)

19. **Path traversal in the audit tooling.** A hook command in the audited repo such as
    `sh ../../x.sh` made the draft tool read a file **outside** the target and quote it into an audit
    meant for publication. Paths that leave the target are refused and symlinks are not followed.
    None of the 20 audits was affected (script counts identical before and after the fix).

## Found by the first pre-publication review (9)

The finished repo was reviewed three ways before publication (AI-assisted passes, see above). These are
the problems it found, in order of severity.

20. **A plugin inside `build/` reported "nothing declared".** The file walk skipped folders named
    `build`, `dist`, `venv` and a few others, silently. For a security tool this was the worst kind of
    bug: a confident clean result. Only `.git` and `node_modules` are skipped now, and skipped folders
    and symlinks are listed under "Not checked". Fixture `hidden-in-build`.
21. **A scanned repo could write into the report.** Values such as an env var name, a matcher or a
    server name went into the Markdown unescaped, so a crafted name could add a fake heading and a
    paragraph saying the repo "was reviewed and is SAFE". Every value from the scanned repo now goes
    through `src/text.mjs`. The new test found one more place on its first run: the diff title.
22. **The audit tooling could be stalled.** The pattern that found script paths in hook commands took
    quadratic time (a 60K-character command: 4.2 s; 50K: 11.3 s in the reviewer's run). Replaced with a
    word split and a length cap; timing tests on 200K-character inputs for it and three other patterns.
23. **Terminal control codes reached the terminal.** A hook command containing ANSI escapes could clear
    the screen during a scan. Markdown output strips them (and bidirectional overrides); JSON escapes them.
24. **Findings were attributed to the wrong thing.** A skill repo ships `stack/`, a separate template
    project; its `.mcp.json` and settings were reported as the skill's own. Another repo has 23 of its
    54 hooks in project settings files. A finding now belongs to a plugin only when its file is where
    Claude Code loads that plugin's components; project settings are labelled. Found while re-scanning
    after #25. Fixture `project-settings-in-plugin`.
25. **Declarations the scanner did not read**, checked against the Claude Code documentation:
    `plugin.json` `hooks` / `mcpServers` given as paths; settings that run a command (`statusLine`,
    `apiKeyHelper` and six others); MCP pre-approvals (`enableAllProjectMcpServers`,
    `enabledMcpjsonServers`); plugin language servers and monitors; and allow rules that grant a shell
    with any arguments (`Bash(sh -c:*)`). Re-scanning the 20 repos with these added found one new high
    finding (the template project's `enableAllProjectMcpServers`) and three new attention findings.
26. **Two parsing bugs:** for `docker run` the image was taken as the last argument (`serve` in
    `docker run img serve`), and `uvx --from <source>` took the source's value as a flag.
27. **Claims that said more than the tool did:** "see everything it will run" (see #20, #25); "15
    fixtures" (there were 14); "every fix shipped with a test" (#12, #14 and #18 had none — they have
    tests now); `ANTHROPIC_BASE_URL` attributed to CVE-2025-59536 (it is CVE-2026-21852); "files read"
    for files that were only listed; a quotation from Anthropic without a link.
28. **Audit wording a maintainer could fairly object to:** a ranking ("the largest footprint in this
    set"); an ECC summary stated more strongly than the evidence behind it, and a leftover working note;
    a claude-mem summary that omitted "once an API key is configured"; "the repo itself runs nothing"
    for a repo whose root declares two MCP servers; one plugin missing from a table. All corrected, and
    all 20 audits were regenerated from a single scanner version.

## Found by the second pre-publication review (5)

29. **Invisible characters in the source.** Where escape text such as `\u200b` was intended, the
    literal zero-width and bidirectional control characters had landed in three source files — in the
    very code that strips them from reports. GitHub would have shown a "bidirectional Unicode" warning
    on a security tool. Replaced with escapes, and `test/source-hygiene.test.mjs` now fails if any
    appear anywhere in the repo.
30. **Hooks in skill and subagent frontmatter were not read.** The hooks documentation: "hooks can be
    defined directly in skills and subagents using frontmatter, in the same configuration format as
    settings-based hooks". Added a small YAML-subset parser (`src/frontmatter.mjs`) that gives up rather
    than guesses. Re-scanning found 78 such hooks in two of the 20 repos (70 in one repo's 14 copies of
    the same skill). Fixture `frontmatter-hooks`, parser tests.
31. **Two plugins with the same name were merged.** One repo has two plugins named `claude-flow`; the
    audit counted 3 plugins with findings instead of 4. Duplicate names now carry their folder.
    Fixture `duplicate-plugin-names`.
32. **`headersHelper` on MCP servers** (a command run at connection time) was not read, and the text
    for local MCP servers said they start "when the project loads". Per the MCP documentation, a
    plugin's servers start when the plugin is enabled, and a project's servers after approval in an
    interactive session. Fixture `mcp-headers-helper`.
33. **Wording:** "lists all of these declarations" (see #30); "outside review" for what were
    AI-assisted review passes; "high" defined as "no approval at all", when project allow rules apply
    only after the workspace trust dialog; an ECC summary and a get-shit-done summary that needed a
    stated limit; a missing manual check for two untraced installers in one audit. All corrected; all 20
    audits regenerated from one scanner version.

## Found by the third review, on the new frontmatter code (5)

34. **A "__proto__" key hid a hook.** In the frontmatter parser, `obj[key] = value` with the key
    `__proto__` calls the prototype setter instead of adding a key, so a hook placed under it vanished with
    no finding and no error. Keys are now defined as own properties.
35. **Three more ways a frontmatter hook vanished with no trace:** a quoted `"hooks":` key was not
    recognised; frontmatter over 64 KB returned nothing; a `.md` file over 1 MB was dropped without being
    listed as skipped. The first is read now; the other two are reported.
36. **Valid YAML the parser refused:** a quoted value followed by a comment (`- "human"  # note`). This
    made 14 agent files in one audited repo "not parsed". Now read; anchors, aliases and tags make the
    parser give up instead of returning their literal text.
37. **Hook entries in another tool's format.** Once those 14 files (and 116 like them) parsed, their own
    `pre` / `post` keys briefly became 298 findings. They are not Claude Code events or the documented
    shape, so they are not hooks; each file gets one "not interpreted" line instead, and the audit shows it
    in a new "Not read by the scanner" section, which the audits previously did not have at all.
38. **Documented handler fields:** `if` (a permission-rule condition, evaluated only on tool events; on
    other events the hook never runs) and `once` (skill frontmatter only) are read; a subagent's `Stop`
    is reported as `SubagentStop`, as Claude Code converts it; "for every tool" is no longer said of
    non-tool events.

## Found by the fourth review (5)

39. **Inline objects in a plugin.json array were dropped.** `hooks` and `mcpServers` take "Path, object,
    or array of either", and the manifest reference's own example mixes a path and an object. Only the
    paths were read: a hook declared as an object inside the array produced no finding and no error. Every
    inline object is read now. The same change reads `lspServers` and `experimental.monitors` from the
    manifest, inline or by path, which the scanner had listed as a limit, and lists an MCP bundle
    (`.mcpb`, `.dxt`) as not read. The first version of this fix treated a `monitors` array only as inline
    entries, so a path inside it was dropped; the code review of the fix caught it.
40. **A plugin named "__proto__" in the "By plugin" table.** The per-plugin counts were a plain object,
    so that name showed `undefined | NaN` and wrote to `Object.prototype`: the same class as #34, in
    the report instead of the parser. Now a `Map`. The first version missed one lookup, and the
    "(outside any plugin)" row disappeared; the code review of the fix caught that too.
41. **No length limit on hostile text inside sentences.** A hook event, matcher, `if` value or key name
    could be as long as the file, and was repeated in full in the explanation and in the report. The
    fragments are clipped where they are embedded; the full value stays in its own field.
42. **Registry wording for other runners.** "A local install is used if present" is true of `npx` and
    `bunx`; it was also said of `uvx` and `pnpm dlx`, which the scanner has no source for.
43. **Monitor wording from an older page.** The quoted "start automatically when the plugin is active"
    is no longer in the plugin reference; the text now quotes the manifest reference, and a monitor is
    named by its own `name` field.

## Found by the release gate (13)

44. **One capital letter hid everything.** File names were matched case-sensitively, so
    `.Claude/settings.json` with `"allow": ["Bash"]` gave no finding and exit 0, while Windows and macOS
    open that file as `.claude/settings.json`. The same applied to every component file name and to paths
    in `plugin.json`. All are matched without case now. Folder skipping deliberately stays exact: a
    folder named `Node_Modules` is scanned, not skipped.
45. **A manifest array could stall or crash the scan.** 60,000 copies of one path in `plugin.json` took
    39 seconds and could end in a JSON output error with no report. The cause was reading that one file
    60,000 times: a file named twice in one field is now read once, which also fixes double counting.
46. **Subagents in subfolders lost their plugin.** `agents/review/helper.md` was read as a subagent but
    not attributed to its plugin, so the plugin's row in "By plugin" showed zero. Claude Code "loads them
    recursively" (plugin components documentation); attribution now does too.

47. **My first fix for #45 hid declarations twice over.** It capped each field at 100 entries, so a
    manifest could put its one real hook after 100 empty ones: no finding, exit 0 even with
    `--fail-on attention`. And its de-duplication set was shared by all fields, so `hooks` and
    `mcpServers` naming the same file read it only as hooks. The second gate round caught both. There is
    no cap now (de-duplication alone removes the cost), the set is per field, and repeated error lines are
    written once, each naming its path.
48. **Two files that differ only in case** (possible on Linux) shared one entry in the lookup used for
    manifest paths. An exact name is now looked up first.

49. **Two silent limits from the first version of the component detector.** It stopped after 200
    findings and skipped anything nested more than 20 levels deep, with no error line. Because it walked
    the file from the end, a monitor placed first behind 250 others was never reported, and the scan exited
    0. The third gate round found it; round 2 had removed a cap only where it was reported. Both limits are
    gone (the walk is iterative and the input at most 1 MB), and a search of `src/` for every remaining
    limit found none that drops a declaration without a line under "Not checked". A manifest entry that is
    neither a path nor an object now gets such a line too.

50. **"Not checked" did not reach the verdict.** A project settings file padded past 1 MB and holding
    `Bash(*)` was listed under "Not checked", but the headline said "Nothing in this folder is declared to
    run on its own" and the exit code was 0, even with `--fail-on high`. In a diff the same file showed
    `Bash(*)` as **removed**. Now a scan or diff with an unread file that could declare something exits
    `3` and says so in the headline, and a diff lists such a finding as "no longer checked", which exits
    `1` like a new one. My claim after round 3, that no silent drop was left, was true of the detectors
    and false of the report.
51. **A widened `if` was not a change.** The diff did not compare a hook's `condition` or `once`, so a
    hook that went from one command to every command showed no difference. Both are value fields now.

52. **A link was a policy skip, so it could hide a hook.** Links are never followed, which is right; but
    the round-4 fix counted them as skipped "by design", so `hooks/` as a link to a real folder gave
    "nothing declared" and exit 0, and a diff showed the hook as removed. Claude Code reads through a link.
    A link now makes the scan incomplete (exit `3`), and a diff matches unread folders by prefix, so a
    finding under a linked folder is "no longer checked". A file whose size cannot be read, and an entry
    that is not a file, folder or link, are listed instead of skipped silently.

53. **The marketplace file was not read at all.** The gate found that an entry whose `source` points
    into `node_modules` hid a whole plugin with exit 0. Reading the marketplace reference showed more: an
    entry can declare hooks, MCP servers, language servers and monitors inline, and a `command` source
    or `headersHelper` runs a command. All are read now. On the 20 audited repos this found 12 language
    servers in `anthropics/claude-plugins-official`, declared in entries that are their plugins' only
    manifest, and showed that its audit described 39 plugins of a marketplace that lists 311: 259 are
    hosted elsewhere. That audit and `wshobson/agents` (2 of 94 hosted elsewhere) now say so, and the
    scanner reports such entries itself.

54. **Marketplace findings in the wrong row.** The round-6 reader reported what an entry declares, but
    not as part of the entry's plugin: the plugin's row in "By plugin" read 0 0 0 while its entry ran a
    command. An entry whose source is a folder here is now a plugin (with or without `plugin.json`), and
    its declarations belong to it. Five entries in `anthropics/skills` share the folder `./`, each
    choosing other skills; they are five plugins, not one. Also: `"./C:/Windows"` and an absolute
    `metadata.pluginRoot` resolved off the folder (harmless, nothing was read there; now refused); a
    source that is a list or a number, or an undocumented source type, is reported; `command` sources
    are counted separately from plugins hosted elsewhere.

55. **My round-7 model assumed one owner per file.** With several entries on one folder, a
    `hooks/hooks.json` there was given to the first entry only, so a decoy entry listed first left the
    chosen plugin's row at 0 0 0; swapping the two entries turned the same hook into "removed" from one
    plugin and "added" to another in a diff; and two entries with one name and one folder became one row.
    Now such a file belongs to every entry on the folder (`sharedBy`, counted in each row, with a label
    sorted so order does not matter), an entry is identified by its position rather than its name, and
    names still equal after adding the folder are numbered.

56. **The diff keyed ownership by a display label.** `plugin` was part of the slot, and for a shared
    file it held the joined names "a, b", so a plugin literally named "a, b" split into a and b gave an
    empty diff and exit 0, and a new owner joining a shared folder showed an unchanged hook as removed and
    added. The plugin is now a value, `owners`, compared as a list. The round-8 numbering could also
    produce a name a real plugin already had ("x #1"), giving two equal rows; numbers now skip taken
    names. Entry hooks written as a path or array, which Claude Code does not run, are listed as not read.

The tenth round passed (MERGE). Two non-blocking points it raised are open, not fixed:

- A marketplace entry with no valid `source` is reported but belongs to no plugin. Claude Code does not
  load such an entry.
- An error in one marketplace entry marks the whole marketplace file as not read, so in a diff every
  finding in that file is "no longer checked". This errs on the side of caution (exit 1), with noise.

These fixes changed numbers in three audits (`anthropics/claude-plugins-official`: 36 → 48 findings, all
12 new ones language servers, and 39 → 53 plugins; `anthropics/skills`: 0 → 5 plugins, still nothing
declared; `wshobson/agents`: one "Not checked" line). The totals in the README do not include language
servers.

## Mistakes in the audit text itself

Five counts in the hand-written parts of audits were first written by eye and were wrong
(13 for 12, 25 for 19, "four" for three, "three plugin configs" for four hook files and two settings
files, 8 for 7). All were caught by checking against `scan.json`. Since then every number in an audit
is produced by a command, and a sentence that was not checked says so ("Not checked in this pass").
The fourth review found two more, both in text read by hand from a target: "six events" for seven in a
file the scanner could not parse, and a paraphrased code quote.

## Fairness correction

Ten ruflo hooks run `npx @claude-flow/cli@latest`. The generated draft listed them with the plugin's
hooks. They are in fact in `v3/@claude-flow/mcp/.claude/settings.json`, a sub-package's project
settings, active only if that folder is opened as a project. The audit says so explicitly, and since #24
the scanner labels such findings itself.
