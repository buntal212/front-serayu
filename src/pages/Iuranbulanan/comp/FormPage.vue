<template>
  <div class="form-page q-pa-md">
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
        <q-select
          v-model="store.form.bulan"
          round
          dense
          outlined
          label="Pembayaran Bulan"
          :options="bulan"
          option-label="nama"
          option-value="kode"
          emit-value
          map-options
          class="form-input"
          dark
          readonly
          :rules="[(val) => !!val || 'Nama wajib diisi']"
        />

        <q-select
          v-model="store.form.tahun"
          round
          dense
          outlined
          label="Pembayaran Tahun"
          :options="tahunOptions"
          option-label="nama"
          option-value="id"
          emit-value
          map-options
          class="form-input"
          dark
          readonly
          :rules="[(val) => !!val || 'Nama wajib diisi']"
        />

        <q-select
          v-model="store.form.warga_id"
          dense
          outlined
          label="Nama Warga"
          :options="options"
          option-label="name"
          option-value="id"
          emit-value
          map-options
          use-input
          clearable
          class="form-input"
          dark
          @filter="filterWarga"
          @update:model-value="(val) => namawarga(val)"
          :rules="[(val) => !!val || 'No. Ktp wajib diisi']"
        />

        <q-select
          v-model="store.form.jeniskewargaan"
          round
          dense
          outlined
          label="jenis Kewargaan"
          :options="props.iuran"
          option-label="jenis"
          option-value="id"
          emit-value
          map-options
          class="form-input"
          dark
          @update:model-value="(val) => carinominal(val)"
          :rules="[(val) => !!val || 'No. Ktp wajib diisi']"
        />

        <q-input
          v-model="store.form.jumlah"
          round
          dense
          outlined
          type="number"
          disable
          label="Jumlah"
          class="form-input"
          dark
          :rules="[(val) => !!val || 'No. Ktp wajib diisi']"
        />

        <q-select
          v-model="store.form.carabayar"
          round
          dense
          outlined
          label="Cara Bayar"
          :options="props.carabayar"
          option-label="label"
          option-value="label"
          emit-value
          map-options
          class="form-input"
          dark
          :rules="[(val) => !!val || 'No. Ktp wajib diisi']"
        />

        <div class="q-mt-lg flex justify-between">
          <q-btn label="Reset" color="grey-7" flat class="btn-reset" />
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
  </div>
</template>

<script setup>
import { usePembayaranIuranBulananStore } from 'src/stores/iuranbulanan/iuranbulanan'
import { computed, onMounted, ref } from 'vue'

const store = usePembayaranIuranBulananStore()
const emits = defineEmits(['back'])

const props = defineProps({
  data: {
    type: Object,
    default: null,
  },
  bulan: {
    type: Object,
    default: null,
  },
  iuran: {
    type: Object,
    default: null,
  },
  warga: {
    type: Object,
    default: null,
  },
  carabayar: {
    type: Object,
    default: null,
  },
})

const tahunOptions = computed(() => {
  const options = []
  const tahunIni = store.form.tahun || new Date().getFullYear()
  for (let t = tahunIni - 1; t <= tahunIni + 1; t++) {
    options.push({ id: t, nama: t.toString() })
  }
  return options
})

const options = ref([props.warga])

function filterWarga(val, update) {
  if (val === '') {
    update(() => {
      options.value = props.warga
    })
    return
  }
  update(() => {
    const needle = val.toLowerCase()

    options.value = props.warga.filter((v) => v.name.toString().toLowerCase().indexOf(needle) > -1)
  })
}

function carinominal(val) {
  const data = props.iuran.find((v) => v.id === val)
  store.form.jumlah = data.nominal
}

function namawarga(val) {
  const data = props.warga.find((v) => v.id === val)
  store.form.nama = data.name
}

function onSubmit() {
  store.simpan()
}

onMounted(() => {
  // store.initReset()
  // const stringdulu = store.form.bulan.toString()

  // const sasa = props.bulan?.find((v) => v.kode === stringdulu)
  // store.form.bulan = sasa.kode
  store.form.bulan = store.params.bulan
  store.form.tahun = store.params.tahun
})
</script>

<style scoped>
.form-page {
  padding: 16px;
  max-width: 560px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 14px;
  position: relative;
  z-index: 2;
}
.form-card {
  border-radius: 20px;

  background: rgba(15, 23, 42, 0.28);

  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);

  border: 1px solid rgba(255, 255, 255, 0.08);

  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.04),
    0 16px 40px rgba(0, 0, 0, 0.35);

  color: #fff;
}

/* Input */
.form-input {
  margin-bottom: 18px;
}

.form-input :deep(.q-field__control) {
  background: rgba(15, 23, 42, 0.5);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  transition: all 0.2s;
}

.form-input :deep(.q-field__control:hover),
.form-input :deep(.q-field--focused .q-field__control) {
  background: rgba(15, 23, 42, 0.7);
  border-color: rgba(167, 139, 250, 0.3);
  box-shadow: 0 0 0 3px rgba(167, 139, 250, 0.1);
}

.form-input :deep(.q-field__label) {
  color: rgba(255, 255, 255, 0.5);
}

.form-input :deep(.q-field__native),
.form-input :deep(.q-field__input) {
  color: #fff;
}

/* Button */
.btn-submit {
  border-radius: 14px;
  padding: 10px 30px;
  font-weight: 600;
  letter-spacing: 0.3px;
}

.btn-reset {
  border-radius: 14px;
  padding: 10px 30px;
  color: rgba(255, 255, 255, 0.5);
  font-weight: 500;
}
</style>
