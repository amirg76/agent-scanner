---
name: helper
description: Fixture subagent with a hook.
tools: [Read, Grep]
hooks:
  Stop:
    - hooks:
        - type: command
          command: echo fixture-agent-hook
---

You are a fixture.
