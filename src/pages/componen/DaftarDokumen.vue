<template>
  <div class="glass-card dokumen-section">
    <div class="section-label">Dokumen Anggota Keluarga</div>

    <div class="dokumen-grid">
      <div v-for="(x, index) in store.itemsrinci" :key="index" class="dokumen-item">
        <div class="dokumen-img-wrap" @click="lihatFoto(x.foto)">
          <q-img
            :src="x.foto"
            ratio="1"
            class="dokumen-img"
            spinner-color="#6366f1"
            spinner-size="30px"
          />
        </div>
        <div class="dokumen-name">
          {{ x.jenisdok === 'Kartu Keluarga' ? 'Dokumen KK' : x.nama }}
        </div>
        <div class="dokumen-actions">
          <q-btn dense flat color="light-blue" icon="visibility" @click="downloadPdf(x.foto)" />
          <q-btn
            dense
            flat
            color="red"
            icon="delete"
            @click.stop="emits('hapus', x)"
            :loading="store.loadinghapusrinci && store.formrinci.id === x.id"
          />
        </div>
      </div>
    </div>
  </div>

  <!-- Dialog foto besar -->
  <q-dialog v-model="dialogFoto">
    <q-card class="preview-card">
      <div class="preview-header">
        <div class="preview-title">Preview Dokumen</div>
        <q-btn dense flat round icon="close" color="white" v-close-popup />
      </div>
      <q-img
        :src="fotoTerpilih"
        ratio="1"
        class="preview-img"
        spinner-color="#6366f1"
        spinner-size="30px"
      />
      <div class="preview-footer">
        <q-btn flat label="Tutup" color="#f87171" v-close-popup class="close-btn" />
      </div>
    </q-card>
  </q-dialog>

  <!-- Dialog tambah dokumen -->
  <q-dialog v-model="store.dialog">
    <q-card class="form-card">
      <div class="form-header">
        <div class="form-title">Tambahkan Dokumen Anggota Keluarga</div>
      </div>

      <q-separator style="border-color: rgba(255,255,255,0.06)" />

      <q-form @submit="simpanrinci">
        <div class="form-body">
          <q-select
            v-model="store.formrinci.jenis"
            label="Jenis Dokumen"
            dense
            filled
            class="form-input"
            dark
            :options="['Kartu Keluarga', 'Kartu Tanda Penduduk']"
            :rules="[(val) => !!val || 'Wajib diisi']"
          />
          <q-input
            v-model="store.formrinci.nama"
            label="Nama Lengkap"
            dense
            filled
            class="form-input"
            dark
            :rules="[(val) => !!val || 'Wajib diisi']"
            v-if="store.formrinci.jenis === 'Kartu Tanda Penduduk'"
          />
          <q-input
            v-model="store.formrinci.noktp"
            label="NO. KTP"
            dense
            filled
            class="form-input"
            dark
            :rules="[(val) => !!val || 'Wajib diisi']"
            v-if="store.formrinci.jenis === 'Kartu Tanda Penduduk'"
          />
          <q-uploader
            ref="uploaderRef"
            :key="store.resetUploaderKey"
            style="max-width: 300px"
            label="Masukkan Dokumen"
            max-file-size="5242880"
            accept=".jpg, .jpeg"
            @added="onFileAdded"
            @rejected="onRejected"
          />
        </div>

        <q-separator style="border-color: rgba(255,255,255,0.06)" />

        <div class="form-footer">
          <q-btn dense label="Cancel" color="grey-6" flat v-close-popup />
          <q-btn dense label="Simpan" color="#818cf8" type="submit" :loading="store.loadingrinci" class="save-btn" />
        </div>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useWargaStore } from 'src/stores/Warga/warga'
import { ref } from 'vue'
import { useQuasar } from 'quasar'

const store = useWargaStore()
const dialogFoto = ref(false)
const fotoTerpilih = ref(null)
const emits = defineEmits(['hapus'])
const $q = useQuasar()
const props = defineProps({ id_heder: { type: Number, default: null } })

function lihatFoto(url) {
  fotoTerpilih.value = url
  dialogFoto.value = true
}

function downloadPdf(url) {
  window.open(url, '_blank')
}

function simpanrinci() {
  store.formrinci.id_heder = props.id_heder
  store.simpanrinci()
}

function onFileAdded(files) {
  store.uploadedFiles = files[0]
}

function onRejected() {
  $q.notify({
    type: 'negative',
    message: `File Harus Berformat jpg atau jpeg dan Maksimal 512 Kb`,
  })
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

/* Glass card */
.glass-card {
  border-radius: 20px;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.06),
    0 16px 40px rgba(0, 0, 0, 0.5);
  padding: 20px;
  animation: cardSlideIn 0.5s ease-out 0.15s both;
  font-family: 'Inter', sans-serif;
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

.section-label {
  font-size: 16px;
  font-weight: 600;
  color: #e2e8f0;
  margin-bottom: 14px;
  letter-spacing: 0.3px;
}

/* Dokumen grid */
.dokumen-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.dokumen-item {
  background: rgba(255, 255, 255, 0.04);
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  padding: 10px;
  transition: all 0.25s ease;
}

.dokumen-item:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.12);
  transform: translateY(-2px);
}

.dokumen-img-wrap {
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
}

.dokumen-img {
  border-radius: 10px;
}

.dokumen-name {
  text-align: center;
  margin-top: 8px;
  font-size: 12px;
  font-weight: 600;
  color: #cbd5e1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dokumen-actions {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 6px;
}

/* Preview dialog */
.preview-card {
  background: rgba(15, 23, 42, 0.95) !important;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px !important;
  width: 90vw;
  max-width: 700px;
  color: #e2e8f0;
}

.preview-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
}

.preview-title {
  font-size: 16px;
  font-weight: 700;
  color: #f1f5f9;
}

.preview-img {
  border-radius: 12px;
  max-height: 70vh;
  object-fit: contain;
}

.preview-footer {
  padding: 8px 16px 12px;
  display: flex;
  justify-content: flex-end;
}

.close-btn {
  color: #f87171 !important;
}

/* Form dialog */
.form-card {
  border-radius: 20px !important;
  background: rgba(15, 23, 42, 0.95) !important;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #e2e8f0;
  font-family: 'Inter', sans-serif;
}

.form-header {
  padding: 16px 20px 12px;
}

.form-title {
  font-size: 16px;
  font-weight: 700;
  color: #f1f5f9;
}

.form-body {
  padding: 16px 20px;
  max-height: 50vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.form-input {
  margin-bottom: 4px;
}

.form-footer {
  padding: 12px 20px 16px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.save-btn {
  background: rgba(99, 102, 241, 0.15) !important;
  color: #818cf8 !important;
}

/* Responsive */
@media (min-width: 480px) {
  .dokumen-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
