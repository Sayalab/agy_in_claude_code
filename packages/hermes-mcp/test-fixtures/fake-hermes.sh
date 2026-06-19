#!/usr/bin/env bash
if [[ "$1" == "version" ]]; then echo "Hermes Agent v0.10.0"; exit 0; fi
if [[ "$1" == "chat" && "$2" == "-q" ]]; then echo "Hello from fake hermes: $3"; echo "args: $*"; exit 0; fi
exit 1
