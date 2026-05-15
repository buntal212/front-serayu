<template>
  <div class="form-page">
    <!-- Form Card -->
    <div class="glass-card form-section">
      <div class="back-row">
        <q-btn
          flat
          dense
          icon="arrow_back"
          label="Kembali"
          class="btn-back"
          @click="emits('back')"
        />
      </div>

      <div class="form-title">Form Data Warga</div>

      <q-form @submit="onSubmit">
        <q-input
          v-model="store.form.nama"
          label="Nama Lengkap"
          dense
          filled
          class="form-input"
          dark
          :rules="[(val) => !!val || 'Wajib diisi']"
        />
        <q-input
          v-model="store.form.nokk"
          label="NO. KK"
          dense
          filled
          class="form-input"
          dark
          :rules="[(val) => !!val || 'Wajib diisi']"
        />
        <div class="btn-group">
          <q-btn
            type="submit"
            label="Simpan"
            class="btn-save full-width"
            :loading="store.loading"
          />
          <q-btn
            v-if="store.form.id"
            label="Tambah Dokumen Anggota Keluarga"
            class="btn-add full-width"
            @click="tambahanggota(localx?.name, store.form.nokk)"
          />
        </div>
      </q-form>
    </div>

    <!-- Documents section -->
    <div v-if="localx?.name === 'Programer'" class="glass-card docs-section">
      <DaftarDokumen @hapus="hapusrinci" :id_heder="Number(store.form.id)" />
    </div>
    <div v-else class="glass-card docs-section">
      <div class="access-denied" v-if="store.form.nokk === '3574030701890001'">
        <q-icon name="lock" size="32px" color="red-4" />
        <span>Akses Ditolak</span>
      </div>
      <div v-else>
        <DaftarDokumen @hapus="hapusrinci" :id_heder="store.form.id" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { notifError } from 'src/modules/notifs'
import DaftarDokumen from 'src/pages/componen/DaftarDokumen.vue'
import { useWargaStore } from 'src/stores/Warga/warga'
import { onMounted, ref, watch } from 'vue'

const localx = JSON.parse(localStorage.getItem('user') || '{}')
const store = useWargaStore()
const props = defineProps({
  data: {
    type: Object,
    default: null,
  },
})

const emits = defineEmits(['back'])

const uploaderRef = ref(null)

function onSubmit() {
  store.simpan()
}

function tambahanggota(yangakses, yangdiakses) {
  if (yangdiakses === '' || yangdiakses === null) {
    notifError('Isi Dulu No KKnya...!!!')
  } else {
    if (yangakses === 'Programer') {
      store.dialog = true
      store.formrinci.nokk = yangdiakses
    } else {
      if (yangdiakses === '3574030701890001') {
        notifError('Akses Ditolak...!!!')
      } else {
        store.dialog = true
        store.formrinci.nokk = yangdiakses
      }
    }
  }
}

function hapusrinci(data) {
  store.formrinci.id = data.id
  store.hapusrinci(data)
}

watch(
  () => store.resetUploaderKey,
  () => {
    if (uploaderRef.value) {
      uploaderRef.value.reset()
    }
  },
)

onMounted(() => {
  if (props.data) {
    store.form.nama = props.data?.name
    store.form.nokk = props.data?.nokk
    store.form.id = props.data?.id
    store.itemsrinci = props.data?.rincian
  } else {
    store.initReset()
    store.itemsrinci = []
  }
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

.form-page {
  padding: 16px;
  max-width: 560px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

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

/* Form section */
.form-section {
  padding: 24px;
}

.back-row {
  margin-bottom: 10px;
}

.btn-back {
  color: #94a3b8;
  font-family: 'Inter', sans-serif;
  font-size: 13px;
}

.btn-back:hover {
  color: #e2e8f0;
}

.form-title {
  font-size: 18px;
  font-weight: 700;
  color: #f1f5f9;
  text-align: center;
  margin-bottom: 20px;
  font-family: 'Inter', sans-serif;
}

/* Input */
.form-input {
  margin-bottom: 16px;
}

.form-input :deep(.q-field__control) {
  background: rgba(255, 255, 255, 0.04);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  transition: all 0.2s;
}

.form-input :deep(.q-field__control:hover) {
  border-color: rgba(255, 255, 255, 0.15);
}

.form-input :deep(.q-field--focused .q-field__control) {
  border-color: rgba(99, 102, 241, 0.4);
  background: rgba(255, 255, 255, 0.06);
}

/* Buttons */
.btn-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 24px;
}

.btn-save {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: #fff;
  border-radius: 14px;
  padding: 10px 20px;
  font-weight: 600;
  font-family: 'Inter', sans-serif;
  border: none;
}

.btn-add {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: #fff;
  border-radius: 14px;
  padding: 10px 20px;
  font-weight: 600;
  font-family: 'Inter', sans-serif;
  border: none;
}

/* Documents section */
.docs-section {
  padding: 20px;
  animation-delay: 0.15s;
}

.access-denied {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 20px;
  color: #f87171;
  font-size: 14px;
  font-weight: 600;
  font-family: 'Inter', sans-serif;
}
</style>
