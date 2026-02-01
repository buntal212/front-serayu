import { defineStore } from 'pinia'
import { date } from 'quasar'
import { api } from 'src/boot/axios'
import { notifError, notifSuccess } from 'src/modules/notifs'

export const useBelanjaStore = defineStore('belanja', {
  state: () => ({
    items: [],
    itemsrincian: [],
    loading: false,
    rincianloading: false,
    dialog: false,
    params: {
      q: '',
      bulan: '',
      tahun: new Date().getFullYear(),
    },
    form: {
      id: '',
      notrans: '',
      tgl: date.formatDate(new Date(), 'YYYY-MM-DD'),
      jenisbelanja: '',
      keterangan: '',
      jenispembayaran: '',
      totalbelanja: 0,
      namabarang: '',
      jumlah: 1,
      harga: 0,
      subtotal: 0,
    },
    rincian: [],
    harga: 0,
    isError: false,
  }),
  actions: {
    getlist() {
      this.loading = true
      const params = { params: this.params }
      return new Promise((resolve, reject) => {
        api
          .get('/transaksi/transaksibelanja/get-belanja', params)
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
      this.rincianloading = true
      this.isError = false
      return new Promise((resolve, reject) => {
        api
          .post('/transaksi/transaksibelanja/simpan', this.form)
          .then(({ data }) => {
            this.form.notrans = data?.data[0]?.notrans
            this.items.unshift(data?.data[0])
            this.form.totalbelanja += this.form.subtotal
            this.rincian.unshift(data?.data[0]?.rincian[0])
            this.initResetrincian()
            this.rincianloading = false
            notifSuccess(data?.message)
            resolve(data)
          })
          .catch((err) => {
            this.rincianloading = false
            this.isError = true
            notifError(err?.response?.data?.message)
            reject(err)
          })
      })
    },
    initReset() {
      this.form.id = ''
      this.form.notrans = ''
      this.form.tgl = date.formatDate(new Date(), 'YYYY-MM-DD')
      this.form.jenisbelanja = ''
      this.form.keterangan = ''
      this.form.totalbelanja = 0
      this.initResetrincian()
    },
    initResetrincian() {
      this.form.namabarang = ''
      this.form.jumlah = 1
      this.form.harga = 0
      this.harga = 0
      this.form.subtotal = 0
    },
  },
})
