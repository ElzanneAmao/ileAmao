// === Ile Amao — Household Task Manager ===

const STORAGE_KEY = 'ileamao_tasks';
const USER_KEY = 'ileamao_user';

const CATEGORY_LABELS = {
  chores: 'Daily Chores',
  cleaning: 'Cleaning',
  deepclean: 'Deep Clean',
  garden: 'Garden',
  child: 'Little One',
  admin: 'Admin',
  groceries: 'Groceries'
};

const FREQUENCY_LABELS = {
  daily: 'Daily',
  '3x_week': '3x / Week',
  every_3rd_day: 'Every 3rd Day',
  weekly: 'Weekly',
  monthly: 'Monthly',
  adhoc: 'One-off'
};

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const DEFAULT_TASKS = [
  // Daily tasks
  { name: 'Dishes', category: 'chores', frequency: 'daily', assignee: 'partner' },
  { name: 'Pack dishwasher', category: 'chores', frequency: 'daily', assignee: 'elzanne' },
  { name: 'Unpack dishwasher', category: 'chores', frequency: 'daily', assignee: 'partner' },
  { name: 'Prepare dinner / bring out food', category: 'chores', frequency: 'daily', assignee: 'elzanne' },
  { name: 'Wipe counters', category: 'chores', frequency: 'daily', assignee: 'elzanne' },
  { name: 'Tidy play area', category: 'chores', frequency: 'daily', assignee: 'partner' },
  { name: 'Tidy house', category: 'chores', frequency: 'daily', assignee: 'elzanne' },
  { name: 'Make beds', category: 'chores', frequency: 'daily', assignee: 'both' },
  { name: 'Clean kitchen', category: 'chores', frequency: 'daily', assignee: 'both' },

  // 3x per week — Mon, Wed, Fri
  { name: 'Wash laundry', category: 'chores', frequency: '3x_week', assignee: 'elzanne', scheduledDays: [1, 3, 5] },
  { name: 'Fold laundry', category: 'chores', frequency: '3x_week', assignee: 'partner', scheduledDays: [1, 3, 5] },

  // Every 3rd day
  { name: 'Robot vacuum / manual vacuum', category: 'cleaning', frequency: 'every_3rd_day', assignee: 'elzanne' },

  // Weekly room cleaning — comprehensive (dusting, floors, surfaces, etc.)
  { name: 'Clean living room & dining room', category: 'cleaning', frequency: 'weekly', assignee: 'both', scheduledDay: 1, notes: 'Dusting, floors, surfaces — full clean' },
  { name: 'Clean son\'s room', category: 'cleaning', frequency: 'weekly', assignee: 'both', scheduledDay: 2, notes: 'Dusting, floors, surfaces — full clean' },
  { name: 'Clean guest room & bathrooms', category: 'cleaning', frequency: 'weekly', assignee: 'both', scheduledDay: 3, notes: 'Includes shower, toilets, floors, dusting' },
  { name: 'Clean our room', category: 'cleaning', frequency: 'weekly', assignee: 'both', scheduledDay: 4, notes: 'Dusting, floors, surfaces — full clean' },
  { name: 'Clean study', category: 'cleaning', frequency: 'weekly', assignee: 'both', scheduledDay: 5, notes: 'Dusting, floors, surfaces — full clean' },

  // Weekly other
  { name: 'Take out trash', category: 'chores', frequency: 'weekly', assignee: 'elzanne' },
  { name: 'Bring dustbin back in', category: 'chores', frequency: 'weekly', assignee: 'partner' },

  // Deep clean
  { name: 'Wash the windows', category: 'deepclean', frequency: 'monthly', assignee: 'outsourced' },
];

// === State ===
let tasks = [];
let currentUser = localStorage.getItem(USER_KEY) || 'elzanne';
let currentFilter = 'all';
let currentCategory = 'all';
let currentAssignee = 'all';
let editingTaskId = null;

// === Init ===
function init() {
  loadTasks();
  updateGreeting();
  renderDashboard();
  renderAllTasks();
  bindEvents();
  updateUserUI();
}

// === Data ===
function loadTasks() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    tasks = JSON.parse(stored);
  } else {
    tasks = DEFAULT_TASKS.map((t, i) => ({
      id: Date.now() + i,
      ...t,
      notes: t.notes || '',
      status: 'todo',
      completedAt: null,
      createdAt: new Date().toISOString()
    }));
    saveTasks();
  }
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function todayKey() {
  return new Date().toISOString().split('T')[0];
}

// === Schedule Logic ===
function isTaskScheduledToday(task) {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0=Sun … 6=Sat

  switch (task.frequency) {
    case 'daily':
      return true;

    case '3x_week':
      return (task.scheduledDays || [1, 3, 5]).includes(dayOfWeek);

    case 'every_3rd_day': {
      const epoch = new Date('2026-01-01');
      const diffDays = Math.floor((now - epoch) / 86400000);
      return diffDays % 3 === 0;
    }

    case 'weekly':
      if (task.scheduledDay !== undefined) {
        return dayOfWeek === task.scheduledDay;
      }
      return true; // no specific day — show all week

    case 'monthly':
    case 'adhoc':
      return task.status === 'todo';

    default:
      return true;
  }
}

