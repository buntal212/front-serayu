<template>
  <AppLoader :show="pageLoading" />
  <q-page class="dashboard-page">
    <!-- Animated background orbs -->
    <div class="bg-orbs">
      <div class="orb orb-1"></div>
      <div class="orb orb-2"></div>
      <div class="orb orb-3"></div>
    </div>

    <div class="dashboard-content">
      <!-- Profile Card -->
      <div class="glass-card profile-card">
        <div class="profile-inner">
          <div class="avatar-ring">
            <q-avatar size="72px">
              <img :src="user.avatar || defaultAvatar" alt="User" />
            </q-avatar>
          </div>
          <div class="profile-details">
            <div class="profile-name">{{ user.name }}</div>
            <div class="profile-nokk">{{ user.nokk }}</div>
          </div>
        </div>
      </div>

      <!-- Menu Grid -->
      <div class="glass-card menu-section">
        <div class="section-label">Menu</div>
        <div class="menu-grid">
          <div
            v-for="item in menuItems"
            :key="item.name"
            class="menu-item"
            :style="{ '--accent': item.color }"
            @click="navigate(item.link)"
          >
            <div class="menu-icon-box">
              <q-icon :name="item.icon" size="30px" class="menu-icon" />
              <q-badge
                v-if="item.name === 'notif' && storenotif.unreadCount > 0"
                class="notif-badge"
                :label="storenotif.unreadCount > 9 ? '9+' : storenotif.unreadCount"
              />
            </div>
            <div class="menu-label">{{ item.label }}</div>
          </div>
        </div>
      </div>

      <!-- Shalat Card -->
      <div class="glass-card shalat-section">
        <div class="section-label text-center">Jadwal Shalat Hari Ini</div>
        <div class="shalat-grid">
          <div v-for="(waktu, nama) in storecuaca.items" :key="nama" class="shalat-item">
            <div class="shalat-nama">{{ nama }}</div>
            <div class="shalat-waktu">{{ waktu }}</div>
          </div>
        </div>
      </div>

      <!-- Cuaca Card -->
      <div class="glass-card cuaca-section">
        <div v-for="(group, tanggal) in groupedCuaca" :key="tanggal">
          <div class="section-label text-center">
            Prakiraan Cuaca — <span class="accent">{{ tanggal }}</span>
          </div>

          <div class="cuaca-table">
            <div class="cuaca-row header">
              <div>Jam</div>
              <div>Suhu</div>
              <div>Cuaca</div>
              <div>Icon</div>
            </div>
            <div class="cuaca-row" v-for="(item, i) in group" :key="i">
              <div>{{ item.jam }}</div>
              <div>{{ item.suhu }}°C</div>
              <div>{{ item.cuaca }}</div>
              <div><img :src="item.image" width="36" /></div>
            </div>
          </div>
        </div>
      </div>
    </div>
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
import { usenotifikasiStore } from 'src/stores/notif/notif'

const router = useRouter()
const pageLoading = ref(true)
const storecuaca = useCuacaStore()
const storenotif = usenotifikasiStore()
useAutoLogout(router)

const defaultAvatar =
  'https://i0.wp.com/www.rukita.co/stories/wp-content/uploads/2022/04/3b0440d25a78d581953ddc0a1237615e.webp?w=600&ssl=1'

const user = ref({ name: '', email: '', avatar: '' })
const menuItems = ref([])

const navigate = (link) => router.push(link)

