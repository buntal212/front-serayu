<template>
  <q-page class="dashboard-bg">
    <div class="container">
      <div>
        <ListPage v-if="isList" @open="bukanotif($event)" @back="isList = true" />
        <NotifDetailPage v-else @back="isList = true" />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import ListPage from './comp/ListPage.vue'
import NotifDetailPage from './comp/NotifDetailPage.vue'
import { useRouter } from 'vue-router'

const isList = ref(true)
const router = useRouter()
const bukanotif = (notif) => {
  router.push(`/notif/${notif.id}`)
}
// function bukanotifx() {
//   isList.value = false
// }
</script>

<style scoped>
.dashboard-bg {
  background: radial-gradient(circle at top, #020617, #020617 40%, #000000);
}
</style>
