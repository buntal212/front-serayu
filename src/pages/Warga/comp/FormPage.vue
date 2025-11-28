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
        <div class="q-mt-lg row items-center">
          <div v-if="store.form.id">
            <q-btn
              label="Tambah Anggota Keluarga"
              color="primary"
              glossy
              dense
              rounded
              @click="tambahanggota()"
            />
          </div>

          <q-space />

          <q-btn
            type="submit"
            label="Simpan"
            color="red-7"
            glossy
            class="btn-submit"
            :loading="store.loading"
          />
        </div>
      </q-form>
    </q-card>

    <DaftarDokumen />
    <!-- </div> -->
  </q-page>
  <q-dialog v-model="store.dialog">
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
  </q-dialog>
</template>

<script setup>
import { useQuasar } from 'quasar'
import DaftarDokumen from 'src/pages/componen/DaftarDokumen.vue'
import { useWargaStore } from 'src/stores/Warga/warga'
import { onMounted, ref } from 'vue'

const store = useWargaStore()
const props = defineProps({
  data: {
    type: Object,
    default: null,
  },
})
const $q = useQuasar()
const emits = defineEmits(['back'])

const uploaderRef = ref(null)

function onSubmit() {
  store.simpan()
}

function simpanrinci() {
  store.formrinci.id_heder = store.form.id
  store.simpanrinci()
}

function tambahanggota() {
  store.dialog = true
}

function onFileAdded(files) {
  store.uploadedFiles = files[0]
  console.log('files', store.uploadedFiles)
}

function onRejected() {
  // Notify plugin needs to be installed
  // https://v2.quasar.dev/quasar-plugins/notify#Installation
  $q.notify({
    type: 'negative',
    message: `File Harus Berformat jpg atau jpeg dan Maksimal 512 Kb`,
  })
}

onMounted(() => {
  console.log('props', props.data)
  if (props.data) {
    store.form.nama = props.data?.name
    store.form.nokk = props.data?.nokk
    store.form.id = props.data?.id
    store.itemsrinci = props.data?.rincian
  } else {
    store.initReset()
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
