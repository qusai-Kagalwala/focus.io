/* ═══════════════════════════════════════════
   js/app.js — Entry Point / App Init
   focus.io Study Tracker
═══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  // Initial render
  renderDashboard();
  renderKanban();
  initPomodoro();

  // Keep mini-pomo in sync on dashboard while timer runs
  setInterval(() => {
    if (pomoRunning) renderMiniPomo();
  }, 500);

  console.log('%cfocus.io loaded ✓', 'color:#2c5f2e;font-family:monospace;font-size:13px');
});
