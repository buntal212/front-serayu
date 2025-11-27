import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'
import { notifError, notifSuccess } from 'src/modules/notifs'

export const useWargaStore = defineStore('mwarga', {
  state: () => ({
    items: [],
    itemsrinci: [],
    loading: false,
    loadinghapus: false,
    loadingrinci: false,
    dialog: false,
    params: {
      q: '',
    },
    form: {
      id: '',
      nama: '',
      nokk: '',
    },
    formrinci: {
      id: '',
      id_heder: '',
      nama: '',
      noktp: '',
    },
    uploadedFiles: [],
    isError: false,
  }),
  actions: {
    getlist() {
      this.loading = true
      const params = { params: this.params }
      return new Promise((resolve, reject) => {
        api
          .get('/master/warga/get-warga', params)
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
    simpan() {
      this.loading = true
      this.isError = false
      return new Promise((resolve, reject) => {
        api
          .post('/master/warga/simpan', this.form)
          .then(({ data }) => {
            const newData = data?.data
            if (this.form.id === '') {
              this.items.push(newData)
            } else {
              this.items = this.items.map((item) => {
                if (item.id === newData.id) {
                  return newData
                }
                return item
              })
            }
            this.initReset()
            notifSuccess(data?.message)
            this.loading = false
            resolve(data)
          })
          .catch((err) => {
            notifError(err)
            this.loading = false
            reject(err)
          })
      })
    },
    hapus(id) {
      this.loadinghapus = true
      return new Promise((resolve, reject) => {
        api
          .post('/master/warga/hapus', { id })
          .then(({ data }) => {
            this.items = this.items.filter((item) => item.id !== id)
            notifSuccess(data?.data?.message)
            this.loadinghapus = false
            resolve(data)
          })
          .catch((err) => {
            notifError(err)
            this.loadinghapus = false
            reject(err)
          })
      })
    },
    async simpanrinci() {
      this.loadingrinci = true
      this.isError = false
      try {
        const formData = new FormData()

        for (const key in this.formrinci) {
          formData.append(key, this.formrinci[key])
        }

        // Tambah file dari uploader
        // if (this.uploadedFiles.length > 0) {
        formData.append('foto', this.uploadedFiles) // ambil file pertama
        // }

        const { data } = await api.post('/master/warga/simpanrinci', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })

        const newData = data.data
        if (!this.formrinci.id) {
          this.itemsrinci.unshift(newData)
        } else {
          this.itemsrinci = this.itemsrinci.map((i) => (i.id === newData.id ? newData : i))
        }
        this.initResetrinci()
        notifSuccess(data.message)
      } catch (err) {
        this.isError = true
        notifError(err.response?.data?.message || 'Gagal menyimpan data')
        throw err
      } finally {
        this.loadingrinci = false
      }
    },
    initResetrinci() {
      this.formrinci.id = ''
      this.formrinci.id_heder = ''
      this.formrinci.nama = ''
      this.formrinci.noktp = ''
      this.uploadedFiles = []
    },
    initReset() {
      this.form.id = ''
      this.form.nama = ''
      this.form.nokk = ''
    },
  },
})
