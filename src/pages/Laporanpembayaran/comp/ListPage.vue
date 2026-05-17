<template>
  <q-page>
    <div class="bg-orbs">
      <div class="orb orb-1"></div>
      <div class="orb orb-2"></div>
      <div class="orb orb-3"></div>
    </div>

    <div class="page-content">
      <div class="page-title">
        <div class="title-text">Data Pembayaran Iuran</div>
        <div class="title-subtext">Daftar pembayaran warga terbaru</div>
      </div>

      <div class="warga-grid">
        <template v-if="store.loading">
          <SkeletonCard v-for="n in 6" :key="'skeleton-' + n" />
        </template>

        <template v-else>
          <q-card
            v-for="(w, index) in store.items"
            :key="w.id || index"
            flat
            bordered
            :class="['warga-card', w.notrans === null ? 'card-belum-bayar' : 'card-sudah-bayar']"
          >
            <!-- STATUS -->
            <div :class="['status-badge', w.notrans === null ? 'status-danger' : 'status-success']">
              <q-icon :name="w.notrans === null ? 'warning' : 'check_circle'" size="14px" />

              {{ w.notrans === null ? 'Belum Bayar' : 'Sudah Bayar' }}
            </div>

            <!-- NOMOR -->
            <div class="card-number">#{{ index + 1 }}</div>

            <!-- NAMA -->
            <div class="warga-name">
              {{ w.nama }}

              <span class="text-grey-5 text-caption q-ml-xs">
                {{ w.nokk }}
              </span>
            </div>

            <!-- INFO -->
            <div class="info-group">
              <div class="info-item">
                <q-icon name="event" size="16px" />
                <span v-if="w.notrans === null">
                  {{ getNamaBulan(store.params.bulan) }}
                  {{ store.params.tahun }}
                </span>
                <span v-else> {{ getNamaBulan(w?.bulan) }} {{ w?.tahun }} </span>
              </div>

              <div class="info-item">
                <q-icon name="payments" size="16px" />

                <span>
                  {{ w.notrans !== null ? w.cara_bayar : 'Menunggu Pembayaran' }}
                </span>
              </div>

              <div class="info-item">
                <q-icon name="schedule" size="16px" />

                <span>
                  {{ humanDate(w.created_at) }}
                </span>
              </div>
            </div>

            <!-- NOMINAL -->
            <div
              :class="['nominal-box', w.notrans === null ? 'nominal-danger' : 'nominal-success']"
            >
              {{ formatDouble(w.nominal) || '-' }}
            </div>
          </q-card>
        </template>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { formatDouble, humanDate } from 'src/modules/formatter'
import SkeletonCard from 'src/pages/componen/SkeletonCard.vue'
import { useLapPembayaranIuranStore } from 'src/stores/laporan/lappembayaraniuran'
import { getNamaBulan } from 'src/utils/dateHelper'

const store = useLapPembayaranIuranStore()
</script>

<style scoped>
.dashboard-bg {
  position: relative;
  min-height: 100vh;
  background: radial-gradient(circle at top, #020617, #020617 40%, #000000);
  overflow-x: hidden;
  padding: 20px 16px 40px;
}

/* CONTENT */
.page-content {
  position: relative;
  z-index: 2;
  max-width: 1200px;
  margin: 0 auto;
}

/* TITLE */
.page-title {
  margin-bottom: 24px;
}

.title-text {
  font-size: 28px;
  font-weight: 700;
  color: #f8fafc;
  margin-bottom: 4px;
}

.title-subtext {
  color: #94a3b8;
  font-size: 14px;
}

/* GRID */
.warga-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 18px;
}

/* CARD */
.warga-card {
  position: relative;
  overflow: hidden;
  border-radius: 26px;
  padding: 22px;
  backdrop-filter: blur(18px);

  transition:
    transform 0.35s ease,
    box-shadow 0.35s ease,
    border-color 0.35s ease;

  border: 1px solid rgba(255, 255, 255, 0.08);

  box-shadow:
    0 10px 35px rgba(0, 0, 0, 0.35),
    inset 0 1px 0 rgba(255, 255, 255, 0.04);
}

.warga-card:hover {
  transform: translateY(-8px) scale(1.015);
}

