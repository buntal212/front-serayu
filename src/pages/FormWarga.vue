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
        <!-- Brand -->
        <div class="brand-section">
          <div class="brand-icon">
            <q-icon name="person_add" size="36px" />
          </div>

          <h2 class="brand-title">
            Perum <br />
            Cluster Serayu
          </h2>

          <p class="brand-subtitle">Sistem Informasi Warga</p>
        </div>

        <!-- Form -->
        <div class="form-fields">
          <div class="input-group">
            <q-icon name="person" class="input-icon" />
            <input v-model="store.formregister.username" type="text" placeholder="Username" />
          </div>

          <div class="input-group">
            <q-icon name="lock" class="input-icon" />
            <input v-model="store.formregister.password" type="password" placeholder="Password" />
          </div>

          <div class="input-group">
            <q-icon name="lock_reset" class="input-icon" />
            <input
              v-model="store.formregister.confirmpassword"
              type="password"
              placeholder="Masukkan Ulang Password"
            />
          </div>
        </div>

        <!-- Button -->
        <div class="action-buttons">
          <q-btn
            label="Register"
            type="submit"
            unelevated
            rounded
            icon="how_to_reg"
            class="btn-register full-width"
            :loading="store.loadingregister"
            :disable="store.loadingregister"
          />
        </div>

        <div class="welcome-text">Selamat Datang Di Sistem Informasi Cluster Serayu</div>
      </div>
    </q-form>
  </q-page>
</template>

<script setup>
import { useQuasar } from 'quasar'

import { useWargaStore } from 'src/stores/Warga/warga'
import { useRouter } from 'vue-router'

const store = useWargaStore()
const router = useRouter()
const $q = useQuasar()

const drops = 20 // jumlah tetesan hujan

// eslint-disable-next-line no-unused-vars
function dropStyle(n) {
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
  if (
    store.formregister.nokk === '' ||
    store.formregister.username === '' ||
    store.formregister.password === '' ||
    store.formregister.confirmpassword === ''
  ) {
    $q.notify({ type: 'negative', message: 'Username dan password tidak boleh kosong' })
    return
  } else if (store.formregister.password !== store.formregister.confirmpassword) {
    $q.notify({ type: 'negative', message: 'Password tidak sama' })
    return
  } else {
    store.simpanregister(router)
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

/* ORBS */
.bg-orbs {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 0;
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
}

.orb-2 {
  width: 220px;
  height: 220px;
  background: #6366f1;
  bottom: -60px;
  left: -40px;
}

.orb-3 {
  width: 180px;
  height: 180px;
  background: #06b6d4;
  top: 40%;
  left: 20%;
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

/* RAIN */
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
  0% {
    top: -100px;
    opacity: 0;
  }
  30% {
    opacity: 1;
  }
  100% {
    top: 100vh;
    opacity: 0;
  }
}

/* WRAPPER */
.register-wrapper {
  position: relative;
  z-index: 2;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
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
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.06),
    0 24px 48px rgba(0, 0, 0, 0.6);
}

/* BRAND */
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
  color: white;
  box-shadow: 0 8px 24px rgba(16, 185, 129, 0.35);
}

.brand-title {
  font-family: 'Inter', sans-serif;
  font-size: 1.6em;
  font-weight: 700;
  color: #f1f5f9;
  line-height: 1.3;
}

.brand-subtitle {
  font-size: 0.85em;
  color: #94a3b8;
  margin-top: 4px;
}

/* FORM */
.form-fields {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.input-group {
  display: flex;
  align-items: center;
  padding: 0 14px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: 0.25s ease;
}

.input-group:focus-within {
  border-color: rgba(16, 185, 129, 0.5);
  background: rgba(255, 255, 255, 0.08);
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.15);
}

.input-icon {
  color: #64748b;
  font-size: 20px;
}

.input-group input {
  flex: 1;
  width: 100%;
  padding: 14px 12px;
  background: transparent;
  border: none;
  outline: none;
  color: #f1f5f9;
  font-size: 1em;
}

.input-group input::placeholder {
  color: #64748b;
}

/* BUTTON */
.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.btn-register {
  background: linear-gradient(135deg, #10b981, #06b6d4) !important;
  color: white !important;
  font-weight: 600;
  padding: 12px 0;
  border-radius: 14px !important;
  box-shadow: 0 8px 24px rgba(16, 185, 129, 0.3);
  transition: 0.25s ease;
}

.btn-register:hover {
  transform: translateY(-1px);
  box-shadow: 0 12px 32px rgba(16, 185, 129, 0.45);
}

/* FOOTER */
.welcome-text {
  text-align: center;
  color: #64748b;
  font-size: 0.8em;
  line-height: 1.5;
}
</style>
