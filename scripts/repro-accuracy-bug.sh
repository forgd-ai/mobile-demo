#!/usr/bin/env bash
# Description: Deterministic cross-layer accuracy check: does the BFF's weekly summary match the raw API data?
# Description: Boots both services on test ports, recomputes expected totals independently, diffs, exits non-zero on mismatch.

set -euo pipefail
cd "$(dirname "$0")/.."

API_PORT=4980
BFF_PORT=4981
USER_ID=1

cleanup() {
  [[ -n "${API_PID:-}" ]] && kill "$API_PID" 2>/dev/null || true
  [[ -n "${BFF_PID:-}" ]] && kill "$BFF_PID" 2>/dev/null || true
}
trap cleanup EXIT

wait_for() {
  local url="$1" name="$2"
  for _ in $(seq 1 60); do
    if curl -sf "$url" >/dev/null 2>&1; then return 0; fi
    sleep 0.5
  done
  echo "FATAL: $name did not come up at $url" >&2
  exit 3
}

TSX="$(pwd)/node_modules/.bin/tsx"
if [[ ! -x "$TSX" ]]; then
  echo "FATAL: $TSX not found; run npm install first" >&2
  exit 3
fi

echo "booting api (:$API_PORT) and bff (:$BFF_PORT) on test ports..."
(cd services/api && exec env PORT=$API_PORT "$TSX" src/server.ts >/dev/null 2>&1) &
API_PID=$!
(cd services/bff && exec env PORT=$BFF_PORT API_URL="http://localhost:$API_PORT" "$TSX" src/server.ts >/dev/null 2>&1) &
BFF_PID=$!
wait_for "http://localhost:$API_PORT/health" "api"
wait_for "http://localhost:$BFF_PORT/health" "bff"

# The check pins tz=UTC so the expected values are identical on every machine.
# The canonical window is the latest Monday-start UTC week that contains
# workouts for the user; the fixtures always end on a full week.
node - "$API_PORT" "$BFF_PORT" "$USER_ID" <<'EOF'
const [apiPort, bffPort, userIdRaw] = process.argv.slice(2);
const userId = Number(userIdRaw);
const MI = 1609.344;
const FT = 3.28084;
const round1 = (x) => Math.round(x * 10) / 10;

function weekStartUtc(epochSeconds) {
  const d = new Date(epochSeconds * 1000);
  const day = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const shift = (day.getUTCDay() + 6) % 7;
  day.setUTCDate(day.getUTCDate() - shift);
  return day;
}

const main = async () => {
  const apiRes = await fetch(`http://localhost:${apiPort}/v1/workouts?user_id=${userId}`);
  const rows = (await apiRes.json()).result;
  if (!rows.length) {
    console.error('FATAL: no fixture workouts for user ' + userId);
    process.exit(3);
  }

  // latest UTC week containing data = the canonical window
  const latestStart = rows.map((r) => weekStartUtc(r.start_ts)).sort((a, b) => b - a)[0];
  const fromTs = latestStart.getTime() / 1000;
  const toTs = fromTs + 7 * 86400;
  const weekKey = latestStart.toISOString().slice(0, 10);
  const week = rows.filter((r) => r.start_ts >= fromTs && r.start_ts < toTs);

  // expected values, computed independently from raw API data:
  // sum raw storage units first, convert to display units exactly once
  const meters = week.reduce((s, r) => s + r.distance_m, 0);
  const seconds = week.reduce((s, r) => s + r.duration_s, 0);
  const elevM = week.reduce((s, r) => s + (r.elevation_gain_m ?? 0), 0);
  const expected = {
    workouts: week.length,
    totalDurationSeconds: seconds,
    'totalDistance km': round1(meters / 1000).toFixed(1),
    'totalDistance mi': round1(meters / MI).toFixed(1),
    'totalElevationGain m': String(Math.round(elevM)),
    'totalElevationGain ft': String(Math.round(elevM * FT)),
  };

  // what the bff serves for the same window
  const bff = {};
  for (const units of ['metric', 'imperial']) {
    const res = await fetch(
      `http://localhost:${bffPort}/api/summary/weekly?userId=${userId}&units=${units}&tz=UTC`
    );
    const summary = (await res.json()).weeks.find((w) => w.weekStart === weekKey);
    if (!summary) {
      console.error(`FATAL: bff has no ${units} summary for week ${weekKey}`);
      process.exit(3);
    }
    bff[units] = summary;
  }

  const checks = [
    ['workouts', expected.workouts, bff.metric.workouts],
    ['totalDurationSeconds', expected.totalDurationSeconds, bff.metric.totalDurationSeconds],
    ['totalDistance (km)', expected['totalDistance km'], bff.metric.totalDistance.toFixed(1)],
    ['totalDistance (mi)', expected['totalDistance mi'], bff.imperial.totalDistance.toFixed(1)],
    ['totalElevationGain (m)', expected['totalElevationGain m'], String(bff.metric.totalElevationGain)],
    ['totalElevationGain (ft)', expected['totalElevationGain ft'], String(bff.imperial.totalElevationGain)],
  ];

  console.log(`\ncanonical window: week of ${weekKey} (UTC), user ${userId}, ${week.length} workouts\n`);
  console.log('field                      expected      bff           verdict');
  console.log('-------------------------  ------------  ------------  --------');
  let mismatches = 0;
  for (const [field, exp, got] of checks) {
    const ok = String(exp) === String(got);
    if (!ok) mismatches++;
    console.log(
      `${field.padEnd(25)}  ${String(exp).padEnd(12)}  ${String(got).padEnd(12)}  ${ok ? 'ok' : 'MISMATCH'}`
    );
  }
  console.log('');
  if (mismatches > 0) {
    console.log(`ACCURACY BUG (${mismatches} mismatches)`);
    process.exit(1);
  }
  console.log('DATA CONSISTENT');
};

main().catch((err) => {
  console.error('FATAL:', err);
  process.exit(3);
});
EOF
