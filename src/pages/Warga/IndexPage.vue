<template>
  <q-page class="warga-page">
    <!-- Animated background orbs -->
    <div class="bg-orbs">
      <div class="orb orb-1"></div>
      <div class="orb orb-2"></div>
      <div class="orb orb-3"></div>
    </div>
    <div class="warga-content">
      <div>
        <ListPage
          v-if="isList"
          @add="
            () => {
              item = null
              isList = false
            }
          "
          @edit="
            (data) => {
              item = data
              isList = false
            }
          "
          @hapus="hapusWarga($event)"
        />
        <FormPage v-else :data="item" @back="isList = true" />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useWargaStore } from 'src/stores/Warga/warga'
import FormPage from './comp/FormPage.vue'
import ListPage from './comp/ListPage.vue'

const store = useWargaStore()
const isList = ref(true)
const item = ref(null)

function hapusWarga(data) {
  store.form.id = data.id
  store.hapus(data.id)
}
onMounted(() => {
  store.getlist()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
.dashboard-bg {
  min-height: 100vh;
  background: radial-gradient(circle at top, #020617, #020617 40%, #000000);
}

.container {
  padding: 16px;
}
.warga-page {
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
.warga-content {
  position: relative;
  z-index: 1;
}
</style>
