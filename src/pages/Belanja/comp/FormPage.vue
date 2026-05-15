<template>
  <q-page class="form-page">
    <!-- Animated background orbs -->
    <div class="bg-orbs">
      <div class="orb orb-1"></div>
      <div class="orb orb-2"></div>
      <div class="orb orb-3"></div>
    </div>

    <div class="form-content">
      <q-form @submit="onSubmit">
        <!-- Header -->
        <div class="glass-card header-card">
          <div class="row items-center justify-between">
            <q-btn
              flat
              dense
              icon="arrow_back"
              color="white"
              class="btn-back"
              @click="emits('back')"
            />
            <div class="form-title">Form Belanja</div>
            <q-btn
              round
              icon="print"
              size="sm"
              class="print-btn"
              @click="cetak()"
            />
          </div>
          <div class="row text-white text-subtitle2 q-mt-md summary-row">
            <div class="col-6">
              No.: <b>{{ store.form.notrans || '-' }}</b>
            </div>
            <div class="col-6 text-right">
              <q-icon name="paid" size="sm" />
              <b>Rp. {{ formatDouble(store.form.totalbelanja, 0) }}</b>
            </div>
          </div>
        </div>

        <!-- Form Fields -->
        <div class="glass-card">
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
            dense
            outlined
            type="textarea"
            class="form-input"
            dark
            :rules="[(val) => !!val || 'Wajib Diisi...!!!']"
          />

          <q-select
            v-model="store.form.jenisbelanja"
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
        </div>

        <!-- Rincian Belanja -->
        <div class="glass-card">
          <div class="row justify-between items-center q-mb-sm">
            <div class="rincian-title">Rincian Belanja</div>
            <q-btn
              type="submit"
              icon="add"
              size="sm"
              class="add-btn"
              :loading="store.loading"
            />
          </div>

          <div
            v-for="x in store.rincian"
            :key="x.id"
            class="rincian-item"
          >
            <div class="row justify-between items-center q-mb-xs">
              <div class="item-name">{{ x.namabarang }}</div>
              <div class="item-subtotal">
                Rp {{ formatDouble(x.subtotal, 0) }}
                <q-btn
                  icon="delete"
                  color="red"
                  rounded
                  size="sm"
                  dense
                  @click="hapus(x)"
                  :loading="store.loadinghapusrinci && store.rincianid === x.id"
                />
              </div>
            </div>
            <div class="item-detail">
              <span>{{ x.jumlah }} {{ x.satuan }}</span>
              <span class="multiply q-mx-xs">&times;</span>
              <span>Rp {{ formatDouble(x.harga, 0) }}</span>
            </div>
          </div>
        </div>
      </q-form>
    </div>

    <FormRincian @close="store.dialog = false" />
    <div style="display: none">
      <CetakPDF ref="pdfRef" />
    </div>
  </q-page>
</template>

<script setup>
import { useBelanjaStore } from 'src/stores/Belanja/belanja'
import DateInput from 'src/components/DateInput.vue'
import FormRincian from './FormRincian.vue'
import { onMounted, ref } from 'vue'
import { formatDouble } from 'src/modules/formatter'
import CetakPDF from './CetakPDF.vue'
import html2pdf from 'html2pdf.js'

const store = useBelanjaStore()
const emits = defineEmits(['back'])

function onSubmit() {
  store.initResetrincian
  store.dialog = true
}

function hapus(item) {
  store.rincianid = item.id
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

const pdfRef = ref(null)
async function cetak() {
  const element = pdfRef.value?.$el
  if (!element) return

  const filename = `Belanja_${store.form.notrans}_${store.form.tgl}.pdf`

  try {
    const blob = await html2pdf()
      .set({
        margin: 10,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      })
      .from(element)
      .output('blob')

    const handle = await window.showSaveFilePicker({
      suggestedName: filename,
      types: [
        {
          description: 'PDF Files',
          accept: { 'application/pdf': ['.pdf'] },
        },
      ],
    })

    const writable = await handle.createWritable()
    await writable.write(blob)
    await writable.close()
  } catch (err) {
    console.error('Gagal cetak PDF:', err)
  }
}

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
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

.form-page {
  position: relative;
  min-height: 100vh;
  background: radial-gradient(circle at top, #020617, #020617 40%, #000000);
  overflow-x: hidden;
  font-family: 'Inter', sans-serif;
  padding-bottom: 32px;
}

.bg-orbs {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
}

.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.25;
  animation: float 8s ease-in-out infinite;
}

.orb-1 {
  width: 280px;
  height: 280px;
  background: #6366f1;
  top: -60px;
  left: -40px;
}

.orb-2 {
  width: 220px;
  height: 220px;
  background: #0ea5e9;
  bottom: -40px;
  right: -30px;
  animation-delay: -3s;
}

.orb-3 {
  width: 180px;
  height: 180px;
  background: #8b5cf6;
  top: 50%;
  left: 60%;
  animation-delay: -5s;
}

@keyframes float {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-30px) scale(1.05); }
}

.form-content {
  position: relative;
  z-index: 1;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  max-width: 560px;
  margin: 0 auto;
}

.glass-card {
  border-radius: 20px;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06), 0 16px 40px rgba(0, 0, 0, 0.5);
  padding: 20px;
  animation: cardSlideIn 0.5s ease-out both;
}

@keyframes cardSlideIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.header-card {
  animation-delay: 0s;
}

.form-title {
  font-size: 16px;
  font-weight: 600;
  color: #e2e8f0;
  letter-spacing: 0.3px;
}

.btn-back {
  flex-shrink: 0;
}

.print-btn {
  background: linear-gradient(135deg, #0ea5e9, #6366f1);
  color: #fff;
}

.summary-row {
  font-size: 13px;
  color: #94a3b8;
}

/* Form inputs */
.form-input {
  margin-bottom: 18px;
}

.form-input :deep(.q-field__control) {
  background: rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.form-input :deep(.q-field__control:hover),
.form-input :deep(.q-field--focused .q-field__control) {
  border-color: #6366f1;
  background: rgba(255, 255, 255, 0.1);
}

.form-input :deep(.q-field__native),
.form-input :deep(.q-field__input) {
  color: #e2e8f0;
}

.form-input :deep(.q-field__label) {
  color: #64748b;
}

/* Rincian */
.rincian-title {
  font-size: 16px;
  font-weight: 600;
  color: #a5b4fc;
}

.add-btn {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: #fff;
  border-radius: 50%;
}

.rincian-item {
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.06);
  padding: 12px;
  margin-bottom: 8px;
  transition: all 0.2s ease;
}

.rincian-item:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.12);
}

.item-name {
  font-size: 14px;
  font-weight: 600;
  color: #f1f5f9;
}

.item-subtotal {
  font-size: 14px;
  font-weight: 600;
  color: #a5b4fc;
  display: flex;
  align-items: center;
  gap: 6px;
}

.item-detail {
  font-size: 12px;
  color: #94a3b8;
}

.multiply {
  font-weight: 700;
  color: #64748b;
}
</style>
