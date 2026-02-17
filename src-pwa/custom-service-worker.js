/// <reference lib="webworker" />
/* eslint-env serviceworker */

import { clientsClaim } from 'workbox-core'
import {
  precacheAndRoute,
  cleanupOutdatedCaches,
  createHandlerBoundToURL,
} from 'workbox-precaching'
import { registerRoute, NavigationRoute } from 'workbox-routing'
import { NetworkFirst, CacheFirst } from 'workbox-strategies'
import { ExpirationPlugin } from 'workbox-expiration'

// ----------------------
// Service Worker Setup
// ----------------------
self.skipWaiting()
clientsClaim()

// ----------------------
// Precache & Cleanup
// ----------------------
let manifest = self.__WB_MANIFEST.filter(
  (entry, idx, arr) => arr.findIndex((e) => e.url === entry.url) === idx,
)

if (!manifest.find((e) => e.url === 'index.html')) {
  manifest.push({ url: 'index.html', revision: null })
}

precacheAndRoute(manifest)
cleanupOutdatedCaches()

// ----------------------
// SPA Fallback
// ----------------------
const navigationHandler = createHandlerBoundToURL('/index.html')

registerRoute(
  new NavigationRoute(navigationHandler, {
    denylist: [/^\/workbox-(.)*\.js$/, /^\/__/],
  }),
)

// ----------------------
// Cache API, images, fonts, scripts, styles
// ----------------------
registerRoute(
  ({ url }) => url.pathname.startsWith('/api/'),
  new NetworkFirst({
    cacheName: 'api-cache',
    networkTimeoutSeconds: 5,
    plugins: [new ExpirationPlugin({ maxEntries: 50, maxAgeSeconds: 5 * 60 })],
  }),
)

registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'image-cache',
    plugins: [new ExpirationPlugin({ maxEntries: 50, maxAgeSeconds: 24 * 60 * 60 })],
  }),
)

registerRoute(
  ({ request, url }) =>
    request.destination === 'font' ||
    url.origin.includes('fonts.googleapis.com') ||
    url.origin.includes('fonts.gstatic.com'),
  new CacheFirst({
    cacheName: 'font-cache',
    plugins: [new ExpirationPlugin({ maxEntries: 30, maxAgeSeconds: 365 * 24 * 60 * 60 })],
  }),
)

registerRoute(
  ({ request }) => request.destination === 'style' || request.destination === 'script',
  new NetworkFirst({
    cacheName: 'static-assets-cache',
    plugins: [new ExpirationPlugin({ maxEntries: 50, maxAgeSeconds: 7 * 24 * 60 * 60 })],
  }),
)

// ----------------------
// Push Notification
// ----------------------
self.addEventListener('push', (event) => {
  if (!event.data) return

  let payload = {}
  try {
    payload = event.data.json()
  } catch {
    payload = { data: { body: event.data.text(), title: 'Notifikasi' } }
  }

  const data = payload.data || payload.notification || {}
  const title = data.title || 'Notifikasi'
  const body = data.body || ''
  const notifData = { id: data.notrans || null }

  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-192x192.png',
      data: notifData,
    }),
  )
})

// ----------------------
// Notification Click
// ----------------------
self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  const notifId = event.notification.data?.id

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Cek apakah sudah ada tab aplikasi
      for (const client of clientList) {
        if ('postMessage' in client) {
          // Kirim pesan ke tab yang ada
          client.postMessage({
            type: 'OPEN_DETAIL',
            id: notifId, // bisa null, nanti router buka /notif
          })
          return client.focus()
        }
      }
      // Kalau belum ada tab → buka tab baru ke /notif
      return clients.openWindow('/notif')
    }),
  )
})

// ----------------------
// Skip Waiting from Client
// ----------------------
self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting()
})
