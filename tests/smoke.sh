#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:80}"

echo "Testing: $BASE_URL/health"
curl -fsS "$BASE_URL/health" > /dev/null

echo "Testing: $BASE_URL/rooms"
curl -fsS "$BASE_URL/rooms" > /dev/null

echo "Testing: $BASE_URL/bookings (non-fatal)"
curl -s "$BASE_URL/bookings" || echo "Booking service not ready yet"

echo "Smoke tests completed."
