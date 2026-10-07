# Security policy

`agent-scanner` reads untrusted repositories, so bugs in it can matter. Reports are welcome.

## What counts as a vulnerability here

- Anything that lets a scanned repository run code, read or write files outside the scanned folder,
  or make the scanner hang or exhaust memory.
- Anything that lets a scanned repository change what a report says: fake headings, links, or text
  that looks like the scanner's own verdict.
- Control sequences from a scanned repository reaching the terminal.
- A detection gap that makes the scanner report "nothing declared" for an extension that declares
  something that runs automatically.

## How to report

Use GitHub's private vulnerability reporting on this repository (**Security → Report a vulnerability**).
Please include the smallest input that reproduces the problem. Do not open a public issue for a
vulnerability.

This is a one-person project. Expect a first reply within a week. Fixes are released with a test that
reproduces the report, and the report is credited in `CHANGELOG.md` unless you prefer otherwise.

## Corrections to an audit

An error in one of the audits under `audits/` is not a security issue. Open a regular issue using the
"Audit correction" template.

## Supported versions

Only the latest version on the default branch.
