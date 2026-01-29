<template>
  <q-page class="dashboard-bg q-pa-lg">
    <div class="row justify-center">
      <div class="col-12 col-sm-8 col-md-6">
        <!-- PROFILE CARD -->
        <q-card class="q-pa-lg profile-card">
          <div class="q-pa-md">
            <div class="q-gutter-sm">
              <div class="warga-grid">
                <!-- Skeleton -->
                <template v-if="storewarga.loading">
                  <SkeletonCard v-for="n in 6" :key="'skeleton-' + n" />
                </template>

                <template v-else>
                  <q-card
                    v-for="w in storewarga.items"
                    :key="w.id"
                    flat
                    bordered
                    class="warga-card q-pa-md"
                  >
                    <!-- ROW: Nama + Delete -->
                    <div class="row items-center justify-between">
                      <div class="warga-name">
                        {{
                          w.nokk === '3574030701890001' || w.nokk === 3574030701890001
                            ? 'Mas ' + w.name
                            : 'Bpk. ' + w.name
                        }}
                      </div>

                      <q-btn
                        round
                        dense
                        flat
                        icon="settings"
                        color="red"
                        size="sm"
                        @click="tambahhakakses(w)"
                      />
                    </div>
                  </q-card>
                </template>
              </div>
            </div>
          </div>
        </q-card>
      </div>
    </div>
    <q-dialog v-model="store.dialog">
      <q-card class="form-card flex full-width">
        <q-card-section>
          <div class="text-h6">Hak Akses</div>
        </q-card-section>

        <q-separator />

        <!-- LOADING -->
        <q-card-section v-if="store.loading">
          <div class="row justify-center">
            <q-spinner-dots color="primary" size="2em" />
          </div>
        </q-card-section>

        <!-- CONTENT -->
        <q-form v-else @submit="simpan">
          <q-card-section style="max-height: 50vh" class="scroll">
            <div v-for="x in store.items" :key="x.id">
              <q-checkbox v-model="x.checked" :label="x.label" color="teal" />
            </div>
          </q-card-section>

          <q-separator />

          <q-card-actions align="right">
            <q-btn dense label="Cancel" color="primary" v-close-popup />
            <q-btn dense label="Simpan" color="red" type="submit" :loading="store.loadingsimpan" />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { onMounted } from 'vue'
import { useHakAksesStore } from 'src/stores/hakakses'
import { useWargaStore } from 'src/stores/Warga/warga'
import SkeletonCard from '../componen/SkeletonCard.vue'

const store = useHakAksesStore()
const storewarga = useWargaStore()

function simpan() {
  store.form.id_menu = store.items
    .filter((x) => x.checked) // ambil yang dicentang
    .map((x) => x.id)

  store.simpan()
}

function tambahhakakses(w) {
  store.getlist(w.id)
  store.form.id_warga = w.id
  store.dialog = true
}

onMounted(() => {
  storewarga.getlist()
})
</script>

<style scoped>
.dashboard-bg {
  background: radial-gradient(circle at top, #020617, #020617 40%, #000000);
}

.profile-card {
  background: #1a1a1a;
  border-radius: 18px;
  backdrop-filter: blur(6px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.5);
}

.warga-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

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
  font-size: 1.1rem;
}

.warga-nik {
  font-size: 0.9rem;
  margin-top: 6px;
}
.form-card {
  border-radius: 20px;
  background: rgba(30, 30, 30, 0.55);
  backdrop-filter: blur(15px);
  box-shadow: 0 4px 22px rgba(0, 0, 0, 0.8);
  color: #fff;
}
</style>
