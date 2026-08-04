self.addEventListener('install', event => self.skipWaiting());
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));

self.addEventListener('push', event => {
  let data = {};
  try { data = event.data ? event.data.json() : {}; } catch { data = { body: event.data ? event.data.text() : '' }; }
  const title = data.title || 'Nima OS';
  const options = {
    body: data.body || 'یک یادآوری از Nima OS',
    icon: '/favicon.png?v=nima-os-v2',
    badge: '/favicon.png?v=nima-os-v2',
    tag: data.tag || 'nima-os',
    renotify: false,
    data: {
      url: data.url || '/nima-os-independent-v2.html?from=notification',
      kind: data.kind || 'general',
      sentAt: data.sentAt || new Date().toISOString()
    }
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  const target = new URL(event.notification.data?.url || '/nima-os-independent-v2.html?from=notification', self.location.origin).href;
  event.waitUntil((async () => {
    const windows = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const client of windows) {
      if ('focus' in client) {
        await client.navigate(target);
        return client.focus();
      }
    }
    return self.clients.openWindow(target);
  })());
});
