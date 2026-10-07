# Fixtures

Every fixture here is **inert**: hooks and scripts only `echo` or `console.log`, and the two
installer fixtures contain a `cp` line for the installer detector to find. Nothing here is executed.
They test *structure* (where something is declared, on which event, with which
matcher, pinned or not), not attack payloads.

Each folder has an `expected.json`:

- `findings`: each entry must be matched by at least one finding the scanner
  returns (every listed key must be equal).
- `exact`: when `true`, the scanner must return exactly this many findings.

Never run `npm install` or any script inside this folder.
