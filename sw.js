const CACHE_NAME = 'ileamao-v5';
const ASSETS = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './manifest.json',
  './icons/icon.svg'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});

// === Periodic Background Sync ===
self.addEventListener('periodicsync', (e) => {
  if (e.tag === 'daily-task-reminder') {
    e.waitUntil(showDailyReminder());
  }
});

const NOTIF_MESSAGES = [
  count => `This is the house we always dreamed of — let's be proud of it! Only ${count} tasks today. 🏡`,
  count => `Live, love...clean? Lol. ${count} tasks waiting for you. 💅`,
  count => `WHAT A LOVELY DAY! ${count} tasks to conquer! 🔥`,
  count => `Plot twist: the house doesn't clean itself. ${count} tasks today. 😂`,
  count => `A tidy home is a happy home. ${count} tasks — you've got this! ✨`,
  count => `Rise and shine! ${count} tasks between you and the couch. 🛋️`,
  count => `Ile Amao won't run itself! ${count} tasks — let's goooo. 🏃`,
  count => `Future you will be so grateful. Just ${count} tasks! 🙏`,
  count => `Teamwork makes the dream work. ${count} tasks today. 🤝`,
  count => `You're not just doing chores, you're building a home. ${count} tasks. 🫶`,
];

async function showDailyReminder() {
  const hour = new Date().getHours();
  if (hour < 6 || hour > 10) return;

  const taskCount = await getTodayTaskCount();
  if (taskCount === 0) return;

  const msg = NOTIF_MESSAGES[Math.floor(Math.random() * NOTIF_MESSAGES.length)];

  await self.registration.showNotification('Ile Amao', {
    body: msg(taskCount),
    icon: './icons/icon-192.png',
    badge: './icons/icon-192.png',
    tag: 'daily-reminder',
    renotify: true,
    data: { url: './index.html' }
  });
}

async function getTodayTaskCount() {
  try {
    const cache = await caches.open(CACHE_NAME);
    const response = await cache.match('./app.js');
    if (!response) return 0;

    const clients = await self.clients.matchAll({ type: 'window' });
    if (clients.length > 0) {
      return new Promise((resolve) => {
        const channel = new MessageChannel();
        channel.port1.onmessage = (e) => resolve(e.data.count || 0);
        clients[0].postMessage({ type: 'GET_TODAY_COUNT' }, [channel.port2]);
        setTimeout(() => resolve(0), 3000);
      });
    }
    return 8;
  } catch {
    return 8;
  }
}

// === Notification Click ===
self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  e.waitUntil(
    self.clients.matchAll({ type: 'window' }).then(clients => {
      if (clients.length > 0) {
        return clients[0].focus();
      }
      return self.clients.openWindow(e.notification.data?.url || './index.html');
    })
  );
});
