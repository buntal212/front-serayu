import { ref } from 'vue'

export const deferredPrompt = ref(null)
export const showInstallDialog = ref(false)

export default () => {
  window.addEventListener('beforeinstallprompt', (e) => {
    console.log('🔥 beforeinstallprompt fired!')

    // hentikan banner bawaan chrome
    e.preventDefault()

    // simpan event
    deferredPrompt.value = e

    // tampilkan dialog custom
    showInstallDialog.value = true
  })
}
