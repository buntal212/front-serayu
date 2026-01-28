<template>
  <q-card class="bg-black text-white">
    <q-card-section>
      <div class="text-h6 text-weight-bold text-center">Laporan Pembayaran Kas</div>
      <q-separator />
      <div class="row q-gutter-xs">
        <div class="col-7">
          <q-select
            v-model="store.params.bulan"
            round
            dense
            outlined
            label="Bulan"
            :options="props.bulan"
            option-label="nama"
            option-value="kode"
            emit-value
            map-options
            class="form-input"
            dark
            @update:model-value="store.setParams"
          />
        </div>
        <div class="col-4">
          <q-select
            v-model="store.params.tahun"
            round
            dense
            outlined
            label="Tahun"
            :options="tahunOptions"
            option-label="nama"
            option-value="id"
            emit-value
            map-options
            dark
            class="form-input"
            @update:model-value="store.setParams"
          />
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>
<script setup>
import { useLapPembayaranIuranStore } from 'src/stores/laporan/lappembayaraniuran'
import { onMounted } from 'vue'
// import { onMounted } from 'vue'

const store = useLapPembayaranIuranStore()

const props = defineProps({
  bulan: {
    type: Object,
    default: null,
  },
})

const tahunOptions = [store.params.tahun - 1, store.params.tahun, store.params.tahun + 1]

onMounted(() => {
  const stringdulu = String(store.params.bulan).padStart(2, '0')
  const sasa = props.bulan?.find((v) => v.kode === stringdulu)
  store.params.bulan = sasa.kode
  store.setParams()
})
</script>
<style scoped>
/* Input */
.form-input {
  margin-bottom: 18px;
}

.form-input :deep(.q-field__control) {
  background: rgba(255, 255, 255, 0.04);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  transition: all 0.2s;
}

.form-input :deep(.q-field__control:hover),
.form-input :deep(.q-field--focused .q-field__control) {
  background: rgba(255, 255, 255, 0.07);
  border-color: rgba(255, 255, 255, 0.2);
}
</style>
