/* ═══════════════════════════════════════════
   js/dashboard.js — Dashboard View
   focus.io Study Tracker
═══════════════════════════════════════════ */

function renderDashboard() {
  renderStats();
  renderStreak();
  renderHeatmap();
  renderHUD();
  renderRecent();
  renderMiniPomo();
}

/* ── STAT CARDS ── */

function renderStats() {
  const tasks = state.tasks;
  const done  = tasks.filter(t => t.status === 'done');
  const pct   = tasks.length ? Math.round(done.length / tasks.length * 100) : 0;
  const hours = tasks.reduce((s, t) => s + t.hours, 0);

  document.getElementById('statTotal').textContent   = tasks.length;
  document.getElementById('statDone').textContent    = done.length;
  document.getElementById('statDonePct').textContent = pct + '% done';
  document.getElementById('statHours').textContent   = hours.toFixed(1) + 'h';
}

/* ── STREAK ── */

function renderStreak() {
  const s = state.streak;
  document.getElementById('streakDisplay').textContent = s + (s === 1 ? ' day' : ' days') + ' streak';
  document.getElementById('statStreak').textContent    = s;
}

/* ── ACTIVITY HEATMAP ── */

function renderHeatmap() {
  const grid       = document.getElementById('heatmapGrid');
  const monthsRow  = document.getElementById('hmMonths');

  // ── FIX 1 (empty right half): Build exactly 53 complete weeks.
  // Find the most recent Saturday (end of current week), then go back
  // 52 full weeks so we always render 53 × 7 = 371 cells regardless of today's weekday.
  const CELL_SIZE = 15;   // px per cell (12px + 3px gap) — must match CSS
  const WEEKS     = 53;

  // Anchor: end = the coming Saturday (or today if already Saturday)
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const daysUntilSat = (6 - today.getDay() + 7) % 7;
  const end   = new Date(today); end.setDate(end.getDate() + daysUntilSat);

  // Start = Sunday 52 weeks before that Saturday
  const start = new Date(end);
  start.setDate(start.getDate() - (WEEKS * 7 - 1));

  // Walk every day start → end inclusive
  const days = [];
  const cur  = new Date(start);
  while (cur <= end) { days.push(new Date(cur)); cur.setDate(cur.getDate() + 1); }

  const todayKey = dateKey(today);
  const maxAct   = Math.max(...Object.values(state.activity), 1);

  grid.innerHTML = days.map(d => {
    const k      = dateKey(d);
    const act    = state.activity[k] || 0;
    const future = d > today;
    const level  = (act === 0 || future) ? 0
      : act < maxAct * 0.25 ? 1
      : act < maxAct * 0.5  ? 2
      : act < maxAct * 0.75 ? 3 : 4;
    const outline = k === todayKey ? 'style="outline:1.5px solid var(--accent);outline-offset:1px"' : '';
    const tip     = future ? '' : `data-tip="${k}: ${act} task${act !== 1 ? 's' : ''}"`;
    return `<div class="hm-cell" data-level="${level}" ${tip} ${outline}></div>`;
  }).join('');

  // ── FIX 2 (merging labels): Each column is CELL_SIZE px wide.
  // Track the cumulative column index so we emit a correctly-spaced <span>
  // for every column, placing the month name only on the first column of each month.
  let monthHtml  = '';
  let colIndex   = 0;
  let lastMonth  = -1;

  for (let w = 0; w < WEEKS; w++) {
    const d = days[w * 7];          // Sunday of this week
    const m = d.getMonth();
    if (m !== lastMonth) {
      lastMonth = m;
      const label = d.toLocaleString('default', { month: 'short' });
      monthHtml += `<span style="position:absolute;left:${colIndex * CELL_SIZE}px;font-size:0.65rem;color:var(--text3);font-family:'DM Mono',monospace;white-space:nowrap">${label}</span>`;
    }
    colIndex++;
  }

  // Wrap in a relative container sized to match the grid
  monthsRow.innerHTML = `<div style="position:relative;height:16px;width:${WEEKS * CELL_SIZE}px">${monthHtml}</div>`;
}

/* ── STATUS HUD ── */

function renderHUD() {
  const tasks   = state.tasks;
  const total   = tasks.length || 1;
  const todo    = tasks.filter(t => t.status === 'todo').length;
  const inp     = tasks.filter(t => t.status === 'inprogress').length;
  const done    = tasks.filter(t => t.status === 'done').length;
  const highPri = tasks.filter(t => t.priority === 'high' && t.status !== 'done').length;

  const rows = [
    { label: 'To Do',                val: todo,    color: 'var(--accent3)', pct: todo    / total },
    { label: 'In Progress',          val: inp,     color: 'var(--warn)',    pct: inp     / total },
    { label: 'Completed',            val: done,    color: 'var(--accent)',  pct: done    / total },
    { label: 'High Priority (open)', val: highPri, color: 'var(--danger)', pct: highPri / total }
  ];

  document.getElementById('hudRows').innerHTML = rows.map(r => `
    <div class="hud-row">
      <div class="hud-label">${r.label}</div>
      <div class="hud-bar">
        <div class="hud-bar-fill" style="width:${(r.pct * 100).toFixed(0)}%;background:${r.color}"></div>
      </div>
      <div class="hud-val" style="color:${r.color}">${r.val}</div>
    </div>
  `).join('');
}

/* ── RECENT TASKS ── */

function renderRecent() {
  const recent = [...state.tasks].sort((a, b) => b.id - a.id).slice(0, 5);

  if (!recent.length) {
    document.getElementById('recentTasks').innerHTML =
      `<div class="empty"><div class="empty-icon">📝</div>No tasks yet. Add one!</div>`;
    return;
  }

  document.getElementById('recentTasks').innerHTML = recent.map(t => `
    <div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--border)">
      <span class="priority-dot p-${t.priority}"></span>
      <div style="flex:1;font-size:0.83rem;font-weight:500;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${t.title}</div>
      <span class="tag tag-${t.cat}">${CATS[t.cat].label}</span>
      <span style="flex-shrink:0;font-size:0.7rem;color:var(--text3);font-family:'DM Mono',monospace">${STATUS_LABEL[t.status]}</span>
    </div>
  `).join('');
}
