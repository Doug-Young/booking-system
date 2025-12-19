#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost}"

check() {
  local path="$1"

  echo "Testing: $BASE_URL$path"
  for i in {1..20}; do
    if curl -fsS "$BASE_URL$path" > /dev/null; then
      echo "OK: $path"
      return 0
    fi
    sleep 2
  done

  echo "Failed: $path"
  return 1
}

check "/health"
check "/rooms"
check "/bookings"

echo "Smoke tests passed."
