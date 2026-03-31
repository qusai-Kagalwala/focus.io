/* ═══════════════════════════════════════════
   js/charts.js — Analytics Charts (Chart.js)
   focus.io Study Tracker
═══════════════════════════════════════════ */

const chartInstances = {};

/* ── THEME HELPERS ── */

function chartThemeColors() {
  const dark = document.documentElement.getAttribute('data-theme') === 'dark';
  return {
    grid:   dark ? '#2e2e2b' : '#e2e0d8',
    text:   dark ? '#9b9890' : '#6b6860',
    border: dark ? '#1c1c1a' : '#ffffff'
  };
}

function destroyCharts() {
  Object.values(chartInstances).forEach(c => c.destroy());
  Object.keys(chartInstances).forEach(k => delete chartInstances[k]);
}

/* ── SHARED OPTIONS ── */

function baseOpts(tc) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: tc.text, font: { family: 'DM Mono', size: 11 } }
      }
    }
  };
}

function scaleOpts(tc) {
  return {
    x: { ticks: { color: tc.text }, grid: { color: tc.grid } },
    y: { ticks: { color: tc.text }, grid: { color: tc.grid } }
  };
}

/* ── RENDER ALL CHARTS ── */

function renderCharts() {
  destroyCharts();

  const tasks = state.tasks;
  const tc    = chartThemeColors();
  const bo    = baseOpts(tc);

  /* 1 ── Tasks by Category (doughnut) */
  const catLabels = Object.values(CATS).map(c => c.label);
  const catCounts = Object.keys(CATS).map(k => tasks.filter(t => t.cat === k).length);
  const catColors = Object.values(CATS).map(c => c.color);

  chartInstances.cat = new Chart(document.getElementById('chartCat'), {
    type: 'doughnut',
    data: {
      labels:   catLabels,
      datasets: [{ data: catCounts, backgroundColor: catColors, borderWidth: 2, borderColor: tc.border }]
    },
    options: { ...bo }
  });

  /* 2 ── Completion Rate (bar) */
  const statusCounts = [
    tasks.filter(t => t.status === 'todo').length,
    tasks.filter(t => t.status === 'inprogress').length,
    tasks.filter(t => t.status === 'done').length
  ];

  chartInstances.status = new Chart(document.getElementById('chartStatus'), {
    type: 'bar',
    data: {
      labels:   ['To Do', 'In Progress', 'Done'],
      datasets: [{ data: statusCounts, backgroundColor: ['#4a7fb5', '#d4613a', '#2c5f2e'], borderRadius: 4 }]
    },
    options: {
      ...bo,
      plugins: { ...bo.plugins, legend: { display: false } },
      scales: scaleOpts(tc)
    }
  });

  /* 3 ── Hours by Category (bar) */
  const hoursBycat = Object.keys(CATS).map(k =>
    tasks.filter(t => t.cat === k).reduce((s, t) => s + t.hours, 0)
  );

  chartInstances.hours = new Chart(document.getElementById('chartHours'), {
    type: 'bar',
    data: {
      labels:   catLabels,
      datasets: [{ data: hoursBycat, backgroundColor: catColors, borderRadius: 4 }]
    },
    options: {
      ...bo,
      plugins: { ...bo.plugins, legend: { display: false } },
      scales: scaleOpts(tc)
    }
  });

  /* 4 ── Tasks Added Last 7 Days (line) */
  const weekDays   = [];
  const weekLabels = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    weekDays.push(dateKey(d));
    weekLabels.push(d.toLocaleDateString('en-IN', { weekday: 'short' }));
  }
  const weekCounts = weekDays.map(k => tasks.filter(t => t.createdAt === k).length);

  chartInstances.week = new Chart(document.getElementById('chartWeek'), {
    type: 'line',
    data: {
      labels:   weekLabels,
      datasets: [{
        data:                weekCounts,
        borderColor:         'var(--accent)',
        backgroundColor:     'rgba(44,95,46,0.1)',
        fill:                true,
        tension:             0.4,
        pointBackgroundColor:'var(--accent)',
        pointRadius:         4
      }]
    },
    options: {
      ...bo,
      plugins: { ...bo.plugins, legend: { display: false } },
      scales: {
        ...scaleOpts(tc),
        y: { ...scaleOpts(tc).y, ticks: { ...scaleOpts(tc).y.ticks, stepSize: 1 } }
      }
    }
  });
}
