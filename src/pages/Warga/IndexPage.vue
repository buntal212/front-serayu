<template>
  <q-page class="dashboard-bg">
    <div class="container">
      <div>
        <ListPage
          v-if="isList"
          @add="
            () => {
              item = null
              isList = false
            }
          "
          @edit="
            (data) => {
              item = data
              isList = false
            }
          "
          @hapus="hapusWarga($event)"
        />
        <FormPage v-else :data="item" @back="isList = true" />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useWargaStore } from 'src/stores/Warga/warga'
import FormPage from './comp/FormPage.vue'
import ListPage from './comp/ListPage.vue'

const store = useWargaStore()
const isList = ref(true)
const item = ref(null)

function hapusWarga(data) {
  store.form.id = data.id
  store.hapus(data.id)
}
onMounted(() => {
  store.getlist()
})
</script>

<style scoped>
.dashboard-bg {
  background: radial-gradient(circle at top, #020617, #020617 40%, #000000);
}
</style>
