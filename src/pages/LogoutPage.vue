<template>
  <div class="q-pa-md flex flex-center">
    <q-spinner color="primary" size="40px" />
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { Notify } from 'quasar'
import { onMounted } from 'vue'

const router = useRouter()

onMounted(() => {
  // Bersihkan data
  console.log('logout')
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  localStorage.removeItem('menus')
  localStorage.removeItem('rincian')
  sessionStorage.clear()

  // Tampilkan notifikasi
  Notify.create({
    type: 'negative',
    message: 'Anda telah logout.',
    position: 'top',
  })

  // Redirect ke login
  router.push('/login')
})
</script>
