/* ═══════════════════════════════════════════
   js/clock.js — Full-Screen Clock
   focus.io Study Tracker
═══════════════════════════════════════════ */

let clockInterval = null;

function openClock() {
  document.getElementById('clockOverlay').classList.add('active');
  tickClock();
  clockInterval = setInterval(tickClock, 1000);
}

function closeClock() {
  document.getElementById('clockOverlay').classList.remove('active');
  clearInterval(clockInterval);
  clockInterval = null;
}

function tickClock() {
  const now = new Date();
  document.getElementById('clockBig').textContent =
    now.toLocaleTimeString('en-IN', { hour12: false });
  document.getElementById('clockDateBig').textContent =
    now.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

// Close clock with Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && document.getElementById('clockOverlay').classList.contains('active')) {
    closeClock();
  }
});
