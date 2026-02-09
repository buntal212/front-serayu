import { initializeApp } from 'firebase/app'
import { getMessaging, getToken, onMessage } from 'firebase/messaging'
import { usenotifikasiStore } from 'src/stores/notif/notif'

const firebaseConfig = {
  apiKey: 'AIzaSyASYtJXVc9H_96OZtw6oxUb_-WvZ1zUOYk',
  authDomain: 'perum-bi-app.firebaseapp.com',
  projectId: 'perum-bi-app',
  messagingSenderId: '654914326199',
  appId: '1:654914326199:web:13b79c606e14618044c732',
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
      'BFHWPxbE0RvsQhdbImFC_8nMyO3T5HvI42cBbDuDneT81AZl2p1986kkvTOPmU0tyy8SfWVhj15eZUEWLv3bvqs',
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
