# What changed: `ECC@v2.1.0` → `affaan-m_ECC`

4 added, 9 changed, 1 removed.

## Added — runs now, did not before

- **ATTENTION** hook [`ecc`] `PreToolUse` matcher `PowerShell` — `hooks/hooks.json`
  `node -e "const p=require('path');const r=(function(){var p=require('path'),f=require('fs'),o=require('os');var e=proces…`
- **ATTENTION** hook [`ecc`] `PreToolUse` matcher `Bash|PowerShell|Write|Edit|MultiEdit` — `hooks/hooks.json`
  `node -e "const p=require('path');const r=(function(){var p=require('path'),f=require('fs'),o=require('os');var e=proces…`
- **ATTENTION** hook [`ecc`] `PostToolUseFailure` matcher `Skill` — `hooks/hooks.json`
  `node -e "const p=require('path');const r=(function(){var p=require('path'),f=require('fs'),o=require('os');var e=proces…`
- **ATTENTION** hook [`ecc`] `Stop` matcher `.*` — `hooks/hooks.json`
  `node -e "const p=require('path');const r=(function(){var p=require('path'),f=require('fs'),o=require('os');var e=proces…`

## Changed

- **ATTENTION** hook [`ecc`] `PostToolUse` matcher `.*` — `hooks/hooks.json`
  `node -e "const p=require('path');const r=(function(){var p=require('path'),f=require('fs'),o=require('os');var e=proces…`
  - command differs at char 974: `…rocess.env.CLAUDE_PLUGIN_ROOT=r;process.env.ECC_POSTTOOLUSE_PASSTHROUGH='1';proc…` → `…rocess.env.CLAUDE_PLUGIN_ROOT=r;process.argv.splice(1,0,s);require(s).cli()" syn…`
- **ATTENTION** hook [`ecc`] `PostToolUse` matcher `.*` — `hooks/hooks.json`
  `node -e "const p=require('path');const r=(function(){var p=require('path'),f=require('fs'),o=require('os');var e=proces…`
  - command differs at char 974: `…rocess.env.CLAUDE_PLUGIN_ROOT=r;process.env.ECC_POSTTOOLUSE_PASSTHROUGH='1';proc…` → `…rocess.env.CLAUDE_PLUGIN_ROOT=r;process.argv.splice(1,0,s);require(s).cli()" asy…`
- **ATTENTION** hook [`ecc`] `Stop` matcher `.*` — `hooks/hooks.json`
  `node -e "const p=require('path');const r=(function(){var p=require('path'),f=require('fs'),o=require('os');var e=proces…`
  - command differs at char 15: `node -e "const fs=require('fs');const path=require('pat…` → `node -e "const p=require('path');const r=(function(){va…`
- **ATTENTION** hook [`ecc`] `Stop` matcher `.*` — `hooks/hooks.json`
  `node -e "const p=require('path');const r=(function(){var p=require('path'),f=require('fs'),o=require('os');var e=proces…`
  - command differs at char 15: `node -e "const fs=require('fs');const path=require('pat…` → `node -e "const p=require('path');const r=(function(){va…`
- **ATTENTION** hook [`ecc`] `Stop` matcher `.*` — `hooks/hooks.json`
  `node -e "const p=require('path');const r=(function(){var p=require('path'),f=require('fs'),o=require('os');var e=proces…`
  - command differs at char 15: `node -e "const fs=require('fs');const path=require('pat…` → `node -e "const p=require('path');const r=(function(){va…`
- **ATTENTION** hook [`ecc`] `Stop` matcher `.*` — `hooks/hooks.json`
  `node -e "const p=require('path');const r=(function(){var p=require('path'),f=require('fs'),o=require('os');var e=proces…`
  - command differs at char 15: `node -e "const fs=require('fs');const path=require('pat…` → `node -e "const p=require('path');const r=(function(){va…`
- **ATTENTION** hook [`ecc`] `Stop` matcher `.*` — `hooks/hooks.json`
  `node -e "const p=require('path');const r=(function(){var p=require('path'),f=require('fs'),o=require('os');var e=proces…`
  - command differs at char 15: `node -e "const fs=require('fs');const path=require('pat…` → `node -e "const p=require('path');const r=(function(){va…`
- **ATTENTION** hook [`ecc`] `Stop` matcher `.*` — `hooks/hooks.json`
  `node -e "const p=require('path');const r=(function(){var p=require('path'),f=require('fs'),o=require('os');var e=proces…`
  - command differs at char 15: `node -e "const fs=require('fs');const path=require('pat…` → `node -e "const p=require('path');const r=(function(){va…`
- **ATTENTION** hook [`ecc`] `SessionEnd` matcher `.*` — `hooks/hooks.json`
  `node -e "const p=require('path');const r=(function(){var p=require('path'),f=require('fs'),o=require('os');var e=proces…`
  - command differs at char 15: `node -e "const fs=require('fs');const path=require('pat…` → `node -e "const p=require('path');const r=(function(){va…`

## Removed

- **ATTENTION** hook [`ecc`] `PreToolUse` matcher `Bash|Write|Edit|MultiEdit` — `hooks/hooks.json`
  `node -e "const p=require('path');const r=(function(){var p=require('path'),f=require('fs'),o=require('os');var e=proces…`

