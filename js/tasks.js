/* ═══════════════════════════════════════════
   js/tasks.js — Task CRUD & Modal
   focus.io Study Tracker
═══════════════════════════════════════════ */

let newTaskStatus = 'todo';

/* ── MODAL ── */

function openModal(status = 'todo') {
  newTaskStatus = status;
  document.getElementById('modalOverlay').classList.add('active');
  document.getElementById('taskTitle').focus();
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('active');
  document.getElementById('taskTitle').value  = '';
  document.getElementById('taskNotes').value  = '';
  document.getElementById('taskHours').value  = 1;
  document.getElementById('taskDue').value    = '';
}

/* ── SAVE ── */

function saveTask() {
  const title = document.getElementById('taskTitle').value.trim();
  if (!title) return;

  const task = {
    id:        Date.now().toString(),
    title,
    cat:       document.getElementById('taskCat').value,
    priority:  document.getElementById('taskPri').value,
    due:       document.getElementById('taskDue').value,
    hours:     parseFloat(document.getElementById('taskHours').value) || 1,
    notes:     document.getElementById('taskNotes').value.trim(),
    status:    newTaskStatus,
    createdAt: dateKey(new Date())
  };

  state.tasks.push(task);

  // Log activity for heatmap
  state.activity[task.createdAt] = (state.activity[task.createdAt] || 0) + 1;
  updateStreak();
  saveState();

  closeModal();
  renderDashboard();
  renderKanban();
}

/* ── DELETE ── */

function deleteTask(id) {
  state.tasks = state.tasks.filter(t => t.id !== id);
  saveState();
  renderDashboard();
  renderKanban();
}

/* ── MOVE ── */

function moveTask(id, status) {
  const task = state.tasks.find(t => t.id === id);
  if (task) {
    task.status = status;
    saveState();
    renderDashboard();
    renderKanban();
  }
}

/* ── KEYBOARD SHORTCUT ── */

document.addEventListener('keydown', e => {
  // Close modal on Escape
  if (e.key === 'Escape') closeModal();
});
