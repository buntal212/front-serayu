<template>
  <div class="pdf-page">
    <!-- HEADER -->
    <KopDokumen :namadokumen="namadokumen" :bulan="bulanx" :tahun="tahun" />

    <!-- TITLE -->
    <div class="laporan-header">
      <div class="text-center">
        <div class="text-caption">Dicetak: {{ formatTanggal(new Date()) }}</div>
      </div>
    </div>

    <!-- TABLE -->
    <table class="report-table">
      <thead>
        <tr>
          <th width="5%">No</th>
          <th width="16%">No Trans</th>
          <th width="22%">Nama Warga</th>
          <th width="13%">Periode</th>
          <th width="14%">Status</th>
          <th width="12%">Nominal</th>
          <th width="18%">Tanggal</th>
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="(item, index) in items"
          :key="item.notrans || index"
          :class="item.notrans ? 'row-paid' : 'row-unpaid'"
        >
          <td class="text-center">
            {{ index + 1 }}
          </td>

          <td class="text-center">
            <span v-if="item.notrans" class="trx-badge">
              {{ item.notrans }}
            </span>

            <span v-else class="trx-empty"> - </span>
          </td>

          <td>
            <div class="nama-cell">
              {{ item.nama }}
            </div>

            <div v-if="item.keterangan" class="ket-cell">
              {{ item.keterangan }}
            </div>
          </td>

          <td v-if="item.notrans === null" class="text-center">
            {{ getNamaBulan(bulanx) }} {{ tahun }}
          </td>
          <td v-else class="text-center">{{ getNamaBulan(item.bulan) }} {{ item.tahun }}</td>

          <!-- STATUS -->
          <td class="text-center">
            <div :class="['status-pill', item.notrans ? 'status-paid' : 'status-unpaid']">
              {{ item.notrans ? 'LUNAS' : 'MENUNGGU PEMBAYARAN' }}
            </div>

            <div v-if="item.notrans" class="payment-method">
              {{ item.cara_bayar }}
            </div>
          </td>

          <td class="text-right nominal">Rp. {{ formatDouble(item.nominal) }}</td>

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
/* ======================
   PAGE
====================== */

@page {
  size: A4 portrait;
  margin: 10mm;
}

.pdf-page {
  background: #ffffff;
  color: #111827;

  padding: 10px;

  font-size: 11px;
  line-height: 1.5;

  font-family: Arial, Helvetica, sans-serif;

  width: 100%;
  min-height: auto;

  overflow: visible;
  box-sizing: border-box;
}

/* ======================
   HEADER
====================== */

.laporan-header {
  margin-bottom: 20px;
  padding-bottom: 14px;
  border-bottom: 3px solid #111827;
}

/* ======================
   TABLE
====================== */

.report-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;

  page-break-inside: auto;
}

.report-table thead {
  display: table-header-group;
}

.report-table tfoot {
  display: table-footer-group;
}

.report-table tr {
  page-break-inside: avoid;
  break-inside: avoid;
}

.report-table td,
.report-table th {
  page-break-inside: avoid;
  break-inside: avoid;
}

.report-table thead th {
  background: #1e293b;
  color: #ffffff;

  font-size: 11px;
  font-weight: 700;

  padding: 10px 8px;

  border: 1px solid #cbd5e1;

  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.report-table tbody td {
  border: 1px solid #d1d5db;
  padding: 8px;

  vertical-align: middle;
  font-size: 11px;
}

/* ======================
   ROW STATUS
====================== */

.row-paid {
  background: #f0fdf4;
}

.row-unpaid {
  background: #fef2f2;
}

/* ======================
   TEXT
====================== */

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

/* ======================
   STATUS
====================== */

.status-pill {
  display: inline-block;

  padding: 4px 10px;

  border-radius: 999px;

  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.4px;
}

.status-paid {
  background: #dcfce7;
  color: #166534;
  border: 1px solid #86efac;
}

.status-unpaid {
  background: #fee2e2;
  color: #991b1b;
  border: 1px solid #fca5a5;
}

/* ======================
   PAYMENT
====================== */

.payment-method {
  margin-top: 4px;

  font-size: 10px;
  color: #475569;
}

/* ======================
   TRANSACTION
====================== */

.trx-badge {
  display: inline-block;

  padding: 3px 8px;

  border-radius: 8px;

  background: #e0e7ff;
  color: #3730a3;

  font-size: 10px;
  font-weight: 700;
}

.trx-empty {
  color: #9ca3af;
}

/* ======================
   NOMINAL
====================== */

.nominal {
  font-weight: 700;
  color: #111827;

  white-space: nowrap;
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
   FOOTER
====================== */

.footer-info {
  margin-top: 14px;

  font-size: 11px;
  color: #374151;

  page-break-inside: avoid;
}

/* ======================
   SIGNATURE
====================== */

.ttd-table {
  width: 100%;

  margin-top: 35px;

  border-collapse: collapse;

  page-break-inside: avoid;
  break-inside: avoid;
}

.ttd-col {
  width: 50%;

  text-align: center;
  vertical-align: top;

  page-break-inside: avoid;
  break-inside: avoid;
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
  margin-top: 8px;
  margin-bottom: 8px;
}

.qr-box img {
  width: 70px;
  height: 70px;

  object-fit: contain;
}

.ttd-name {
  font-weight: 700;
  margin-top: 5px;

  color: #111827;
}
</style>
