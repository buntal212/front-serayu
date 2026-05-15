import { defineStore } from 'pinia'
import { api } from 'boot/axios'
import { Notify } from 'quasar'

export const usenotifikasiStore = defineStore('notifikasi', {
  state: () => ({
    notifications: [],
    notificationsdetail: {},
    unreadCount: [],
    loading: false
  }),

  getters: {
    getNotifications: (state) => state.notifications,
    getUnreadCount: (state) => state.unreadCount.length
  },

  actions: {
    async loadNotifications () {
      this.loading = true
      try {
        const res = await api.get('notif/simpantoken/notifications')
        this.notifications = res.data.data
        this.unreadCount = res.data.data.filter((n) => n.is_read === '0')
      } catch (error) {
        console.error('Failed to load notifications:', error)
        Notify.create({
          type: 'negative',
          message: 'Gagal memuat notifikasi',
          position: 'top',
          timeout: 3000
        })
      } finally {
        this.loading = false
      }
    },

    async loadNotificationDetail (id) {
      try {
        const res = await api.get(`notif/simpantoken/notifications/${id}`)
        this.notificationsdetail = res.data.data
        return res.data.data
      } catch (error) {
        console.error('Failed to load notification detail:', error)
        Notify.create({
          type: 'negative',
          message: 'Gagal memuat detail notifikasi',
          position: 'top',
          timeout: 3000
        })
      }
    },

    async markAllRead () {
      try {
        await api.post('notification/mark-all-read')
        await this.loadNotifications()
        Notify.create({
          type: 'positive',
          message: 'Semua notifikasi ditandai dibaca',
          position: 'top',
          timeout: 2000
        })
      } catch (error) {
        console.error('Failed to mark all as read:', error)
        Notify.create({
          type: 'negative',
          message: 'Gagal menandai notifikasi',
          position: 'top',
          timeout: 3000
        })
      }
    },

    async markAsRead (id) {
      try {
        await api.post(`notification/${id}/mark-read`)
        const notif = this.notifications.find((n) => n.id === id)
        if (notif) notif.is_read = '1'
        this.unreadCount = this.notifications.filter((n) => n.is_read === '0')
      } catch (error) {
        console.error('Failed to mark as read:', error)
      }
    }
  }
})
