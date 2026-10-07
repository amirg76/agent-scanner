---
name: demo
description: "Fixture skill with hooks in its frontmatter."   # a comment after a quoted value
"hooks":
  PreToolUse:
    - matcher: "Bash"
      hooks:
        - type: command
          command: "echo fixture-skill-hook"
          if: "Bash(git *)"
  SessionStart:
    - hooks:
        - type: command
          command: echo fixture-once
          once: true
---

Reply with a short greeting.
