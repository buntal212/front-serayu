<template>
  <q-page class="dashboard-page">
    <!-- Animated background orbs -->
    <div class="bg-orbs">
      <div class="orb orb-1"></div>
      <div class="orb orb-2"></div>
      <div class="orb orb-3"></div>
    </div>

    <div class="dashboard-content">
      <!-- Header -->
      <div class="glass-card">
        <div class="header-row">
          <q-btn flat dense icon="arrow_back" color="white" @click="goHome" class="btn-back" />
          <div class="section-label" style="margin-bottom:0">Data Pembayaran Iuran Bulan</div>
          <q-btn
            round
            dense
            icon="add"
            size="sm"
            class="add-btn"
            @click="emits('add')"
          />
        </div>
      </div>

      <!-- Search & Filter -->
      <div class="glass-card">
        <q-input
          dense
          filled
          v-model="store.params.q"
          placeholder="Cari warga..."
          class="search-input"
          clearable
          @clear="search = ''"
          @update:model-value="store.getlist()"
          dark
        >
          <template #append>
            <q-icon name="search" color="grey-5" />
          </template>
        </q-input>
        <div class="row q-mt-sm q-gutter-sm">
          <div class="col">
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
              :disable="store.loading"
              @update:model-value="store.getlist()"
              class="filter-input"
              dark
            />
          </div>
          <div class="col">
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
              :disable="store.loading"
              @update:model-value="store.getlist()"
              class="filter-input"
              dark
            />
          </div>
        </div>
      </div>

      <!-- Data Cards -->
      <div v-if="store.loading" class="card-grid">
        <SkeletonCard v-for="n in 6" :key="'skeleton-' + n" />
      </div>
      <div v-else class="card-grid">
        <div v-for="w in store.items" :key="w.id" class="glass-card data-card" @click="emits('edit', w)">
          <div class="card-name">{{ w.nama }}</div>
          <div class="card-info">
            <q-icon name="event" size="16px" class="info-icon" />
            <span>{{ getNamaBulan(w?.bulan) }} {{ w?.tahun }}</span>
          </div>
          <div class="card-info">
            <q-icon name="payments" size="16px" class="info-icon" />
            <span>Cara Bayar: {{ w.cara_bayar }}</span>
          </div>
          <div class="card-amount">{{ formatDouble(w.nominal) || '-' }}</div>
          <div class="card-date">{{ humanDate(w.created_at) }}</div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { formatDouble, humanDate } from 'src/modules/formatter'
import SkeletonCard from 'src/pages/componen/SkeletonCard.vue'
import { usePembayaranIuranBulananStore } from 'src/stores/iuranbulanan/iuranbulanan'
import { getNamaBulan } from 'src/utils/dateHelper'

const router = useRouter()
const store = usePembayaranIuranBulananStore()
const emits = defineEmits(['add', 'edit'])

const props = defineProps({
  bulan: {
    type: Object,
    default: null,
  },
})

const tahunOptions = [store.form.tahun - 1, store.form.tahun, store.form.tahun + 1]

function goHome() {
  router.push('/')
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

.dashboard-page {
  position: relative;
  min-height: 100vh;
  background: radial-gradient(circle at top, #020617, #020617 40%, #000000);
  overflow-x: hidden;
  font-family: 'Inter', sans-serif;
  padding-bottom: 32px;
}

.bg-orbs {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
}

.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.25;
  animation: float 8s ease-in-out infinite;
}

.orb-1 {
  width: 280px;
  height: 280px;
  background: #6366f1;
  top: -60px;
  left: -40px;
}

.orb-2 {
  width: 220px;
  height: 220px;
  background: #0ea5e9;
  bottom: -40px;
  right: -30px;
  animation-delay: -3s;
}

.orb-3 {
  width: 180px;
  height: 180px;
  background: #8b5cf6;
  top: 50%;
  left: 60%;
  animation-delay: -5s;
}

@keyframes float {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-30px) scale(1.05); }
}

.dashboard-content {
  position: relative;
  z-index: 1;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  max-width: 560px;
  margin: 0 auto;
}

.glass-card {
  border-radius: 20px;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06), 0 16px 40px rgba(0, 0, 0, 0.5);
  padding: 20px;
  animation: cardSlideIn 0.5s ease-out both;
}

@keyframes cardSlideIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.header-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.btn-back {
  flex-shrink: 0;
}

.add-btn {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: #fff;
  margin-left: auto;
}

.section-label {
  font-size: 16px;
  font-weight: 600;
  color: #e2e8f0;
  letter-spacing: 0.3px;
}

/* Search */
.search-input {
  width: 100%;
}

.search-input :deep(.q-field__control) {
  background: rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.search-input :deep(.q-field__control:hover),
.search-input :deep(.q-field--focused .q-field__control) {
  border-color: #6366f1;
  background: rgba(255, 255, 255, 0.1);
}

.search-input :deep(.q-field__native) {
  color: #e2e8f0;
}

.search-input :deep(.q-field__label) {
  color: #64748b;
}

/* Filter selects */
.filter-input :deep(.q-field__control) {
  background: rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.filter-input :deep(.q-field__control:hover),
.filter-input :deep(.q-field--focused .q-field__control) {
  border-color: #6366f1;
  background: rgba(255, 255, 255, 0.1);
}

.filter-input :deep(.q-field__native),
.filter-input :deep(.q-field__input) {
  color: #e2e8f0;
}

.filter-input :deep(.q-field__label) {
  color: #64748b;
}

/* Card grid */
.card-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 14px;
}

@media (min-width: 480px) {
  .card-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.data-card {
  cursor: pointer;
  transition: all 0.25s ease;
}

.data-card:hover {
  transform: translateY(-4px);
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.12);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.5);
}

.card-name {
  font-size: 16px;
  font-weight: 700;
  color: #f1f5f9;
  margin-bottom: 8px;
}

.card-info {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #94a3b8;
  margin-bottom: 4px;
}

.info-icon {
  color: #6366f1;
}

.card-amount {
  font-size: 18px;
  font-weight: 700;
  color: #a5b4fc;
  margin-top: 8px;
}

.card-date {
  font-size: 12px;
  color: #64748b;
  margin-top: 4px;
}
</style>
