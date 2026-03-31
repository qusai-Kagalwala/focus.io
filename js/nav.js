/* ═══════════════════════════════════════════
   js/nav.js — View Navigation
   focus.io Study Tracker
═══════════════════════════════════════════ */

const PAGE_TITLES = {
  dashboard:  'Dashboard',
  kanban:     'Kanban Board',
  calendar:   'Calendar',
  pomodoro:   'Pomodoro Timer',
  charts:     'Analytics',
  categories: 'Categories'
};

/**
 * Switch the active view.
 * @param {string} page - view id suffix (e.g. 'dashboard')
 * @param {Element|null} el - the clicked nav-item element
 */
function nav(page, el) {
  // Update nav highlights
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  if (el) el.classList.add('active');

  // Swap view
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById('view-' + page).classList.add('active');

  // Update topbar title
  document.getElementById('pageTitle').textContent = PAGE_TITLES[page] || page;

  // Lazy-render each view on first visit / revisit
  const renderers = {
    dashboard:  renderDashboard,
    kanban:     renderKanban,
    calendar:   renderCalendar,
    charts:     renderCharts,
    categories: renderCategories
  };
  if (renderers[page]) renderers[page]();
}
