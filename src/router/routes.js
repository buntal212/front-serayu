const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: '/profile', component: () => import('pages/Profile/IndexPage.vue') },
      { path: '/warga', component: () => import('pages/Warga/IndexPage.vue') },
      { path: '/iuranbulanan', component: () => import('pages/Iuranbulanan/IndexPage.vue') },
      { path: '/belanja', component: () => import('pages/Belanja/IndexPage.vue') },
      {
        path: '/laporanpembayaran',
        component: () => import('pages/Laporanpembayaran/IndexPage.vue'),
      },
      {
        path: '/laporankas',
        component: () => import('pages/Laporankas/IndexPage.vue'),
      },
      {
        path: '/hakakses',
        component: () => import('pages/Hakakses/IndexPage.vue'),
      },
      {
        path: 'logout',
        component: () => import('src/pages/LogoutPage.vue'),
      },
    ],
  },

  {
    path: '/login',
    component: () => import('layouts/LoginLayout.vue'),
    children: [
      { path: '', component: () => import('pages/LoginPage.vue') },
      { path: '/register', component: () => import('pages/RegisterPage.vue') },
      { path: '/formwarga', component: () => import('pages/FormWarga.vue') },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
