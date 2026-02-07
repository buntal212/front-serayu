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
        <div v-if="subtitle" class="instansi-subtitle">
          {{ subtitle }}
        </div>
      </div>
    </div>

    <hr class="divider" />
  </div>

  <div class="header">{{ namadokumen }}</div>
</template>

<script setup>
import logoPerum from 'src/assets/perum.png'
defineProps({
  nama: {
    type: String,
    default: 'PERUM BENGAWAN INDAH',
  },
  subtitle: {
    type: String,
    default: '',
  },
  alamat: {
    type: String,
    default: 'Jl. Bengawan Solo, Kelurahan Jrebeng Wetan, Kecamatan Kedopok, Kota Probolinggo',
  },
  namadokumen: {
    type: String,
    default: 'Dokumen Bukti Belanja',
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
  width: 90px;
  vertical-align: middle;
  text-align: center;
}

.logo-box img {
  max-width: 80px;
  max-height: 80px;
}

.header-row {
  display: table;
  width: 100%;
}

.text-box {
  display: table-cell;
  vertical-align: middle;
  text-align: center;
  padding-right: 90px; /* biar tetap center walau ada logo */
}
</style>
