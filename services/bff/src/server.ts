// Description: Express server exposing the app-facing contract on port 4100.
// Description: Every response is camelCase, display units, ISO timestamps, and named enums.

import cors from 'cors';
import express from 'express';
import { fetchUsers, fetchWorkout, fetchWorkouts, UpstreamError } from './apiClient.js';
import { buildWeeklySummary } from './summary.js';
import { toActivity, toUser } from './transforms/casing.js';
import { parseTimeZone } from './transforms/time.js';
import { parseUnits } from './transforms/units.js';

const app = express();
const PORT = Number(process.env.PORT ?? 4100);

app.use(cors());

function handleError(res: express.Response, err: unknown) {
  if (err instanceof UpstreamError) {
    console.error(`[bff] upstream failure: ${err.message}`);
    res.status(502).json({ error: 'upstream_unavailable', detail: err.message });
    return;
  }
  console.error('[bff] unexpected failure:', err);
  res.status(500).json({ error: 'internal', detail: String(err) });
}

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

// GET /api/activities?userId=1&units=metric&status=synced
app.get('/api/activities', async (req, res) => {
  try {
    const units = parseUnits(req.query.units);
    const userId = req.query.userId ? Number(req.query.userId) : undefined;
    const status = typeof req.query.status === 'string' ? req.query.status : undefined;
    const rows = await fetchWorkouts({ userId });
    const activities = rows
      .map((row) => toActivity(row, units))
      .filter((activity) => status === undefined || activity.status === status)
      .sort((a, b) => b.startTime.localeCompare(a.startTime));
    res.json({ activities, count: activities.length });
  } catch (err) {
    handleError(res, err);
  }
});

app.get('/api/activities/:id', async (req, res) => {
  try {
    const units = parseUnits(req.query.units);
    const row = await fetchWorkout(Number(req.params.id));
    if (!row) {
      res.status(404).json({ error: 'not_found' });
      return;
    }
    res.json({ activity: toActivity(row, units) });
  } catch (err) {
    handleError(res, err);
  }
});

app.get('/api/users', async (_req, res) => {
  try {
    const rows = await fetchUsers();
    res.json({ users: rows.map(toUser) });
  } catch (err) {
    handleError(res, err);
  }
});

// GET /api/summary/weekly?userId=1&units=metric&tz=America/New_York
app.get('/api/summary/weekly', async (req, res) => {
  try {
    const units = parseUnits(req.query.units);
    const timeZone = parseTimeZone(req.query.tz);
    const userId = req.query.userId ? Number(req.query.userId) : undefined;
    const rows = await fetchWorkouts({ userId });
    const weeks = buildWeeklySummary(rows, units, timeZone);
    console.log(`[bff] weekly summary: ${weeks.length} weeks for user ${userId ?? 'all'}`);
    res.json({ weeks, units, timeZone });
  } catch (err) {
    handleError(res, err);
  }
});

app.listen(PORT, () => {
  console.log(`[bff] app contract listening on http://localhost:${PORT}`);
});
