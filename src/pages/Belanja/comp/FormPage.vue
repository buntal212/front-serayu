<template>
  <q-page class="dashboard-bg q-pa-sm">
    <!-- CARD FORM BELANJA -->
    <q-form @submit="onSubmit">
      <q-card flat bordered class="form-card q-pa-sm">
        <!-- Header Form -->
        <div class="row items-center justify-between q-mb-sm">
          <div class="text-h6 text-white">Form Belanja</div>

          <q-btn
            round
            icon="arrow_back"
            color="red-7"
            size="sm"
            glossy
            class="btn-back"
            @click="emits('back')"
          />
        </div>

        <!-- No Transaksi & Total Belanja -->
        <div class="row text-white text-subtitle2 q-mb-md">
          <div class="col-6">
            No.:
            <b>{{ store.form.notrans || '-' }}</b>
          </div>

          <div class="col-6 text-right">
            <q-icon name="paid" size="sm" />
            <b>Rp. {{ formatDouble(store.form.totalbelanja, 0) }}</b>
          </div>
        </div>

        <!-- Form -->

        <date-input
          v-model="store.form.tgl"
          label="Tanggal Transaksi"
          class="form-input"
          dark
          :rules="[(val) => !!val || 'Wajib Diisi...!!!']"
        />

        <q-input
          v-model="store.form.keterangan"
          label="Keterangan Belanja"
          round
          dense
          outlined
          type="textarea"
          class="form-input"
          dark
          :rules="[(val) => !!val || 'Wajib Diisi...!!!']"
        />

        <q-select
          v-model="store.form.jenisbelanja"
          round
          dense
          outlined
          label="Jenis Belanja"
          :options="jenisbelanja"
          option-label="label"
          option-value="value"
          emit-value
          map-options
          use-input
          clearable
          class="form-input"
          dark
          :rules="[(val) => !!val || 'Wajib Diisi...!!!']"
        />

        <q-select
          v-model="store.form.jenispembayaran"
          round
          dense
          outlined
          label="Jenis Pembayaran"
          :options="[
            { label: 'Cash', value: 'Cash' },
            { label: 'Hutang', value: 'Hutang' },
          ]"
          option-label="label"
          option-value="value"
          emit-value
          map-options
          use-input
          clearable
          class="form-input"
          dark
          :rules="[(val) => !!val || 'Wajib Diisi...!!!']"
        />

        <!-- <div class="q-mt-lg flex justify-between">
          <q-btn label="Reset" color="grey-6" flat class="btn-reset" />
          <q-btn
            type="submit"
            label="Simpan"
            color="red-7"
            glossy
            class="btn-submit"
            :loading="store.loading"
          />
        </div> -->
      </q-card>

      <!-- CARD RINCIAN BELANJA -->
      <q-card flat bordered class="detail-card q-pa-sm q-mt-sm rincian-card shadow-2xl soft-card">
        <div class="row justify-between items-center q-mb-md">
          <div class="text-h6 rincian-title text-primary">Rincian Belanja</div>

          <!-- Tombol Tambah -->
          <q-btn
            type="submit"
            icon="add"
            size="sm"
            color="blue-7"
            glossy
            class="btn-submit"
            :loading="store.loading"
          />
        </div>

        <div
          v-for="x in store.rincian"
          :key="x.id"
          class="rincian-item q-pa-sm q-mb-sm shadow-sm soft-item"
        >
          <div class="item-header row justify-between items-center q-mb-xs">
            <div class="item-name text-weight-medium text-dark">{{ x.namabarang }}</div>
            <div class="item-subtotal text-primary text-weight-bold">
              Rp {{ formatDouble(x.subtotal, 0) }} || {{ store.rincian.id }}
              <q-btn
                icon="delete"
                color="red"
                rounded
                size="sm"
                dense
                @click="hapus(x)"
                :loading="store.loadinghapusrinci"
              />
            </div>
          </div>

          <div class="item-detail text-grey-7">
            <span>{{ x.jumlah }}</span>
            <span class="multiply q-mx-xs">×</span>
            <span>Rp {{ formatDouble(x.harga, 0) }}</span>
          </div>
        </div>
      </q-card>
    </q-form>
    <FormRincian @close="store.dialog = false" />
  </q-page>
</template>

<script setup>
import { useBelanjaStore } from 'src/stores/Belanja/belanja'
import DateInput from 'src/components/DateInput.vue'
import FormRincian from './FormRincian.vue'
import { onMounted } from 'vue'
import { formatDouble } from 'src/modules/formatter'

const store = useBelanjaStore()
const emits = defineEmits(['back'])
function onSubmit() {
  store.initResetrincian
  store.dialog = true
}

function hapus(item) {
  store.hapusrincian(item)
}

const props = defineProps({
  bulan: {
    type: Object,
    default: null,
  },
  data: {
    type: Object,
    default: null,
  },
})
const jenisbelanja = [
  { label: 'Aset', value: 1 },
  { label: 'Habis Pakai', value: 2 },
]

onMounted(() => {
  if (props.data) {
    store.form.notrans = props.data?.notrans
    store.form.tgl = props.data?.tgl
    store.form.jenisbelanja = Number(props.data.jenisbelanja)
    store.form.keterangan = props.data.keterangan
    store.form.jenispembayaran = props.data.jenispembayaran
    store.form.totalbelanja = props.data.totalbelanja
    store.form.id = props.data.id
    store.rincian = props.data.rincian
  } else {
    store.initReset()
    store.rincian = []
  }
})
</script>

<style scoped>
/* === FORM CARD === */
.form-card {
  border-radius: 20px;
  background: rgba(30, 30, 30, 0.55);
  backdrop-filter: blur(15px);
  box-shadow: 0 4px 22px rgba(0, 0, 0, 0.8);
  color: #fff;
}

.btn-back {
  border-radius: 50%;
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
  border-color: rgba(255, 255, 255, 0.2);
}

/* Buttons */
.btn-submit,
.btn-reset {
  border-radius: 14px;
  padding: 8px 25px;
  font-weight: bold;
}

/* === DETAIL CARD === */
.detail-card {
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  transition: 0.25s;
}

/* Hover glow */
.detail-card:hover {
  border-color: rgba(255, 255, 255, 0.2);
  box-shadow: 0 0 18px rgba(255, 255, 255, 0.1);
}

/* Label & Value */
.detail-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-label {
  font-size: 14px;
  color: #cbd5e1;
}

.detail-value {
  font-size: 15px;
  font-weight: 600;
  color: #fff;
}
.soft-card {
  border-radius: 20px;
  background: #ffffff;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.05);
}

.rincian-item {
  border-radius: 16px;
  background: #f9fafb;
  border: 1px solid #ececec;
  transition: 0.2s ease;
}

.rincian-item:hover {
  background: #ffffff;
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.06);
}

.item-name {
  font-size: 15px;
}

.item-subtotal {
  font-size: 16px;
}

.item-detail {
  font-size: 13px;
}

.multiply {
  font-weight: bold;
}
</style>
