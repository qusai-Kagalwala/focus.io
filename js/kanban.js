/* ═══════════════════════════════════════════
   js/kanban.js — Kanban Board + Drag & Drop
   focus.io Study Tracker
═══════════════════════════════════════════ */

let draggedId = null;

/* ── RENDER ── */

function renderKanban() {
  STATUSES.forEach(st => {
    const tasks = state.tasks.filter(t => t.status === st);
    document.getElementById('cnt-' + st).textContent     = tasks.length;
    document.getElementById('cards-' + st).innerHTML     = tasks.map(taskCardHTML).join('');
  });

  // Attach drag listeners to freshly rendered cards
  document.querySelectorAll('.task-card[draggable]').forEach(el => {
    el.addEventListener('dragstart', e => {
      draggedId = e.currentTarget.dataset.id;
      e.currentTarget.style.opacity = '0.5';
    });
    el.addEventListener('dragend', e => {
      e.currentTarget.style.opacity = '1';
    });
  });
}

/* ── CARD HTML ── */

function taskCardHTML(t) {
  const due     = t.due ? `<span class="task-due">Due: ${t.due}</span>` : '';
  const doneBtn = t.status !== 'done'
    ? `<button class="task-action-btn" onclick="moveTask('${t.id}','done')" title="Mark done">✓</button>`
    : '';

  return `
    <div class="task-card" draggable="true" data-id="${t.id}">
      <div class="task-actions">
        ${doneBtn}
        <button class="task-action-btn" onclick="deleteTask('${t.id}')" title="Delete" style="color:var(--danger)">✕</button>
      </div>
      <div class="task-title">${t.title}</div>
      <div class="task-meta">
        <span class="priority-dot p-${t.priority}"></span>
        <span class="tag tag-${t.cat}">${CATS[t.cat].label}</span>
        <span style="font-size:0.68rem;color:var(--text3);font-family:'DM Mono',monospace">${t.hours}h</span>
        ${due}
      </div>
    </div>
  `;
}

/* ── DRAG & DROP HANDLERS ── */

function dragOver(e) {
  e.preventDefault();
  e.currentTarget.classList.add('drag-over');
}

function drop(e, status) {
  e.currentTarget.classList.remove('drag-over');
  if (draggedId) {
    moveTask(draggedId, status);
    draggedId = null;
  }
}

// Remove highlight when cursor leaves a column
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.kanban-col').forEach(col => {
    col.addEventListener('dragleave', () => col.classList.remove('drag-over'));
  });
});
