import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'
import { notifError, notifSuccess } from 'src/modules/notifs'

export const usePembayaranIuranBulananStore = defineStore('pembayaranIuranbulanan', {
  state: () => ({
    items: [],
    loading: false,

    params: {
      q: '',
      bulan: '',
      tahun: new Date().getFullYear(),
    },
    form: {
      id: '',
      notrans: '',
      bulan: new Date().getMonth() + 1,
      tahun: new Date().getFullYear(),
      warga_id: '',
      nama: '',
      jeniskewargaan: '',
      jumlah: '',
      carabayar: '',
      keterangan: '',
    },
    isError: false,
  }),
  actions: {
    getlist() {
      this.loading = true
      const params = { params: this.params }
      return new Promise((resolve, reject) => {
        api
          .get('/transaksi/pembayaraniuran/get-pembayaran-iuran', params)
          .then((response) => {
            this.items = response.data
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
          .post('/transaksi/pembayaraniuran/simpan', this.form)
          .then(({ data }) => {
            this.notrans = data?.data[0]?.notrans
            this.items.push(data?.data[0])
            // console.log('data', data?.data)
            this.initReset()
            notifSuccess(data?.message)
            this.loading = false
            resolve(data)
          })
          .catch((err) => {
            this.loading = false
            this.isError = true
            notifError(err?.response?.data?.message)
            reject(err)
          })
      })
    },
    initReset() {
      this.form.id = ''
      this.form.notrans = ''
      // this.form.bulan = new Date().getMonth() + 1
      // this.form.tahun = new Date().getFullYear()
      this.form.warga_id = ''
      this.form.jeniskewargaan = ''
      this.form.jumlah = ''
      this.form.carabayar = ''
      this.form.keterangan = ''
      // const bulanSekarang = String(new Date().getMonth() + 1).padStart(2, '0')
      // this.form.bulan = bulanSekarang
    },
  },
})
