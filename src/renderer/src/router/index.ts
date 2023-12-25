import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'layout',
      redirect: '/dashboard',
      component: () => import('@renderer/layout/index.vue'),
      children: []
    },
    {
      path: '/login',
      name: '登录',
      component: () => import('@renderer/views/login/index.vue'),
      children: []
    }
  ]
})

export default router
