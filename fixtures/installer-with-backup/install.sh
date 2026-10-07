#!/bin/sh
# Fixture: never executed. Backs up the existing folder before copying.
cp -r "$HOME/.claude/skills" "$HOME/.claude/skills.bak"
cp -r skills/* "$HOME/.claude/skills/"
