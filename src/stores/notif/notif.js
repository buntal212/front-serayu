import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'
import { notifError } from 'src/modules/notifs'

export const usenotifikasiStore = defineStore('notifikasi-store', {
  state: () => ({
    items: [],
    notifications: [],
    notificationsdetail: '',
    loading: false,
    loadingrinci: false,
    isError: false,
    unreadCount: 0,
  }),
  actions: {
    async simpantoken(token) {
      await api.post('/notif/simpantoken/simpantoken', {
        token,
        platform: 'web',
        device_name: navigator.userAgent,
      })
    },
    async loadNotifications() {
      this.loading = true
      try {
        const res = await api.get('/notif/simpantoken/notifications')
        this.notifications = res.data?.data || []
        console.log('NOTIF:', this.notifications)
        this.loading = false
      } catch (err) {
        notifError(err)
        this.loading = false
      }
    },
    async updateNotification(val) {
      console.log('val', val)
      this.loadingrinci = true

      try {
        const res = await api.post('/notif/simpantoken/read-notifications', { id: val.id })

        const header = res.data?.data

        // inject ke state
        this.notificationsdetail = header

        // update list jadi sudah dibaca (optional)
        const idx = this.notifications.findIndex((item) => item.id === header.id)

        if (idx !== -1) {
          this.notifications[idx].is_read = 1
        }
      } catch (err) {
        notifError(err)
      } finally {
        this.loadingrinci = false
      }
    },
    async getUnreadCount() {
      const res = await api.get('/notif/simpantoken/unread-count')
      this.unreadCount = res.data.total_unread
    },
    async markAllRead() {
      await api.get('/notif/simpantoken/read-all')
      this.loadNotifications()
      // this.notifications.forEach((n) => (n.is_read = 1))
    },

    // async openNotif() {
    //   if (!notif.is_read) {
    //     await api.post(`/api/notifications/read/${notif.id}`)
    //     notif.is_read = 1
    //   }

    //   // Kalau mau redirect berdasarkan type
    //   if (notif.type === 'pembayaran_iuran') {
    //     // misalnya ke halaman detail pembayaran
    //     // router.push(`/pembayaran/${JSON.parse(notif.data_json).notrans}`)
    //   }
    // },
    // const markAllRead = async () => {
    //   await api.post('/api/notifications/read-all')
    //   notifications.value.forEach((n) => (n.is_read = 1))
    // }

    // const formatDate = (date) => {
    //   return new Date(date).toLocaleString('id-ID')
    // }
  },
})
