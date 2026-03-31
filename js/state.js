/* ═══════════════════════════════════════════
   js/state.js — Central Data Store
   focus.io Study Tracker
═══════════════════════════════════════════ */

const CATS = {
  cs:    { label: 'Computer Science', color: '#4caf50' },
  math:  { label: 'Mathematics',      color: '#5c6bc0' },
  sci:   { label: 'Science',          color: '#ff7043' },
  eng:   { label: 'English',          color: '#e91e63' },
  other: { label: 'Other',            color: '#78909c' }
};

const STATUSES = ['todo', 'inprogress', 'done'];

const STATUS_LABEL = {
  todo:       'To Do',
  inprogress: 'In Progress',
  done:       'Done'
};

const STORAGE_KEY = 'focusio_v1';

/** Load state from localStorage or return defaults */
function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try { return JSON.parse(raw); } catch(e) { /* fall through */ }
  }
  return {
    tasks:      [],
    catLimits:  { cs: 10, math: 8, sci: 6, eng: 4, other: 5 },
    pomoDone:   0,
    pomoLog:    [],
    streak:     0,
    lastActive: null,
    activity:   {}     // { 'YYYY-MM-DD': count }
  };
}

/** Persist state to localStorage */
function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

// Single global state object
const state = loadState();
