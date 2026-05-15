<template>
  <div class="row q-col-gutter-sm">
    <!-- Saldo Awal -->
    <div v-if="Number(store.saldoawal) !== 0" class="col-12">
      <div class="glass-card info-card saldo-awal-card">
        <div class="info-card-header">
          <q-icon name="account_balance_wallet" size="22px" class="info-icon" />
          <span class="info-label">Saldo Awal</span>
        </div>

        <div class="info-amount">
          {{ formatRupiah(store.saldoawal) }}
        </div>

        <div v-if="store.tanggaltutupsaldo" class="info-sub">s/d {{ store.tanggaltutupsaldo }}</div>
      </div>
    </div>

    <!-- Ringkasan -->
    <div class="col-12">
      <div class="glass-card info-card summary-card">
        <div class="row q-col-gutter-md">
          <div class="col-6">
            <div class="summary-box">
              <div class="summary-label">Total Masuk</div>

              <div class="summary-amount text-positive">
                {{ formatRupiah(totalMasuk) }}
              </div>
            </div>
          </div>

          <div class="col-6">
            <div class="summary-box">
              <div class="summary-label">Total Keluar</div>

              <div class="summary-amount text-negative">
                {{ formatRupiah(totalKeluar) }}
              </div>
            </div>
          </div>
        </div>

        <q-separator dark class="summary-divider" />

        <div class="row">
          <div class="col-12">
            <div class="saldo-akhir-box">
              <div class="summary-label">Saldo Akhir</div>

              <div class="saldo-akhir-amount">
                {{ formatRupiah(saldoAkhir) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="store.loading" class="col-12 flex flex-center">
      <q-spinner-dots color="primary" size="3em" />
    </div>

    <!-- Items -->
    <template v-if="!store.loading && store.items.length > 0">
      <div v-for="(item, index) in store.items" :key="index" class="col-12">
        <q-card class="glass-card item-card">
          <!-- HEADER -->
          <q-card-section class="item-header row items-center no-wrap">
            <div
              class="item-avatar q-mr-md"
              :class="item.jenis == 'masuk' ? 'bg-income' : 'bg-expense'"
            >
              <q-icon
                :name="item.debit > 0 ? 'trending_up' : 'trending_down'"
                color="white"
                size="18px"
              />
            </div>

            <div class="col">
              <div
                class="item-title"
                :class="item.jenis === 'masuk' ? 'text-positive' : 'text-negative'"
              >
                {{ item?.notrans }}
              </div>

              <div
                class="item-date"
                :class="item.jenis === 'masuk' ? 'text-positive' : 'text-negative'"
              >
                {{ item.jenis === 'masuk' ? 'Debet' : 'Kredit' }}
              </div>
            </div>

            <div class="text-right">
              <div
                class="item-amount"
                :class="item.jenis === 'masuk' ? 'text-positive' : 'text-negative'"
              >
                {{ item.jenis === 'masuk' ? '+' : '-' }}
                {{ formatRupiah(item.nominal) }}
              </div>
            </div>
          </q-card-section>

          <!-- DETAIL -->
          <q-separator dark />

          <q-card-section class="detail-card">
            <div class="detail-row">
              <span class="detail-label">Tanggal</span>
              <span class="detail-value">
                {{ formattglfull(item.tanggal) }}
              </span>
            </div>
            <!-- <pre>{{ item }}</pre> -->

            <div class="detail-row">
              <span class="detail-label">Keterangan</span>
              <span class="detail-value">
                {{ item.keterangan }}
              </span>
            </div>
            <div class="detail-row">
              <span
                class="detail-label"
                :class="item.jenis === 'masuk' ? 'text-positive' : 'text-negative'"
                >Saldo</span
              >

              <span
                class="detail-value"
                :class="item.jenis === 'masuk' ? 'text-positive' : 'text-negative'"
              >
                {{ formatRupiah(item.saldo) }}
              </span>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </template>

    <!-- Empty -->
    <div v-if="!store.loading && store.items.length === 0" class="col-12 flex flex-center">
      <div class="empty-state">
        <q-icon name="search_off" size="56px" class="empty-icon" />

        <div class="empty-text">Pilih bulan dan tahun untuk melihat laporan kas</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useLapKasStore } from 'src/stores/laporan/laporankas'
import { formattglfull } from 'src/modules/utils'
// import { getNamaBulan } from 'src/utils/dateHelper'

const store = useLapKasStore()

const totalMasuk = computed(() =>
  store.items
    .filter((item) => item.jenis === 'masuk')
    .reduce((sum, item) => sum + Number(item.nominal), 0),
)

const totalKeluar = computed(() =>
  store.items
    .filter((item) => item.jenis !== 'masuk')
    .reduce((sum, item) => sum + Number(item.nominal), 0),
)
const saldoAkhir = computed(() => {
  const saldoAwal = Number(store.saldoawal || 0)
  const masuk = Number(totalMasuk.value || 0)
  const keluar = Number(totalKeluar.value || 0)

  return saldoAwal + masuk - keluar
})

function formatRupiah(val) {
  const num = Number(val)
  if (isNaN(num)) return 'Rp 0'
  return 'Rp ' + num.toLocaleString('id-ID')
}
</script>

<style scoped>
/* =========================
   GLASS CARD BASE
========================= */
.glass-card {
  border-radius: 20px;
  background: rgba(15, 23, 42, 0.68);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.35),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
  overflow: hidden;
}