/* BELUM BAYAR */
.card-belum-bayar {
  background: linear-gradient(135deg, rgba(127, 29, 29, 0.88), rgba(69, 10, 10, 0.92));

  border-color: rgba(248, 113, 113, 0.25);
}

.card-belum-bayar:hover {
  box-shadow:
    0 18px 45px rgba(239, 68, 68, 0.22),
    0 0 20px rgba(239, 68, 68, 0.15);
}

/* SUDAH BAYAR */
.card-sudah-bayar {
  background: linear-gradient(135deg, rgba(6, 78, 59, 0.88), rgba(2, 44, 34, 0.92));

  border-color: rgba(74, 222, 128, 0.22);
}

.card-sudah-bayar:hover {
  box-shadow:
    0 18px 45px rgba(34, 197, 94, 0.22),
    0 0 20px rgba(34, 197, 94, 0.12);
}

/* STATUS */
.status-badge {
  position: absolute;
  top: 18px;
  right: 18px;

  display: flex;
  align-items: center;
  gap: 6px;

  padding: 6px 12px;
  border-radius: 999px;

  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.4px;

  backdrop-filter: blur(12px);
}

.status-danger {
  background: rgba(239, 68, 68, 0.18);
  color: #fecaca;
  border: 1px solid rgba(239, 68, 68, 0.25);
}

.status-success {
  background: rgba(34, 197, 94, 0.16);
  color: #bbf7d0;
  border: 1px solid rgba(34, 197, 94, 0.22);
}

/* NUMBER */
.card-number {
  width: 42px;
  height: 42px;
  border-radius: 14px;

  display: flex;
  align-items: center;
  justify-content: center;

  background: rgba(255, 255, 255, 0.08);

  font-weight: 700;
  margin-bottom: 16px;

  backdrop-filter: blur(10px);

  color: white;
}

/* NAMA */
.warga-name {
  font-size: 18px;
  font-weight: 700;
  color: white;
  margin-bottom: 18px;
  line-height: 1.5;
}

/* INFO */
.info-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 10px;

  color: rgba(255, 255, 255, 0.82);
  font-size: 13px;
}

.info-item .q-icon {
  opacity: 0.9;
}

/* NOMINAL */
.nominal-box {
  margin-top: 22px;

  padding: 16px;
  border-radius: 18px;

  text-align: center;

  font-size: 22px;
  font-weight: 800;
  letter-spacing: 0.5px;

  backdrop-filter: blur(12px);
}

.nominal-danger {
  background: rgba(239, 68, 68, 0.12);
  color: #fecaca;
  border: 1px solid rgba(239, 68, 68, 0.22);
}

.nominal-success {
  background: rgba(34, 197, 94, 0.12);
  color: #bbf7d0;
  border: 1px solid rgba(34, 197, 94, 0.22);
}

/* ORBS */
.bg-orbs {
  position: fixed;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
}

.orb {
  position: absolute;
  border-radius: 999px;
  filter: blur(90px);
  opacity: 0.22;
  animation: float 10s ease-in-out infinite;
}

.orb-1 {
  width: 300px;
  height: 300px;
  background: #6366f1;
  top: -100px;
  left: -80px;
}

.orb-2 {
  width: 240px;
  height: 240px;
  background: #0ea5e9;
  bottom: -80px;
  right: -50px;
  animation-delay: -3s;
}

.orb-3 {
  width: 220px;
  height: 220px;
  background: #8b5cf6;
  top: 45%;
  left: 60%;
  animation-delay: -6s;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px) scale(1);
  }

  50% {
    transform: translateY(-35px) scale(1.08);
  }
}

/* MOBILE */
@media (max-width: 600px) {
  .title-text {
    font-size: 22px;
  }

  .warga-grid {
    grid-template-columns: 1fr;
  }

  .warga-card {
    animation: fadeUp 0.45s ease both;
  }

  @keyframes fadeUp {
    from {
      opacity: 0;
      transform: translateY(18px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
}

.card-belum-bayar {
  border-left: 5px solid #ef5350;
  background: rgba(239, 83, 80, 0.08);
}

.card-sudah-bayar {
  border-left: 5px solid #66bb6a;
  background: rgba(102, 187, 106, 0.08);
}
</style>
