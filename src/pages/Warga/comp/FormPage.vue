<template>
  <q-page class="dashboard-bg q-pa-md">
    <!-- <div class="form-container"> -->
    <q-card flat bordered class="form-card q-pa-lg">
      <q-btn
        flat
        dense
        icon="arrow_back"
        label="Kembali"
        class="btn-back q-mb-md"
        @click="emits('back')"
      />

      <div class="text-h5 text-center text-white q-mb-md">Form Data Warga</div>

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
        <div class="q-mt-lg column items-center q-gutter-sm">
          <q-btn
            type="submit"
            label="Simpan"
            color="red-7"
            glossy
            class="btn-submit full-width"
            :loading="store.loading"
          />
          <!-- <div v-if="store.form.id" class="q-mt-sm"> -->
          <q-btn
            v-if="store.form.id"
            label="Tambah Anggota Keluarga"
            color="primary"
            glossy
            class="btn-submit full-width"
            @click="tambahanggota(localx?.name, store.form.nokk)"
          />
          <!-- </div> -->
        </div>
      </q-form>
    </q-card>
    <div v-if="localx?.name === 'Programer'">
      <DaftarDokumen @hapus="hapusrinci" :id_heder="Number(store.form.id)" />
    </div>
    <div v-else>
      <q-card flat bordered class="form-card q-pa-lg q-mt-md">
        <div class="text-h6 q-mb-md text-center" v-if="store.form.nokk === '3574030701890001'">
          Akses Ditolak
        </div>
        <div v-else>
          <DaftarDokumen @hapus="hapusrinci" :id_heder="store.form.id" />
        </div>
      </q-card>
    </div>

    <!-- </div> -->
  </q-page>
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
  // store.formrinci.id_heder = ''
  if (yangakses === 'Programer') {
    store.dialog = true
  } else {
    if (yangdiakses === '3574030701890001') {
      notifError('Akses Ditolak...!!!')
    } else {
      store.dialog = true
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
      uploaderRef.value.reset() // ⬅️ Pemanggilan resmi RESET
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
.form-card {
  border-radius: 20px;
  background: rgba(30, 30, 30, 0.55);
  backdrop-filter: blur(15px);
  box-shadow: 0 4px 22px rgba(0, 0, 0, 0.8);
  color: #fff;
}

/* Input */
.form-input {
  margin-bottom: 18px;
}

.form-input :deep(.q-field__control) {
  background: rgba(255, 255, 255, 0.04);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  transition: all 0.2s;
}

.form-input :deep(.q-field__control:hover),
.form-input :deep(.q-field--focused .q-field__control) {
  background: rgba(255, 255, 255, 0.07);
  border-color: rgba(255, 255, 255, 0.2);
}

/* Button */
.btn-submit {
  border-radius: 14px;
  padding: 8px 25px;
  font-weight: bold;
}

.btn-reset {
  border-radius: 14px;
  padding: 8px 25px;
  color: #bbb;
}
</style>
