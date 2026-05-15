<template>
  <div class="pdf-page">
    <!-- HEADER -->
    <KopDokumen :namadokumen="namadokumen" />

    <!-- TITLE -->
    <div class="report-header">
      <div class="report-title">LAPORAN PEMBAYARAN IURAN</div>

      <div class="report-subtitle">Bulan {{ getNamaBulan(bulanx) }} {{ tahun }}</div>

      <div class="report-date">Digenerete : {{ formatTanggal(new Date()) }}</div>
    </div>

    <!-- TABLE -->
    <table class="report-table">
      <thead>
        <tr>
          <th width="5%">No</th>
          <th width="18%">No Trans</th>
          <th width="20%">Nama</th>
          <th width="15%">Bulan</th>
          <th width="15%">Pembayaran</th>
          <th width="12%">Nominal</th>
          <th width="15%">Tanggal</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="(item, index) in items" :key="item.notrans || index">
          <td class="text-center">
            {{ index + 1 }}
          </td>

          <td>
            {{ item.notrans }}
          </td>

          <td>
            <div class="nama-cell">
              {{ item.nama }}
            </div>

            <div v-if="item.keterangan" class="ket-cell">
              {{ item.keterangan }}
            </div>
          </td>

          <td class="text-center">{{ getNamaBulan(item.bulan) }} {{ item.tahun }}</td>

          <td class="text-center">
            {{ item.cara_bayar }}
          </td>

          <td class="text-right nominal">Rp {{ formatDouble(item.nominal) }}</td>

          <td class="text-center">
            {{ formatTanggal(item.created_at) }}
          </td>
        </tr>
      </tbody>
    </table>

    <!-- FOOTER -->
    <div class="footer-info">
      Total Data : <b>{{ items.length }}</b>
    </div>

    <!-- SIGNATURE -->
    <table class="ttd-table">
      <tr>
        <td class="ttd-col">
          <div class="ttd-city">Mengetahui,</div>

          <div class="ttd-role">Ketua</div>

          <div class="qr-box">
            <img v-if="qrKetua" :src="qrKetua" />
          </div>

          <div class="ttd-name">( Ketua )</div>
        </td>

        <td class="ttd-col">
          <div class="ttd-city">Dibuat Oleh,</div>

          <div class="ttd-role">Bendahara</div>

          <div class="qr-box">
            <img v-if="qrBendahara" :src="qrBendahara" />
          </div>

          <div class="ttd-name">( Bendahara )</div>
        </td>
      </tr>
    </table>
  </div>
</template>

<script setup>
import QRCode from 'qrcode'
import KopDokumen from 'src/components/KopDokumen.vue'
import { formatDouble } from 'src/modules/formatter'
import { getNamaBulan } from 'src/utils/dateHelper'
import { onMounted, ref } from 'vue'

defineProps({
  items: Array,
  bulanx: Number,
  tahun: Number,
})

const namadokumen = 'Laporan Pembayaran Iuran'

function formatTanggal(tanggal) {
  if (!tanggal) return '-'

  const date = new Date(tanggal)

  return date.toLocaleString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const qrKetua = ref('')
const qrBendahara = ref('')

onMounted(async () => {
  qrKetua.value = await QRCode.toDataURL('Ketua')
  qrBendahara.value = await QRCode.toDataURL('Bendahara')
})
</script>

<style scoped>
.pdf-page {
  background: #ffffff;
  color: #111827;
  padding: 10px;
  font-size: 11px;
  line-height: 1.5;
  font-family: Arial, Helvetica, sans-serif;
}

/* ======================
   HEADER
====================== */

.report-header {
  text-align: center;
  margin-top: 10px;
  margin-bottom: 20px;
}

.report-title {
  font-size: 18px;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: #111827;
}

.report-subtitle {
  font-size: 13px;
  margin-top: 4px;
  color: #374151;
}

.report-date {
  margin-top: 6px;
  font-size: 11px;
  color: #6b7280;
}

/* ======================
   TABLE
====================== */

.report-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

.report-table thead th {
  background: #1e293b;
  color: #ffffff;
  font-size: 11px;
  padding: 10px 8px;
  border: 1px solid #cbd5e1;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.report-table tbody td {
  border: 1px solid #d1d5db;
  padding: 8px;
  vertical-align: top;
  font-size: 11px;
}

.report-table tbody tr:nth-child(even) {
  background: #f8fafc;
}

.nama-cell {
  font-weight: 700;
  color: #111827;
}

.ket-cell {
  margin-top: 3px;
  color: #6b7280;
  font-size: 10px;
  font-style: italic;
}

.nominal {
  font-weight: 700;
  color: #111827;
}

/* ======================
   ALIGN
====================== */

.text-center {
  text-align: center;
}

.text-right {
  text-align: right;
}

/* ======================
   FOOTER INFO
====================== */

.footer-info {
  margin-top: 14px;
  font-size: 11px;
  color: #374151;
}

/* ======================
   SIGNATURE
====================== */

.ttd-table {
  width: 100%;
  margin-top: 50px;
  border-collapse: collapse;
}

.ttd-col {
  width: 50%;
  text-align: center;
  vertical-align: top;
}

.ttd-city {
  font-size: 11px;
  color: #374151;
}

.ttd-role {
  margin-top: 4px;
  font-size: 12px;
  font-weight: 700;
  color: #111827;
}

.qr-box {
  margin-top: 10px;
  margin-bottom: 10px;
}

.qr-box img {
  width: 80px;
  height: 80px;
  object-fit: contain;
}

.ttd-name {
  font-weight: 700;
  margin-top: 5px;
  color: #111827;
}
</style>
