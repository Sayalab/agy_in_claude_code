#!/usr/bin/env bash
if [[ "$1" == "--version" ]]; then echo "7.2.14"; exit 0; fi
if [[ "$1" == "run" ]]; then echo "Hello from fake kilo: $2"; exit 0; fi
exit 1
