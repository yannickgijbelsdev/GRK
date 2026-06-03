import { baseSchedule } from '../mock';

// Returns the schedule row for the current Europe/Brussels local time.
// Each row has a `time` like "10:00 - 13:00" — we match the current hour:min against it.
export const getCurrentScheduleSlot = (now = new Date()) => {
  // Format current time in Europe/Brussels timezone as HH:MM
  const fmt = new Intl.DateTimeFormat('nl-NL', {
    timeZone: 'Europe/Brussels',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  const parts = fmt.format(now).split(':');
  const hh = parseInt(parts[0], 10);
  const mm = parseInt(parts[1], 10);
  const cur = hh * 60 + mm;

  const toMin = (s) => {
    const [H, M] = s.split(':').map((n) => parseInt(n, 10));
    return H * 60 + M;
  };

  for (const row of baseSchedule) {
    const [from, to] = row.time.split(' - ');
    const a = toMin(from);
    let b = toMin(to);
    // Handle midnight wrap (e.g. "22:00 - 00:00") — treat "00:00" as 1440
    if (b === 0) b = 24 * 60;
    if (cur >= a && cur < b) return row;
  }
  return baseSchedule[0];
};
