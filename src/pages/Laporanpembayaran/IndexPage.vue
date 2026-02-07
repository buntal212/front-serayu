<template>
  <q-page class="dashboard-bg">
    <div class="container">
      <div v-if="storebulan.items.length === 0" class="q-pa-md flex flex-center">
        <q-spinner-dots color="primary" size="3em" />
      </div>

      <div v-else class="q-pa-sm">
        <FormPencarian :bulan="storebulan.items" />

        <q-btn
          label="Export PDF"
          icon="picture_as_pdf"
          color="primary"
          class="full-width q-mb-sm"
          @click="exportToPDF"
        />

        <ListPage />

        <!-- Renderer PDF (HARUS ADA DI DOM) -->
        <Teleport to="body">
          <div ref="pdfRef" class="pdf-capture">
            <LaporanPDF
              :items="store.items"
              :bulanx="Number(store.params.bulan)"
              :tahun="store.params.tahun"
            />
          </div>
        </Teleport>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { nextTick, onMounted, ref } from 'vue'
import html2pdf from 'html2pdf.js'
import FormPencarian from './comp/FormPencarian.vue'
import ListPage from './comp/ListPage.vue'
import LaporanPDF from './comp/LaporanPDF.vue'
import { getNamaBulan } from 'src/utils/dateHelper'
import { useBulanStore } from 'src/stores/bulan'
import { useLapPembayaranIuranStore } from 'src/stores/laporan/lappembayaraniuran'

const storebulan = useBulanStore()
const store = useLapPembayaranIuranStore()
const pdfRef = ref(null)

onMounted(() => {
  storebulan.getlist()
  console.log('pdfEl mounted:', pdfRef.value)
})

async function exportToPDF() {
  const el = pdfRef.value
  if (!store.items || store.items.length === 0) {
    console.warn('Data laporan kosong')
    return
  }
  el.style.display = 'block'
  await nextTick()
  await new Promise((r) => setTimeout(r, 300)) // tunggu render + QR

  const element = pdfRef.value
  if (!(element instanceof HTMLElement)) {
    console.error('PDF element invalid', element)
    return
  }

  const namaBulan = getNamaBulan(store.params.bulan)
  const tahun = store.params.tahun
  const filename = `Laporan_Pembayaran_Iuran_${namaBulan}_${tahun}.pdf`

  const blob = await html2pdf()
    .set({
      margin: [10, 10, 10, 10],
      html2canvas: {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff', // 🔥 WAJIB
      },
      jsPDF: {
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait',
      },
    })
    .from(pdfRef.value)
    .outputPdf('blob')

  el.style.display = 'none'

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
}
</script>
<style scoped>
.dashboard-bg {
  background: radial-gradient(circle at top, #020617, #020617 40%, #000000);
}
.pdf-capture {
  width: 190mm; /* A4 - margin */
  margin: 0 auto;
  background: #ffffff;
  padding: 10mm;
  display: none;
}
</style>
