<template>
  <div class="laporan-print">
    <!-- Header -->

    <KopDokumen :namadokumen="namadokumen" />
    <div class="laporan-header">
      <div class="text-center">
        <div class="text-caption">
          Bulan {{ getNamaBulan(bulanx) }} {{ tahun }}<br />
          Dicetak: {{ formatTanggal(new Date()) }}
        </div>
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
          <td>{{ formatDouble(saldoawal) }}</td>
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
import { getNamaBulan } from 'src/utils/dateHelper'
import { computed } from 'vue'

const namadokumen = 'Laporan Kas'
const props = defineProps({
  items: Array,
  bulanx: Number,
  tahun: Number,
  saldoawal: Number,
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
  return props.saldoawal + totalMasuk.value - totalKeluar.value
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
/* Container */
.laporan-print {
  background: #ffffff;
  color: #000;
  padding: 16px;
  font-family: Arial, sans-serif;
}

/* Header */
.laporan-header {
  border-bottom: 2px solid #000;
  padding-bottom: 12px;
  margin-bottom: 16px;
}

.text-h4 {
  font-size: 22px;
}

.text-subtitle {
  font-size: 14px;
  margin-top: 4px;
}

.text-caption {
  font-size: 12px;
  margin-top: 2px;
  opacity: 0.8;
}

.text-bold {
  font-weight: bold;
}

/* Table */
table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
}

th,
td {
  border: 1px solid #000;
  padding: 6px 8px;
  text-align: center;
}

th {
  background: #f0f0f0;
  font-weight: bold;
}

/* Warna Masuk / Keluar */
.masuk {
  color: #008000; /* hijau */
  font-weight: bold;
}

.keluar {
  color: #c00000; /* merah */
  font-weight: bold;
}

/* Striping ringan */
tbody tr:nth-child(odd) {
  background: #fff;
}
tbody tr:nth-child(even) {
  background: #f9f9f9;
}

/* Print optimization */
@media print {
  .laporan-print {
    padding: 0;
  }
  table,
  th,
  td {
    border: 1px solid #000;
    font-size: 12pt;
  }
  th {
    background: #eee;
  }
}

/* Saldo Awal */
.saldo-awal {
  background: #e0e0e0;
  font-weight: bold;
  color: #000;
}

/* Saldo Akhir */
.saldo-akhir {
  background: #d0d0d0;
  font-weight: bold;
  color: #000;
  border-top: 2px solid #000;
}

/* Text align kanan untuk angka */
.text-right {
  text-align: right;
  padding-right: 8px;
}
.ttd-wrapper {
  page-break-before: always; /* 🔥 INI KUNCINYA */
  break-before: page;
  margin-top: 20mm;
}
.qr-box {
  margin-top: 12px;
  text-align: center;
}

.qr-box img {
  width: 120px;
  height: 120px;
  display: block;
  margin: 12px auto;
}
</style>