onMounted(async () => {
  pageLoading.value = true

  try {
    const userData = localStorage.getItem('user') || '{}'
    user.value = JSON.parse(userData)
  } catch (e) {
    console.error('Gagal parsing user data', e)
  }

  try {
    const menuData = localStorage.getItem('menus') || '[]'
    const parsedMenu = JSON.parse(menuData)
    if (Array.isArray(parsedMenu)) menuItems.value = parsedMenu
  } catch (e) {
    console.error('Gagal parsing menu data', e)
  }

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
  storenotif.getUnreadCount
  console.log('🔥 TOKEN FINAL:', token)
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

.dashboard-page {
  position: relative;
  min-height: 100vh;
  background: radial-gradient(circle at top, #020617, #020617 40%, #000000);
  overflow-x: hidden;
  font-family: 'Inter', sans-serif;
  padding-bottom: 32px;
}

/* Animated background orbs */
.bg-orbs {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
}

.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.25;
  animation: float 8s ease-in-out infinite;
}

.orb-1 {
  width: 280px;
  height: 280px;
  background: #6366f1;
  top: -60px;
  left: -40px;
}

.orb-2 {
  width: 220px;
  height: 220px;
  background: #0ea5e9;
  bottom: -40px;
  right: -30px;
  animation-delay: -3s;
}

.orb-3 {
  width: 180px;
  height: 180px;
  background: #8b5cf6;
  top: 50%;
  left: 60%;
  animation-delay: -5s;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0) scale(1);
  }
  50% {
    transform: translateY(-30px) scale(1.05);
  }
}

/* Content wrapper */
.dashboard-content {
  position: relative;
  z-index: 1;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 560px;
  margin: 0 auto;
}

/* Glass card base */
.glass-card {
  border-radius: 20px;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.06),
    0 16px 40px rgba(0, 0, 0, 0.5);
  padding: 20px;
  animation: cardSlideIn 0.5s ease-out both;
}

.glass-card:nth-child(1) {
  animation-delay: 0s;
}
.glass-card:nth-child(2) {
  animation-delay: 0.08s;
}
.glass-card:nth-child(3) {
  animation-delay: 0.16s;
}
.glass-card:nth-child(4) {
  animation-delay: 0.24s;
}

@keyframes cardSlideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Section label */
.section-label {
  font-size: 16px;
  font-weight: 600;
  color: #e2e8f0;
  margin-bottom: 14px;
  letter-spacing: 0.3px;
}

.accent {
  color: #818cf8;
  font-weight: 700;
}

/* Profile */
.profile-inner {
  display: flex;
  align-items: center;
  gap: 16px;
}

.avatar-ring {
  padding: 3px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6366f1, #8b5cf6, #0ea5e9);
  flex-shrink: 0;
}

.profile-name {
  font-size: 18px;
  font-weight: 700;
  color: #f1f5f9;
}

.profile-nokk {
  font-size: 13px;
  color: #94a3b8;
  margin-top: 2px;
}

/* Menu grid */
.menu-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
}

.menu-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px 8px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.06);
  cursor: pointer;
  transition: all 0.25s ease;
}

.menu-item:hover {
  transform: translateY(-4px);
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.12);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.5);
}

.menu-item:active {
  transform: translateY(0) scale(0.97);
}

.menu-icon-box {
  position: relative;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 14px;
  background: var(--accent, linear-gradient(135deg, #6366f1, #8b5cf6));
}

.menu-icon {
  color: #fff;
}

.menu-label {
  font-size: 12px;
  font-weight: 600;
  color: #cbd5e1;
  text-align: center;
  line-height: 1.2;
}

.notif-badge {
  position: absolute;
  top: -6px;
  right: -20px;
  font-size: 10px;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  border-radius: 8px;
  background: #ef4444;
  color: #fff;
  font-weight: 700;
}

/* Shalat */
.shalat-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: 10px;
}

.shalat-item {
  background: rgba(255, 255, 255, 0.06);
  border-radius: 14px;
  padding: 12px 6px;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.06);
  transition: background 0.2s ease;
}

.shalat-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

.shalat-nama {
  font-size: 12px;
  color: #a5b4fc;
  font-weight: 600;
  margin-bottom: 4px;
}

.shalat-waktu {
  font-size: 16px;
  font-weight: 700;
  color: #f8fafc;
}

/* Cuaca */
.cuaca-table {
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.cuaca-row {
  display: grid;
  grid-template-columns: 60px 60px 1fr 60px;
  padding: 10px 14px;
  align-items: center;
  color: #e2e8f0;
  font-size: 13px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  text-align: center;
}

.cuaca-row:last-child {
  border-bottom: none;
}

.cuaca-row.header {
  background: rgba(99, 102, 241, 0.15);
  font-weight: 700;
  color: #c7d2fe;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Responsive */
@media (min-width: 480px) {
  .menu-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>
