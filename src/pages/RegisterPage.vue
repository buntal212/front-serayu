<template>
  <q-page class="register-page">
    <!-- Animated background orbs -->
    <div class="bg-orbs">
      <div class="orb orb-1"></div>
      <div class="orb orb-2"></div>
      <div class="orb orb-3"></div>
    </div>

    <!-- Rain Animation -->
    <div class="rain">
      <i v-for="n in drops" :key="n" :style="dropStyle(n)"></i>
    </div>

    <!-- Register Form -->
    <q-form @submit="onSubmit" class="register-wrapper">
      <div class="register-card">
        <!-- Logo / Brand -->
        <div class="brand-section">
          <div class="brand-icon">
            <q-icon name="person_add" size="36px" />
          </div>
          <h2 class="brand-title">Registrasi<br />Warga</h2>
          <p class="brand-subtitle">Perum Bengawan Indah</p>
        </div>

        <!-- Input -->
        <div class="form-fields">
          <div class="input-group">
            <q-icon name="badge" class="input-icon" />
            <input
              v-model="nokk"
              type="text"
              placeholder="Masukkan No KK"
            />
          </div>
        </div>

        <!-- Actions -->
        <div class="action-buttons">
          <q-btn
            label="Cari Data Warga"
            type="submit"
            unelevated
            rounded
            icon="search"
            class="btn-search full-width"
            :loading="loading"
            :disable="loading"
          />

          <q-btn
            label="Kembali ke Login"
            flat
            rounded
            class="btn-back full-width"
            @click="router.push('/login')"
          />
        </div>

        <div class="welcome-text">
          Masukkan Nomor Kartu Keluarga untuk melanjutkan pendaftaran
        </div>
      </div>
    </q-form>
  </q-page>
</template>

<script setup>
import { useQuasar } from 'quasar'
import { api } from 'src/boot/axios'
import { useWargaStore } from 'src/stores/Warga/warga'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const $q = useQuasar()
const drops = 20
const loading = ref(false)
const nokk = ref('')
const router = useRouter()
const store = useWargaStore()

function dropStyle() {
  const left = Math.random() * 100 + '%'
  const duration = (Math.random() * 1 + 0.8).toFixed(2) + 's'
  const delay = (Math.random() * 1).toFixed(2) + 's'
  return {
    left,
    animationDuration: duration,
    animationDelay: delay,
  }
}

async function onSubmit() {
  loading.value = true

  try {
    if (nokk.value === '') {
      $q.notify({ type: 'negative', message: 'No KK tidak boleh kosong' })
      return
    } else {
      const respon = await api.post('/caridatawarga', {
        nokk: nokk.value,
      })
      if (respon.data.data.status === false) {
        $q.notify({ type: 'negative', message: respon.data.data.message })
      } else {
        store.formregister.nokk = nokk.value
        router.push('/formwarga')
      }
    }
  } catch (error) {
    console.error(error)
    $q.notify({ type: 'negative', message: 'Username atau password salah' })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

.register-page {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: radial-gradient(circle at top, #020617, #020617 40%, #000000);
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ============================
   ANIMATED BACKGROUND ORBS
============================ */
.bg-orbs {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 0;
  overflow: hidden;
}

.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.3;
  animation: float 8s ease-in-out infinite;
}

.orb-1 {
  width: 280px;
  height: 280px;
  background: #10b981;
  top: -80px;
  right: -60px;
  animation-delay: 0s;
}

.orb-2 {
  width: 220px;
  height: 220px;
  background: #6366f1;
  bottom: -60px;
  left: -40px;
  animation-delay: -3s;
}

.orb-3 {
  width: 180px;
  height: 180px;
  background: #06b6d4;
  top: 40%;
  left: 20%;
  animation-delay: -5s;
}

@keyframes float {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-30px) scale(1.05); }
}

/* ============================
   RAIN
============================ */
.rain {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  top: 0;
  left: 0;
  z-index: 1;
}

.rain i {
  position: absolute;
  top: -100px;
  width: 2px;
  height: 15px;
  background: rgba(148, 163, 184, 0.4);
  animation: fall linear infinite;
  border-radius: 50%;
}

@keyframes fall {
  0% { top: -100px; opacity: 0; }
  30% { opacity: 1; }
  100% { top: 100vh; opacity: 0; }
}

/* ============================
   REGISTER WRAPPER
============================ */
.register-wrapper {
  position: relative;
  z-index: 2;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

.register-card {
  width: 360px;
  max-width: 92vw;
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 36px 28px;
  border-radius: 24px;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.06),
    0 24px 48px rgba(0, 0, 0, 0.6);
  animation: cardIn 0.6s ease-out;
}

@keyframes cardIn {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.97);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* ============================
   BRAND SECTION
============================ */
.brand-section {
  text-align: center;
}

.brand-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  background: linear-gradient(135deg, #10b981, #06b6d4);
  color: #fff;
  box-shadow: 0 8px 24px rgba(16, 185, 129, 0.35);
}

.brand-title {
  font-family: 'Inter', sans-serif;
  font-size: 1.6em;
  font-weight: 700;
  color: #f1f5f9;
  line-height: 1.3;
  margin: 0;
}

.brand-subtitle {
  font-family: 'Inter', sans-serif;
  font-size: 0.85em;
  color: #94a3b8;
  margin-top: 4px;
}

/* ============================
   FORM FIELDS
============================ */
.form-fields {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.input-group {
  position: relative;
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 14px;
  padding: 0 14px;
  transition: all 0.25s ease;
}

.input-group:focus-within {
  border-color: rgba(16, 185, 129, 0.5);
  background: rgba(255, 255, 255, 0.08);
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.15);
}

.input-icon {
  color: #64748b;
  font-size: 20px;
  flex-shrink: 0;
}

.input-group input {
  flex: 1;
  width: 100%;
  padding: 14px 12px;
  background: transparent;
  border: none;
  font-size: 1em;
  font-family: 'Inter', sans-serif;
  color: #f1f5f9;
  outline: none;
}

.input-group input::placeholder {
  color: #64748b;
}

/* ============================
   ACTION BUTTONS
============================ */
.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.btn-search {
  background: linear-gradient(135deg, #10b981, #06b6d4) !important;
  color: #fff !important;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 1em;
  padding: 12px 0;
  letter-spacing: 0.5px;
  border-radius: 14px !important;
  box-shadow: 0 8px 24px rgba(16, 185, 129, 0.3);
  transition: all 0.25s ease;
}

.btn-search:hover {
  box-shadow: 0 12px 32px rgba(16, 185, 129, 0.45);
  transform: translateY(-1px);
}

.btn-back {
  color: #64748b !important;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 0.9em;
  padding: 10px 0;
  border-radius: 14px !important;
  transition: all 0.25s ease;
}

.btn-back:hover {
  color: #94a3b8 !important;
}

/* ============================
   WELCOME TEXT
============================ */
.welcome-text {
  text-align: center;
  color: #64748b;
  font-family: 'Inter', sans-serif;
  font-size: 0.8em;
  line-height: 1.5;
}

/* ============================
   RESPONSIVE
============================ */
@media (max-width: 400px) {
  .register-card {
    padding: 28px 20px;
    gap: 20px;
  }

  .brand-title {
    font-size: 1.4em;
  }
}
</style>
