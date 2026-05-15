<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
      <q-page padding class="dashboard-bg">
        <!-- Tombol kembali -->
        <div class="q-mb-md">
          <q-btn flat icon="arrow_back" color="white" label="Kembali" @click="goHome" />
        </div>

        <!-- Notifikasi detail -->
        <q-card v-if="notif" class="bg-dark text-white shadow-10">
          <q-card-section>
            <div class="text-h6 text-weight-bold">{{ notif.title }}</div>
            <div class="text-grey-5 text-caption q-mt-xs">{{ formatDate(notif.created_at) }}</div>
          </q-card-section>

          <q-separator dark />

          <q-card-section>
            <div class="text-body1">
              {{ notif.message }} <br />
              NO. Transaksi : {{ parsedData?.notrans }}
            </div>
          </q-card-section>
        </q-card>

        <!-- Jika tidak ada notifikasi -->
        <div v-else class="text-center text-white q-mt-xl">Notifikasi tidak ditemukan</div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usenotifikasiStore } from 'src/stores/notif/notif'

const route = useRoute()
const router = useRouter()
const store = usenotifikasiStore()

const notif = ref(null)

// Ambil ID dari route param
const id = route.params.id

// Parsing JSON dari data_json
const parsedData = computed(() => {
  try {
    return notif.value?.data_json ? JSON.parse(notif.value.data_json) : null
  } catch (e) {
    console.error('JSON parse error:', e)
    return null
  }
})

// Load detail notifikasi
const loadNotifDetail = async (id) => {
  // 1️⃣ Cari dulu di store
  notif.value = store.notifications.find((n) => String(n.id) === String(id)) || null

  // 2️⃣ Kalau tidak ada, fetch dari API
  if (!notif.value) {
    try {
      const res = await store.loadNotificationDetail(id)
      notif.value = res
    } catch (e) {
      console.error('Notif tidak ditemukan', e)
      notif.value = null
    }
  }

  // 3️⃣ Tandai sudah dibaca
  if (notif.value && Number(notif.value.is_read) === 0) {
    await store.updateNotification(notif.value)
    notif.value.is_read = '1'
  }
}

// Load ketika mounted
onMounted(() => {
  if (id) loadNotifDetail(id)
})

// Format tanggal
const formatDate = (date) => new Date(date).toLocaleString('id-ID')

// Fungsi tombol kembali
const goHome = () => {
  router.push('/notif') // route utama, jika belum login akan trigger auto logout
}
</script>

<style scoped>
.dashboard-bg {
  background: linear-gradient(160deg, #0f0f0f, #1a1a1a, #111827);
  min-height: 100vh;
}
</style>
