import { createRouter, createWebHashHistory } from 'vue-router'

export default createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      // path: '/login',
      name: '登录',
      component: () => import('@renderer/view/login/index.vue')
    },
    {
      path: '/list',
      // path: '/login',
      name: '子页面',
      component: () => import('@renderer/view/list/index.vue')
    },
    {
      path: '/1',
      name: '首页',
      component: () => import('@renderer/layout/index.vue')
    }
  ]
})
