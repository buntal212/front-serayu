<template>
  <q-footer class="bottom-bar q-py-md">
    <div class="row justify-center items-center q-gutter-lg">
      <q-btn
        flat
        rounded
        no-caps
        class="nav-btn"
        :class="{ 'active': isActive('/') }"
        icon="home"
        label="Home"
        @click="goHome()"
      >
        <q-tooltip :offset="[0, 5]">{{ $t('Home') }}</q-tooltip>
      </q-btn>

      <q-btn
        flat
        rounded
        no-caps
        class="nav-btn"
        :class="{ 'active': isActive('/dashboard') }"
        icon="dashboard"
        label="Dashboard"
        @click="goTo('/dashboard')"
      >
        <q-tooltip :offset="[0, 5]">{{ $t('Dashboard') }}</q-tooltip>
      </q-btn>

      <q-btn
        flat
        rounded
        no-caps
        class="nav-btn logout-btn"
        icon="logout"
        label="Exit"
        @click="logoutUser()"
      >
        <q-tooltip :offset="[0, 5]">{{ $t('Logout') }}</q-tooltip>
      </q-btn>
    </div>
  </q-footer>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

function goHome() {
  router.push('/')
}

function goTo(path) {
  router.push(path)
}

function isActive(path) {
  return route.path === path
}

function logoutUser() {
  router.push('/logout')
}
</script>

<style scoped>
.bottom-bar {
  position: fixed;
  bottom: 0;
  width: 100%;
  z-index: 1000;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.85) 0%, rgba(255, 255, 255, 0.95) 100%);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-top: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 -8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.5);
}

.nav-btn {
  min-height: 48px;
  padding: 8px 24px;
  border-radius: 24px;
  font-weight: 600;
  font-size: 14px;
  letter-spacing: 0.5px;
  color: #666;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: transparent;
  position: relative;
  overflow: hidden;
}

.nav-btn::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.nav-btn:hover::before {
  opacity: 0.1;
}

.nav-btn:hover {
  color: #667eea;
  transform: translateY(-2px);
}

.nav-btn.active {
  color: white;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.nav-btn.active .q-icon {
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.logout-btn {
  color: #ef5350;
}

.logout-btn:hover {
  color: #c62828;
  background: rgba(239, 83, 80, 0.1);
}

.logout-btn::before {
  display: none;
}

@media (max-width: 600px) {
  .nav-btn {
    padding: 6px 16px;
    font-size: 12px;
    min-height: 40px;
  }
}
</style>
