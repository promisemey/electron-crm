import router from '@router'
import { useDyRoutesStore } from '@store/dyRoutesStore'
import { storeToRefs } from 'pinia'

// 全局前置导航守卫
router.beforeEach(async (to, from, next) => {
  // 添加路由
  const mapRoutes = useDyRoutesStore()
  const { dyRoutes } = storeToRefs(mapRoutes)
  dyRoutes.value.forEach((item) => router.addRoute(item.parentView ?? item.name, item))

  const white = ['/login']
  const token = localStorage.getItem('token')
  // 是否在白名单
  if (white.includes(to.path)) {
    next()
  } else {
    // token 不存在 重定向登录页
    if (!token) {
      next('/login')
    } else {
      // 如果没有匹配到路径
      if (to.matched.length == 0) {
        router.push(to.fullPath)
      }

      next()
    }
  }
})

// 全局后置导航守卫
router.afterEach(() => {
  console.log('前置')
})
