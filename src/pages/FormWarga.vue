<template>
  <q-page class="flex flex-center bg-dark">
    <!-- Rain Animation -->
    <div class="rain">
      <i v-for="n in drops" :key="n" :style="dropStyle(n)"></i>
    </div>

    <!-- Login Form -->
    <q-form @submit="onSubmit" class="login-wrapper">
      <div class="login">
        <h2>Perum <br />Bengawan Indah</h2>

        <div class="inputBx">
          <input v-model="store.formregister.username" type="text" placeholder="Username" />
        </div>
        <div class="inputBx">
          <input v-model="store.formregister.password" type="password" placeholder="Password" />
        </div>
        <div class="inputBx">
          <input
            v-model="store.formregister.confirmpassword"
            type="password"
            placeholder="Masukkan Ulang Password"
          />
        </div>

        <div class="inputBx">
          <q-btn
            label="Register"
            type="submit"
            color="primary"
            glossy
            rounded
            class="full-width"
            :loading="store.loadingregister"
            :disable="store.loadingregister"
          />
        </div>
        <div class="links text-white">Selamat Datang Di Sistem Informasi Cluster Serayu</div>
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
@import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@300&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Quicksand', sans-serif;
}

.q-page {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

/* Rain Animation */
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
  background: rgba(214, 218, 218, 0.6);
  animation: fall linear infinite;
  border-radius: 50%;
}

.rain i:nth-child(1) {
  left: 5%;
  animation-duration: 1s;
  animation-delay: 0s;
}
.rain i:nth-child(2) {
  left: 15%;
  animation-duration: 1.2s;
  animation-delay: 0.3s;
}
.rain i:nth-child(3) {
  left: 25%;
  animation-duration: 0.9s;
  animation-delay: 0.5s;
}
.rain i:nth-child(4) {
  left: 35%;
  animation-duration: 1.1s;
  animation-delay: 0.2s;
}
.rain i:nth-child(5) {
  left: 45%;
  animation-duration: 1.3s;
  animation-delay: 0.7s;
}
.rain i:nth-child(6) {
  left: 55%;
  animation-duration: 0.8s;
  animation-delay: 0.4s;
}
.rain i:nth-child(7) {
  left: 65%;
  animation-duration: 1.4s;
  animation-delay: 0.1s;
}
.rain i:nth-child(8) {
  left: 75%;
  animation-duration: 1.2s;
  animation-delay: 0.6s;
}
.rain i:nth-child(9) {
  left: 85%;
  animation-duration: 1s;
  animation-delay: 0.8s;
}
.rain i:nth-child(10) {
  left: 95%;
  animation-duration: 1.3s;
  animation-delay: 0.3s;
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

/* Login Form */
.login-wrapper {
  position: relative;
  z-index: 2;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

.login {
  position: relative;
  width: 300px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  background: rgba(0, 0, 0, 0.6);
  padding: 30px;
  border-radius: 20px;
}

.login h2 {
  font-size: 2em;
  color: #fff;
  text-align: center;
}

.inputBx {
  position: relative;
  width: 100%;
}

.inputBx input {
  width: 100%;
  padding: 12px 20px;
  background: transparent;
  border: 2px solid #fff;
  border-radius: 40px;
  font-size: 1.2em;
  color: #fff;
  outline: none;
}

.inputBx input::placeholder {
  color: rgba(255, 255, 255, 0.75);
}

.inputBx .q-btn {
  width: 100%;
}

.links {
  text-align: center;
  color: #fff;
  font-size: 0.9em;
}
</style>
