// === Ile Amao — Household Task Manager ===

const STORAGE_KEY = 'ileamao_tasks';
const USER_KEY = 'ileamao_user';
const DATA_VERSION_KEY = 'ileamao_data_version';
const CURRENT_DATA_VERSION = 2;

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

const MOTIVATIONAL_MESSAGES = {
  elzanne: [
    count => `This is the house we always dreamed of — let's be proud of it! Only ${count} task${count === 1 ? '' : 's'} today. 🏡`,
    count => `Live, love...clean? Lol. ${count} task${count === 1 ? '' : 's'} waiting for you. 💅`,
    count => `Hey girl, hey! Get working on your ${count} task${count === 1 ? '' : 's'}. 💪`,
    count => `WHAT A LOVELY DAY! ${count} task${count === 1 ? '' : 's'} to conquer! 🔥🔥🔥`,
    count => `Queen of the castle reporting for duty. ${count} task${count === 1 ? '' : 's'} on the board. 👑`,
    count => `A tidy home is a happy home. ${count} task${count === 1 ? '' : 's'} — you've got this! ✨`,
    count => `Plot twist: the house doesn't clean itself. ${count} task${count === 1 ? '' : 's'} today. 😂`,
    count => `You're not just doing chores, you're building a home. ${count} task${count === 1 ? '' : 's'}. 🫶`,
    count => `Channel your inner Marie Kondo. ${count} task${count === 1 ? '' : 's'} that spark joy... or at least tidiness. ✨`,
    count => `Rise and shine! ${count} task${count === 1 ? '' : 's'} between you and the couch. 🛋️`,
    count => `Ile Amao won't run itself! ${count} task${count === 1 ? '' : 's'} — let's goooo. 🏃‍♀️`,
    count => `Future you will be so grateful. Just ${count} task${count === 1 ? '' : 's'}! 🙏`,
  ],
  partner: [
    count => `This is the house we always dreamed of — let's be proud of it! Only ${count} task${count === 1 ? '' : 's'} today. 🏡`,
    count => `King Deji, your ${count} task${count === 1 ? '' : 's'} await${count === 1 ? 's' : ''}. 👑`,
    count => `WHAT A LOVELY DAY! ${count} task${count === 1 ? '' : 's'} to conquer! 🔥🔥🔥`,
    count => `Bro. ${count} task${count === 1 ? '' : 's'}. Let's get it done. 💪`,
    count => `The dishwasher won't unpack itself, chief. ${count} task${count === 1 ? '' : 's'} today. 😄`,
    count => `A tidy home is a happy home. ${count} task${count === 1 ? '' : 's'} — you've got this! ✨`,
    count => `Rise and grind! ${count} task${count === 1 ? '' : 's'} on the list today. ☀️`,
    count => `Plot twist: the house doesn't clean itself. ${count} task${count === 1 ? '' : 's'} today. 😂`,
    count => `Ile Amao won't run itself! ${count} task${count === 1 ? '' : 's'} — let's goooo. 🏃‍♂️`,
    count => `Future you will be so grateful. Just ${count} task${count === 1 ? '' : 's'}! 🙏`,
    count => `Teamwork makes the dream work. ${count} task${count === 1 ? '' : 's'} for you today. 🤝`,
    count => `You're not just doing chores, you're building a home. ${count} task${count === 1 ? '' : 's'}. 🫶`,
  ]
};

