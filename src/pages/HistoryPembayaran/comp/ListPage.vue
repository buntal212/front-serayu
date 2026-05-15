<template>
  <q-page>
    <div class="page-content">
      <div class="page-title">
        <div class="title-text">Riwayat Pembayaran</div>
        <div class="title-subtext">Daftar seluruh pembayaran warga</div>
      </div>

      <div class="warga-grid">
        <template v-if="store.loading">
          <SkeletonCard v-for="n in 6" :key="'skeleton-' + n" />
        </template>

        <template v-else-if="store.items.length === 0">
          <div class="empty-state">
            <q-icon name="receipt_long" size="48px" color="grey-6" />
            <div class="empty-text">Belum ada data pembayaran</div>
          </div>
        </template>

        <template v-else>
          <q-card
            v-for="(w, index) in store.items"
            :key="w.id || index"
            flat
            bordered
            class="warga-card"
          >
            <div class="card-number">#{{ index + 1 }}</div>

            <div class="warga-name">
              {{ w.nama }}
            </div>

            <div class="info-group">
              <div class="info-item">
                <q-icon name="event" size="16px" />
                <span> {{ getNamaBulan(w?.bulan) }} {{ w?.tahun }} </span>
              </div>

              <div class="info-item">
                <q-icon name="payments" size="16px" />
                <span>{{ w.cara_bayar }}</span>
              </div>

              <div class="info-item">
                <q-icon name="schedule" size="16px" />
                <span>{{ humanDate(w.created_at) }}</span>
              </div>
            </div>

            <div class="nominal-box">
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
import { useHistoryPembayaranStore } from 'src/stores/history/historypembayaran'
import { getNamaBulan } from 'src/utils/dateHelper'

const store = useHistoryPembayaranStore()
</script>

<style scoped>
.page-content {
  position: relative;
  z-index: 2;
  max-width: 1200px;
  margin: 0 auto;
}

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

.warga-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 18px;
}

.warga-card {
  position: relative;
  overflow: hidden;
  border-radius: 24px;
  padding: 22px;
  background: rgba(15, 23, 42, 0.72);
  backdrop-filter: blur(18px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #fff;
  transition: all 0.3s ease;

  box-shadow:
    0 10px 35px rgba(0, 0, 0, 0.35),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

.warga-card:hover {
  transform: translateY(-8px);
  border-color: rgba(99, 102, 241, 0.4);

  box-shadow:
    0 20px 45px rgba(0, 0, 0, 0.45),
    0 0 20px rgba(99, 102, 241, 0.15);
}

.warga-card::before {
  content: '';
  position: absolute;
  width: 160px;
  height: 160px;
  background: rgba(99, 102, 241, 0.15);
  border-radius: 50%;
  top: -80px;
  right: -80px;
  filter: blur(20px);
}

.card-number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  width: 38px;
  height: 38px;
  border-radius: 12px;
  font-weight: 700;
  margin-bottom: 14px;
  font-size: 13px;
}

.warga-name {
  font-size: 18px;
  font-weight: 700;
  color: #f8fafc;
  margin-bottom: 16px;
  line-height: 1.4;
}

.info-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #cbd5e1;
  font-size: 13px;
}

.info-item .q-icon {
  color: #818cf8;
}

.nominal-box {
  margin-top: 18px;
  padding: 14px;
  border-radius: 16px;
  background: rgba(99, 102, 241, 0.12);
  border: 1px solid rgba(99, 102, 241, 0.18);

  font-size: 20px;
  font-weight: 700;
  color: #c7d2fe;
  text-align: center;
}

.empty-state {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 40px;
}

.empty-text {
  color: #94a3b8;
  font-size: 14px;
}

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
</style>