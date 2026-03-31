/* ═══════════════════════════════════════════
   js/pomodoro.js — Pomodoro Timer
   focus.io Study Tracker
═══════════════════════════════════════════ */

const POMO_MODES = {
  focus: 25 * 60,
  short:  5 * 60,
  long:  15 * 60
};

const CIRCUM_BIG  = 427;   // 2πr for r=68
const CIRCUM_MINI = 289;   // 2πr for r=46

let pomoMode     = 'focus';
let pomoRemain   = POMO_MODES.focus;
let pomoRunning  = false;
let pomoInterval = null;
let pomoSession  = 0;      // sessions this browser session

/* ── MODE SWITCHING ── */

function setPomoMode(m) {
  pomoMode    = m;
  pomoRemain  = POMO_MODES[m];
  pomoRunning = false;
  clearInterval(pomoInterval);

  document.querySelectorAll('.pomo-mode').forEach(el => el.classList.remove('active'));
  document.getElementById('pm-' + m).classList.add('active');

  const btn = document.getElementById('pomoStartBtn');
  if (btn) btn.textContent = '▶ Start';

  renderPomoDisplay();
}

/* ── START / PAUSE ── */

function pomoToggle() {
  if (pomoRunning) {
    pomoRunning = false;
    clearInterval(pomoInterval);
    document.getElementById('pomoStartBtn').textContent = '▶ Start';
  } else {
    pomoRunning = true;
    document.getElementById('pomoStartBtn').textContent = '⏸ Pause';
    pomoInterval = setInterval(pomoTick, 1000);
  }
}

/* ── TICK ── */

function pomoTick() {
  if (pomoRemain <= 0) { pomoComplete(); return; }
  pomoRemain--;
  renderPomoDisplay();
  renderMiniPomo();
}

/* ── COMPLETE ── */

function pomoComplete() {
  pomoRunning = false;
  clearInterval(pomoInterval);

  const startBtn = document.getElementById('pomoStartBtn');
  if (startBtn) startBtn.textContent = '▶ Start';

  if (pomoMode === 'focus') {
    pomoSession++;
    state.pomoDone++;

    const now = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    state.pomoLog.unshift({ time: now, session: state.pomoDone });

    // Register activity on heatmap
    const today = dateKey(new Date());
    state.activity[today] = (state.activity[today] || 0) + 0.5;
    updateStreak();
    saveState();

    renderPomoLog();
    renderPomoSessions();
  }

  // Auto switch to next mode
  const nextMode = pomoMode === 'focus'
    ? (pomoSession % 4 === 0 ? 'long' : 'short')
    : 'focus';
  setPomoMode(nextMode);
}

/* ── RESET ── */

function pomoReset() {
  pomoRunning = false;
  clearInterval(pomoInterval);
  pomoRemain = POMO_MODES[pomoMode];

  const startBtn = document.getElementById('pomoStartBtn');
  if (startBtn) startBtn.textContent = '▶ Start';

  renderPomoDisplay();
  renderMiniPomo();
}

/* ── SKIP ── */

function pomoSkip() { pomoComplete(); }

/* ── RENDER ── */

function renderPomoDisplay() {
  const total  = POMO_MODES[pomoMode];
  const pct    = pomoRemain / total;
  const offset = CIRCUM_BIG * (1 - pct);

  const prog = document.getElementById('pomoProgress');
  if (prog) prog.style.strokeDashoffset = offset;

  const timeEl  = document.getElementById('pomoTime');
  const phaseEl = document.getElementById('pomoPhase');
  if (timeEl)  timeEl.textContent  = formatTime(pomoRemain);
  if (phaseEl) phaseEl.textContent = phaseLabel(pomoMode);
}

function renderMiniPomo() {
  const total  = POMO_MODES[pomoMode];
  const pct    = pomoRemain / total;
  const offset = CIRCUM_MINI * (1 - pct);

  const miniProg  = document.getElementById('miniPomoProgress');
  const miniTime  = document.getElementById('miniPomoTime');
  const miniPhase = document.getElementById('miniPomoPhase');

  if (miniProg)  miniProg.style.strokeDashoffset = offset;
  if (miniTime)  miniTime.textContent  = formatTime(pomoRemain);
  if (miniPhase) miniPhase.textContent = phaseLabel(pomoMode, true);
}

function renderPomoLog() {
  const el = document.getElementById('pomoLog');
  if (!el) return;
  el.innerHTML = state.pomoLog.slice(0, 20).map(l =>
    `<div class="hud-row">
       <div class="hud-label">Session #${l.session}</div>
       <div class="hud-val">${l.time}</div>
     </div>`
  ).join('');
}

function renderPomoSessions() {
  const wrap = document.getElementById('pomoSessions');
  if (!wrap) return;
  const filled = pomoSession % 4 || (pomoSession > 0 ? 4 : 0);
  wrap.innerHTML = Array(4).fill(0).map((_, i) =>
    `<div class="pomo-dot${i < filled ? ' done' : ''}"></div>`
  ).join('');
}

function phaseLabel(mode, short = false) {
  if (mode === 'focus') return 'focus';
  if (mode === 'short') return short ? 'short' : 'short break';
  return short ? 'long' : 'long break';
}

/* ── DASHBOARD QUICK-START ── */

function pomoDashStart() {
  // Navigate to pomodoro view first
  nav('pomodoro', document.querySelectorAll('.nav-item')[3]);
  pomoToggle();
}

/* ── INIT ── */

function initPomodoro() {
  renderPomoLog();
  renderPomoSessions();
  renderPomoDisplay();
  renderMiniPomo();
}