/* =========================
   INFO CARDS
========================= */
.info-card {
  padding: 18px 20px;
  margin-bottom: 4px;
}

.info-card-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.info-icon {
  color: #818cf8;
}

.info-label {
  font-size: 14px;
  font-weight: 600;
  color: #94a3b8;
  letter-spacing: 0.3px;
}

.info-amount {
  font-size: 24px;
  font-weight: 800;
  color: #f8fafc;
  letter-spacing: 0.2px;
}

.info-sub {
  font-size: 12px;
  color: #64748b;
  margin-top: 4px;
}

/* =========================
   SALDO AWAL
========================= */
.saldo-awal-card {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.12), rgba(15, 23, 42, 0.68));
}

/* =========================
   SUMMARY
========================= */
.summary-card {
  padding: 20px;
}

.summary-box {
  text-align: center;
}

.summary-label {
  font-size: 12px;
  font-weight: 600;
  color: #94a3b8;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.summary-amount {
  font-size: 18px;
  font-weight: 800;
  margin-top: 6px;
}

.summary-divider {
  margin: 14px 0;
  background: rgba(255, 255, 255, 0.06);
}

.saldo-akhir-box {
  text-align: center;
}

.saldo-akhir-amount {
  font-size: 22px;
  font-weight: 800;
  color: #f8fafc;
  margin-top: 6px;
}

/* =========================
   ITEM CARDS
========================= */
.item-card {
  margin-bottom: 8px;
}

.item-header {
  padding: 12px 14px;
  border-radius: 20px;
}

.item-avatar {
  width: 38px;
  height: 38px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bg-income {
  background: linear-gradient(135deg, #10b981, #059669);
}

.bg-expense {
  background: linear-gradient(135deg, #f43f5e, #e11d48);
}

.item-title {
  font-size: 14px;
  font-weight: 700;
  color: #f8fafc;
}

.item-date {
  font-size: 11px;
  color: #64748b;
  margin-top: 2px;
}

.item-amount {
  font-size: 14px;
  font-weight: 700;
}

.item-saldo {
  font-size: 11px;
  color: #64748b;
  text-align: right;
  margin-top: 2px;
}

/* =========================
   DETAIL CARD
========================= */
.detail-card {
  background: rgba(0, 0, 0, 0.2) !important;
  border-radius: 0 0 20px 20px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 4px;
}

.detail-row + .detail-row {
  border-top: 1px solid rgba(255, 255, 255, 0.04);
}

.detail-label {
  font-size: 13px;
  color: #94a3b8;
}

.detail-value {
  font-size: 13px;
  font-weight: 600;
  color: #e2e8f0;
}

/* =========================
   EMPTY STATE
========================= */
.empty-state {
  text-align: center;
  padding: 48px 20px;
}

.empty-icon {
  color: #334155;
  margin-bottom: 16px;
}

.empty-text {
  font-size: 14px;
  color: #64748b;
}

/* =========================
   TEXT COLORS
========================= */
.text-positive {
  color: #34d399 !important;
}

.text-negative {
  color: #fb7185 !important;
}
</style>
