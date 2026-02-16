<template>
  <q-page class="dashboard-bg">
    <div class="container">
      <div>
        <ListPage v-if="isList" @open="bukanotif()" @back="isList = true" />
        <NotifDetailPage v-else @back="isList = true" />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import ListPage from './comp/ListPage.vue'
import NotifDetailPage from './comp/NotifDetailPage.vue'
const isList = ref(true)

function bukanotif() {
  isList.value = false
}
</script>

<style scoped>
.dashboard-bg {
  background: radial-gradient(circle at top, #020617, #020617 40%, #000000);
}
</style>