function getMotivationalMessage(user, count) {
  const messages = MOTIVATIONAL_MESSAGES[user] || MOTIVATIONAL_MESSAGES.elzanne;
  const index = Math.floor(Math.random() * messages.length);
  return messages[index](count);
}

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
  const storedVersion = parseInt(localStorage.getItem(DATA_VERSION_KEY) || '0', 10);
  const stored = localStorage.getItem(STORAGE_KEY);

  if (stored && storedVersion >= CURRENT_DATA_VERSION) {
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
    localStorage.setItem(DATA_VERSION_KEY, String(CURRENT_DATA_VERSION));
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
function isTaskScheduledOnDate(task, date) {
  const dayOfWeek = date.getDay();

  switch (task.frequency) {
    case 'daily':
      return true;

    case '3x_week':
      return (task.scheduledDays || [1, 3, 5]).includes(dayOfWeek);

    case 'every_3rd_day': {
      const epoch = new Date('2026-01-01');
      const diffDays = Math.floor((date - epoch) / 86400000);
      return diffDays % 3 === 0;
    }

    case 'weekly':
      if (task.scheduledDay !== undefined) {
        return dayOfWeek === task.scheduledDay;
      }
      return true;

    case 'monthly':
    case 'adhoc':
      return task.status === 'todo';

    default:
      return true;
  }
}

function isTaskScheduledToday(task) {
  return isTaskScheduledOnDate(task, new Date()) || task.carriedOver;
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

  const todayTasks = tasks.filter(t => isTaskScheduledToday(t));
  const myTasks = todayTasks.filter(t =>
    t.assignee === currentUser || t.assignee === 'both'
  );
  const todoCount = myTasks.filter(t => t.status === 'todo').length;
  const motivation = getMotivationalMessage(currentUser, todoCount);

  document.getElementById('greeting').innerHTML =
    `${greeting}, <span>${name}</span>`;
  document.getElementById('motivation').textContent = motivation;
}

// === Rendering ===
function formatTodayHeader() {
  const now = new Date();
  const day = DAY_NAMES[now.getDay()];
  const date = now.getDate();
  const months = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  const month = months[now.getMonth()];
  const year = now.getFullYear();
  return `Today's Tasks — ${day}, ${date} ${month} ${year}`;
}

function renderDashboard() {
  const today = todayKey();

  document.getElementById('todayHeader').textContent = formatTodayHeader();

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
    : task.assignee === 'both' ? 'Deji & Elzanne'
    : 'Outsourced';

  const scheduleInfo = showSchedule ? '' :
    `<span class="task-schedule">${getScheduleLabel(task)}</span>`;
  const carryBadge = task.carriedOver && !isDone
    ? '<span class="task-badge badge-carry">Carry over</span>' : '';

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
          ${carryBadge}
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

  const isAdhoc = task.frequency === 'adhoc' || task.frequency === 'monthly';
  const path = isAdhoc ? 'adhoc' : todayKey();
  const ref = completionsRef.child(path).child(String(id));

  if (task.status === 'todo') {
    ref.set({
      completedAt: new Date().toISOString(),
      completedBy: currentUser === 'elzanne' ? 'Elzanne' : 'Deji'
    });
  } else {
    ref.remove();
  }
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
let todayCompletions = {};
let adhocCompletions = {};
let recentCompletions = {};
let carryOverTaskIds = new Set();

function dateKey(date) {
  return date.toISOString().split('T')[0];
}

function applyCompletions() {
  computeCarryOvers();
  tasks.forEach(t => {
    t.carriedOver = false;
    if (t.frequency === 'adhoc' || t.frequency === 'monthly') {
      const c = adhocCompletions[String(t.id)];
      t.status = c ? 'done' : 'todo';
      t.completedAt = c ? c.completedAt : null;
    } else {
      const c = todayCompletions[String(t.id)];
      t.status = c ? 'done' : 'todo';
      t.completedAt = c ? c.completedAt : null;
      if (!c && carryOverTaskIds.has(t.id)) {
        t.carriedOver = true;
      }
    }
  });
  saveTasks();
  renderDashboard();
  renderAllTasks();
}

function computeCarryOvers() {
  carryOverTaskIds = new Set();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let daysBack = 1; daysBack <= 7; daysBack++) {
    const pastDate = new Date(today);
    pastDate.setDate(pastDate.getDate() - daysBack);
    const key = dateKey(pastDate);
    const dayCompletions = recentCompletions[key] || {};

    const hasAnyCompletions = Object.keys(dayCompletions).length > 0;
    if (!hasAnyCompletions) continue;

    tasks.forEach(t => {
      if (t.frequency === 'adhoc' || t.frequency === 'monthly') return;
      if (carryOverTaskIds.has(t.id)) return;
      if (isTaskScheduledOnDate(t, today)) return;
      if (isTaskScheduledOnDate(t, pastDate) && !dayCompletions[String(t.id)]) {
        carryOverTaskIds.add(t.id);
      }
    });
  }
}

function initTaskSync() {
  const today = todayKey();

  completionsRef.child(today).on('value', (snap) => {
    todayCompletions = snap.val() || {};
    recentCompletions[today] = todayCompletions;
    applyCompletions();
  });

  completionsRef.child('adhoc').on('value', (snap) => {
    adhocCompletions = snap.val() || {};
    applyCompletions();
  });

  const now = new Date();
  for (let i = 1; i <= 7; i++) {
    const pastDate = new Date(now);
    pastDate.setDate(pastDate.getDate() - i);
    const key = dateKey(pastDate);
    completionsRef.child(key).once('value', (snap) => {
      recentCompletions[key] = snap.val() || {};
      applyCompletions();
    });
  }
}

// === Firebase ===
const firebaseConfig = {
  apiKey: "AIzaSyDQ_JCp4JIDGN3iKx9RV9tB5S8IsnYWsZ8",
  authDomain: "ile-amao.firebaseapp.com",
  databaseURL: "https://ile-amao-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "ile-amao",
  storageBucket: "ile-amao.firebasestorage.app",
  messagingSenderId: "870686278977",
  appId: "1:870686278977:web:6a1e3e0573d7f7fc3a0dc0"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const groceriesRef = db.ref('groceries');
const completionsRef = db.ref('taskCompletions');

// === Grocery List ===
function initGroceries() {
  const form = document.getElementById('groceryForm');
  const input = document.getElementById('groceryInput');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = input.value.trim();
    if (!name) return;

    groceriesRef.push({
      name: name,
      bought: false,
      addedBy: currentUser === 'elzanne' ? 'Elzanne' : 'Deji',
      addedAt: Date.now()
    });

    input.value = '';
  });

  document.getElementById('clearCheckedBtn').addEventListener('click', () => {
    groceriesRef.once('value', (snap) => {
      const updates = {};
      snap.forEach(child => {
        if (child.val().bought) {
          updates[child.key] = null;
        }
      });
      if (Object.keys(updates).length > 0) {
        groceriesRef.update(updates);
      }
    });
  });

  groceriesRef.orderByChild('addedAt').on('value', (snap) => {
    renderGroceryList(snap);
  });
}

