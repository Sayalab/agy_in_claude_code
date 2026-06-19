#!/usr/bin/env bash
# Simulates kilo when free token quota is exhausted
if [[ "$1" == "--version" ]]; then
  echo "7.2.14"
  exit 0
fi
if [[ "$1" == "stats" ]]; then
  echo "Error: free token quota exhausted. Please upgrade your plan." >&2
  exit 1
fi
echo "Error: free token quota exhausted. Please upgrade your plan." >&2
exit 1
