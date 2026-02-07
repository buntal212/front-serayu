<template>
  <div class="pdf-page">
    <!-- Judul -->
    <KopDokumen :namadokumen="namadokumen" />

    <div class="text-center q-mb-sm">
      <div class="text-caption">
        Bulan {{ getNamaBulan(bulanx) }} {{ tahun }}<br />
        Dicetak: {{ formatTanggal(new Date()) }}
      </div>
    </div>

    <q-separator class="q-my-sm" />

    <!-- Daftar Data -->
    <div
      v-for="(item, index) in items"
      :key="item.notrans || index"
      class="q-mb-md q-pa-sm item-box"
    >
      <div class="row q-col-gutter-sm">
        <div class="col-4">
          <div><strong>Notrans:</strong> {{ item.notrans }}</div>
          <div><strong>Nama:</strong> {{ item.nama }}</div>
        </div>

        <div class="col-4">
          <div><strong>Bulan Bayar:</strong> {{ getNamaBulan(item.bulan) }} {{ item.tahun }}</div>
          <div><strong>Nominal:</strong> Rp. {{ formatDouble(item.nominal) }}</div>
          <div><strong>Cara Bayar:</strong> {{ item.cara_bayar }}</div>
        </div>

        <div class="col-4">
          <div><strong>Keterangan:</strong> {{ item.keterangan }}</div>
          <div><strong>Tanggal Bayar:</strong> {{ formatTanggal(item.created_at) }}</div>
        </div>
      </div>
    </div>

    <!-- TTD -->
    <table class="ttd-table">
      <tr>
        <td class="ttd-col">
          Mengetahui,<br />
          <b>Ketua</b>
          <div class="qr-box">
            <img v-if="qrKetua" :src="qrKetua" />
          </div>
          <b>( Ketua )</b>
        </td>

        <td class="ttd-col">
          Dibuat oleh,<br />
          <b>Bendahara</b>
          <div class="qr-box">
            <img v-if="qrBendahara" :src="qrBendahara" />
          </div>
          <b>( Bendahara )</b>
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
    month: 'long',
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
  color: #000000;
  box-sizing: border-box;
}

.item-box {
  border: 1px solid #ccc;
  border-radius: 6px;
}

.ttd-table {
  width: 100%;
  margin-top: 40px;
  border-collapse: collapse;
}

.ttd-col {
  width: 50%;
  text-align: center;
  vertical-align: top;
}

.qr-box img {
  width: 80px;
  height: 80px;
  margin: 8px auto;
  display: block;
}
</style>