function getScheduleLabel(task) {
  if (task.frequency === 'weekly' && task.scheduledDay !== undefined) {
    return DAY_NAMES[task.scheduledDay] + 's';
  }
  if (task.frequency === '3x_week') {
    return 'Mon / Wed / Fri';
  }
  if (task.frequency === 'every_3rd_day') {
    return 'Every 3rd day';
  }
  return FREQUENCY_LABELS[task.frequency] || task.frequency;
}

// === Greeting ===
function updateGreeting() {
  const hour = new Date().getHours();
  const name = currentUser === 'elzanne' ? 'Elzanne' : 'Deji';
  let greeting;
  if (hour < 12) greeting = 'Good morning';
  else if (hour < 17) greeting = 'Good afternoon';
  else greeting = 'Good evening';

  document.getElementById('greeting').innerHTML =
    `${greeting}, <span>${name}</span>`;
}

// === Rendering ===
function renderDashboard() {
  const today = todayKey();

  const todayTasks = tasks.filter(t => isTaskScheduledToday(t));
  const myTodayTasks = todayTasks.filter(t =>
    t.assignee === currentUser || t.assignee === 'both'
  );

  const doneTodayCount = myTodayTasks.filter(t =>
    t.completedAt && t.completedAt.startsWith(today)
  ).length;
  const todoCount = myTodayTasks.filter(t => t.status === 'todo').length;

  document.getElementById('statTodo').textContent = todoCount;
  document.getElementById('statDone').textContent = doneTodayCount;
  document.getElementById('statTotal').textContent = myTodayTasks.length;

  // Today's checklist — show user's tasks
  const todayContainer = document.getElementById('todayTasks');
  const todoFirst = [...myTodayTasks].sort((a, b) => {
    if (a.status === 'todo' && b.status !== 'todo') return -1;
    if (a.status !== 'todo' && b.status === 'todo') return 1;
    return 0;
  });
  todayContainer.innerHTML = todoFirst.length
    ? todoFirst.map(t => renderTaskItem(t, true)).join('')
    : emptyState('All caught up for today!');

  // Upcoming — tasks scheduled later this week that aren't today's
  const upcomingContainer = document.getElementById('upcomingTasks');
  const dayOfWeek = new Date().getDay();
  const upcoming = tasks.filter(t => {
    if (isTaskScheduledToday(t)) return false;
    if (t.assignee !== currentUser && t.assignee !== 'both') return false;
    if (t.frequency === 'weekly' && t.scheduledDay !== undefined) return true;
    if (t.frequency === '3x_week') {
      return (t.scheduledDays || [1, 3, 5]).some(d => d > dayOfWeek);
    }
    return false;
  }).slice(0, 6);

  upcomingContainer.innerHTML = upcoming.length
    ? upcoming.map(t => renderTaskItem(t, false)).join('')
    : emptyState('No upcoming tasks');
}

function renderAllTasks() {
  let filtered = tasks;

  if (currentFilter !== 'all') {
    filtered = filtered.filter(t => t.frequency === currentFilter);
  }
  if (currentCategory !== 'all') {
    filtered = filtered.filter(t => t.category === currentCategory);
  }
  if (currentAssignee !== 'all') {
    if (currentAssignee === 'both') {
      filtered = filtered.filter(t => t.assignee === 'both');
    } else {
      filtered = filtered.filter(t => t.assignee === currentAssignee || t.assignee === 'both');
    }
  }

  const todoTasks = filtered.filter(t => t.status === 'todo');
  const doneTasks = filtered.filter(t => t.status === 'done');

  const container = document.getElementById('allTasks');
  container.innerHTML = todoTasks.length || doneTasks.length
    ? todoTasks.map(t => renderTaskItem(t)).join('') +
      doneTasks.map(t => renderTaskItem(t)).join('')
    : emptyState('No tasks match your filters');
}

function renderTaskItem(task, showSchedule) {
  const isDone = task.status === 'done';
  const assigneeLabel = task.assignee === 'elzanne' ? 'Elzanne'
    : task.assignee === 'partner' ? 'Deji'
    : task.assignee === 'both' ? 'Both'
    : 'Outsourced';

  const scheduleInfo = showSchedule ? '' :
    `<span class="task-schedule">${getScheduleLabel(task)}</span>`;

  return `
    <div class="task-item ${isDone ? 'done' : ''}" data-id="${task.id}">
      <button class="task-check" onclick="toggleTask(${task.id})" aria-label="Toggle done">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="white" stroke-width="3">
          <path d="M5 12l5 5L19 7"/>
        </svg>
      </button>
      <div class="task-info" onclick="editTask(${task.id})">
        <div class="task-name">${escapeHtml(task.name)}</div>
        <div class="task-meta">
          <span class="task-badge badge-${task.category}">${CATEGORY_LABELS[task.category] || task.category}</span>
          <span class="task-assignee">${assigneeLabel}</span>
          ${scheduleInfo}
        </div>
      </div>
      <div class="task-actions">
        <button class="task-action-btn delete" onclick="deleteTask(${task.id})" aria-label="Delete">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14"/>
          </svg>
        </button>
      </div>
    </div>
  `;
}

