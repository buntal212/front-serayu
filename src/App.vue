<template>
  <router-view />
</template>

<script setup>
import { useQuasar } from 'quasar'
import { onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const $q = useQuasar()

let timeout = null
const TIMEOUT_MINUTES = 15
const TIMEOUT_MS = TIMEOUT_MINUTES * 60 * 1000

function resetTimer() {
  if (timeout) clearTimeout(timeout)
  timeout = setTimeout(() => {
    handleLogout()
  }, TIMEOUT_MS)
}

function handleLogout() {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  localStorage.removeItem('menus')
  sessionStorage.clear()
  $q.notify({
    color: 'negative',
    message: `Anda telah logout karena tidak ada aktivitas selama ${TIMEOUT_MINUTES} menit.`,
  })
  router.push('/login')
}

function addListeners() {
  window.addEventListener('mousemove', resetTimer)
  window.addEventListener('keydown', resetTimer)
  window.addEventListener('click', resetTimer)
  window.addEventListener('touchstart', resetTimer)
}

function removeListeners() {
  window.removeEventListener('mousemove', resetTimer)
  window.removeEventListener('keydown', resetTimer)
  window.removeEventListener('click', resetTimer)
  window.removeEventListener('touchstart', resetTimer)
}

function handleSWMessage(event) {
  if (event.data?.type === 'OPEN_DETAIL') {
    // const id = event.data.id
    // if (id) {
    // router.push(`/notiflangsung/${id}`)
    router.push(`/notif`)
    // }
  }
}

onMounted(() => {
  navigator.serviceWorker?.addEventListener('message', handleSWMessage)

  resetTimer()
  addListeners()
})

onUnmounted(() => {
  navigator.serviceWorker?.removeEventListener('message', handleSWMessage)
  removeListeners()
  clearTimeout(timeout)
})
</script>
