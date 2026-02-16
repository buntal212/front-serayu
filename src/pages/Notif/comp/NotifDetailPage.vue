<template>
  <!-- <pre class="text-white">{{ store.notificationsdetail }}</pre> -->
  <q-page padding class="dashboard-bg">
    <div class="q-mb-md">
      <q-btn flat icon="arrow_back" color="white" label="Kembali" @click="emits('back')" />
    </div>

    <q-card class="bg-dark text-white shadow-10">
      <q-card-section>
        <div class="text-h6 text-weight-bold">
          {{ store.notificationsdetail?.title }}
        </div>

        <div class="text-grey-5 text-caption q-mt-xs">
          {{ formatDate(store.notificationsdetail?.created_at) }}
        </div>
      </q-card-section>

      <q-separator dark />

      <q-card-section>
        <div class="text-body1">
          {{ store.notificationsdetail?.message }} <br />
          NO. Transaksi :
          {{ parsedData?.notrans }}
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { usenotifikasiStore } from 'src/stores/notif/notif'
import { computed, watch } from 'vue'

const store = usenotifikasiStore()
const emits = defineEmits(['back'])

const formatDate = (date) => {
  return new Date(date).toLocaleString('id-ID')
}

const parsedData = computed(() => {
  try {
    return store.notificationsdetail?.data_json
      ? JSON.parse(store.notificationsdetail.data_json)
      : null
  } catch (e) {
    console.error('JSON parse error:', e)
    return null
  }
})

watch(
  () => store.notificationsdetail,
  (val) => {
    if (val?.is_read === '0') {
      val.is_read = '1'
      store.updateNotification(val)
    }
  },
  { immediate: true },
)
</script>

<style scoped>
.dashboard-bg {
  background: linear-gradient(160deg, #0f0f0f, #1a1a1a, #111827);
  min-height: 100vh;
}
</style>
