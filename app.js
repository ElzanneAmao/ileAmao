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
  weekly: 'Weekly',
  monthly: 'Monthly',
  adhoc: 'One-off'
};

const DEFAULT_TASKS = [
  { name: 'Make the beds', category: 'chores', frequency: 'daily', assignee: 'elzanne' },
  { name: 'Do laundry', category: 'chores', frequency: 'daily', assignee: 'elzanne' },
  { name: 'Pack the dishwasher', category: 'chores', frequency: 'daily', assignee: 'partner' },
  { name: 'Unpack the dishwasher', category: 'chores', frequency: 'daily', assignee: 'partner' },
  { name: 'Do the dishes', category: 'chores', frequency: 'daily', assignee: 'partner' },
  { name: 'Cook dinner', category: 'chores', frequency: 'daily', assignee: 'elzanne' },
  { name: 'Prep house for robot vacuum', category: 'chores', frequency: 'daily', assignee: 'partner' },
  { name: 'Set the robot vacuum', category: 'chores', frequency: 'daily', assignee: 'partner' },
  { name: 'Pack away toys', category: 'chores', frequency: 'daily', assignee: 'elzanne' },
  { name: 'Tidy up the house', category: 'chores', frequency: 'daily', assignee: 'elzanne' },
  { name: 'Bring out food for defrost', category: 'chores', frequency: 'daily', assignee: 'elzanne' },
  { name: 'Wash the floors', category: 'cleaning', frequency: 'weekly', assignee: 'elzanne' },
  { name: 'Wipe the counters', category: 'cleaning', frequency: 'weekly', assignee: 'partner' },
  { name: 'Dust the furniture', category: 'cleaning', frequency: 'weekly', assignee: 'partner' },
  { name: 'Clean the showers', category: 'cleaning', frequency: 'weekly', assignee: 'elzanne' },
  { name: 'Clean the sinks', category: 'cleaning', frequency: 'weekly', assignee: 'partner' },
  { name: 'Clean the bathrooms', category: 'cleaning', frequency: 'weekly', assignee: 'elzanne' },
  { name: 'Wash the windows', category: 'deepclean', frequency: 'monthly', assignee: 'outsourced' },
  { name: 'Tidy the garden', category: 'garden', frequency: 'weekly', assignee: 'partner' },
  { name: 'Water the garden', category: 'garden', frequency: 'weekly', assignee: 'partner' },
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
      notes: '',
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
  const todayTasks = tasks.filter(t =>
    t.frequency === 'daily' || (t.frequency === 'adhoc' && t.status === 'todo')
  );
  const doneTodayCount = tasks.filter(t =>
    t.completedAt && t.completedAt.startsWith(today)
  ).length;
  const todoCount = tasks.filter(t => t.status === 'todo').length;

  document.getElementById('statTodo').textContent = todoCount;
  document.getElementById('statDone').textContent = doneTodayCount;
  document.getElementById('statTotal').textContent = tasks.length;

  const todayContainer = document.getElementById('todayTasks');
  const todayFiltered = todayTasks.slice(0, 8);
  todayContainer.innerHTML = todayFiltered.length
    ? todayFiltered.map(t => renderTaskItem(t)).join('')
    : emptyState('All caught up for today!');

  const upcomingContainer = document.getElementById('upcomingTasks');
  const upcoming = tasks.filter(t =>
    (t.frequency === 'weekly' || t.frequency === 'monthly') && t.status === 'todo'
  ).slice(0, 5);
  upcomingContainer.innerHTML = upcoming.length
    ? upcoming.map(t => renderTaskItem(t)).join('')
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
    filtered = filtered.filter(t => t.assignee === currentAssignee);
  }

  const todoTasks = filtered.filter(t => t.status === 'todo');
  const doneTasks = filtered.filter(t => t.status === 'done');

  const container = document.getElementById('allTasks');
  container.innerHTML = todoTasks.length || doneTasks.length
    ? todoTasks.map(t => renderTaskItem(t)).join('') +
      doneTasks.map(t => renderTaskItem(t)).join('')
    : emptyState('No tasks match your filters');
}

function renderTaskItem(task) {
  const isDone = task.status === 'done';
  const assigneeLabel = task.assignee === 'elzanne' ? 'Elzanne'
    : task.assignee === 'partner' ? 'Deji' : 'Outsourced';

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
  // Bottom nav
  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.addEventListener('click', () => switchView(btn.dataset.view));
  });

  // FAB
  document.getElementById('fabAdd').addEventListener('click', () => {
    editingTaskId = null;
    document.getElementById('addTaskTitle').textContent = 'New Task';
    document.getElementById('taskForm').reset();
    document.getElementById('taskId').value = '';
    switchView('addTaskView');
  });

  // Cancel
  document.getElementById('cancelTask').addEventListener('click', () => {
    switchView('dashboardView');
  });

  // Form submit
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

  // Tabs
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentFilter = tab.dataset.filter;
      renderAllTasks();
    });
  });

  // Category filter
  document.getElementById('categoryFilter').addEventListener('change', (e) => {
    currentCategory = e.target.value;
    renderAllTasks();
  });

  // Assignee filter
  document.getElementById('assigneeFilter').addEventListener('change', (e) => {
    currentAssignee = e.target.value;
    renderAllTasks();
  });

  // Profile
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
      document.getElementById('profileOverlay').classList.remove('active');
    });
  });

  // Close overlay on backdrop click
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
    avatar.textContent = 'A';
    avatar.style.background = 'var(--navy-light)';
  }
}

// === Daily Reset ===
function resetDailyTasks() {
  const today = todayKey();
  const lastReset = localStorage.getItem('ileamao_lastReset');
  if (lastReset === today) return;

  tasks.forEach(t => {
    if (t.frequency === 'daily') {
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
