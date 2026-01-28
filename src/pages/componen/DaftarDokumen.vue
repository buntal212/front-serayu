<template>
  <q-card flat bordered class="form-card q-pa-lg q-mt-md">
    <div class="text-h6 q-mb-md">Dokumen Anggota Keluarga</div>
    <!-- <pre>{{ store.itemsrinci }}</pre> -->
    <div class="row q-col-gutter-md">
      <div v-for="(x, index) in store.itemsrinci" :key="index" class="col-6 col-sm-4 col-md-3">
        <q-card class="img-card q-pa-sm">
          <q-img
            :src="x.foto"
            ratio="1"
            class="rounded-borders"
            spinner-color="red"
            spinner-size="35px"
            @click="lihatFoto(x.foto)"
          />

          <div class="text-center q-mt-sm text-black text-subtitle2 ellipsis">
            {{ x.nama }}
          </div>

          <div class="row justify-around q-mt-sm">
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
        </q-card>
      </div>
    </div>

    <!-- Dialog untuk foto besar -->
    <q-dialog v-model="dialogFoto">
      <q-card class="bg-dark text-white" style="width: 90vw; max-width: 700px; border-radius: 16px">
        <!-- Header -->
        <div class="row items-center justify-between q-pa-sm">
          <div class="text-h6">Preview Dokumen</div>
          <q-btn dense flat round icon="close" color="white" v-close-popup />
        </div>

        <!-- Foto besar -->
        <q-img
          :src="fotoTerpilih"
          ratio="1"
          class="rounded-borders"
          spinner-color="red"
          style="max-height: 70vh; object-fit: contain"
        />

        <!-- Footer -->
        <q-card-actions align="right" class="q-pa-sm">
          <q-btn flat label="Tutup" color="red" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-card>
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
</script>
<style scoped>
.form-card {
  border-radius: 20px;
  background: rgba(30, 30, 30, 0.55);
  backdrop-filter: blur(15px);
  box-shadow: 0 4px 22px rgba(0, 0, 0, 0.8);
  color: #fff;
}
</style>