function renderGroceryList(snapshot) {
  const container = document.getElementById('groceryList');
  const items = [];

  snapshot.forEach(child => {
    items.push({ key: child.key, ...child.val() });
  });

  const unbought = items.filter(i => !i.bought);
  const bought = items.filter(i => i.bought);
  const sorted = [...unbought, ...bought];

  container.innerHTML = sorted.length
    ? sorted.map(item => `
      <div class="grocery-item ${item.bought ? 'bought' : ''}" data-key="${item.key}">
        <button class="grocery-check" onclick="toggleGrocery('${item.key}', ${!item.bought})" aria-label="Toggle bought">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="white" stroke-width="3">
            <path d="M5 12l5 5L19 7"/>
          </svg>
        </button>
        <span class="grocery-name">${escapeHtml(item.name)}</span>
        <span class="grocery-added-by">${item.addedBy || ''}</span>
        <button class="grocery-delete" onclick="deleteGrocery('${item.key}')" aria-label="Remove">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
    `).join('')
    : '<div class="empty-state"><p>Shopping list is empty — add items above!</p></div>';

  const summary = document.getElementById('grocerySummary');
  if (items.length > 0) {
    summary.textContent = `${unbought.length} to buy, ${bought.length} bought`;
  } else {
    summary.textContent = '';
  }
}

window.toggleGrocery = function(key, bought) {
  groceriesRef.child(key).update({ bought: bought });
};

window.deleteGrocery = function(key) {
  groceriesRef.child(key).remove();
};

// === Log Slips ===
const slipsRef = db.ref('slips');
let allSlips = [];
let slipMonthFilter = '';

function initSlips() {
  const form = document.getElementById('slipForm');
  const dateInput = document.getElementById('slipDate');
  const monthInput = document.getElementById('slipMonth');

  // Auto-set today's date
  const today = new Date().toISOString().split('T')[0];
  dateInput.value = today;
  updateSalaryMonth(today);

  dateInput.addEventListener('change', () => {
    updateSalaryMonth(dateInput.value);
  });

  const categorySelect = document.getElementById('slipCategory');
  const restaurantGroup = document.getElementById('restaurantGroup');
  const restaurantInput = document.getElementById('slipRestaurant');

  categorySelect.addEventListener('change', () => {
    restaurantGroup.style.display = categorySelect.value === 'Dining Out' ? '' : 'none';
    if (categorySelect.value !== 'Dining Out') restaurantInput.value = '';
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const slip = {
      date: dateInput.value,
      salaryMonth: monthInput.value,
      category: document.getElementById('slipCategory').value,
      amount: parseFloat(document.getElementById('slipAmount').value),
      loggedBy: currentUser === 'elzanne' ? 'Elzanne' : 'Deji',
      loggedAt: Date.now()
    };

    const restaurant = restaurantInput.value.trim();
    if (restaurant && slip.category === 'Dining Out') {
      slip.restaurant = restaurant;
    }

    const commentInput = document.getElementById('slipComment');
    const comment = commentInput.value.trim();
    if (comment) slip.comment = comment;

    if (!slip.amount || slip.amount <= 0) return;

    slipsRef.push(slip);

    document.getElementById('slipAmount').value = '';
    document.getElementById('slipCategory').selectedIndex = 0;
    commentInput.value = '';
    restaurantInput.value = '';
    restaurantGroup.style.display = 'none';
  });

  slipsRef.orderByChild('loggedAt').on('value', (snap) => {
    allSlips = [];
    snap.forEach(child => {
      allSlips.push({ key: child.key, ...child.val() });
    });
    allSlips.reverse();
    populateMonthFilter();
    renderSlips();
  });

  document.getElementById('slipMonthFilter').addEventListener('change', (e) => {
    slipMonthFilter = e.target.value;
    renderSlips();
  });
}

function updateSalaryMonth(dateStr) {
  const monthInput = document.getElementById('slipMonth');
  if (!dateStr) return;

  const date = new Date(dateStr + 'T00:00:00');
  const day = date.getDate();

  // Pay cycle: 25th to 24th. If day >= 25, salary month = current month.
  // If day < 25, salary month = previous month.
  let salaryYear = date.getFullYear();
  let salaryMonth = date.getMonth(); // 0-indexed

  if (day < 25) {
    salaryMonth -= 1;
    if (salaryMonth < 0) {
      salaryMonth = 11;
      salaryYear -= 1;
    }
  }

  monthInput.value = `${salaryYear}-${String(salaryMonth + 1).padStart(2, '0')}`;
}

function populateMonthFilter() {
  const select = document.getElementById('slipMonthFilter');
  const months = [...new Set(allSlips.map(s => s.salaryMonth))].sort().reverse();
  if (!slipMonthFilter && months.length > 0) slipMonthFilter = months[0];
  const current = slipMonthFilter || '';

  select.innerHTML = '<option value="">All months</option>' +
    months.map(m => {
      const [y, mo] = m.split('-');
      const label = new Date(y, parseInt(mo) - 1).toLocaleDateString('en-ZA', { month: 'long', year: 'numeric' });
      return `<option value="${m}" ${m === current ? 'selected' : ''}>${label}</option>`;
    }).join('');
}

