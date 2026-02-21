<template>
  <q-layout view="lHh Lpr lFf">
    <!-- KONTEN ATAS -->
    <q-page-container>
      <q-page class="q-pa-md">
        <q-tab-panels v-model="tab" animated class="fit dashboard-bg">
          <q-tab-panel name="tokenfcm">
            <q-card flat bordered class="dashboard-bg text-white">
              <q-card-section class="text-subtitle1 text-weight-bold">
                🔑 Daftar Token FCM
                <q-btn
                  label="Hapus All Tokens"
                  color="red"
                  dense
                  @click="store.hapusalltoken()"
                  :loading="store.loadingfcmtoken"
                />
              </q-card-section>
              <q-separator />
              <q-card-section>
                <div v-if="store.loadingfcmtoken" class="row justify-center q-pa-md">
                  <q-spinner size="40px" color="primary" />
                </div>
                <div v-else>
                  <q-list>
                    <q-item v-for="item in store.itemsfcmtoken" :key="item.id">
                      <q-item-section>
                        <q-item-label class="text-weight-bold">
                          User : {{ item.user?.name }}
                        </q-item-label>
                        <q-item-label lines="2"> Token : {{ item.token }} </q-item-label>
                        <q-item-content>
                          <q-item-label caption class="text-white">
                            DEVICE NAME {{ item.device_name }}
                          </q-item-label>
                          <q-item-label caption class="text-white">
                            PLATFORM : {{ item.platform }}
                          </q-item-label>
                        </q-item-content>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </div>
              </q-card-section>
            </q-card>
          </q-tab-panel>

          <q-tab-panel name="notfikasi">
            <q-card flat bordered class="dashboard-bg text-white">
              <q-card-section class="text-subtitle1 text-weight-bold">
                🔔 Isi Semua Notifikasi
                <div class="q-gutter-sm">
                  <q-btn
                    label="Hapus All Notif"
                    color="red"
                    dense
                    @click="store.hapusallnotifikasiall()"
                    :loading="store.loadingnotifikasiall"
                  />
                  <q-btn
                    label="Test Notif"
                    color="primary"
                    dense
                    @click="store.kirimnotifikasiall()"
                    :loading="store.loadingnotifikasiall"
                  />
                </div>
              </q-card-section>
              <q-separator />
              <q-card-section>
                <div v-if="store.loadingnotifikasiall" class="row justify-center q-pa-md">
                  <q-spinner size="40px" color="primary" />
                </div>
                <div v-else>
                  <q-list>
                    <q-item v-for="item in store.itemsnotifikasiall" :key="item.id">
                      <q-item-section>
                        <q-item-label class="text-weight-bold">
                          Type : {{ item.title }} ( {{ item.type }} )
                        </q-item-label>
                        <q-item-label lines="2"> Data : {{ item.data_json }} </q-item-label>
                        <q-item-content>
                          <q-item-label caption class="text-white">
                            Dari : {{ item.user?.name }}
                          </q-item-label>
                          <q-item-label caption class="text-white">
                            Kirim Ke : {{ item.user_penerima?.name }}
                          </q-item-label>
                        </q-item-content>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </div>
              </q-card-section>
            </q-card>
          </q-tab-panel>

          <q-tab-panel name="tesnotif"> 📤 Isi Tes Notifikasi </q-tab-panel>
        </q-tab-panels>
      </q-page>
    </q-page-container>

    <!-- FOOTER -->
    <q-footer bordered>
      <MenusPages v-model="tab" />
    </q-footer>
  </q-layout>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import MenusPages from './comp/MenusPages.vue'
import { usenotifikasiStore } from 'src/stores/notif/notif'

const tab = ref('tokenfcm')
const store = usenotifikasiStore()
onMounted(async () => {
  store.getlisttoken()
})
</script>
<style scoped>
.dashboard-bg {
  background: radial-gradient(circle at top, #020617, #020617 40%, #000000);
}
</style>
