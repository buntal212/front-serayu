<template>
  <q-page class="dashboard-page">
    <!-- Animated background orbs -->
    <div class="bg-orbs">
      <div class="orb orb-1"></div>
      <div class="orb orb-2"></div>
      <div class="orb orb-3"></div>
    </div>

    <div class="dashboard-content">
      <div v-if="storebulan.items.length === 0" class="q-pa-md flex flex-center loading-wrapper">
        <q-spinner-dots color="primary" size="3em" />
      </div>

      <div v-else>
        <div class="glass-card search-section q-mb-sm">
          <div class="header-section">
            <q-btn round dense flat icon="arrow_back" class="back-btn" @click="$router.back()" />

            <div class="section-label">Filter Laporan</div>
          </div>
          <FormPencarian :bulan="storebulan.items" />

          <q-btn
            label="Export PDF"
            icon="picture_as_pdf"
            color="primary"
            class="export-btn full-width"
            @click="exportToPDF"
            unelevated
          />
        </div>

        <div class="list-section">
          <ListPage />
        </div>

        <!-- Versi PDF tersembunyi -->
        <div style="display: none">
          <LaporanPDF
            ref="pdfRef"
            :qrKetua="qrKetua"
            :qrBendahara="qrBendahara"
            :items="store.items"
            :bulanx="Number(store.params.bulan)"
            :tahun="store.params.tahun"
            :saldoawal="store.saldoawal"
            :tanggaltutupsaldo="store.tanggaltutupsaldo"
          />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import html2pdf from 'html2pdf.js'
import FormPencarian from './comp/FormPencarian.vue'
import ListPage from './comp/ListPage.vue'
import LaporanPDF from './comp/LaporanPDF.vue'
import { getNamaBulan } from 'src/utils/dateHelper'
import { useBulanStore } from 'src/stores/bulan'
import { useLapKasStore } from 'src/stores/laporan/laporankas'
import QRCode from 'qrcode'

const storebulan = useBulanStore()
const store = useLapKasStore()
const pdfRef = ref(null)
const qrKetua = ref('')
const qrBendahara = ref('')

onMounted(async () => {
  qrKetua.value = await QRCode.toDataURL('Ketua')
  qrBendahara.value = await QRCode.toDataURL('Bendahara')
})
onMounted(() => {
  storebulan.items = []
  storebulan.getlist()
})

async function exportToPDF() {
  const element = pdfRef.value?.$el
  if (!element) return

  const namaBulan = getNamaBulan(store.params.bulan)
  const tahun = store.params.tahun
  const filename = `Kas_${namaBulan}_${tahun}.pdf`

  const pdf = await html2pdf()
    .set({
      margin: 0.5,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
    })
    .from(element)
    .outputPdf('blob')

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
  await writable.write(pdf)
  await writable.close()
}
</script>
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

.dashboard-page {
  position: relative;
  min-height: 100vh;
  overflow-x: hidden;
  background:
    radial-gradient(circle at top left, rgba(99, 102, 241, 0.15), transparent 30%),
    radial-gradient(circle at bottom right, rgba(14, 165, 233, 0.12), transparent 35%),
    linear-gradient(180deg, #020617 0%, #030712 45%, #000000 100%);
  font-family: 'Inter', sans-serif;
  padding: 20px 14px 40px;
}

/* =========================
   BACKGROUND ORBS
========================= */

.bg-orbs {
  position: fixed;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
}

.orb {
  position: absolute;
  border-radius: 999px;
  filter: blur(100px);
  opacity: 0.2;
  animation: floating 12s ease-in-out infinite;
}

.orb-1 {
  width: 320px;
  height: 320px;
  background: #6366f1;
  top: -100px;
  left: -100px;
}

.orb-2 {
  width: 260px;
  height: 260px;
  background: #0ea5e9;
  bottom: -80px;
  right: -60px;
  animation-delay: -4s;
}

.orb-3 {
  width: 220px;
  height: 220px;
  background: #8b5cf6;
  top: 45%;
  left: 60%;
  animation-delay: -7s;
}

@keyframes floating {
  0%,
  100% {
    transform: translateY(0px) scale(1);
  }

  50% {
    transform: translateY(-35px) scale(1.08);
  }
}

/* =========================
   CONTENT WRAPPER
========================= */

.dashboard-content {
  position: relative;
  z-index: 2;
  max-width: 700px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

/* =========================
   GLASS CARD
========================= */

.glass-card {
  position: relative;
  overflow: hidden;

  border-radius: 28px;

  background: rgba(15, 23, 42, 0.68);

  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);

  border: 1px solid rgba(255, 255, 255, 0.08);

  box-shadow:
    0 10px 40px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);

  padding: 22px;

  animation: fadeUp 0.45s ease;
}

/* glow */
.glass-card::before {
  content: '';
  position: absolute;
  width: 180px;
  height: 180px;
  background: rgba(99, 102, 241, 0.12);
  border-radius: 50%;
  top: -90px;
  right: -90px;
  filter: blur(25px);
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(22px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* =========================
   SEARCH SECTION
========================= */

.search-section {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

/* title */
.section-label {
  font-size: 20px;
  font-weight: 700;
  color: #f8fafc;
  letter-spacing: 0.3px;
}

/* =========================
   EXPORT BUTTON
========================= */

.export-btn {
  height: 52px;
  border-radius: 18px;
  font-weight: 700;
  letter-spacing: 0.3px;

  background: linear-gradient(135deg, #6366f1, #8b5cf6);

  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease;
}

.export-btn:hover {
  transform: translateY(-3px);

  box-shadow:
    0 10px 25px rgba(99, 102, 241, 0.35),
    0 0 18px rgba(139, 92, 246, 0.2);
}

.export-btn:active {
  transform: scale(0.98);
}

/* =========================
   LIST SECTION
========================= */

.list-section {
  padding: 14px;
}

/* =========================
   LOADING
========================= */

.loading-wrapper {
  min-height: 250px;

  border-radius: 28px;

  background: rgba(15, 23, 42, 0.68);

  backdrop-filter: blur(24px);

  border: 1px solid rgba(255, 255, 255, 0.08);

  box-shadow:
    0 10px 40px rgba(0, 0, 0, 0.35),
    inset 0 1px 0 rgba(255, 255, 255, 0.04);
}

/* =========================
   MOBILE
========================= */

@media (max-width: 768px) {
  .dashboard-page {
    padding: 14px 10px 30px;
  }

  .glass-card {
    padding: 18px;
    border-radius: 24px;
  }

  .section-label {
    font-size: 18px;
  }

  .export-btn {
    height: 48px;
    border-radius: 16px;
  }
}

.header-section {
  display: flex;
  align-items: center;
  gap: 5px;
}

.back-btn {
  width: 38px;
  height: 38px;

  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.08);

  color: #f8fafc;

  backdrop-filter: blur(12px);

  transition: all 0.25s ease;
}

.back-btn:hover {
  transform: translateX(-2px);

  background: rgba(99, 102, 241, 0.18);

  border-color: rgba(99, 102, 241, 0.3);

  box-shadow: 0 6px 18px rgba(99, 102, 241, 0.2);
}

.section-label {
  font-size: 20px;
  font-weight: 700;
  color: #f8fafc;
  letter-spacing: 0.3px;
}
</style>
