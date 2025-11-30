<template>
  <q-page class="dashboard-bg q-pa-lg">
    <div class="row justify-center">
      <div class="col-12 col-sm-8 col-md-6">
        <!-- PROFILE CARD -->
        <q-card class="q-pa-lg profile-card">
          <!-- AVATAR -->
          <div class="column items-center">
            <q-avatar size="100px" class="avatar-border">
              <img :src="user.avatar || defaultAvatar" alt="User" />
            </q-avatar>

            <div class="text-h5 text-bold q-mt-sm">
              {{ user.name }}
            </div>
            <div class="text-grey-5 text-subtitle2">
              {{ user.email }}
            </div>
          </div>

          <q-separator spaced />

          <!-- USER DETAIL -->
          <div class="q-mt-md">
            <q-list dense>
              <q-item>
                <q-item-section>
                  <div class="text-grey-5 text-caption">NIK / NO KK</div>
                  <div class="text-body1 text-white">{{ user.nokk || '-' }}</div>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <div class="text-grey-5 text-caption">Username</div>
                  <div class="text-body1 text-white">
                    {{ user.username ? user.username : '-' }}
                  </div>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <div class="text-grey-5 text-caption">Terakhir Update</div>
                  <div class="text-body1 text-white">{{ humanDate(user.updated_at) }}</div>
                </q-item-section>
              </q-item>
            </q-list>
          </div>

          <q-separator spaced />

          <!-- BUTTONS -->
          <div class="row q-gutter-md justify-center q-mt-md">
            <!-- <q-btn color="primary" glossy rounded label="Edit Profil" @click="edit" /> -->
            <q-btn
              color="red"
              glossy
              rounded
              outline
              label="Logout"
              @click="logout"
              class="full-width"
            />
            <q-btn
              color="red"
              glossy
              rounded
              outline
              label="Tambah Dokumen"
              @click="tambahanggota()"
              class="full-width"
            />
          </div>
        </q-card>
      </div>
    </div>
    <DaftarDokumen />
    <!-- <q-dialog v-model="store.dialog">
      <q-card class="form-card">
        <q-card-section>
          <div class="text-h6">Tambahkan Anggota Keluarga</div>
        </q-card-section>

        <q-separator />
        <q-form @submit="simpanrinci">
          <q-card-section style="max-height: 50vh" class="scroll">
            <q-input
              v-model="store.formrinci.nama"
              label="Nama Lengkap"
              dense
              filled
              class="form-input"
              dark
              :rules="[(val) => !!val || 'Wajib diisi']"
            />
            <q-input
              v-model="store.formrinci.noktp"
              label="NO. KTP"
              dense
              filled
              class="form-input"
              dark
              :rules="[(val) => !!val || 'Wajib diisi']"
            />
            <q-uploader
              ref="uploaderRef"
              :key="store.resetUploaderKey"
              style="max-width: 300px"
              label="Masukkan KTP"
              max-file-size="5242880"
              accept=".jpg, .jpeg"
              @added="onFileAdded"
              @rejected="onRejected"
            />
          </q-card-section>

          <q-separator />

          <q-card-actions align="right">
            <q-btn dense label="Cancel" color="primary" v-close-popup />
            <q-btn dense label="Simpan" color="red" type="submit" :loading="store.loadingrinci" />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog> -->
  </q-page>
</template>

<script setup>
import { humanDate } from 'src/modules/formatter'
import { onMounted, ref } from 'vue'
import DaftarDokumen from '../componen/DaftarDokumen.vue'
import { useWargaStore } from 'src/stores/Warga/warga'
import { useRouter } from 'vue-router'
const user = ref({ name: '', email: '', avatar: '' })
const userData = localStorage.getItem('user') || '{}'
user.value = JSON.parse(userData)

const store = useWargaStore()
const router = useRouter()
// function edit() {
//   console.log('edit profile')
// }

function logout() {
  router.push('/logout')
}

function tambahanggota() {
  store.dialog = true
}

const defaultAvatar =
  'https://i0.wp.com/www.rukita.co/stories/wp-content/uploads/2022/04/3b0440d25a78d581953ddc0a1237615e.webp?w=600&ssl=1'

onMounted(() => {
  const rinciandokumen = localStorage.getItem('rincian') || '[]'
  store.itemsrinci = JSON.parse(rinciandokumen)
})
</script>

<style scoped>
.dashboard-bg {
  background: linear-gradient(160deg, #0f0f0f, #1a1a1a, #111827);
  min-height: 100vh;
}

.profile-card {
  background: #1a1a1a;
  border-radius: 18px;
  backdrop-filter: blur(6px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.5);
}
</style>
