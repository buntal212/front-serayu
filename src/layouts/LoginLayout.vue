<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <!-- <q-toolbar>
        <q-toolbar-title>Perum App</q-toolbar-title>
      </q-toolbar> -->
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  setTimeout(() => {
    if (window.deferredPrompt) {
      console.log('🔥 Menampilkan prompt Install App...')
      window.deferredPrompt.prompt()

      window.deferredPrompt.userChoice.then((choice) => {
        console.log('User pilihan:', choice.outcome)
        window.deferredPrompt = null
      })
    } else {
      console.log('❗ A2HS belum tersedia')
    }
  }, 500)
})
</script>
