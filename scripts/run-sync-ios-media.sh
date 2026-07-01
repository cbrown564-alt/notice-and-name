#!/bin/bash
set -euo pipefail

find_node() {
  if [[ -n "${NODE_BINARY:-}" && -x "${NODE_BINARY}" ]]; then
    echo "${NODE_BINARY}"
    return 0
  fi

  if command -v node >/dev/null 2>&1; then
    command -v node
    return 0
  fi

  local candidate
  for candidate in \
    /opt/homebrew/bin/node \
    /usr/local/bin/node \
    "${HOME}/.nvm/versions/node/"*/bin/node; do
    if [[ -x "${candidate}" ]]; then
      echo "${candidate}"
      return 0
    fi
  done

  return 1
}

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
NODE="$(find_node)" || {
  echo "error: node not found. Xcode does not load shell profiles (nvm, etc.)." >&2
  echo "Install Node via Homebrew or set NODE_BINARY in the Xcode scheme/build settings." >&2
  exit 1
}

exec "${NODE}" "${SCRIPT_DIR}/sync-ios-media.js" "$@"
