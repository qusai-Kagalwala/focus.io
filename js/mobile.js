/* ═══════════════════════════════════════════
   js/mobile.js — Drawer & Bottom Nav
   focus.io Study Tracker
═══════════════════════════════════════════ */

/* ── DRAWER ── */

function openDrawer() {
  document.getElementById('drawerOverlay').classList.add('active');
  document.querySelector('.sidebar').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeDrawer() {
  document.getElementById('drawerOverlay').classList.remove('active');
  document.querySelector('.sidebar').classList.remove('open');
  document.body.style.overflow = '';
}

/* ── BOTTOM NAV ── */

/**
 * Navigate from the mobile bottom nav.
 * Also syncs the sidebar nav-item highlight.
 * @param {string} page
 * @param {Element} el - the bottom-nav-item clicked
 */
function mobileNav(page, el) {
  // Highlight bottom nav item
  document.querySelectorAll('.bottom-nav-item').forEach(n => n.classList.remove('active'));
  el.classList.add('active');

  // Sync sidebar nav-item (find by data-page or position)
  const sidebarItems = document.querySelectorAll('.nav-item');
  const pageOrder = ['dashboard', 'kanban', 'calendar', 'pomodoro', 'charts', 'categories'];
  const idx = pageOrder.indexOf(page);
  if (idx >= 0 && sidebarItems[idx]) {
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    sidebarItems[idx].classList.add('active');
  }

  // Run the main nav function
  nav(page, null);
}

/* ── CLOSE DRAWER ON SIDEBAR NAV CLICK (mobile) ── */

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
      if (window.innerWidth < 768) closeDrawer();
    });
  });

  // Swipe left to close drawer
  let touchStartX = 0;
  document.querySelector('.sidebar').addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });
  document.querySelector('.sidebar').addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (dx < -60) closeDrawer();   // swipe left by 60px
  }, { passive: true });
});
