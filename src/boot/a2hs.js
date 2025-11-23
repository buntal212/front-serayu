import { boot } from 'quasar/wrappers'

export default boot(() => {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    console.log('🔥 beforeinstallprompt fired!')
    window.deferredPrompt = e
  })
})
