<template>
  <div id="pdf-content" class="pdf-wrapper">
    <!-- HEADER -->
    <KopDokumen />

    <!-- INFO TRANSAKSI -->
    <table class="info-table">
      <tr>
        <td>No Transaksi</td>
        <td>: {{ store.form.notrans }}</td>
        <td>Tanggal</td>
        <td>: {{ store.form.tgl }}</td>
      </tr>
      <tr>
        <td>Jenis Belanja</td>
        <td>: {{ jenisBelanjaLabel }}</td>
        <td>Pembayaran</td>
        <td>: {{ store.form.jenispembayaran }}</td>
      </tr>
      <tr>
        <td>Keterangan</td>
        <td colspan="4">: {{ store.form.keterangan }}</td>
      </tr>
    </table>

    <!-- RINCIAN -->
    <table class="detail-table">
      <thead>
        <tr>
          <th style="width: 5%">No</th>
          <th>Nama Barang</th>
          <th style="width: 15%">Jumlah</th>
          <th style="width: 15%">Satuan</th>
          <th style="width: 20%">Harga</th>
          <th style="width: 20%">Subtotal</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(x, i) in store.rincian" :key="x.id">
          <td class="center">{{ i + 1 }}</td>
          <td>{{ x.namabarang }}</td>
          <td class="center">{{ x.jumlah }}</td>
          <td class="center">{{ x.satuan }}</td>
          <td class="right">Rp {{ formatDouble(x.harga, 0) }}</td>
          <td class="right">Rp {{ formatDouble(x.subtotal, 0) }}</td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td colspan="5" class="right total-label">TOTAL</td>
          <td class="right total-value">Rp {{ formatDouble(store.form.totalbelanja, 0) }}</td>
        </tr>
      </tfoot>
    </table>
    <!-- TANDA TANGAN QR -->
    <table class="ttd-table">
      <tr>
        <td class="ttd-col">
          Mengetahui,<br />
          <b>Ketua</b>

          <div class="qr-box">
            <img :src="qrKetua" alt="QR Ketua" />
          </div>

          <b>( Ketua )</b>
        </td>

        <td class="ttd-col">
          Dibuat oleh,<br />
          <b>Bendahara</b>

          <div class="qr-box">
            <img :src="qrBendahara" alt="QR Bendahara" />
          </div>

          <b>( Bendahara )</b>
        </td>
      </tr>
    </table>

    <!-- FOOTER -->
    <div class="footer">
      <div>Dicetak pada: {{ tanggalCetak }}</div>
    </div>
  </div>
</template>

<script setup>
import QRCode from 'qrcode'
import { computed, onMounted, ref } from 'vue'
import { useBelanjaStore } from 'src/stores/Belanja/belanja'
import { formatDouble } from 'src/modules/formatter'
import KopDokumen from 'src/components/KopDokumen.vue'

const store = useBelanjaStore()

const qrKetua = ref('')
const qrBendahara = ref('')

onMounted(async () => {
  qrKetua.value = await QRCode.toDataURL('Ketua')
  qrBendahara.value = await QRCode.toDataURL('Bendahara')
})

const jenisBelanjaLabel = computed(() => {
  return store.form.jenisbelanja === 1 ? 'Aset' : 'Habis Pakai'
})

const tanggalCetak = new Date().toLocaleString('id-ID')
</script>

<style scoped>
/* === GLOBAL === */
.pdf-wrapper {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 12px;
  color: #000;
}

/* === INFO === */
.info-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 14px;
}

.info-table td {
  padding: 4px 6px;
  vertical-align: top;
}

/* === DETAIL TABLE === */
.detail-table {
  width: 100%;
  border-collapse: collapse;
}

.detail-table th,
.detail-table td {
  border: 1px solid #000;
  padding: 6px;
}

.detail-table th {
  background: #f0f0f0;
  text-align: center;
}

.center {
  text-align: center;
}

.right {
  text-align: right;
}

.total-label {
  font-weight: bold;
}

.total-value {
  font-weight: bold;
}

/* === FOOTER === */
.footer {
  margin-top: 20px;
  font-size: 11px;
}

/* === TTD QR === */
.ttd-table {
  width: 100%;
  margin-top: 40px;
  text-align: center;
}

.ttd-col {
  width: 50%;
  font-size: 12px;
  vertical-align: top;
}

.qr-box {
  margin: 10px 0;
}

.qr-box img {
  width: 90px;
  height: 90px;
}
</style>
