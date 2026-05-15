import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'

export const useHistoryPembayaranStore = defineStore('historyPembayaran', {
  state: () => ({
    items: [],
    loading: false,
    params: {
      tahun: new Date().getFullYear(),
    },
    isError: false,
  }),
  actions: {
    setParams() {
      this.getlist()
    },
    getlist() {
      this.loading = true
      const params = { params: this.params }
      return new Promise((resolve, reject) => {
        api
          .get('/laporan/lapyangsudahbayar/get-history-pembayaran', params)
          .then((response) => {
            this.items = response.data?.data
            this.loading = false
            resolve(response.data)
          })
          .catch((error) => {
            this.loading = false
            reject(error)
          })
      })
    },
  },
})