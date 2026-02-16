<template>
  <q-page padding class="dashboard-bg">
    <!-- HEADER -->
    <div class="row items-center justify-between q-mb-lg">
      <div class="text-h6 title-text">Inbox Notifikasi</div>

      <q-btn
        flat
        class="action-btn"
        label="Tandai Semua Dibaca"
        @click="markAllRead"
        v-if="store.unreadCount.length > 0"
      />
    </div>

    <!-- LIST -->
    <template v-if="store.loading">
      <SkeletonCardnotif v-for="n in 6" :key="'skeleton-' + n" />
    </template>
    <template v-else-if="!store.loading || store.notifications.length === 0">
      <q-list class="notif-list rounded-borders">
        <q-item
          v-for="notif in store.notifications"
          :key="notif.id"
          clickable
          @click="openNotif(notif)"
          :class="Number(notif.is_read) === 0 ? 'notif-unread' : 'notif-read'"
        >
          <q-item-section>
            <q-item-label class="notif-title">
              {{ notif.title }}
            </q-item-label>

            <q-item-label caption class="notif-message">
              {{ notif.message }}
            </q-item-label>

            <q-item-label caption class="notif-date">
              {{ formatDate(notif.created_at) }}
            </q-item-label>
          </q-item-section>

          <q-item-section side>
            <div v-if="Number(notif.is_read) === 0" class="notif-dot"></div>
          </q-item-section>
        </q-item>
      </q-list>
    </template>

    <!-- EMPTY -->
    <template v-else>
      <div class="text-center q-mt-xl empty-text">Belum ada notifikasi</div>
    </template>
  </q-page>
</template>

<script setup>
import SkeletonCardnotif from 'src/pages/componen/SkeletonCardnotif.vue'
import { usenotifikasiStore } from 'src/stores/notif/notif'
import { onMounted } from 'vue'

const store = usenotifikasiStore()
const emits = defineEmits(['open'])

const formatDate = (date) => {
  return new Date(date).toLocaleString('id-ID')
}

const openNotif = (notif) => {
  emits('open', notif)
  store.notificationsdetail = notif
}

const markAllRead = () => {
  store.markAllRead()
}

onMounted(() => {
  store.loadNotifications()
})
</script>

<style scoped>
.dashboard-bg {
  background: linear-gradient(160deg, #0f0f0f, #1a1a1a, #111827);
  min-height: 100vh;
  padding: 16px;
  overflow-x: hidden;
}

/* HEADER */
.title-text {
  color: #ffffff;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.action-btn {
  color: #3b82f6;
  font-weight: 500;
}

/* LIST CONTAINER */
.notif-list {
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.03);
  border-radius: 14px;
  padding: 6px;
}

/* ITEM READ */
.notif-read {
  background: transparent;
  border-radius: 10px;
  transition: all 0.3s ease;
}

.notif-read:hover {
  background: rgba(255, 255, 255, 0.04);
}

/* ITEM UNREAD */
.notif-unread {
  background: rgba(59, 130, 246, 0.12);
  border-left: 4px solid #3b82f6;
  border-radius: 10px;
  transition: all 0.3s ease;
}

.notif-unread:hover {
  background: rgba(59, 130, 246, 0.18);
}

/* TEXT */
.notif-title {
  color: #ffffff;
  font-weight: 600;
}

.notif-message {
  color: #cbd5e1;
  margin-top: 2px;
}

.notif-date {
  color: #94a3b8;
  font-size: 12px;
  margin-top: 4px;
}

.empty-text {
  color: #94a3b8;
}

/* DOT */
.notif-dot {
  width: 10px;
  height: 10px;
  background: #3b82f6;
  border-radius: 50%;
}
</style>