function emptyState(msg) {
  return `
    <div class="empty-state">
      <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="10"/>
      </svg>
      <p>${msg}</p>
    </div>
  `;
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// === Actions ===
window.toggleTask = function(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;

  if (task.status === 'todo') {
    task.status = 'done';
    task.completedAt = new Date().toISOString();
  } else {
    task.status = 'todo';
    task.completedAt = null;
  }

  saveTasks();
  renderDashboard();
  renderAllTasks();
};

window.deleteTask = function(id) {
  if (!confirm('Delete this task?')) return;
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
  renderDashboard();
  renderAllTasks();
};

window.editTask = function(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;

  editingTaskId = id;
  document.getElementById('addTaskTitle').textContent = 'Edit Task';
  document.getElementById('taskId').value = id;
  document.getElementById('taskName').value = task.name;
  document.getElementById('taskCategory').value = task.category;
  document.getElementById('taskFrequency').value = task.frequency;
  document.getElementById('taskAssignee').value = task.assignee;
  document.getElementById('taskNotes').value = task.notes || '';

  switchView('addTaskView');
};

// === Navigation ===
function switchView(viewId) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById(viewId).classList.add('active');

  document.querySelectorAll('.nav-item').forEach(n => {
    n.classList.toggle('active', n.dataset.view === viewId);
  });

  const fab = document.getElementById('fabAdd');
  fab.style.display = viewId === 'addTaskView' ? 'none' : 'flex';
}

// === Events ===
function bindEvents() {
  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.addEventListener('click', () => switchView(btn.dataset.view));
  });

  document.getElementById('fabAdd').addEventListener('click', () => {
    editingTaskId = null;
    document.getElementById('addTaskTitle').textContent = 'New Task';
    document.getElementById('taskForm').reset();
    document.getElementById('taskId').value = '';
    switchView('addTaskView');
  });

  document.getElementById('cancelTask').addEventListener('click', () => {
    switchView('dashboardView');
  });

  document.getElementById('taskForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = {
      name: document.getElementById('taskName').value.trim(),
      category: document.getElementById('taskCategory').value,
      frequency: document.getElementById('taskFrequency').value,
      assignee: document.getElementById('taskAssignee').value,
      notes: document.getElementById('taskNotes').value.trim()
    };

    if (!formData.name) return;

    if (editingTaskId) {
      const task = tasks.find(t => t.id === editingTaskId);
      if (task) Object.assign(task, formData);
    } else {
      tasks.push({
        id: Date.now(),
        ...formData,
        status: 'todo',
        completedAt: null,
        createdAt: new Date().toISOString()
      });
    }

    saveTasks();
    renderDashboard();
    renderAllTasks();
    switchView('dashboardView');
  });

  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentFilter = tab.dataset.filter;
      renderAllTasks();
    });
  });

  document.getElementById('categoryFilter').addEventListener('change', (e) => {
    currentCategory = e.target.value;
    renderAllTasks();
  });

  document.getElementById('assigneeFilter').addEventListener('change', (e) => {
    currentAssignee = e.target.value;
    renderAllTasks();
  });

  document.getElementById('profileBtn').addEventListener('click', () => {
    document.getElementById('profileOverlay').classList.add('active');
  });

  document.getElementById('closeProfile').addEventListener('click', () => {
    document.getElementById('profileOverlay').classList.remove('active');
  });

  document.querySelectorAll('.user-option').forEach(btn => {
    btn.addEventListener('click', () => {
      currentUser = btn.dataset.user;
      localStorage.setItem(USER_KEY, currentUser);
      updateUserUI();
      updateGreeting();
      renderDashboard();
      document.getElementById('profileOverlay').classList.remove('active');
    });
  });

  document.getElementById('profileOverlay').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) {
      e.currentTarget.classList.remove('active');
    }
  });
}

function updateUserUI() {
  const avatar = document.getElementById('currentUserAvatar');
  if (currentUser === 'elzanne') {
    avatar.textContent = 'E';
    avatar.style.background = 'var(--sage)';
  } else {
    avatar.textContent = 'D';
    avatar.style.background = 'var(--navy-light)';
  }
}

// === Daily Reset ===
function resetDailyTasks() {
  const today = todayKey();
  const lastReset = localStorage.getItem('ileamao_lastReset');
  if (lastReset === today) return;

  tasks.forEach(t => {
    if (t.frequency === 'daily' || t.frequency === '3x_week' ||
        t.frequency === 'every_3rd_day' || t.frequency === 'weekly') {
      t.status = 'todo';
      t.completedAt = null;
    }
  });

  localStorage.setItem('ileamao_lastReset', today);
  saveTasks();
}

// === Service Worker Registration ===
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}

// === Start ===
resetDailyTasks();
init();