function renderSlips() {
  const filtered = slipMonthFilter
    ? allSlips.filter(s => s.salaryMonth === slipMonthFilter)
    : allSlips;

  // Summary
  const summaryEl = document.getElementById('slipSummary');
  if (filtered.length > 0) {
    const total = filtered.reduce((sum, s) => sum + (s.amount || 0), 0);
    const groceriesTotal = filtered
      .filter(s => s.category.startsWith('Groceries:'))
      .reduce((sum, s) => sum + (s.amount || 0), 0);
    const diningTotal = filtered
      .filter(s => s.category === 'Dining Out' || s.category.startsWith('Dining Out:'))
      .reduce((sum, s) => sum + (s.amount || 0), 0);
    const miscTotal = filtered
      .filter(s => s.category.startsWith('Misc Ex:'))
      .reduce((sum, s) => sum + (s.amount || 0), 0);
    const generalTotal = filtered
      .filter(s => s.category.startsWith('General:'))
      .reduce((sum, s) => sum + (s.amount || 0), 0);

    summaryEl.innerHTML = `
      <div class="slip-summary-card total">
        <span class="slip-summary-amount">R${formatAmount(total)}</span>
        <span class="slip-summary-label">Total</span>
      </div>
      <div class="slip-summary-card">
        <span class="slip-summary-amount">R${formatAmount(groceriesTotal)}</span>
        <span class="slip-summary-label">Groceries</span>
      </div>
      <div class="slip-summary-card">
        <span class="slip-summary-amount">R${formatAmount(diningTotal)}</span>
        <span class="slip-summary-label">Dining Out</span>
      </div>
      <div class="slip-summary-card">
        <span class="slip-summary-amount">R${formatAmount(miscTotal)}</span>
        <span class="slip-summary-label">Misc</span>
      </div>
      <div class="slip-summary-card">
        <span class="slip-summary-amount">R${formatAmount(generalTotal)}</span>
        <span class="slip-summary-label">General</span>
      </div>
    `;
  } else {
    summaryEl.innerHTML = '';
  }

  // Group by category prefix
  const container = document.getElementById('slipList');
  if (filtered.length === 0) {
    container.innerHTML = '<div class="empty-state"><p>No slips logged yet</p></div>';
    return;
  }

  const groups = {};
  filtered.forEach(s => {
    const prefix = s.category.split(':')[0] || 'Other';
    if (!groups[prefix]) groups[prefix] = [];
    groups[prefix].push(s);
  });

  let html = '';
  for (const [group, items] of Object.entries(groups)) {
    const groupTotal = items.reduce((sum, s) => sum + (s.amount || 0), 0);
    html += `<div class="slip-group-header">
      <span>${escapeHtml(group)}</span>
      <span class="slip-group-total">R${formatAmount(groupTotal)}</span>
    </div>`;
    items.forEach(s => {
      const catLabel = s.category.split(': ')[1] || s.category;
      const dateLabel = new Date(s.date + 'T00:00:00').toLocaleDateString('en-ZA', {
        day: 'numeric', month: 'short'
      });
      const restaurantLabel = s.restaurant ? ` — ${escapeHtml(s.restaurant)}` : '';
      const commentLabel = s.comment ? `<div class="slip-item-comment">${escapeHtml(s.comment)}</div>` : '';
      html += `
        <div class="slip-item">
          <div class="slip-item-info">
            <div class="slip-item-category">${escapeHtml(catLabel)}${restaurantLabel}</div>
            ${commentLabel}
            <div class="slip-item-meta">${dateLabel} &middot; ${s.loggedBy || ''}</div>
          </div>
          <div class="slip-item-amount">R${formatAmount(s.amount)}</div>
          <button class="slip-item-delete" onclick="deleteSlip('${s.key}')" aria-label="Delete">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
      `;
    });
  }
  container.innerHTML = html;
}

function formatAmount(num) {
  return num.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

window.deleteSlip = function(key) {
  if (!confirm('Delete this slip?')) return;
  slipsRef.child(key).remove();
};

// === Expense Dashboard ===
const DEFAULT_BUDGETS = {
  'Groceries': 14600,
  'General': 5500,
  'Dining Out': 800,
  'Misc Ex': 4000
};

const BUDGET_LABELS = {
  'Groceries': 'Groceries',
  'General': 'Petrol',
  'Dining Out': 'Dining Out',
  'Misc Ex': 'Misc Expenses'
};

let dashMonthFilter = '';
let monthlyBudgets = {};
const budgetsRef = db.ref('budgets');

function initDashboard() {
  document.querySelectorAll('.slip-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.slip-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      document.querySelectorAll('.slip-subview').forEach(v => v.classList.remove('active'));
      document.getElementById(tab.dataset.slipView).classList.add('active');
      if (tab.dataset.slipView === 'dashView') renderDashboardView();
    });
  });

  document.getElementById('dashMonthFilter').addEventListener('change', (e) => {
    dashMonthFilter = e.target.value;
    renderDashboardView();
  });

  budgetsRef.on('value', (snap) => {
    monthlyBudgets = snap.val() || {};
    renderDashboardView();
  });

  document.getElementById('editBudgetBtn').addEventListener('click', () => {
    const editor = document.getElementById('budgetEditor');
    if (editor.style.display === 'none') {
      renderBudgetEditor();
      editor.style.display = '';
    } else {
      editor.style.display = 'none';
    }
  });
}

