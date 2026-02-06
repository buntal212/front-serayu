import { defineStore } from 'pinia'
import { date } from 'quasar'
import { api } from 'src/boot/axios'
import { notifError, notifSuccess } from 'src/modules/notifs'

export const useBelanjaStore = defineStore('belanja', {
  state: () => ({
    items: [],
    itemsrincian: [],
    loading: false,
    loadinghapusrinci: false,
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
            const header = data?.data?.[0]
            const rincianBaru = header?.rincian?.[0]

            // ✅ rincian selalu ditambah
            if (rincianBaru) {
              this.rincian.unshift(rincianBaru)
              console.log('sasasasa', this.form.totalbelanja)
              const totalbelanjasekarang = header?.totalbelanja
              this.form.totalbelanja = totalbelanjasekarang + this.form.subtotal
            }

            // 🔍 cek header sudah ada di items atau belum
            const index = this.items.findIndex((item) => item.notrans === header?.notrans)
            if (index === -1 && header?.notrans) {
              // ➕ belum ada → tambah di depan
              this.items.unshift(header)
            } else if (index !== -1) {
              // 🔄 sudah ada → update datanya
              this.items[index] = {
                ...this.items[index],
                ...header,
              }
            }

            // sync ke form
            if (header?.notrans) {
              this.form.notrans = header.notrans
            }

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
    async hapusrincian(val) {
      this.loadinghapusrinci = true
      try {
        const payload = {
          id: val.id,
          notrans: this.form.notrans,
          totalbelanja: this.form.totalbelanja - val.subtotal,
        }

        const { data } = await api.post(
          '/transaksi/transaksibelanja/hapus-rincian-belanja',
          payload,
        )

        const header = data?.data?.[0]

        // 1️⃣ hapus rincian di frontend
        this.rincian = this.rincian.filter((x) => x.id !== val.id)

        // 2️⃣ update header kalau backend kirim data terbaru
        if (header?.notrans) {
          const idx = this.items.findIndex((item) => item.notrans === header.notrans)

          if (idx !== -1) {
            // update header lama
            this.items.splice(idx, 1, {
              ...this.items[idx],
              ...header,
            })
          }
        }

        // 3️⃣ sinkronkan total
        if (header?.totalbelanja !== undefined) {
          this.form.totalbelanja = header.totalbelanja
        }
        notifSuccess(data?.message)
        // this.loadinghapusrinci = false
      } catch (err) {
        console.error(err)
        this.$q.notify({
          type: 'negative',
          message: 'Gagal menghapus rincian',
        })
      } finally {
        this.loadinghapusrinci = false
        this.clickedId = null
      }
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
