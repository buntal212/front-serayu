import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'

export const usenotifikasiStore = defineStore('notifikasi-store', {
  state: () => ({
    items: [],
    loading: false,
    isError: false,
  }),
  actions: {
    async simpantoken(token) {
      await api.post('/notif/simpantoken/simpantoken', {
        token,
        platform: 'web',
        device_name: navigator.userAgent,
      })
    },
  },
})
