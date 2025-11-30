import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'
import { notifError, notifSuccess } from 'src/modules/notifs'

export const useHakAksesStore = defineStore('hakakses', {
  state: () => ({
    items: [],
    loading: false,
    loadingsimpan: false,
    isError: false,
    dialog: false,
    form: {
      id_warga: '',
      id_menu: [],
    },
  }),
  actions: {
    getlist(idwarga) {
      this.loading = true
      return new Promise((resolve, reject) => {
        api
          .get('/master/hakakses/get-hakakses', { params: { idwarga } })
          .then((response) => {
            this.items = response.data.data.map((m) => ({
              ...m,
              checked: m.hakakses.length > 0, // jika ada relasi → otomatis dicentang
            }))
            console.log(this.items)
            this.loading = false
            resolve(response.data)
          })
          .catch((error) => {
            this.loading = false
            reject(error)
          })
      })
    },
    async simpan() {
      this.loadingsimpan = true
      this.isError = false
      try {
        const { data } = await api.post('/master/hakakses/simpan', this.form)
        notifSuccess(data.message)
        this.loadingsimpan = false
      } catch (err) {
        this.isError = true
        notifError(err.response?.data?.message || 'Gagal menyimpan data')
        throw err
      } finally {
        this.loadingsimpan = false
      }
    },
  },
})
