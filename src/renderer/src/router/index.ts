import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'

const router = createRouter({
  // history: createWebHistory(),
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'layout',
      redirect: '/dashboard',
      component: () => import('@renderer/layout/index.vue'),
      children: [
        {
          name: '404',
          path: '/:catchAll(.*)',
          component: () => import(`@renderer/views/404.vue`)
        }
      ]
    },
    {
      path: '/login',
      name: '登录',
      component: () => import('@renderer/views/login/index.vue')
    }
  ]
})

export default router
