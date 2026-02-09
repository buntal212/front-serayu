<template>
  <AppLoader :show="pageLoading" />
  <q-page class="dashboard-bg" padding>
    <!-- Profil User -->
    <q-card flat bordered class="profile-card q-mb-md">
      <div class="profile-bg">
        <div class="profile-avatar">
          <q-avatar size="80px" class="avatar-border">
            <img :src="user.avatar || defaultAvatar" alt="User" />
          </q-avatar>
        </div>
        <div class="profile-info">
          <div class="text-h6">{{ user.name }}</div>
          <div class="text-subtitle2">{{ user.nokk }}</div>
        </div>
      </div>
    </q-card>

    <!-- Menu Grid -->
    <q-card flat bordered class="menu-container q-pa-md">
      <q-card-section>
        <div class="menu-grid">
          <q-card
            v-for="item in menuItems"
            :key="item.name"
            class="menu-card"
            flat
            bordered
            clickable
            v-ripple
            :style="{ background: item.color }"
            @click="navigate(item.link)"
          >
            <q-card-section class="row items-center justify-center">
              <q-icon :name="item.icon" size="36px" class="text-white" />
            </q-card-section>
            <q-card-section class="text-center">
              <div class="menu-label">{{ item.label }}</div>
            </q-card-section>
          </q-card>
        </div>
      </q-card-section>
    </q-card>

    <!-- Waktu Shalat -->
    <q-card flat bordered class="shalat-card q-pa-md q-mb-md">
      <div class="text-h6 text-white text-center q-mb-sm">Jadwal Shalat Hari Ini</div>

      <div class="shalat-grid">
        <div v-for="(waktu, nama) in storecuaca.items" :key="nama" class="shalat-item">
          <div class="shalat-nama">{{ nama }}</div>
          <div class="shalat-waktu">{{ waktu }}</div>
        </div>
      </div>
    </q-card>

    <!-- Cuaca Card -->
    <q-card flat bordered class="cuaca-card q-pa-md">
      <div v-for="(group, tanggal) in groupedCuaca" :key="tanggal" class="q-mb-xl">
        <div class="text-h8 text-white q-mb-sm text-weight-bold text-center">
          Prakiraan Cuaca PERUM Bengawan Indah pada Tanggal
          <span class="text-h6"> {{ tanggal }}</span>
        </div>

        <div class="cuaca-table text-italic">
          <div class="cuaca-row header">
            <div align="center">Jam</div>
            <div align="center">Suhu</div>
            <div align="center">Cuaca</div>
            <div align="center">Icon</div>
          </div>

          <div class="cuaca-row" v-for="(item, i) in group" :key="i">
            <div align="center">{{ item.jam }}</div>
            <div align="center">{{ item.suhu }}°C</div>
            <div align="center">{{ item.cuaca }}</div>
            <div align="center"><img :src="item.image" width="40" /></div>
          </div>
        </div>
      </div>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCuacaStore } from 'src/stores/cuaca'
import { storeToRefs } from 'pinia'
import AppLoader from './componen/AppLoader.vue'
import { useAutoLogout } from 'src/boot/autologout'
import { requestFcmToken } from 'src/notif/firebase'

const router = useRouter()
const pageLoading = ref(true)
const storecuaca = useCuacaStore()
useAutoLogout(router)

const defaultAvatar =
  'https://i0.wp.com/www.rukita.co/stories/wp-content/uploads/2022/04/3b0440d25a78d581953ddc0a1237615e.webp?w=600&ssl=1'

const user = ref({ name: '', email: '', avatar: '' })
const menuItems = ref([])

// Navigasi SPA aman
const navigate = (link) => router.push(link)

onMounted(async () => {
  pageLoading.value = true

  // Ambil user dari localStorage
  try {
    const userData = localStorage.getItem('user') || '{}'
    user.value = JSON.parse(userData)
  } catch (e) {
    console.error('Gagal parsing user data', e)
  }

  // Ambil menu dari localStorage
  try {
    const menuData = localStorage.getItem('menus') || '[]'
    const parsedMenu = JSON.parse(menuData)
    if (Array.isArray(parsedMenu)) menuItems.value = parsedMenu
  } catch (e) {
    console.error('Gagal parsing menu data', e)
  }

  // Ambil data cuaca
  await storecuaca.getCuaca()
  storecuaca.jadwatshalat()
  pageLoading.value = false
})

const { listJam } = storeToRefs(storecuaca)
const groupedCuaca = computed(() =>
  listJam.value.reduce((acc, item) => {
    ;(acc[item.tanggal] = acc[item.tanggal] || []).push(item)
    return acc
  }, {}),
)

onMounted(async () => {
  const token = await requestFcmToken()
  console.log('🔥 TOKEN FINAL:', token)
})
</script>

<style scoped>
.dashboard-bg {
  background: radial-gradient(circle at top, #020617, #020617 40%, #000000);
  min-height: 100vh;
  padding: 16px;
}

/* ===============================
   CARD GLOBAL STYLE
================================ */
.profile-card,
.menu-container,
.shalat-card,
.cuaca-card {
  border-radius: 20px;
  background: linear-gradient(145deg, #0f172a, #020617);
  backdrop-filter: blur(14px);
  border: 1px solid rgba(255, 255, 255, 0.06);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.05),
    0 12px 30px rgba(0, 0, 0, 0.7);
}

/* ===============================
   PROFILE
================================ */
.profile-card {
  margin-bottom: 16px;
}

.profile-bg {
  padding: 24px 16px 18px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.profile-info div {
  color: #e5e7eb;
}

/* ===============================
   MENU
================================ */
.menu-container {
  margin-bottom: 20px;
}

.menu-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 16px;
}

.menu-card {
  width: 120px;
  height: 120px;
  border-radius: 16px;
  /* background: linear-gradient(
    145deg,
    rgba(255, 255, 255, 0.08),
    rgba(255, 255, 255, 0.03)
  ) !important; */
  display: flex;
  flex-direction: column;
  justify-content: center;
  transition: all 0.25s ease;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.menu-card:hover {
  transform: translateY(-6px) scale(1.03);
  box-shadow: 0 14px 32px rgba(0, 0, 0, 0.85);
}

.menu-label {
  color: #f8fafc;
  font-weight: 600;
}

/* ===============================
   SHALAT
================================ */
.shalat-card {
  margin-bottom: 20px;
}

.shalat-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(90px, 1fr));
  gap: 12px;
  margin-top: 10px;
}

.shalat-item {
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.04));
  border-radius: 14px;
  padding: 12px 6px;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.shalat-nama {
  font-size: 13px;
  color: #c7d2fe;
  font-weight: 600;
}

.shalat-waktu {
  font-size: 17px;
  font-weight: bold;
  color: #ffffff;
}

/* ===============================
   CUACA
================================ */
.cuaca-card {
  margin-bottom: 24px;
}

.cuaca-table {
  width: 100%;
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.cuaca-row {
  display: grid;
  grid-template-columns: 70px 60px 70px 80px 1fr;
  padding: 10px 12px;
  align-items: center;
  background: rgba(255, 255, 255, 0.04);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  color: #f8fafc;
}

.cuaca-row:last-child {
  border-bottom: none;
}

.cuaca-row.header {
  background: rgba(255, 255, 255, 0.14);
  font-weight: bold;
  text-align: center;
}

/* ===============================
   RESPONSIVE
================================ */
@media (min-width: 600px) {
  .menu-card {
    width: 140px;
    height: 140px;
  }
}
</style>