function getBudgetsForMonth(month) {
  const overrides = monthlyBudgets[month] || {};
  const budgets = {};
  for (const group of Object.keys(DEFAULT_BUDGETS)) {
    budgets[group] = overrides[group] !== undefined ? overrides[group] : DEFAULT_BUDGETS[group];
  }
  return budgets;
}

function renderBudgetEditor() {
  const months = getMonthlyData();
  const selectedMonth = dashMonthFilter || Object.keys(months).sort().reverse()[0];
  if (!selectedMonth) return;

  const budgets = getBudgetsForMonth(selectedMonth);
  const [y, mo] = selectedMonth.split('-');
  const monthLabel = new Date(y, parseInt(mo) - 1).toLocaleDateString('en-ZA', { month: 'long', year: 'numeric' });

  const editor = document.getElementById('budgetEditor');
  let html = `<div class="budget-editor-header">Budgets for ${monthLabel}</div>`;

  for (const [group, amount] of Object.entries(budgets)) {
    const label = BUDGET_LABELS[group] || group;
    html += `
      <div class="budget-editor-row">
        <label>${label}</label>
        <div class="budget-input-wrap">
          <span class="budget-input-prefix">R</span>
          <input type="number" class="budget-input" data-group="${group}" value="${amount}" min="0" step="100" inputmode="numeric">
        </div>
      </div>
    `;
  }

  html += `<div class="budget-editor-actions">
    <button class="btn btn-primary btn-sm" id="saveBudgetBtn">Save</button>
    <button class="btn-text" id="cancelBudgetBtn">Cancel</button>
  </div>`;

  editor.innerHTML = html;

  document.getElementById('saveBudgetBtn').addEventListener('click', () => {
    const inputs = editor.querySelectorAll('.budget-input');
    const updates = {};
    inputs.forEach(input => {
      updates[input.dataset.group] = parseFloat(input.value) || 0;
    });
    budgetsRef.child(selectedMonth).set(updates);
    editor.style.display = 'none';
  });

  document.getElementById('cancelBudgetBtn').addEventListener('click', () => {
    editor.style.display = 'none';
  });
}

function renderDashboardView() {
  if (allSlips.length === 0) return;

  populateDashMonthFilter();

  const months = getMonthlyData();
  const selected = dashMonthFilter || Object.keys(months).sort().reverse()[0];
  const isYtd = selected && selected.startsWith('ytd-');

  if (isYtd) {
    const year = selected.split('-')[1];
    renderYtdView(months, year);
  } else {
    renderBudgetBars(months, selected);
    renderMonthlyChart(months, selected);
    renderCategoryBreakdown(months, selected);
    renderMomComparison(months, selected);
  }
}

function populateDashMonthFilter() {
  const select = document.getElementById('dashMonthFilter');
  const months = [...new Set(allSlips.map(s => s.salaryMonth))].sort().reverse();
  const current = dashMonthFilter || months[0] || '';

  const years = [...new Set(months.map(m => m.split('-')[0]))].sort().reverse();
  const ytdOptions = years.map(y =>
    `<option value="ytd-${y}" ${current === 'ytd-' + y ? 'selected' : ''}>YTD ${y}</option>`
  ).join('');

  const monthOptions = months.map(m => {
    const [y, mo] = m.split('-');
    const label = new Date(y, parseInt(mo) - 1).toLocaleDateString('en-ZA', { month: 'long', year: 'numeric' });
    return `<option value="${m}" ${m === current ? 'selected' : ''}>${label}</option>`;
  }).join('');

  select.innerHTML = ytdOptions + monthOptions;
}

function getMonthlyData() {
  const months = {};
  allSlips.forEach(s => {
    if (!months[s.salaryMonth]) months[s.salaryMonth] = [];
    months[s.salaryMonth].push(s);
  });
  return months;
}

function getGroupTotal(slips, prefix) {
  return slips
    .filter(s => s.category.startsWith(prefix))
    .reduce((sum, s) => sum + (s.amount || 0), 0);
}

