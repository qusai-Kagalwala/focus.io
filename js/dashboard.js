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
  const grid   = document.getElementById('heatmapGrid');
  const months = document.getElementById('hmMonths');

  // Build 365-day range ending today, padded to start on Sunday
  const end   = new Date(); end.setHours(0, 0, 0, 0);
  const start = new Date(end); start.setDate(start.getDate() - 364);
  const startDay = start.getDay();
  start.setDate(start.getDate() - startDay);   // rewind to Sunday

  const days = [];
  const cur  = new Date(start);
  while (cur <= end) { days.push(new Date(cur)); cur.setDate(cur.getDate() + 1); }

  const maxAct = Math.max(...Object.values(state.activity), 1);

  grid.innerHTML = days.map(d => {
    const k     = dateKey(d);
    const act   = state.activity[k] || 0;
    const level = act === 0 ? 0
      : act < maxAct * 0.25 ? 1
      : act < maxAct * 0.5  ? 2
      : act < maxAct * 0.75 ? 3 : 4;
    const isToday = k === dateKey(new Date());
    return `
      <div class="hm-cell"
           data-level="${level}"
           data-tip="${k}: ${act} task${act !== 1 ? 's' : ''}"
           ${isToday ? 'style="outline:1.5px solid var(--accent);outline-offset:1px"' : ''}>
      </div>`;
  }).join('');

  // Month labels — one label per month, positioned at the first Sunday of each month
  let lastMonth = -1;
  let html = '';
  days.forEach(d => {
    if (d.getDay() === 0) {
      if (d.getMonth() !== lastMonth) {
        lastMonth = d.getMonth();
        html += `<span style="flex:none;width:15px">${d.toLocaleString('default', { month: 'short' })}</span>`;
      } else {
        html += `<span style="flex:none;width:15px"></span>`;
      }
    }
  });
  months.innerHTML = html;
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
    { label: 'To Do',       val: todo,    color: 'var(--accent3)', pct: todo / total },
    { label: 'In Progress', val: inp,     color: 'var(--warn)',    pct: inp  / total },
    { label: 'Completed',   val: done,    color: 'var(--accent)',  pct: done / total },
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
      <div style="flex:1;font-size:0.83rem;font-weight:500">${t.title}</div>
      <span class="tag tag-${t.cat}">${CATS[t.cat].label}</span>
      <span style="font-size:0.7rem;color:var(--text3);font-family:'DM Mono',monospace">${STATUS_LABEL[t.status]}</span>
    </div>
  `).join('');
}
