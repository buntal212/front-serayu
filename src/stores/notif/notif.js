import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'
import { notifError, notifSuccess } from 'src/modules/notifs'

export const usenotifikasiStore = defineStore('notifikasi-store', {
  state: () => ({
    items: [],
    notifications: [],
    notificationsdetail: '',
    loading: false,
    loadingrinci: false,
    isError: false,
    unreadCount: 0,
    itemsfcmtoken: [],
    loadingfcmtoken: false,
    itemsnotifikasiall: [],
    loadingnotifikasiall: false,
  }),
  actions: {
    async simpantoken(token) {
      const ua = navigator.userAgent

      const isAndroid = /Android/i.test(ua)
      const isiPhone = /iPhone/i.test(ua)
      const isiPad = /iPad/i.test(ua)
      const isIOS = /iPhone|iPad|iPod/i.test(ua)

      const isMobile = /Android|iPhone|iPad|iPod/i.test(ua)

      const os = isAndroid ? 'Android' : isIOS ? 'iOS' : 'Desktop'
      const modelMatch = ua.match(/\((.*?)\)/)

      await api.post('/notif/simpantoken/simpantoken', {
        token,
        platform: navigator.platform,
        device_name: navigator.userAgent,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        online: navigator.onLine,
        language: navigator.language,
        isPWAInstalled: window.matchMedia('(display-mode: standalone)').matches
          ? 'standalone'
          : 'browser',
        isAndroid,
        isiPhone,
        isiPad,
        isIOS,
        isMobile,
        os,
        modelMatch,
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
    async loadNotificationDetail(id) {
      const res = await api.get(`/notif/simpantoken/notifications/${id}`)
      return res.data
    },
    async getlisttoken() {
      this.loadingfcmtoken = true
      try {
        const res = await api.get('/notif/simpantoken/list-token')
        this.itemsfcmtoken = res.data?.data || []
        this.loadingfcmtoken = false
      } catch (err) {
        console.log(err)
        this.loadingfcmtoken = false
      }
      this.loadingfcmtoken = false
    },
    async hapusalltoken() {
      this.loadingfcmtoken = true
      await api.get('/notif/simpantoken/hapus-all-token')
      this.getlisttoken()
    },
    async getNotifikasiall() {
      this.loadingnotifikasiall = true
      try {
        const res = await api.get('/notif/simpantoken/notifications-all')
        this.itemsnotifikasiall = res.data?.data || []
        this.loadingnotifikasiall = false
      } catch (err) {
        console.log(err)
        this.loadingnotifikasiall = false
      }
    },
    async kirimnotifikasiall() {
      this.loadingnotifikasiall = true
      try {
        const res = await api.get('/notif/simpantoken/kirim-notifikasi-all')
        if (res.data.status === true) {
          notifSuccess(res.data.message)
          this.getNotifikasiall()
        } else {
          notifError(res.data.message)
        }
        this.loadingnotifikasiall = false
      } catch (err) {
        console.log(err)
        this.loadingnotifikasiall = false
      }
    },
    async hapusallnotifikasiall() {
      this.loadingnotifikasiall = true
      try {
        const res = await api.get('/notif/simpantoken/hapus-all-notifikasi-all')
        if (res.data.status === true) {
          notifSuccess(res.data.message)
          this.getNotifikasiall()
        } else {
          notifError(res.data.message)
        }
        this.loadingnotifikasiall = false
      } catch (err) {
        console.log(err)
        this.loadingnotifikasiall = false
      }
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
