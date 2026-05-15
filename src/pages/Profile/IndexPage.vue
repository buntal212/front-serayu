<template>
  <q-page class="profile-page">
    <!-- Animated background orbs -->
    <div class="bg-orbs">
      <div class="orb orb-1"></div>
      <div class="orb orb-2"></div>
      <div class="orb orb-3"></div>
    </div>
    <div class="back-btn-wrapper">
      <q-btn flat round dense icon="arrow_back" class="back-btn" @click="goHome" />
    </div>
    <div class="profile-content">
      <!-- Profile Card -->
      <div class="glass-card profile-card">
        <div class="profile-top">
          <div class="avatar-ring">
            <q-avatar size="80px">
              <img :src="user.avatar || defaultAvatar" alt="User" />
            </q-avatar>
          </div>
          <div class="profile-name">{{ user.name }}</div>
          <div class="profile-nokk">{{ user.nokk ?? '-' }}</div>
        </div>

        <div class="detail-list">
          <div class="detail-item">
            <div class="detail-label">NIK / NO KK</div>
            <div class="detail-value">{{ user.nokk || '-' }}</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">Username</div>
            <div class="detail-value">{{ user.username || '-' }}</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">Terakhir Update</div>
            <div class="detail-value">{{ humanDate(user.updated_at) }}</div>
          </div>
        </div>

        <div class="btn-group">
          <q-btn class="action-btn logout-btn" outline rounded label="Logout" @click="logout" />
          <!-- <q-btn
            class="action-btn tambah-btn"
            outline
            rounded
            label="Tambah Dokumen"
            @click="tambahanggota()"
          /> -->
        </div>
      </div>

      <!-- Dokumen Section -->
      <!-- <DaftarDokumen :id_heder="Number(user.id)" @hapus="hapusrinci" /> -->
    </div>
  </q-page>
</template>

<script setup>
import { humanDate } from 'src/modules/formatter'
import { onMounted, ref } from 'vue'
// import DaftarDokumen from '../componen/DaftarDokumen.vue'
import { useWargaStore } from 'src/stores/Warga/warga'
import { useRouter } from 'vue-router'
const user = ref({ name: '', email: '', avatar: '' })
const userData = localStorage.getItem('user') || '{}'
user.value = JSON.parse(userData)

const store = useWargaStore()
const router = useRouter()

function logout() {
  router.push('/logout')
}

const goHome = () => {
  router.push('/') // route utama, jika belum login akan trigger auto logout
}

// function tambahanggota() {
//   store.dialog = true
// }

// function hapusrinci(data) {
//   const x = 'profile'
//   store.formrinci.id = data.id
//   store.hapusrinci(data, x)
// }

const defaultAvatar =
  'https://i0.wp.com/www.rukita.co/stories/wp-content/uploads/2022/04/3b0440d25a78d581953ddc0a1237615e.webp?w=600&ssl=1'

onMounted(() => {
  store.itemsrinci = JSON.parse(localStorage.getItem('rincian') || '[]')
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

.profile-page {
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
.profile-content {
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
  padding: 24px 20px;
  animation: cardSlideIn 0.5s ease-out both;
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

/* Profile top section */
.profile-top {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding-bottom: 20px;
}

.avatar-ring {
  padding: 3px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6366f1, #8b5cf6, #0ea5e9);
  margin-bottom: 4px;
}

.profile-name {
  font-size: 20px;
  font-weight: 700;
  color: #f1f5f9;
}

.profile-nokk {
  font-size: 13px;
  color: #94a3b8;
  margin-top: 2px;
}

/* Detail list */
.detail-list {
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  padding: 16px 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.detail-label {
  font-size: 11px;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.detail-value {
  font-size: 15px;
  font-weight: 600;
  color: #e2e8f0;
}

/* Buttons */
.btn-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-top: 20px;
}

.action-btn {
  width: 100%;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.3px;
  padding: 10px 0;
  border-radius: 12px;
}

.logout-btn {
  color: #f87171;
  border-color: rgba(248, 113, 113, 0.3);
}

.logout-btn:hover {
  background: rgba(248, 113, 113, 0.08);
  border-color: rgba(248, 113, 113, 0.5);
}

.tambah-btn {
  color: #818cf8;
  border-color: rgba(129, 140, 248, 0.3);
}

.tambah-btn:hover {
  background: rgba(129, 140, 248, 0.08);
  border-color: rgba(129, 140, 248, 0.5);
}

/* BACK BUTTON */
.back-btn-wrapper {
  display: flex;
  justify-content: flex-start;
  margin-left: 10px;
  margin-top: 10px;
}

.back-btn {
  color: #f8fafc;
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  transition: all 0.25s ease;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.12);
  transform: translateX(-2px);
}
</style>
