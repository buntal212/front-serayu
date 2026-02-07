<template>
  <q-page class="dashboard-bg"
    ><div class="q-mb-md">
      <div class="text-h5 text-white q-mb-sm">
        Data Belanja
        <q-btn
          glossy
          round
          color="red"
          icon="add"
          size="sm"
          push
          @click="emits('add')"
          unelevated
        />
      </div>
      <div class="row items-center q-gutter-sm">
        <q-input
          dense
          filled
          v-model="store.params.q"
          placeholder="Cari belanja..."
          class="search-input"
          clearable
          @clear="search = ''"
          @update:model-value="store.getlist()"
          :style="{ background: 'white', color: '#000', borderRadius: '8px' }"
        >
          <template #append>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
      <div class="row q-mt-xs q-gutter-xs">
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
            :disable="store.loading"
            @update:model-value="store.getlist()"
            class="search-input select-white"
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
            :disable="store.loading"
            @update:model-value="store.getlist()"
            class="search-input select-white"
          />
        </div>
      </div>
    </div>
    <div class="warga-grid">
      <template v-if="store.loading">
        <SkeletonCard v-for="n in 6" :key="'skeleton-' + n" />
      </template>
      <template v-else>
        <q-card
          v-for="(w, index) in store.items"
          :key="w.id || index"
          flat
          bordered
          class="warga-card q-pa-md"
          @click="emits('edit', w)"
        >
          <div class="warga-name">{{ w.notrans }}</div>

          <div class="warga-email">
            <q-icon name="event" />
            Tgl: {{ humanDate(w.tgl) }}
          </div>

          <div class="warga-email">
            <q-icon name="category" />
            Jenis: {{ jenisbelanja(w.jenisbelanja) }}
          </div>

          <div class="warga-email">
            <q-icon name="info" />
            Ket: {{ w.keterangan }}
          </div>

          <div class="warga-email">
            <q-icon name="payments" />
            Total: {{ formatRp(w.totalbelanja) }}
          </div>
        </q-card>
      </template>
    </div>
  </q-page>
</template>

<script setup>
import { formatRp, humanDate } from 'src/modules/formatter'
import SkeletonCard from 'src/pages/componen/SkeletonCard.vue'
import { useBelanjaStore } from 'src/stores/Belanja/belanja'

const store = useBelanjaStore()
const emits = defineEmits(['add', 'edit'])

const props = defineProps({
  bulan: {
    type: Object,
    default: null,
  },
})

function jenisbelanja(val) {
  if (val === '1' || val === 1) {
    return 'Aset'
  } else if (val === '2' || val === 2) {
    return 'Habis Pakai'
  } else {
    return '-'
  }
}
const tahunOptions = [store.form.tahun - 1, store.form.tahun, store.form.tahun + 1]
</script>

<style scoped>
.dashboard-bg {
  background: linear-gradient(145deg, #0d0d0d, #1b1b1f, #151923);
  min-height: 100vh;
  padding: 18px;
  overflow-x: hidden;
}

/* SEARCH INPUT */
.search-input {
  width: 100%;
  margin-bottom: 10px;
}

.search-input :deep(.q-field__control) {
  background: rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(8px);
  transition: 0.25s;
}

.search-input :deep(.q-field__control:hover),
.search-input :deep(.q-field--focused .q-field__control) {
  background: rgba(255, 255, 255, 0.1);
  border-color: #ff4444;
}

.dashboard-bg {
  background: linear-gradient(145deg, #0b0b0c, #16171d, #0f121a);
  min-height: 100vh;
  padding: 18px;
  overflow-x: hidden;
}

/* SEARCH INPUT */
.search-input :deep(.q-field__control) {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(6px);
  transition: 0.25s ease;
}

.search-input :deep(.q-field__control:hover),
.search-input :deep(.q-field--focused .q-field__control) {
  background: rgba(255, 255, 255, 0.12);
  border-color: #ff5252;
}

/* GRID */
.warga-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 22px;
  margin-top: 18px;
}

/* CARD */
.warga-card {
  border-radius: 20px;
  padding: 20px;
  background: linear-gradient(160deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.03));
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow:
    0 4px 25px rgba(0, 0, 0, 0.5),
    inset 0 0 18px rgba(255, 255, 255, 0.05);
  color: #f5f5f5;

  transition: 0.28s ease;
  transform: translateY(0);
}

.warga-card:hover {
  transform: translateY(-10px);
  box-shadow:
    0 8px 35px rgba(0, 0, 0, 0.75),
    inset 0 0 25px rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.1);
  border-color: #ff4a4a;
}

/* Title */
.warga-name {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 10px;
  color: #ffffff;
  letter-spacing: 0.5px;
  text-shadow: 0 0 6px rgba(255, 255, 255, 0.2);
}

/* Info rows */
.warga-email {
  display: flex;
  align-items: center;
  font-size: 0.95rem;
  opacity: 0.9;
  margin: 4px 0;
  gap: 6px;
}

.warga-email q-icon {
  font-size: 18px;
  opacity: 0.7;
}

/* White select */
.select-white :deep(.q-field__control) {
  background: #ffffff !important;
  color: #000 !important;
  border-radius: 10px;
}

.select-white :deep(.q-field__native) {
  color: #000 !important;
}

.select-white :deep(.q-field__label) {
  color: #444 !important;
}
</style>
