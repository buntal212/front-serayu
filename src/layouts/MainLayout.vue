<template>
  <q-layout view="lHh Lpr lFf">
    <!-- Header -->
    <q-header elevated class="header-gradient">
      <q-toolbar>
        <!-- Logo / Icon Kiri -->
        <q-btn flat dense round icon="home" @click="goHome" class="q-mr-sm" />

        <!-- Judul Project -->
        <q-toolbar-title class="text-h6 text-white">
          Sistem Informasi Perumahan Bengawan Indah
        </q-toolbar-title>

        <!-- Menu / Action kanan -->
        <!-- <q-btn flat dense round icon="menu" @click="toggleDrawer" /> -->
      </q-toolbar>
    </q-header>

    <!-- Drawer opsional -->
    <!-- <q-drawer v-model="drawerOpen" side="left" overlay>
      <q-list padding>
        <q-item v-for="item in menuItems" :key="item.name" clickable @click="navigate(item.link)">
          <q-item-section avatar>
            <q-icon :name="item.icon" />
          </q-item-section>
          <q-item-section>{{ item.label }}</q-item-section>
        </q-item>
      </q-list>
    </q-drawer> -->

    <!-- Konten -->
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const menuItems = ref([])
// const drawerOpen = ref(false)

// Ambil data dari localStorage saat layout dimuat
onMounted(() => {
  const storedMenu = localStorage.getItem('menus')
  if (storedMenu) {
    try {
      menuItems.value = JSON.parse(storedMenu)
    } catch (e) {
      console.error('Gagal parse menu dari localStorage', e)
    }
  }

  // Atur back button di PWA: redirect ke home
  window.addEventListener('popstate', () => {
    if (router.currentRoute.value.path !== '/') {
      router.replace('/')
    }
  })
})

// const toggleDrawer = () => (drawerOpen.value = !drawerOpen.value)
// const navigate = (link) => router.push(link)
const goHome = () => router.push('/')
</script>

<style scoped>
.header-gradient {
  background: linear-gradient(160deg, #0f0f0f, #1a1a1a, #111827);
  color: white;
  height: 70px;
}

.q-toolbar-title {
  font-weight: 600;
}
.header-gradient {
  background: linear-gradient(160deg, #0f0f0f, #1a1a1a, #111827);
  color: white;
  height: 50px; /* dikurangi dari 70px */
}

.q-toolbar {
  min-height: 50px; /* pastikan toolbar ikut mengecil */
  padding: 0 12px; /* padding kiri/kanan sedikit */
}

.q-toolbar-title {
  font-weight: 600;
  font-size: 16px; /* bisa disesuaikan, default lebih besar */
}
</style>
