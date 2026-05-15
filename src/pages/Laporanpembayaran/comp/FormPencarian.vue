<template>
  <div class="row q-gutter-sm">
    <div class="col-7">
      <q-select
        v-model="store.params.bulan"
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
</template>
<script setup>
import { useLapPembayaranIuranStore } from 'src/stores/laporan/lappembayaraniuran'
import { onMounted } from 'vue'

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
.form-input {
  margin-bottom: 8px;
}

.form-input :deep(.q-field__control) {
  background: rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  transition: all 0.25s ease;
}

.form-input :deep(.q-field__control:hover),
.form-input :deep(.q-field--focused .q-field__control) {
  background: rgba(255, 255, 255, 0.1);
  border-color: #818cf8;
  box-shadow: 0 0 0 2px rgba(129, 140, 248, 0.1);
}

.form-input :deep(.q-field__label) {
  color: #94a3b8;
}

.form-input :deep(.q-field__native) {
  color: #e2e8f0;
}

.form-input :deep(.q-icon) {
  color: #94a3b8;
}
</style>
