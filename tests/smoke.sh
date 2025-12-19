#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost}"

check() {
  local path="$1"
  local tries=20

  echo "Testing: $BASE_URL$path"
  for i in $(seq 1 $tries); do
    if curl -fsS "$BASE_URL$path" > /dev/null; then
      echo "OK: $path"
      return 0
    fi
    echo "Retry $i/$tries..."
    sleep 2
  done

  # Print the HTTP status code to help debug in Actions logs
  code=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL$path" || true)
  echo "FAILED: $path (HTTP $code)"
  return 1
}

check "/health"
check "/rooms"
check "/bookings"

echo "Smoke tests passed."
