<template>
  <div class="search-wrapper">
    <q-select
      v-model="store.params.tahun"
      dense
      outlined
      label="Tahun"
      :options="tahunOptions"
      emit-value
      map-options
      dark
      class="form-input"
      @update:model-value="store.setParams"
    />
  </div>
</template>
<script setup>
import { useHistoryPembayaranStore } from 'src/stores/history/historypembayaran'

const store = useHistoryPembayaranStore()

const tahunOptions = [
  store.params.tahun - 2,
  store.params.tahun - 1,
  store.params.tahun,
  store.params.tahun + 1,
  store.params.tahun + 2,
]
</script>
<style scoped>
.search-wrapper {
  display: flex;
  gap: 12px;
}

.form-input {
  width: 100%;
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