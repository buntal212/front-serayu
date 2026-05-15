import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'

export const useLapKasEntryStore = defineStore('lapKasEntry', {
  state: () => ({
    items: [],
    loading: false,
    params: {
      bulan: new Date().getMonth() + 1,
      tahun: new Date().getFullYear(),
    },
    isError: false,
  }),
  actions: {
    setParams(val) {
      this.params = { ...this.params, ...val }
      this.getlist()
    },
    getlist() {
      this.loading = true
      const params = { params: this.params }
      return new Promise((resolve, reject) => {
        api
          .get('/laporan/lapkasentry/get-laporan', params)
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