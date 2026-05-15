<template>
  <q-page class="notif-list-page">
    <!-- HEADER -->
    <div class="list-header">
      <div class="header-title">
        <q-btn flat icon="arrow_back" color="white" @click="goHome" />Inbox Notifikasi
      </div>
      <q-btn
        v-if="store.unreadCount.length > 0"
        flat
        class="mark-btn"
        label="Tandai Semua Dibaca"
        no-caps
        @click="markAllRead"
      />
    </div>

    <!-- LOADING SKELETONS -->
    <template v-if="store.loading">
      <SkeletonCardnotif v-for="n in 6" :key="'skeleton-' + n" />
    </template>

    <!-- NOTIFICATION LIST -->
    <template v-else-if="store.notifications.length > 0">
      <div class="notif-list">
        <div
          v-for="notif in store.notifications"
          :key="notif.id"
          class="notif-item"
          :class="{ unread: Number(notif.is_read) === 0 }"
          @click="openNotif(notif)"
        >
          <div class="notif-icon-box">
            <q-icon name="notifications" size="20px" class="notif-icon" />
            <div v-if="Number(notif.is_read) === 0" class="unread-dot"></div>
          </div>
          <div class="notif-body">
            <div class="notif-title">{{ notif.title }}</div>
            <div class="notif-message">{{ notif.message }}</div>
            <div class="notif-date">{{ formatDate(notif.created_at) }}</div>
          </div>
          <q-icon name="chevron_right" size="20px" class="notif-chevron" />
        </div>
      </div>
    </template>

    <!-- EMPTY -->
    <template v-else>
      <div class="empty-state">
        <q-icon name="notifications_off" size="56px" class="empty-icon" />
        <div class="empty-text">Belum ada notifikasi</div>
        <div class="empty-sub">Notifikasi baru akan muncul di sini</div>
      </div>
    </template>
  </q-page>
</template>

<script setup>
import SkeletonCardnotif from 'src/pages/componen/SkeletonCardnotif.vue'
import { usenotifikasiStore } from 'src/stores/notif/notif'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const store = usenotifikasiStore()
const emits = defineEmits(['open'])
const router = useRouter()

const formatDate = (date) => {
  return new Date(date).toLocaleString('id-ID')
}

const goHome = () => {
  router.push('/') // route utama, jika belum login akan trigger auto logout
}

const openNotif = (notif) => {
  emits('open', notif)
  store.notificationsdetail = notif
  router.push({ name: 'NotifDetailPage' })
}

const markAllRead = () => {
  store.markAllRead()
}

onMounted(() => {
  store.loadNotifications()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

.notif-list-page {
  padding: 20px 16px;
  font-family: 'Inter', sans-serif;
}

/* HEADER */
.list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  animation: fadeIn 0.4s ease-out;
}

.header-title {
  font-size: 22px;
  font-weight: 700;
  color: #f1f5f9;
  letter-spacing: 0.3px;
}

.mark-btn {
  color: #818cf8;
  font-weight: 500;
  font-size: 13px;
}

/* NOTIFICATION LIST */
.notif-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  animation: cardSlideIn 0.5s ease-out both;
}

.notif-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px;
  border-radius: 16px;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.06);
  cursor: pointer;
  transition: all 0.25s ease;
}

.notif-item:hover {
  transform: translateY(-2px);
  background: rgba(15, 23, 42, 0.8);
  border-color: rgba(255, 255, 255, 0.1);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.4);
}

.notif-item:active {
  transform: translateY(0) scale(0.98);
}

.notif-item.unread {
  border-left: 3px solid #6366f1;
  background: rgba(99, 102, 241, 0.08);
}

.notif-item.unread:hover {
  background: rgba(99, 102, 241, 0.14);
}

/* ICON BOX */
.notif-icon-box {
  position: relative;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.3), rgba(139, 92, 246, 0.2));
  flex-shrink: 0;
}

.notif-icon {
  color: #a5b4fc;
}

.unread-dot {
  position: absolute;
  top: -3px;
  right: -3px;
  width: 12px;
  height: 12px;
  background: #6366f1;
  border-radius: 50%;
  border: 2px solid #0f172a;
}

/* NOTIF BODY */
.notif-body {
  flex: 1;
  min-width: 0;
}

.notif-title {
  font-size: 15px;
  font-weight: 600;
  color: #f1f5f9;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.notif-message {
  font-size: 13px;
  color: #94a3b8;
  margin-top: 3px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.notif-date {
  font-size: 12px;
  color: #64748b;
  margin-top: 4px;
}

.notif-chevron {
  color: #475569;
  flex-shrink: 0;
}

/* EMPTY STATE */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  animation: fadeIn 0.5s ease-out;
}

.empty-icon {
  color: #334155;
  margin-bottom: 16px;
}

.empty-text {
  font-size: 16px;
  font-weight: 600;
  color: #94a3b8;
}

.empty-sub {
  font-size: 13px;
  color: #64748b;
  margin-top: 6px;
}

/* ANIMATIONS */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes cardSlideIn {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
