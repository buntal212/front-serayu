<template>
  <q-page class="dashboard-bg">
    <div class="container">
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
          :bulan="storeBulan.items"
        />
        <FormPage v-else :data="item" @back="isList = true" :bulan="storeBulan.items" />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import ListPage from './comp/ListPage.vue'
import FormPage from './comp/FormPage.vue'

import { useBulanStore } from 'src/stores/bulan'
import { useBelanjaStore } from 'src/stores/Belanja/belanja'

const isList = ref(true)
const item = ref(null)

const store = useBelanjaStore()
const storeBulan = useBulanStore()

onMounted(() => {
  storeBulan.getlist()
  const bulanSekarang = String(new Date().getMonth() + 1).padStart(2, '0')
  if (!store.params.bulan) {
    store.params.bulan = bulanSekarang
    store.getlist()
  }
  // store.form.bulan = bulanSekarang
  store.getlist()
})
</script>

<style scoped>
.dashboard-bg {
  background: radial-gradient(circle at top, #020617, #020617 40%, #000000);
}
</style>