function renderBudgetBars(months, selectedMonth) {
  const slips = months[selectedMonth] || [];
  const container = document.getElementById('budgetBars');
  const budgets = getBudgetsForMonth(selectedMonth);

  let html = '';
  for (const [group, budget] of Object.entries(budgets)) {
    const actual = getGroupTotal(slips, group);
    const label = BUDGET_LABELS[group] || group;
    const pct = budget > 0 ? Math.min((actual / budget) * 100, 150) : 0;
    const displayPct = budget > 0 ? Math.round((actual / budget) * 100) : 0;
    const barClass = displayPct <= 75 ? 'under' : displayPct <= 100 ? 'warn' : 'over';

    html += `
      <div class="budget-row">
        <div class="budget-label">
          <span>${label}</span>
        </div>
        <div class="budget-amounts">R${formatAmount(actual)} of R${formatAmount(budget)} spent${actual <= budget ? ` — R${formatAmount(budget - actual)} left` : ` — R${formatAmount(actual - budget)} over`}</div>
        <div class="budget-bar-bg">
          <div class="budget-bar-fill ${barClass}" style="width: ${Math.min(pct, 100)}%"></div>
          <span class="budget-pct">${displayPct}%</span>
        </div>
      </div>
    `;
  }

  const total = slips.reduce((sum, s) => sum + (s.amount || 0), 0);
  const totalBudget = Object.values(budgets).reduce((a, b) => a + b, 0);
  const totalPct = totalBudget > 0 ? Math.round((total / totalBudget) * 100) : 0;
  const totalClass = totalPct <= 75 ? 'under' : totalPct <= 100 ? 'warn' : 'over';

  html += `
    <div class="budget-row" style="margin-top: 16px; padding-top: 12px; border-top: 1px solid var(--gray-200);">
      <div class="budget-label"><span><strong>Total</strong></span></div>
      <div class="budget-amounts">R${formatAmount(total)} of R${formatAmount(totalBudget)} spent${total <= totalBudget ? ` — R${formatAmount(totalBudget - total)} left` : ` — R${formatAmount(total - totalBudget)} over`}</div>
      <div class="budget-bar-bg">
        <div class="budget-bar-fill ${totalClass}" style="width: ${Math.min(totalPct, 100)}%"></div>
        <span class="budget-pct">${totalPct}%</span>
      </div>
    </div>
  `;

  container.innerHTML = html;
}

function renderMonthlyChart(months, selectedMonth) {
  const container = document.getElementById('monthlyChart');
  const sortedMonths = Object.keys(months).sort();
  const totals = sortedMonths.map(m =>
    months[m].reduce((sum, s) => sum + (s.amount || 0), 0)
  );
  const maxTotal = Math.max(...totals);

  container.innerHTML = sortedMonths.map((m, i) => {
    const total = totals[i];
    const heightPct = maxTotal > 0 ? (total / maxTotal) * 100 : 0;
    const [, mo] = m.split('-');
    const label = new Date(2026, parseInt(mo) - 1).toLocaleDateString('en-ZA', { month: 'short' });
    const isCurrent = m === selectedMonth;

    return `
      <div class="chart-col">
        <span class="chart-amount">R${(total/1000).toFixed(1)}k</span>
        <div class="chart-bar ${isCurrent ? 'current' : ''}" style="height: ${heightPct}%"></div>
        <span class="chart-label">${label}</span>
      </div>
    `;
  }).join('');
}

function renderCategoryBreakdown(months, selectedMonth) {
  const slips = months[selectedMonth] || [];
  const container = document.getElementById('categoryBreakdown');

  const categories = {};
  slips.forEach(s => {
    const cat = s.category;
    categories[cat] = (categories[cat] || 0) + (s.amount || 0);
  });

  const sorted = Object.entries(categories).sort((a, b) => b[1] - a[1]);
  const maxAmount = sorted.length > 0 ? sorted[0][1] : 0;

  container.innerHTML = sorted.slice(0, 12).map(([cat, amount]) => {
    const widthPct = maxAmount > 0 ? (amount / maxAmount) * 100 : 0;
    const prefix = cat.split(':')[0];
    const barClass = prefix.startsWith('Groceries') ? 'groceries'
      : prefix.startsWith('Dining') ? 'dining'
      : prefix.startsWith('Misc') ? 'misc' : 'general';
    const shortCat = cat.split(': ')[1] || cat;

    return `
      <div class="cat-row">
        <span class="cat-name">${escapeHtml(shortCat)}</span>
        <div class="cat-bar-bg">
          <div class="cat-bar-fill ${barClass}" style="width: ${widthPct}%"></div>
        </div>
        <span class="cat-amount">R${formatAmount(amount)}</span>
      </div>
    `;
  }).join('');
}

