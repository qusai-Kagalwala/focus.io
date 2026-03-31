/* ═══════════════════════════════════════════
   js/utils.js — Shared Helpers
   focus.io Study Tracker
═══════════════════════════════════════════ */

/**
 * Return a YYYY-MM-DD string for any Date object.
 * @param {Date} d
 * @returns {string}
 */
function dateKey(d) {
  return d.toISOString().slice(0, 10);
}

/**
 * Format seconds into MM:SS display string.
 * @param {number} s - total seconds
 * @returns {string}
 */
function formatTime(s) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}

/**
 * Update the streak counter based on today's activity.
 * Should be called whenever a task is saved or a pomo completes.
 */
function updateStreak() {
  const today = dateKey(new Date());
  if (!state.activity[today]) return;
  if (state.lastActive === today) return;

  const yesterday = dateKey(new Date(Date.now() - 86400000));
  if (state.lastActive === yesterday) {
    state.streak++;
  } else if (state.lastActive !== today) {
    state.streak = 1;
  }
  state.lastActive = today;
  saveState();
}

/**
 * Toggle the app theme between light and dark.
 */
function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('focusio_theme', next);
  // Rebuild charts so colours update
  setTimeout(() => renderCharts(), 100);
}

// Apply saved theme on load
(function applyTheme() {
  const saved = localStorage.getItem('focusio_theme');
  if (saved) document.documentElement.setAttribute('data-theme', saved);
})();

/**
 * Export all tasks to a CSV file and trigger download.
 */
function exportCSV() {
  if (!state.tasks.length) {
    alert('No tasks to export.');
    return;
  }
  const headers = ['ID', 'Title', 'Category', 'Priority', 'Status', 'Due', 'Est Hours', 'Notes', 'Created'];
  const rows = state.tasks.map(t => [
    t.id,
    `"${t.title.replace(/"/g, '""')}"`,
    CATS[t.cat].label,
    t.priority,
    STATUS_LABEL[t.status],
    t.due || '',
    t.hours,
    `"${(t.notes || '').replace(/"/g, '""')}"`,
    t.createdAt
  ]);
  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
  a.download = `focus_io_${dateKey(new Date())}.csv`;
  a.click();
}
