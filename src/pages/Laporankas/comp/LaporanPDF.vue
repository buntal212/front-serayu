<template>
  <div class="laporan-print">
    <!-- Header -->

    <KopDokumen :namadokumen="namadokumen" :bulan="bulanx" :tahun="tahun" />
    <div class="laporan-header">
      <div class="text-center">
        <div class="text-caption">Dicetak: {{ formatTanggal(new Date()) }}</div>
      </div>
    </div>

    <!-- Tabel Data -->
    <table>
      <thead>
        <tr>
          <th>TGL</th>
          <th>NO. TRANS</th>
          <th>MASUK</th>
          <th>KELUAR</th>
          <th>SALDO</th>
          <th>KETERANGAN</th>
        </tr>
      </thead>
      <tbody>
        <tr class="saldo-awal">
          <td>{{ formatTanggal(tanggaltutupsaldo) }}</td>
          <td colspan="3"></td>
          <td>{{ formatDouble(props.saldoawal) }}</td>
          <td>SALDO AWAL</td>
        </tr>
        <tr v-for="(item, index) in items" :key="item.notrans || index">
          <td>{{ formatTanggal(item.tanggal) }}</td>
          <td>{{ item.notrans }}</td>
          <td class="masuk">{{ item.jenis === 'masuk' ? formatDouble(item.nominal) : '' }}</td>
          <td class="keluar">{{ item.jenis === 'keluar' ? formatDouble(item.nominal) : '' }}</td>
          <td>{{ formatDouble(item.saldo) }}</td>
          <td>
            {{ item.penjelasan ? `${item.keterangan} (${item.penjelasan})` : item.keterangan }}
          </td>
        </tr>
        <tr class="saldo-akhir">
          <td colspan="2" class="text-right"></td>
          <td>{{ formatDouble(totalMasuk) }}</td>
          <td>{{ formatDouble(totalKeluar) }}</td>
          <td>{{ formatDouble(saldoAkhir) }}</td>
          <td>SALDO AKHIR</td>
        </tr>
      </tbody>
    </table>
    <div class="ttd-wrapper">
      <table class="ttd-table">
        <tr>
          <td class="ttd-col">
            Mengetahui,<br />
            <b>Ketua</b>

            <div class="qr-box">
              <img :src="qrKetua" />
            </div>

            <b>( Ketua )</b>
          </td>

          <td class="ttd-col">
            Dibuat oleh,<br />
            <b>Bendahara</b>

            <div class="qr-box">
              <img :src="qrBendahara" />
            </div>

            <b>( Bendahara )</b>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script setup>
import KopDokumen from 'src/components/KopDokumen.vue'
import { formatDouble } from 'src/modules/formatter'
// import { getNamaBulan } from 'src/utils/dateHelper'
import { computed } from 'vue'

const namadokumen = 'Laporan Kas'
const props = defineProps({
  items: Array,
  bulanx: Number,
  tahun: Number,
  saldoawal: {
    type: Number,
    default: 0,
  },
  tanggaltutupsaldo: String,
  qrKetua: String,
  qrBendahara: String,
})

const totalMasuk = computed(() => {
  return props.items.reduce((acc, item) => acc + (item.jenis === 'masuk' ? item.nominal : 0), 0)
})
const totalKeluar = computed(() => {
  return props.items.reduce((acc, item) => acc + (item.jenis === 'keluar' ? item.nominal : 0), 0)
})
const saldoAkhir = computed(() => {
  return Number(props.saldoawal) + totalMasuk.value - totalKeluar.value
})

function formatTanggal(tanggal) {
  if (!tanggal) return '-'
  const date = new Date(tanggal)
  return date.toLocaleString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>

<style scoped>
/* =========================
   CONTAINER
========================= */
.laporan-print {
  background: #ffffff;
  color: #111827;
  padding: 24px;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 12px;
  line-height: 1.5;
}

/* =========================
   HEADER
========================= */
.laporan-header {
  margin-bottom: 20px;
  padding-bottom: 14px;
  border-bottom: 3px solid #111827;
}

.text-center {
  text-align: center;
}

.text-caption {
  font-size: 12px;
  color: #4b5563;
  margin-top: 4px;
  line-height: 1.6;
}

/* =========================
   TABLE
========================= */
table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

th {
  background: #1f2937;
  color: #ffffff;
  font-size: 11px;
  font-weight: 700;
  padding: 10px 8px;
  border: 1px solid #374151;
  text-transform: uppercase;
  letter-spacing: 0.4px;
}

td {
  border: 1px solid #d1d5db;
  padding: 8px;
  font-size: 11px;
  vertical-align: middle;
}

/* =========================
   COLUMN ALIGN
========================= */
td:nth-child(1),
td:nth-child(2) {
  text-align: center;
}

td:nth-child(3),
td:nth-child(4),
td:nth-child(5) {
  text-align: right;
  font-family: 'Courier New', monospace;
}

td:nth-child(6) {
  text-align: left;
}

/* =========================
   ROW STRIPING
========================= */
tbody tr:nth-child(even) {
  background: #f9fafb;
}

/* =========================
   SALDO AWAL
========================= */
.saldo-awal {
  background: #e5e7eb !important;
  font-weight: 700;
}

.saldo-awal td {
  border-top: 2px solid #6b7280;
}

/* =========================
   SALDO AKHIR
========================= */
.saldo-akhir {
  background: #dbeafe !important;
  font-weight: 700;
}

.saldo-akhir td {
  border-top: 2px solid #2563eb;
  font-size: 12px;
}

/* =========================
   TEXT COLOR
========================= */
.masuk {
  color: #047857;
  font-weight: 700;
}

.keluar {
  color: #b91c1c;
  font-weight: 700;
}

/* =========================
   TTD
========================= */
.ttd-wrapper {
  margin-top: 50px;
}

.ttd-table {
  width: 100%;
  border: none;
}

.ttd-table td {
  border: none;
}

.ttd-col {
  width: 50%;
  text-align: center;
  vertical-align: top;
  font-size: 12px;
}

.qr-box {
  margin: 14px 0;
}

.qr-box img {
  width: 100px;
  height: 100px;
  object-fit: contain;
}

/* =========================
   PRINT
========================= */
@media print {
  .laporan-print {
    padding: 0;
  }

  table {
    page-break-inside: auto;
  }

  tr {
    page-break-inside: avoid;
    page-break-after: auto;
  }

  thead {
    display: table-header-group;
  }

  tfoot {
    display: table-footer-group;
  }

  th {
    background: #1f2937 !important;
    color: #fff !important;
    -webkit-print-color-adjust: exact;
  }

  .saldo-awal,
  .saldo-akhir {
    -webkit-print-color-adjust: exact;
  }
}
</style>
