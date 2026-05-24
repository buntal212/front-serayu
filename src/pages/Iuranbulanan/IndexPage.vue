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
          :warga="storewarga.items"
        />
        <FormPage
          v-else
          :data="item"
          @back="isList = true"
          :bulan="storeBulan.items"
          :carabayar="carabayar"
          :warga="storewarga.items"
          :iuran="storeiuran.items"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { usePembayaranIuranBulananStore } from 'src/stores/iuranbulanan/iuranbulanan'
import { onMounted, ref } from 'vue'
import ListPage from './comp/ListPage.vue'
import FormPage from './comp/FormPage.vue'
import { useBulanStore } from 'src/stores/bulan'
import { useWargaStore } from 'src/stores/Warga/warga'
import { useNominalIuranStore } from 'src/stores/nominaliuran'

const isList = ref(true)
const item = ref(null)

const store = usePembayaranIuranBulananStore()
const storeBulan = useBulanStore()
const storewarga = useWargaStore()
const storeiuran = useNominalIuranStore()

const carabayar = [
  { label: 'Tunai', value: 1 },
  { label: 'Transfer', value: 2 },
]

onMounted(() => {
  storeBulan.items = []
  storeBulan.getlist()
  const bulanSekarang = String(new Date().getMonth() + 1).padStart(2, '0')
  if (!store.params.bulan) {
    store.params.bulan = bulanSekarang
    store.getlist()
  }
  store.form.bulan = bulanSekarang
  storewarga.getlist()
  storeiuran.getlist()
})
</script>

<style scoped>
.dashboard-bg {
  min-height: 100vh;
  background:
    radial-gradient(circle at top, rgba(99, 102, 241, 0.18), transparent 35%),
    radial-gradient(circle at bottom right, rgba(14, 165, 233, 0.14), transparent 35%),
    linear-gradient(180deg, #020617 0%, #000000 100%);
}
:deep(.q-page) {
  background: transparent !important;
}
</style>