function renderMomComparison(months, selectedMonth) {
  const container = document.getElementById('momComparison');
  const sortedMonths = Object.keys(months).sort();
  const currentIdx = sortedMonths.indexOf(selectedMonth);

  if (currentIdx < 0) { container.innerHTML = ''; return; }

  const currentSlips = months[selectedMonth] || [];
  const prevMonth = currentIdx > 0 ? sortedMonths[currentIdx - 1] : null;
  const prevSlips = prevMonth ? months[prevMonth] : [];

  const groups = ['Groceries', 'General', 'Dining Out', 'Misc Ex'];
  let html = '';

  groups.forEach(group => {
    const current = getGroupTotal(currentSlips, group);
    const prev = getGroupTotal(prevSlips, group);
    const diff = prev > 0 ? ((current - prev) / prev) * 100 : 0;
    const changeClass = diff > 5 ? 'up' : diff < -5 ? 'down' : 'flat';
    const changeLabel = diff > 0 ? `+${Math.round(diff)}%` : diff < 0 ? `${Math.round(diff)}%` : '—';
    const label = group === 'Misc Ex' ? 'Misc Expenses' : group;

    html += `
      <div class="mom-row">
        <span class="mom-label">${label}</span>
        <div class="mom-values">
          <div class="mom-amount">R${formatAmount(current)}</div>
          <div class="mom-change ${changeClass}">${prevMonth ? changeLabel + ' vs prev' : 'First month'}</div>
        </div>
      </div>
    `;
  });

  const totalCurrent = currentSlips.reduce((sum, s) => sum + (s.amount || 0), 0);
  const totalPrev = prevSlips.reduce((sum, s) => sum + (s.amount || 0), 0);
  const totalDiff = totalPrev > 0 ? ((totalCurrent - totalPrev) / totalPrev) * 100 : 0;
  const totalClass = totalDiff > 5 ? 'up' : totalDiff < -5 ? 'down' : 'flat';
  const totalLabel = totalDiff > 0 ? `+${Math.round(totalDiff)}%` : totalDiff < 0 ? `${Math.round(totalDiff)}%` : '—';

  html += `
    <div class="mom-row" style="border-top: 2px solid var(--gray-200); padding-top: 12px;">
      <span class="mom-label"><strong>Total</strong></span>
      <div class="mom-values">
        <div class="mom-amount">R${formatAmount(totalCurrent)}</div>
        <div class="mom-change ${totalClass}">${prevMonth ? totalLabel + ' vs prev' : 'First month'}</div>
      </div>
    </div>
  `;

  container.innerHTML = html;
}

function renderYtdView(months, year) {
  const yearMonths = Object.keys(months).filter(m => m.startsWith(year)).sort();
  const yearSlips = yearMonths.flatMap(m => months[m]);

  // Budget bars — sum of all monthly budgets for the year
  const budgetContainer = document.getElementById('budgetBars');
  const groups = Object.keys(DEFAULT_BUDGETS);
  let html = '';

  groups.forEach(group => {
    const actual = getGroupTotal(yearSlips, group);
    let totalBudget = 0;
    yearMonths.forEach(m => {
      const b = getBudgetsForMonth(m);
      totalBudget += b[group] || 0;
    });
    const label = BUDGET_LABELS[group] || group;
    const pct = totalBudget > 0 ? Math.min((actual / totalBudget) * 100, 150) : 0;
    const displayPct = totalBudget > 0 ? Math.round((actual / totalBudget) * 100) : 0;
    const barClass = displayPct <= 75 ? 'under' : displayPct <= 100 ? 'warn' : 'over';

    html += `
      <div class="budget-row">
        <div class="budget-label"><span>${label}</span></div>
        <div class="budget-amounts">R${formatAmount(actual)} of R${formatAmount(totalBudget)} spent${actual <= totalBudget ? ` — R${formatAmount(totalBudget - actual)} left` : ` — R${formatAmount(actual - totalBudget)} over`}</div>
        <div class="budget-bar-bg">
          <div class="budget-bar-fill ${barClass}" style="width: ${Math.min(pct, 100)}%"></div>
          <span class="budget-pct">${displayPct}%</span>
        </div>
      </div>
    `;
  });

  const ytdTotal = yearSlips.reduce((sum, s) => sum + (s.amount || 0), 0);
  let ytdBudgetTotal = 0;
  yearMonths.forEach(m => {
    ytdBudgetTotal += Object.values(getBudgetsForMonth(m)).reduce((a, b) => a + b, 0);
  });
  const ytdPct = ytdBudgetTotal > 0 ? Math.round((ytdTotal / ytdBudgetTotal) * 100) : 0;
  const ytdClass = ytdPct <= 75 ? 'under' : ytdPct <= 100 ? 'warn' : 'over';

  html += `
    <div class="budget-row" style="margin-top: 16px; padding-top: 12px; border-top: 1px solid var(--gray-200);">
      <div class="budget-label"><span><strong>Total</strong></span></div>
      <div class="budget-amounts">R${formatAmount(ytdTotal)} of R${formatAmount(ytdBudgetTotal)} spent${ytdTotal <= ytdBudgetTotal ? ` — R${formatAmount(ytdBudgetTotal - ytdTotal)} left` : ` — R${formatAmount(ytdTotal - ytdBudgetTotal)} over`}</div>
      <div class="budget-bar-bg">
        <div class="budget-bar-fill ${ytdClass}" style="width: ${Math.min(ytdPct, 100)}%"></div>
        <span class="budget-pct">${ytdPct}%</span>
      </div>
    </div>
  `;
  budgetContainer.innerHTML = html;

  // Monthly chart — show all months in the year
  const chartContainer = document.getElementById('monthlyChart');
  const totals = yearMonths.map(m =>
    months[m].reduce((sum, s) => sum + (s.amount || 0), 0)
  );
  const maxTotal = Math.max(...totals);

  chartContainer.innerHTML = yearMonths.map((m, i) => {
    const total = totals[i];
    const heightPct = maxTotal > 0 ? (total / maxTotal) * 100 : 0;
    const [, mo] = m.split('-');
    const label = new Date(2026, parseInt(mo) - 1).toLocaleDateString('en-ZA', { month: 'short' });
    return `
      <div class="chart-col">
        <span class="chart-amount">R${(total/1000).toFixed(1)}k</span>
        <div class="chart-bar" style="height: ${heightPct}%"></div>
        <span class="chart-label">${label}</span>
      </div>
    `;
  }).join('');

  // Category breakdown — all year
  const catContainer = document.getElementById('categoryBreakdown');
  const categories = {};
  yearSlips.forEach(s => {
    const cat = s.category;
    categories[cat] = (categories[cat] || 0) + (s.amount || 0);
  });
  const sorted = Object.entries(categories).sort((a, b) => b[1] - a[1]);
  const maxAmount = sorted.length > 0 ? sorted[0][1] : 0;

  catContainer.innerHTML = sorted.slice(0, 15).map(([cat, amount]) => {
    const widthPct = maxAmount > 0 ? (amount / maxAmount) * 100 : 0;
    const prefix = cat.split(':')[0];
    const barClass = prefix.startsWith('Groceries') ? 'groceries'
      : prefix.startsWith('Dining') ? 'dining'
      : prefix.startsWith('Misc') ? 'misc' : 'general';
    const shortCat = cat.split(': ')[1] || cat;
    return `
      <div class="cat-row">
        <span class="cat-name">${escapeHtml(shortCat)}</span>
        <div class="cat-bar-bg">
          <div class="cat-bar-fill ${barClass}" style="width: ${widthPct}%"></div>
        </div>
        <span class="cat-amount">R${formatAmount(amount)}</span>
      </div>
    `;
  }).join('');

  // Monthly average instead of MoM
  const momContainer = document.getElementById('momComparison');
  const monthCount = yearMonths.length || 1;
  const avgTotal = ytdTotal / monthCount;

  let momHtml = `<div class="mom-row"><span class="mom-label"><strong>${yearMonths.length} months</strong></span>
    <div class="mom-values"><div class="mom-amount">Avg R${formatAmount(avgTotal)}/mo</div></div></div>`;

  groups.forEach(group => {
    const actual = getGroupTotal(yearSlips, group);
    const avg = actual / monthCount;
    const label = BUDGET_LABELS[group] || group;
    momHtml += `
      <div class="mom-row">
        <span class="mom-label">${label}</span>
        <div class="mom-values">
          <div class="mom-amount">R${formatAmount(actual)}</div>
          <div class="mom-change flat">avg R${formatAmount(avg)}/mo</div>
        </div>
      </div>
    `;
  });

  momContainer.innerHTML = momHtml;
}

