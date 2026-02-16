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
import { initializeApp } from 'firebase/app'
// import { getMessaging, onBackgroundMessage } from 'firebase/messaging/sw'

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
let manifest = self.__WB_MANIFEST.filter(
  (entry, idx, arr) => arr.findIndex((e) => e.url === entry.url) === idx,
)

// Tambahkan index.html secara paksa jika belum ada
if (!manifest.find((e) => e.url === 'index.html')) {
  manifest.push({ url: 'index.html', revision: null })
}

precacheAndRoute(manifest)
cleanupOutdatedCaches()

// ----------------------
// FIX: SPA fallback HARUS pakai '/index.html'
// ----------------------
const navigationHandler = createHandlerBoundToURL('index.html')

registerRoute(
  ({ request }) => request.destination === 'style' || request.destination === 'script',
  new NetworkFirst({
    cacheName: 'static-assets-cache',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 7 * 24 * 60 * 60,
      }),
    ],
  }),
)

registerRoute(
  new NavigationRoute(navigationHandler, {
    denylist: [/^\/workbox-(.)*\.js$/, /^\/__/],
  }),
)

// registerRoute(
//   new NavigationRoute(navigationHandler, {
//     denylist: [/^\/workbox-(.)*\.js$/, /^\/__/],
//   }),
// )

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

// registerRoute(
//   ({ request }) => request.destination === 'style' || request.destination === 'script',
//   new StaleWhileRevalidate({
//     cacheName: 'static-assets-cache',
//     plugins: [
//       new ExpirationPlugin({
//         maxEntries: 50,
//         maxAgeSeconds: 7 * 24 * 60 * 60,
//       }),
//     ],
//   }),
// )

// Push Notifications
// self.addEventListener('push', (event) => {
//   const data = event.data?.json() || {}
//   const title = data.title || 'Notification'
//   const options = {
//     body: data.body || 'You have a new message',
//     icon: data.icon || '/icons/icon-192x192.png',
//     badge: data.badge || '/icons/icon-128x128.png',
//     data: data.url || '/',
//   }
//   event.waitUntil(self.registration.showNotification(title, options))
// })

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

/* =======================
   🔔 FIREBASE FCM
======================= */

// eslint-disable-next-line no-unused-vars
const firebaseApp = initializeApp({
  apiKey: 'AIzaSyASYtJXVc9H_96OZtw6oxUb_-WvZ1zUOYk',
  authDomain: 'perum-bi-app.firebaseapp.com',
  projectId: 'perum-bi-app',
  storageBucket: 'perum-bi-app.firebasestorage.app',
  messagingSenderId: '654914326199',
  appId: '1:654914326199:web:13b79c606e14618044c732',
  measurementId: 'G-V82S7G02L2',
})

// const messaging = getMessaging(firebaseApp)

// onBackgroundMessage(messaging, (payload) => {
//   const title = payload.data?.title || 'Notifikasi'
//   const body = payload.data?.body || ''

//   const url = payload.data?.notrans ? `/transaksi/${payload.data.notrans}` : '/'

//   self.registration.showNotification(title, {
//     body: body,
//     icon: '/icons/icon-192x192.png',
//     badge: '/icons/icon-128x128.png',
//     data: url,
//   })
// })
self.addEventListener('push', function (event) {
  const payload = event.data ? event.data.json() : {}
  // console.log('🔥 PUSH PAYLOAD:', payload)

  const title = payload.notification?.title || payload.data?.title || 'Notifikasi Baru'
  const body = payload.notification?.body || payload.data?.body || ''

  const options = {
    body: body,
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-192x192.png',
    data: payload.data || {}, // penting untuk notificationclick
  }

  event.waitUntil(self.registration.showNotification(title, options))
})

self.addEventListener('notificationclick', function (event) {
  event.notification.close()
  // console.log('Notification click', event)

  // ambil id atau notrans dari data
  const notrans = event.notification.data?.id
  // console.log('notrans', notrans)

  const url = notrans ? `/notif/${notrans}` : '/notif'

  // console.log('notrans', url)

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client) {
          client.focus()
          return client.navigate(url)
        }
      }
      return clients.openWindow(url)
    }),
  )
})

// self.addEventListener('push', (event) => {
//   if (!event.data) return

//   const payload = event.data.json()
//   console.log('🔥 PUSH PAYLOAD:', event.data.json())

//   const title = payload.data?.title || 'Notifikasi'
//   const body = payload.data?.body || ''
//   const url = payload.data?.notrans ? `/notif/comp/NotifDetailPage/${payload.data.notrans}` : '/'

//   event.waitUntil(
//     self.registration.showNotification(title, {
//       body: body,
//       icon: '/icons/icon-192x192.png',
//       badge: '/icons/icon-128x128.png',
//       data: url,
//     }),
//   )
// })
