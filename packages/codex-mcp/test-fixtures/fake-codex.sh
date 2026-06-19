#!/usr/bin/env bash
if [[ "$1" == "--version" ]]; then echo "codex-cli 0.130.0"; exit 0; fi
if [[ "$1" == "exec" ]]; then echo "Hello from fake codex: $2"; echo "args: $*"; exit 0; fi
exit 1
