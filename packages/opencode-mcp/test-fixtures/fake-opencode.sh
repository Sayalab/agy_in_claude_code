#!/usr/bin/env bash
if [[ "$1" == "--version" ]]; then echo "1.14.18"; exit 0; fi
if [[ "$1" == "run" ]]; then echo "Hello from fake opencode: $2"; exit 0; fi
exit 1