// === Service Worker & Notifications ===
async function setupServiceWorker() {
  if (!('serviceWorker' in navigator)) return;

  try {
    const reg = await navigator.serviceWorker.register('sw.js');
    await navigator.serviceWorker.ready;

    navigator.serviceWorker.addEventListener('message', (e) => {
      if (e.data?.type === 'GET_TODAY_COUNT') {
        const todayTasks = tasks.filter(t => isTaskScheduledToday(t));
        const myTasks = todayTasks.filter(t =>
          t.assignee === currentUser || t.assignee === 'both'
        );
        const todoCount = myTasks.filter(t => t.status === 'todo').length;
        e.ports[0].postMessage({ count: todoCount });
      }
    });

    if ('periodicSync' in reg) {
      const status = await navigator.permissions.query({ name: 'periodic-background-sync' });
      if (status.state === 'granted') {
        await reg.periodicSync.register('daily-task-reminder', {
          minInterval: 12 * 60 * 60 * 1000 // 12 hours
        });
      }
    }
  } catch {
    // SW registration failed silently
  }
}

function setupNotificationPrompt() {
  const banner = document.getElementById('notifBanner');
  if (!banner) return;

  if (!('Notification' in window)) return;
  if (Notification.permission === 'granted' || Notification.permission === 'denied') {
    banner.remove();
    return;
  }
  if (localStorage.getItem('ileamao_notif_accepted')) {
    banner.remove();
    return;
  }

  const lastDismissed = localStorage.getItem('ileamao_notif_dismissed');
  if (lastDismissed) {
    const daysSince = (Date.now() - parseInt(lastDismissed, 10)) / 86400000;
    if (daysSince < 7) return;
  }

  banner.classList.add('active');

  document.getElementById('notifAllow').addEventListener('click', () => {
    banner.classList.remove('active');
    localStorage.setItem('ileamao_notif_accepted', '1');
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        showWelcomeNotification();
      }
    });
  });

  document.getElementById('notifDismiss').addEventListener('click', () => {
    banner.classList.remove('active');
    localStorage.setItem('ileamao_notif_dismissed', String(Date.now()));
  });
}

function showWelcomeNotification() {
  if (!('serviceWorker' in navigator) || Notification.permission !== 'granted') return;
  navigator.serviceWorker.ready.then(reg => {
    reg.showNotification('Ile Amao', {
      body: 'Notifications enabled! You\'ll get a daily reminder of your tasks.',
      icon: './icons/icon-192.png',
      badge: './icons/icon-192.png',
      tag: 'welcome'
    });
  });
}

// === Start ===
init();
initTaskSync();
initGroceries();
initSlips();
initDashboard();
setupServiceWorker();
setTimeout(setupNotificationPrompt, 2000);
