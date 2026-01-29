import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'
import { notifError } from 'src/modules/notifs'

export const useCuacaStore = defineStore('cuaca', {
  state: () => ({
    loading: false,
    items: [],
    rawData: [],
    listJam: [],
  }),

  actions: {
    async getCuaca() {
      this.loading = true
      this.rawData = []
      this.listJam = []
      try {
        const res = await api.get('/cuaca', {
          params: {
            adm4: '35.74.05.1006',
          },
        })

        const data = res.data.data[0].cuaca[0]
        this.data = data
        this.listJam = data.map((item) => {
          const d = new Date(item.datetime)

          return {
            tanggal: d.toLocaleDateString('id-ID', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            }),
            jam: d.toLocaleTimeString('id-ID', {
              hour: '2-digit',
              minute: '2-digit',
            }),
            suhu: item.t,
            cuaca: this.convertWeatherCode(item.weather),
            hujan: item.tp,
            angin: item.ws,
            image: item.image,
          }
        })
        console.log('data cuaca', this.data)
        console.log('data cuacaxxx', this.listJam)
      } catch (err) {
        this.error = 'Gagal mengambil data cuaca'
        console.error(err)
      } finally {
        this.loading = false
      }
    },
    convertWeatherCode(code) {
      const list = {
        0: 'Cerah',
        1: 'Cerah Berawan',
        2: 'Cerah Berawan',
        3: 'Berawan',
        4: 'Berawan Tebal',
        60: 'Hujan Ringan',
        61: 'Hujan Sedang',
        63: 'Hujan Lebat',
        80: 'Hujan Lokal',
        95: 'Petir',
      }

      return list[code] ?? 'Tidak diketahui'
    },
    async jadwatshalat() {
      this.loading = true
      try {
        const { data: resp } = await api.get('/jadwalshalat')
        const today = new Date().toLocaleDateString('en-CA')
        const jadwal = resp?.data?.data?.jadwal?.[today]
        if (jadwal) {
          this.items = { ...jadwal }
          delete this.items.tanggal
        }
        console.log('jadwal shalat hari ini', this.items)
      } catch (err) {
        notifError(err.response?.data?.message || 'Gagal menghapus data')
        throw err
      } finally {
        this.loading = false
      }
    },
  },
})
