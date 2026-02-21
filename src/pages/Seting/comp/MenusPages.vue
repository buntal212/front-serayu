<template>
  <div class="bg-primary text-white">
    <q-tabs v-model="model" inline-label mobile-arrows class="shadow-2">
      <q-tab name="tokenfcm" icon="key" label="Token FCM" />
      <q-tab name="notfikasi" icon="notifications" label="Notifikasi" />
      <!-- <q-tab name="tesnotif" icon="send" label="Tes" /> -->
    </q-tabs>
  </div>
</template>

<script setup>
import { usenotifikasiStore } from 'src/stores/notif/notif'
import { watch } from 'vue'

const model = defineModel()
const store = usenotifikasiStore()

watch(model, (val) => {
  if (val === 'notfikasi') {
    store.getNotifikasiall()
  }
})
</script>
