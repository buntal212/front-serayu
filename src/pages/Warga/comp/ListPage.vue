<template>
  <div class="list-page">
    <!-- Header -->
    <div class="glass-card header-card">
      <div class="header-row">
        <q-btn flat icon="arrow_back" color="white" @click="goHome" />
        <div class="page-title">Data Warga</div>
        <q-btn round dense icon="add" size="sm" class="add-btn" @click="emits('add')" />
      </div>
      <div class="search-row">
        <q-input
          dense
          filled
          v-model="store.params.q"
          placeholder="Cari warga..."
          class="search-input"
          dark
          clearable
          @clear="search = ''"
          @update:model-value="store.getlist()"
        >
          <template #append>
            <q-icon name="search" color="grey-6" />
          </template>
        </q-input>
      </div>
    </div>

    <!-- Grid warga -->
    <div class="warga-grid">
      <template v-if="store.loading">
        <SkeletonCard v-for="n in 6" :key="'skeleton-' + n" />
      </template>
      <template v-else>
        <div v-for="w in store.items" :key="w.id" class="glass-card warga-card" @click="editx(w)">
          <div class="card-top">
            <div class="warga-avatar">
              <q-icon name="family_restroom" size="28px" color="grey-5" />
            </div>
            <q-btn
              round
              dense
              flat
              icon="delete"
              class="delete-btn"
              size="sm"
              @click.stop="emits('hapus', w)"
              :loading="store.loadinghapus && store.rincian.id === w.id"
            />
          </div>
          <div class="warga-name">Keluarga {{ w.name }}</div>
          <div class="warga-nik">No. Rumah: {{ w.nokk || '-' }}</div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { notifError } from 'src/modules/notifs'
import SkeletonCard from 'src/pages/componen/SkeletonCard.vue'
import { useWargaStore } from 'src/stores/Warga/warga'
import { useRouter } from 'vue-router'

const router = useRouter()
const store = useWargaStore()
const emits = defineEmits(['add', 'edit', 'hapus'])

function goHome() {
  router.push('/')
}

function editx(data) {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  // console.log(user.nik)
  if (data.nokk === '3574030506061835' || data.nokk === 3574030506061835) {
    if (user.nik != '11111' || user.nik != 11111) {
      notifError('ANDA TIDAK PUNYA AKSES UNTUK MELIHAT DATA INI...!!!')
    } else {
      emits('edit', data)
    }
  } else {
    emits('edit', data)
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

.list-page {
  padding: 16px;
  max-width: 560px;
  margin: 0 auto;
}

/* Glass card base */
.glass-card {
  border-radius: 20px;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.06),
    0 16px 40px rgba(0, 0, 0, 0.5);
  animation: cardSlideIn 0.5s ease-out both;
}

@keyframes cardSlideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Header card */
.header-card {
  padding: 20px;
  margin-bottom: 16px;
}

.header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.page-title {
  font-size: 18px;
  font-weight: 700;
  color: #f1f5f9;
  font-family: 'Inter', sans-serif;
}

.add-btn {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: #fff;
  border: none;
}

.search-row {
  width: 100%;
}

.search-input {
  width: 100%;
}

.search-input :deep(.q-field__control) {
  background: rgba(255, 255, 255, 0.04);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.search-input :deep(.q-field__control:hover) {
  border-color: rgba(255, 255, 255, 0.15);
}

.search-input :deep(.q-field--focused .q-field__control) {
  border-color: rgba(99, 102, 241, 0.4);
  background: rgba(255, 255, 255, 0.06);
}

/* Warga grid */
.warga-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 14px;
}

/* Warga card */
.warga-card {
  padding: 18px;
  cursor: pointer;
  transition:
    transform 0.25s ease,
    border-color 0.25s ease;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.warga-card:hover {
  transform: translateY(-4px);
  border-color: rgba(99, 102, 241, 0.3);
}

.card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.warga-avatar {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: rgba(99, 102, 241, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
}

.delete-btn {
  color: #f87171;
}

.delete-btn:hover {
  background: rgba(248, 113, 113, 0.1);
}

.warga-name {
  font-size: 14px;
  font-weight: 600;
  color: #e2e8f0;
  font-family: 'Inter', sans-serif;
}

.warga-nik {
  font-size: 12px;
  color: #94a3b8;
  font-family: 'Inter', sans-serif;
}
</style>
