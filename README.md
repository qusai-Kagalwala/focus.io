# focus.io — Study & Task Tracker

A clean, minimal study tracker inspired by budget.io.  
Built with pure HTML, CSS, and JavaScript — no build step required.

---

## 📁 Folder Structure

```
focus.io/
├── index.html              ← App shell + all views (HTML only)
│
├── css/
│   ├── variables.css       ← Design tokens (light + dark themes)
│   ├── base.css            ← Resets, typography, utility classes
│   ├── layout.css          ← Sidebar, topbar, main grid
│   ├── components.css      ← Buttons, cards, modal, forms, clock
│   └── views.css           ← Per-view styles (dashboard, kanban, etc.)
│
└── js/
    ├── state.js            ← Global state + localStorage persistence
    ├── utils.js            ← Shared helpers (dateKey, formatTime, CSV export)
    ├── nav.js              ← View navigation controller
    ├── tasks.js            ← Task CRUD + modal logic
    ├── kanban.js           ← Kanban board + drag-and-drop
    ├── pomodoro.js         ← Pomodoro timer (3 modes, sessions, log)
    ├── calendar.js         ← Monthly calendar + task dots
    ├── charts.js           ← Chart.js analytics (4 charts)
    ├── categories.js       ← Category limits & progress bars
    ├── dashboard.js        ← Dashboard: stats, heatmap, HUD, recent tasks
    ├── clock.js            ← Full-screen clock overlay
    └── app.js              ← Entry point — initialises everything
```

---

## ✨ Features

| Feature               | Details                                                       |
|-----------------------|---------------------------------------------------------------|
| **Dashboard**         | 4 stat cards, status HUD, mini pomodoro, recent tasks        |
| **Activity Heatmap**  | GitHub-style 365-day grid with tooltips and intensity levels |
| **Streak Counter**    | Daily activity streak, persists across sessions              |
| **Kanban Board**      | 3 columns (To Do / In Progress / Done), drag-and-drop        |
| **Calendar**          | Monthly view, task dots on due dates, day detail panel       |
| **Pomodoro Timer**    | Focus / Short Break / Long Break, session dots, session log  |
| **Analytics**         | 4 Chart.js charts: category, completion, hours, 7-day trend  |
| **Category Limits**   | Weekly hour caps per category with overflow highlighting     |
| **Full-screen Clock** | Large DM Mono display with full date, Escape to close        |
| **CSV Export**        | Download all tasks as a .csv file                            |
| **Dark / Light Theme**| One-click toggle, charts recolour automatically              |
| **localStorage**      | All data persists across browser sessions                    |

---

## 🚀 Deploy to GitHub Pages

1. Push this folder to a GitHub repository.
2. Go to **Settings → Pages**.
3. Set source to `main` branch, root (`/`) folder.
4. Your app will be live at `https://<username>.github.io/<repo>/`.

No build tools, no npm install — just push and go.

---

## 🛠 Tech Stack

- **HTML5** — semantic structure
- **CSS3** — custom properties, grid, flexbox, transitions
- **Vanilla JS** — modular ES5-compatible files
- **Chart.js 4.4** — analytics charts (CDN)
- **Google Fonts** — DM Sans + DM Mono (CDN)

---

## 📦 Local Development

Simply open `index.html` in your browser — no server required.

```bash
# Optional: use a local server for cleaner paths
npx serve .
# or
python -m http.server 8080
```

---

*Built as part of the DevVault portfolio — github.com/qusai-Kagal/DevVault*
