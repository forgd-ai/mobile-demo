// Description: Express server exposing the legacy-shaped workouts API on port 4000.
// Description: Response envelope, field names, units, and enums all match the original monolith.

import express from 'express';
import { workouts, users, activityTypes } from './data.js';

const app = express();
const PORT = Number(process.env.PORT ?? 4000);

// Legacy envelope: every success is { result, count }, every error is
// { error_code, error_msg }. The BFF unwraps this; nothing else should.
function ok(res: express.Response, result: unknown, count?: number) {
  res.json(count === undefined ? { result } : { result, count });
}

function fail(res: express.Response, code: number, msg: string) {
  res.status(code).json({ error_code: code, error_msg: msg });
}

app.get('/health', (_req, res) => {
  res.json({ ok: 1 });
});

// GET /v1/workouts?user_id=1&from_ts=...&to_ts=...
app.get('/v1/workouts', (req, res) => {
  const userId = req.query.user_id ? Number(req.query.user_id) : undefined;
  const fromTs = req.query.from_ts ? Number(req.query.from_ts) : undefined;
  const toTs = req.query.to_ts ? Number(req.query.to_ts) : undefined;

  let rows = workouts;
  if (userId !== undefined) rows = rows.filter((w) => w.user_id === userId);
  if (fromTs !== undefined) rows = rows.filter((w) => w.start_ts >= fromTs);
  if (toTs !== undefined) rows = rows.filter((w) => w.start_ts < toTs);

  ok(res, rows, rows.length);
});

app.get('/v1/workouts/:id', (req, res) => {
  const row = workouts.find((w) => w.workout_id === Number(req.params.id));
  if (!row) return fail(res, 404, 'workout not found');
  ok(res, row);
});

app.get('/v1/users', (_req, res) => {
  ok(res, users, users.length);
});

app.get('/v1/users/:id', (req, res) => {
  const row = users.find((u) => u.user_id === Number(req.params.id));
  if (!row) return fail(res, 404, 'user not found');
  ok(res, row);
});

app.get('/v1/activity_types', (_req, res) => {
  ok(res, activityTypes, activityTypes.length);
});

app.listen(PORT, () => {
  console.log(`[api] legacy workouts api listening on http://localhost:${PORT}`);
});
