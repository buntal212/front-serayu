<template>
  <q-page class="login-page">
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

    <!-- Login Form -->
    <q-form @submit="onSubmit" class="login-wrapper">
      <div class="login-card">
        <!-- Logo / Brand -->
        <div class="brand-section">
          <div class="brand-icon">
            <q-icon name="home" size="36px" />
          </div>
          <h2 class="brand-title">Cluster Serayu</h2>
          <p class="brand-subtitle">Sistem Informasi</p>
        </div>

        <!-- Inputs -->
        <div class="form-fields">
          <div class="input-group">
            <q-icon name="person" class="input-icon" />
            <input v-model="username" type="text" placeholder="Username" autocomplete="username" />
          </div>

          <div class="input-group">
            <q-icon name="lock" class="input-icon" />
            <input
              v-model="pass"
              :type="showPass ? 'text' : 'password'"
              placeholder="Password"
              autocomplete="current-password"
            />
            <q-btn
              flat
              round
              dense
              :icon="showPass ? 'visibility_off' : 'visibility'"
              class="toggle-pass"
              @click="showPass = !showPass"
            />
          </div>
        </div>

        <!-- Actions -->
        <div class="action-buttons">
          <q-btn
            label="Sign In"
            type="submit"
            unelevated
            rounded
            class="btn-signin full-width"
            :loading="loading"
            :disable="loading"
          />
          <q-btn
            label="Register"
            outline
            rounded
            class="btn-register full-width"
            @click="register()"
          />
        </div>

        <div class="welcome-text">Selamat Datang Di Sistem Informasi Cluster Serayu</div>
      </div>
    </q-form>
  </q-page>
  <q-dialog v-model="showInstallDialog" persistent>
    <q-card style="min-width: 320px; border-radius: 16px">
      <q-card-section class="row items-center q-pb-none">
        <q-icon name="install_mobile" color="primary" size="32px" class="q-mr-sm" />

        <div class="text-h6">Install Aplikasi</div>
      </q-card-section>

      <q-card-section>
        Tambahkan aplikasi Cluster Serayu ke Home Screen agar lebih cepat dan nyaman digunakan.
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Nanti" color="grey" v-close-popup />

        <q-btn label="Install" color="primary" unelevated @click="installApp" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useQuasar } from 'quasar'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { api } from 'src/boot/axios'
import { deferredPrompt, showInstallDialog } from 'boot/a2hs'

async function installApp() {
  if (!deferredPrompt.value) return

  deferredPrompt.value.prompt()

  const { outcome } = await deferredPrompt.value.userChoice

  console.log('INSTALL RESULT:', outcome)

  deferredPrompt.value = null
  showInstallDialog.value = false
}

const username = ref('')
const pass = ref('')
const loading = ref(false)
const showPass = ref(false)

const $q = useQuasar()
const router = useRouter()
const drops = 20

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
    if (username.value === '' || pass.value === '') {
      $q.notify({ type: 'negative', message: 'Username dan password tidak boleh kosong' })
      return
    } else {
      const response = await api.post('/login', {
        username: username.value,
        password: pass.value,
      })

      const token = response.data.token
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
      localStorage.setItem('rincian', JSON.stringify(response.data.rincian))
      localStorage.setItem('menus', JSON.stringify(response.data.menu))

      $q.notify({ type: 'positive', message: 'Login berhasil!' })
      router.push('/')

      // setTimeout(() => {
      //   if (window.deferredPrompt) {
      //     window.deferredPrompt.prompt()
      //     window.deferredPrompt.userChoice.then((choice) => {
      //       console.log('User pilihan:', choice.outcome)
      //       window.deferredPrompt = null
      //     })
      //   }
      // }, 100)
    }
  } catch (error) {
    console.error(error)
    $q.notify({ type: 'negative', message: 'Username atau password salah' })
  } finally {
    loading.value = false
  }
}

function register() {
  router.push('/register')
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

.login-page {
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
  width: 300px;
  height: 300px;
  background: #6366f1;
  top: -80px;
  left: -60px;
  animation-delay: 0s;
}

.orb-2 {
  width: 250px;
  height: 250px;
  background: #0ea5e9;
  bottom: -60px;
  right: -40px;
  animation-delay: -3s;
}

.orb-3 {
  width: 200px;
  height: 200px;
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

/* ============================
   LOGIN WRAPPER
============================ */
.login-wrapper {
  position: relative;
  z-index: 2;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

.login-card {
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
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: #fff;
  box-shadow: 0 8px 24px rgba(99, 102, 241, 0.35);
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
  border-color: rgba(99, 102, 241, 0.5);
  background: rgba(255, 255, 255, 0.08);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
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

.toggle-pass {
  color: #64748b;
  flex-shrink: 0;
}

/* ============================
   ACTION BUTTONS
============================ */
.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.btn-signin {
  background: linear-gradient(135deg, #6366f1, #8b5cf6) !important;
  color: #fff !important;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 1em;
  padding: 12px 0;
  letter-spacing: 0.5px;
  border-radius: 14px !important;
  box-shadow: 0 8px 24px rgba(99, 102, 241, 0.3);
  transition: all 0.25s ease;
}

.btn-signin:hover {
  box-shadow: 0 12px 32px rgba(99, 102, 241, 0.45);
  transform: translateY(-1px);
}

.btn-register {
  color: #94a3b8 !important;
  border-color: rgba(255, 255, 255, 0.15) !important;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 0.95em;
  padding: 11px 0;
  border-radius: 14px !important;
  transition: all 0.25s ease;
}

.btn-register:hover {
  color: #e2e8f0 !important;
  border-color: rgba(255, 255, 255, 0.3) !important;
  background: rgba(255, 255, 255, 0.04);
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
  .login-card {
    padding: 28px 20px;
    gap: 20px;
  }

  .brand-title {
    font-size: 1.4em;
  }
}
</style>
