<template>
  <q-page class="dashboard-bg">
    <div class="container">
      <div>
        <ListPage v-if="isList" @open="bukanotif($event)" />
        <NotifDetailPage v-else @back="isList = true" :data="datadetail" />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import ListPage from './comp/ListPage.vue'
import NotifDetailPage from './comp/NotifDetailPage.vue'
const isList = ref(true)
const datadetail = ref(null)

function bukanotif(val) {
  datadetail.value = val
  isList.value = false
}
</script>

<style scoped>
.dashboard-bg {
  background: radial-gradient(circle at top, #020617, #020617 40%, #000000);
}
</style>
