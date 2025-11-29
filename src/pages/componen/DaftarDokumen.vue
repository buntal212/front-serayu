<template>
  <q-card flat bordered class="form-card q-pa-lg q-mt-md">
    <div class="text-h6 q-mb-md">Dokumen Anggota Keluarga</div>

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
            :loading="store.loadinghapusrinci && store.formrinci.id === x.id"
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
</template>
<script setup>
import { useWargaStore } from 'src/stores/Warga/warga'
import { ref } from 'vue'

const store = useWargaStore()
const dialogFoto = ref(false)
const fotoTerpilih = ref(null)
const emits = defineEmits(['hapus'])

function lihatFoto(url) {
  fotoTerpilih.value = url
  dialogFoto.value = true
}

function downloadPdf(url) {
  window.open(url, '_blank')
}
</script>
