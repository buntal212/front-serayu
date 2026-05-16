// composables/useAutoLogout.js
import { useQuasar } from 'quasar'
import { onMounted, onBeforeUnmount } from 'vue'

export function useAutoLogout(router) {
  const $q = useQuasar()
  const TIMEOUT_MINUTES = 24 * 60
  const TIMEOUT_MS = TIMEOUT_MINUTES * 60 * 1000
  let timeout = null

  function resetTimer() {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      localStorage.removeItem('menus')
      sessionStorage.clear()
      $q.notify({ color: 'negative', message: 'Logout otomatis karena tidak ada aktivitas.' })
      router.push('/login')
    }, TIMEOUT_MS)
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

  onMounted(() => {
    addListeners()
    resetTimer()
  })

  onBeforeUnmount(() => {
    removeListeners()
    if (timeout) clearTimeout(timeout)
  })
}
