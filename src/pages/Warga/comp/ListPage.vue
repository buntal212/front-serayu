<template>
  <q-page class="dashboard-bg">
    <!-- Judul dan search -->
    <div class="q-mb-md">
      <div class="text-h5 text-white q-mb-sm">
        Data Warga
        <q-btn
          glossy
          round
          color="primary"
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
          placeholder="Cari warga..."
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
    </div>

    <!-- Grid warga -->
    <div class="warga-grid">
      <template v-if="store.loading">
        <SkeletonCard v-for="n in 6" :key="'skeleton-' + n" />
      </template>
      <template v-else>
        <q-card
          v-for="w in store.items"
          :key="w.id"
          flat
          bordered
          class="warga-card q-pa-md"
          @click="editx(w)"
        >
          <!-- ROW: Nama + Button Delete -->
          <div class="row items-center justify-between">
            <div class="warga-name">
              {{
                w.nokk === '3574030506061835' || w.nokk === 3574030506061835
                  ? 'Mas ' + w.name
                  : 'Bpk. ' + w.name
              }}
            </div>
          </div>

          <!-- Baris kedua: No. KK -->
          <div class="warga-nik q-mt-sm">No. KK: {{ w.nokk || '-' }}</div>
          <div class="col-6 text-right warga-nik">
            <q-btn
              round
              dense
              flat
              icon="delete"
              color="red"
              size="sm"
              @click.stop="emits('hapus', w)"
              :loading="store.loadinghapus && store.form.id === w.id"
            />
          </div>
        </q-card>
      </template>
    </div>
  </q-page>
</template>

<script setup>
import { notifError } from 'src/modules/notifs'
import SkeletonCard from 'src/pages/componen/SkeletonCard.vue'
import { useWargaStore } from 'src/stores/Warga/warga'

const store = useWargaStore()
const emits = defineEmits(['add', 'edit', 'hapus'])

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
.dashboard-bg {
  background: linear-gradient(160deg, #0f0f0f, #1a1a1a, #111827);
  min-height: 100vh;
  padding: 16px;
  overflow-x: hidden;
}

/* Search input */
.search-input {
  max-width: 400px;
  width: 100%;
  margin-bottom: 5px;
}

/* Grid warga pakai CSS Grid */
.warga-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

/* Card warga */
.warga-card {
  border-radius: 16px;
  background: rgba(30, 30, 30, 0.6);
  backdrop-filter: blur(12px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.8);
  color: #f0f0f0;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}

.warga-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.9);
}

.warga-name {
  font-weight: bold;
  margin-bottom: 4px;
  font-size: 1.1rem;
}

.warga-email,
.warga-nik,
.warga-username {
  font-size: 0.9rem;
  margin-top: 2px;
}
</style>
