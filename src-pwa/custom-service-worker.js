/// <reference lib="webworker" />
/* eslint-env serviceworker */

import { clientsClaim } from 'workbox-core'
import {
  precacheAndRoute,
  cleanupOutdatedCaches,
  createHandlerBoundToURL,
} from 'workbox-precaching'
import { registerRoute, NavigationRoute } from 'workbox-routing'
import { NetworkFirst, CacheFirst, StaleWhileRevalidate } from 'workbox-strategies'
import { ExpirationPlugin } from 'workbox-expiration'

self.addEventListener('fetch', (event) => {
  // Jangan cache folder perumbi
  if (event.request.url.includes('/perumbi/')) {
    event.respondWith(fetch(event.request))
    return
  }
})

self.skipWaiting()
clientsClaim()

// ----------------------
// FIX: Hapus duplikasi entry dari manifest
// ----------------------
const manifest = self.__WB_MANIFEST.filter(
  (entry, idx, arr) => arr.findIndex((e) => e.url === entry.url) === idx,
)

precacheAndRoute(manifest)
cleanupOutdatedCaches()

// ----------------------
// FIX: SPA fallback HARUS pakai '/index.html'
// ----------------------
const FALLBACK_HTML = '/index.html'
const navigationHandler = createHandlerBoundToURL(FALLBACK_HTML)

registerRoute(
  new NavigationRoute(navigationHandler, {
    denylist: [/^\/workbox-(.)*\.js$/, /^\/__/],
  }),
)

// ----------------------
// API, image, font, static assets caching
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
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 24 * 60 * 60,
      }),
    ],
  }),
)

registerRoute(
  ({ request, url }) =>
    request.destination === 'font' ||
    url.origin.includes('fonts.googleapis.com') ||
    url.origin.includes('fonts.gstatic.com'),
  new CacheFirst({
    cacheName: 'font-cache',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 30,
        maxAgeSeconds: 365 * 24 * 60 * 60,
      }),
    ],
  }),
)

registerRoute(
  ({ request }) => request.destination === 'style' || request.destination === 'script',
  new StaleWhileRevalidate({
    cacheName: 'static-assets-cache',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 7 * 24 * 60 * 60,
      }),
    ],
  }),
)

// Push Notifications
self.addEventListener('push', (event) => {
  const data = event.data?.json() || {}
  const title = data.title || 'Notification'
  const options = {
    body: data.body || 'You have a new message',
    icon: data.icon || '/icons/icon-192x192.png',
    badge: data.badge || '/icons/icon-128x128.png',
    data: data.url || '/',
  }
  event.waitUntil(self.registration.showNotification(title, options))
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const url = event.notification.data
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === url && 'focus' in client) return client.focus()
      }
      if (clients.openWindow) return clients.openWindow(url)
    }),
  )
})

self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting()
})
