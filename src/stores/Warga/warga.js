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
    loadinghapusrinci: false,
    loadingregister: false,
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
    formregister: {
      nokk: '',
      username: '',
      password: '',
      confirmpassword: '',
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
        this.itemsrinci.unshift(newData)
        // if (!this.formrinci.id) {
        //   console.log('asd', this.formrinci.id)
        // } else {
        //   this.itemsrinci = this.itemsrinci.map((i) => (i.id === newData.id ? newData : i))
        // }
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
      this.formrinci.foto = ''
      this.uploadedFiles = []
      this.resetUploaderKey++
    },
    initReset() {
      this.form.id = ''
      this.form.nama = ''
      this.form.nokk = ''
    },

    async hapusrinci(data) {
      this.loadinghapusrinci = true
      const params = { id: data.id, id_heder: data.id_heder, foto: data.foto, path: data.path }

      try {
        const { data: resp } = await api.post('/master/warga/hapusrinci', params)
        // Cari item dulu SEBELUM dihapus
        const item = this.items.find((i) => i.id === Number(data.id_heder))

        // Update rincian jika masih ada item-nya
        if (item && resp.data?.rincian) {
          item.rincian = resp.data.rincian
        }

        // Hapus item dari array
        // this.items = this.items.filter((x) => x.id !== data.id)
        this.itemsrinci = this.itemsrinci.filter((item) => item.id !== data.id)
        notifSuccess(resp.message)
      } catch (err) {
        notifError(err.response?.data?.message || 'Gagal menghapus data')
        throw err
      } finally {
        this.loadinghapusrinci = false
      }
    },
    async simpanregister(router) {
      this.loadingregister = true
      this.isError = false
      try {
        const { data } = await api.post('/register', this.formregister)
        // console.log(data?.data)
        notifSuccess(data.message)
        this.initresetregister()
        router.push('/login')
      } catch (err) {
        this.isError = true
        notifError(err.response?.data?.message || 'Gagal menyimpan data')
        throw err
      } finally {
        this.loadingregister = false
      }
    },
    initresetregister() {
      this.formregister.nokk = ''
      this.formregister.username = ''
      this.formregister.password = ''
      this.formregister.confirmpassword = ''
    },
  },
})
