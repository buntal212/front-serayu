<template>
  <q-page class="notif-index-page">
    <ListPage @open="showDetail" />
  </q-page>
</template>

<script setup>
import { useRouter } from 'vue-router'
import ListPage from './comp/ListPage.vue'

const router = useRouter()

const showDetail = (notif) => {
  router.push({ name: 'notif-detail', params: { id: notif.id } })
}
</script>

<style scoped>
.notif-index-page {
  background: linear-gradient(180deg, #0f172a 0%, #1e293b 100%);
  min-height: 100vh;
}
</style>
