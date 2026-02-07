<template>
  <q-dialog v-model="store.dialog" persistent>
    <q-card class="dialog-card q-pa-lg">
      <!-- Header -->
      <div class="row items-center justify-between q-mb-md">
        <div class="text-h6 text-white">Tambah Rincian Belanja</div>

        <q-btn round dense icon="close" color="red-6" glossy @click="emit('close')" />
      </div>

      <!-- Form -->
      <q-form @submit="submitForm">
        <q-input
          v-model="store.form.namabarang"
          label="Nama Barang"
          dense
          outlined
          class="form-input"
          dark
          autofocus
          :rules="[(v) => !!v || 'Wajib diisi']"
        />

        <q-input
          v-model.number="store.form.jumlah"
          label="Jumlah"
          type="number"
          dense
          outlined
          class="form-input"
          dark
          :rules="[(v) => v > 0 || 'Jumlah minimal 1']"
        />

        <q-input
          v-model.number="store.form.satuan"
          label="Satuan"
          dense
          outlined
          class="form-input"
          dark
          :rules="[(v) => !!v || 'Wajib diisi']"
        />

        <q-input
          v-model="store.harga"
          label="Harga Satuan"
          dense
          outlined
          class="form-input"
          dark
          @update:model-value="
            (val) => {
              formatNumber(val)
              store.form.harga = Number(val.replace(/\./g, '')) // simpan angka asli
            }
          "
          :rules="[
            (v) => {
              const num = Number(String(v || '').replace(/\./g, ''))
              return num > 0 || 'Harga tidak valid'
            },
          ]"
        />
        <div class="subtotal-box q-mt-md q-pa-sm">
          <div>Subtotal:</div>
          <div class="subtotal-value">
            {{ subtotal.toLocaleString() }}
          </div>
        </div>

        <div class="q-mt-lg flex justify-between">
          <!-- Subtotal -->

          <q-btn flat label="Batal" color="grey-5" class="btn-cancel" @click="emit('close')" />

          <q-btn
            type="submit"
            label="Simpan"
            color="red-7"
            glossy
            class="btn-save"
            :loading="store.rincianloading"
          />
        </div>
      </q-form>
    </q-card>
  </q-dialog>
</template>
<script setup>
import { useBelanjaStore } from 'src/stores/Belanja/belanja'
import { computed } from 'vue'

const emit = defineEmits(['save', 'close'])
const store = useBelanjaStore()
function formatNumber(value) {
  // Hilangkan semua karakter kecuali angka
  const clean = value.replace(/\D/g, '')

  // Format jadi ribuan: 15000 -> 15.000
  const formatted = clean.replace(/\B(?=(\d{3})+(?!\d))/g, '.')

  // Tampilkan pemisah ribuan
  store.harga = formatted

  // Simpan nilai asli (angka) untuk ke database / perhitungan
  store.form.harga = Number(clean)
}

const subtotal = computed(() => {
  return store.form.harga && store.form.jumlah ? store.form.harga * store.form.jumlah : 0
})

function submitForm() {
  store.form.subtotal = subtotal.value
  store.simpan()
}
</script>

<style scoped>
.dialog-card {
  width: 420px;
  border-radius: 18px;
  background: rgba(35, 35, 35, 0.6);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 4px 25px rgba(0, 0, 0, 0.6);
  color: white;
}

/* Input */
.form-input :deep(.q-field__control) {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.subtotal-box {
  background: rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  display: flex;
  justify-content: space-between;
  color: #fff;
  font-size: 16px;
  font-weight: bold;
}

.subtotal-value {
  color: #ffb4b4;
}

.btn-save,
.btn-cancel {
  padding: 8px 22px;
  border-radius: 14px;
}
</style>
