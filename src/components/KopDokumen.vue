<template>
  <div class="header-instansi">
    <div class="header-row">
      <!-- LOGO -->
      <div v-if="logo" class="logo-box">
        <img :src="logo" alt="Logo Instansi" />
      </div>

      <!-- TEKS -->
      <div class="text-box">
        <div class="instansi-nama">{{ nama }}</div>
        <div class="instansi-alamat">{{ alamat }}</div>
        <div class="instansi-kota">
          {{ kota }}
        </div>
        <div class="header">{{ namadokumen }} {{ getNamaBulan(bulan) }} {{ tahun }}</div>
        <div v-if="subtitle" class="instansi-subtitle">
          {{ subtitle }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import logoPerum from 'src/assets/perum.png'
import { getNamaBulan } from 'src/utils/dateHelper'
defineProps({
  nama: {
    type: String,
    default: 'PERUM Cluster Serayu',
  },
  subtitle: {
    type: String,
    default: '',
  },
  alamat: {
    type: String,
    default: 'Jl. Serayu, Kelurahan Jrebeng Kulon, Kecamatan Kedopok',
  },
  kota: {
    type: String,
    default: 'Kota Probolinggo',
  },
  namadokumen: {
    type: String,
    default: 'Dokumen Bukti Belanja',
  },
  bulan: {
    type: Number,
    default: 1,
  },
  tahun: {
    type: Number,
    default: 2026,
  },
  logo: {
    type: String, // path lokal / base64
    default: logoPerum,
  },
})
</script>

<style scoped>
.header-instansi {
  text-align: center;
  margin-bottom: 14px;
  color: #000;
  font-family: Arial, Helvetica, sans-serif;
}

.instansi-nama {
  font-size: 18px;
  font-weight: bold;
  text-transform: uppercase;
}

.instansi-alamat {
  font-size: 11px;
  margin-top: 4px;
}

.instansi-subtitle {
  font-size: 12px;
  font-weight: bold;
  margin-top: 8px;
}

.divider {
  margin-top: 10px;
  border: none;
  border-top: 1px solid #000;
}

/* === HEADER === */
.header {
  text-align: center;
  margin-bottom: 5px;
}

.title {
  font-size: 18px;
  font-weight: bold;
}

.subtitle {
  font-size: 12px;
  margin-top: 4px;
}

/* logo */
.logo-box {
  display: table-cell;
  width: 130px;
  vertical-align: middle;
  text-align: center;
}

.logo-box img {
  max-width: 120px;
  max-height: 120px;
  object-fit: contain;
}

.text-box {
  display: table-cell;
  vertical-align: middle;
  text-align: center;
  padding-right: 130px; /* sesuaikan dengan ukuran logo */
}

.header-row {
  display: table;
  width: 100%;
}
.instansi-kota {
  font-size: 11px;
  margin-top: 2px;
}
</style>
