/* ═══════════════════════════════════════════
   js/calendar.js — Monthly Calendar View
   focus.io Study Tracker
═══════════════════════════════════════════ */

let calDate     = new Date();
let calSelected = null;

/* ── RENDER ── */

function renderCalendar() {
  const y = calDate.getFullYear();
  const m = calDate.getMonth();

  document.getElementById('calMonthLabel').textContent =
    calDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  const first = new Date(y, m, 1);
  const last  = new Date(y, m + 1, 0);

  // Build day array including leading/trailing days to complete weeks
  const days = [];

  for (let i = first.getDay() - 1; i >= 0; i--) {
    const d = new Date(first);
    d.setDate(d.getDate() - i - 1);
    days.push({ d, other: true });
  }
  for (let i = 1; i <= last.getDate(); i++) {
    days.push({ d: new Date(y, m, i), other: false });
  }
  while (days.length % 7 !== 0) {
    const d = new Date(last);
    d.setDate(d.getDate() + (days.length - last.getDate() - first.getDay() + 2));
    days.push({ d, other: true });
  }

  const todayK   = dateKey(new Date());
  const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  let html = DAY_LABELS.map(l => `<div class="cal-day-label">${l}</div>`).join('');

  html += days.map(({ d, other }) => {
    const k        = dateKey(d);
    const isToday  = k === todayK;
    const hasTasks = state.tasks.some(t => t.due === k);
    const isSel    = calSelected === k;
    return `
      <div class="cal-day
        ${isToday   ? ' today'       : ''}
        ${hasTasks  ? ' has-task'    : ''}
        ${other     ? ' other-month' : ''}
        ${isSel     ? ' selected'    : ''}"
        onclick="calSelect('${k}')">
        ${d.getDate()}
      </div>`;
  }).join('');

  document.getElementById('calGrid').innerHTML = html;
}

/* ── MONTH NAVIGATION ── */

function calNav(dir) {
  calDate.setMonth(calDate.getMonth() + dir);
  renderCalendar();
}

/* ── DAY SELECTION ── */

function calSelect(k) {
  calSelected = k;

  const tasks = state.tasks.filter(t => t.due === k);
  document.getElementById('calSelectedLabel').textContent = k;

  if (tasks.length) {
    document.getElementById('calDayTasks').innerHTML = tasks.map(t => `
      <div style="padding:8px 0;border-bottom:1px solid var(--border);font-size:0.83rem">
        <div style="font-weight:500;margin-bottom:3px">${t.title}</div>
        <div style="display:flex;gap:6px;align-items:center">
          <span class="tag tag-${t.cat}">${CATS[t.cat].label}</span>
          <span class="priority-dot p-${t.priority}"></span>
          <span style="font-size:0.7rem;color:var(--text3);font-family:'DM Mono',monospace">${STATUS_LABEL[t.status]}</span>
        </div>
      </div>
    `).join('');
  } else {
    document.getElementById('calDayTasks').innerHTML =
      `<div class="empty"><div class="empty-icon">📅</div>No tasks due</div>`;
  }

  // Re-render calendar to show selected highlight
  renderCalendar();
}
