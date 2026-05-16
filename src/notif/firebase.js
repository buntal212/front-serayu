import { initializeApp } from 'firebase/app'
import { getMessaging, getToken, onMessage } from 'firebase/messaging'
import { usenotifikasiStore } from 'src/stores/notif/notif'

const firebaseConfig = {
  apiKey: 'AIzaSyC6_ai8KJCJ8ydwZB-jGI8GI71cE7Lx9HY',
  authDomain: 'cluster-serayu.firebaseapp.com',
  projectId: 'cluster-serayu',
  storageBucket: 'cluster-serayu.firebasestorage.app',
  messagingSenderId: '493948301355',
  appId: '1:493948301355:web:e14fc0e5245b2e04d0ba6e',
  measurementId: 'G-BR7ZP3WW4L',
}

const app = initializeApp(firebaseConfig)
const messaging = getMessaging(app)

export async function requestFcmToken() {
  const permission = await Notification.requestPermission()
  if (permission !== 'granted') {
    console.warn('Notif ditolak user')
    return null
  }

  const registration = await navigator.serviceWorker.ready
  const token = await getToken(messaging, {
    vapidKey:
      'BEY8m6CxHQgDZiSnvHwjTdHqo6jT6ZNoWpKWKLdnnhniIcXmXmWgd3u75e9ZX8pvDlygy9Bb60OY4gufGxztp7E',
    serviceWorkerRegistration: registration,
  })

  console.log('🔥 FCM TOKEN:', token)
  const store = usenotifikasiStore()
  store.simpantoken(token)
  return token
}

// foreground
onMessage(messaging, (payload) => {
  console.log('📩 Foreground message:', payload)
})
