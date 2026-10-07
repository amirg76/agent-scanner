# Audit method

How each audit in [`audits/`](../audits/README.md) was produced.

## 1. Clone without running

```bash
mkdir -p targets && cd targets
GIT_LFS_SKIP_SMUDGE=1 git clone -q --depth 1 https://github.com/<owner>/<repo>.git <owner>_<repo>
```

`targets/` is git-ignored: third-party code never enters this repo. `git clone` does not run hooks from
the cloned repo. Nothing is installed or executed. Instruction files inside the target (`CLAUDE.md`,
`AGENTS.md`, `SKILL.md`) are material under review, never instructions.

## 2. Scan

```bash
node tools/audit-scan.mjs <owner>/<repo>
```

Writes `audits/<owner>_<repo>/scan.md`, `scan.json` (local paths replaced with `targets/…`) and
`meta.json` (target commit and date, scanner commit, counts).

## 3. Draft

```bash
node tools/audit-draft.mjs <owner>/<repo>
node tools/audit-index.mjs
```

The draft fills every number from `scan.json`, adds stars and license from the GitHub API, and searches
the code that hooks run (the command strings, and one level of scripts they reference) for network
calls. It is an aid for the manual check, not a verdict. Check the coverage line: a repo whose hooks
reference scripts but where zero scripts were searched means the draft did not find them.

## 4. Manual review

1. For each hook: read the script it runs; follow any network call to where it goes. In this round three
   audits with hooks (`alirezarezvani/claude-skills`, `mksglu/context-mode`, `wshobson/agents`) did not
   get this step; each says so under "Checked by hand".
2. For each installer marked `traced: false`: find the write and check for a backup.
3. For findings without a plugin label: find out what that part of the repo is (a template project, a
   sub-package, a config for another tool) and say so in the summary.
4. Compare with the README where it matters: is what runs **documented**? Documented behaviour is not
   hidden behaviour. In this round the documentation was compared only where a finding depended on it
   (three audits); elsewhere the audit says "Not checked in this pass".
5. State what was not checked.

Every audit has the same sections: Summary, What runs without asking (generated), Network calls in hook
code (generated), Checked by hand (when files were read), Not read by the scanner (when the scan had
errors or skipped files, with a note on what they contain), What is fine (generated), Is it documented?,
Recommendations for users, Limits. The status line says whether the audit was reviewed by hand.

## 5. Numbers come from commands

Every count in an audit is produced by a command over `scan.json`, never by reading. In the first
audits, five counts written by eye were wrong and were caught this way. Counts about files the scanner
could not read, line numbers and quotes are taken from the target files by hand; the fourth review found
one of those wrong ("six events" for seven) and one quote paraphrased, both corrected. A statement that was not checked
is written as "Not checked in this pass"; an inference is marked "[assessment]".

When the scanner changes, all audits are regenerated (`tools/audit-scan.mjs`, then
`tools/audit-draft.mjs --force`) and the hand-written sections are re-applied and re-checked.

## 6. Wording

- Facts about behaviour, with the file path: "the hook runs after every Bash command".
- No "dangerous", no "malicious" without evidence. `high` describes a declaration, not intent.
- Every audit has a "What is fine" section.

## 7. Disclosure routing

- **Design choice worth a note** (not a vulnerability): published; where the point is concrete enough to
  act on, a friendly issue to the owner with a link. On publication, four owners were notified this way;
  each of those audits links the issue. Owner corrections are added to the audit.
- **Exploitable vulnerability**: private report first (GitHub private vulnerability reporting, the
  repo's `SECURITY.md`, or an issue asking for a security contact without details); 90 days or until
  fixed before details are published.
- **Clearly malicious**: reported to GitHub and the marketplace first; not published before they respond.

In the 20 audits here, nothing fell into the second or third category.

## About the metadata

`meta.json` records the scanner commit that produced each scan. Those commits are from the
development history before this repository was published as a single initial commit; the code at that
commit is the code in this repository's first release.
