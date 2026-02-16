<template>
  <q-page padding class="dashboard-bg">
    <div class="q-mb-md">
      <q-btn flat icon="arrow_back" color="white" label="Kembali" @click="$router.back()" />
    </div>

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

    <div v-else class="text-center text-white q-mt-xl">Notifikasi tidak ditemukan</div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { usenotifikasiStore } from 'src/stores/notif/notif'

const store = usenotifikasiStore()
const route = useRoute()
const notif = ref(null)

// parsing data_json jika ada
const parsedData = computed(() => {
  try {
    return notif.value?.data_json ? JSON.parse(notif.value.data_json) : null
  } catch (e) {
    console.error('JSON parse error:', e)
    return null
  }
})

const loadNotifDetail = async (id) => {
  // 1. Coba cari di store dulu (pastikan tipe ID sama)
  notif.value = store.notifications.find((n) => String(n.id) === String(id)) || null

  // 2. Kalau gak ada, fetch dari API
  if (!notif.value) {
    try {
      const res = await store.loadNotificationDetail(id)
      notif.value = res
    } catch (e) {
      console.error('Notif tidak ditemukan', e)
      notif.value = null
    }
  }

  // 3. Tandai read via store function (jangan langsung ubah value)
  if (notif.value && Number(notif.value.is_read) === 0) {
    await store.updateNotification(notif.value)
    notif.value.is_read = '1' // update local supaya tampilan langsung read
  }
}

onMounted(() => {
  const id = route.params.id
  if (id) loadNotifDetail(id)
})

const formatDate = (date) => new Date(date).toLocaleString('id-ID')
</script>

<style scoped>
.dashboard-bg {
  background: linear-gradient(160deg, #0f0f0f, #1a1a1a, #111827);
  min-height: 100vh;
}
</style>
