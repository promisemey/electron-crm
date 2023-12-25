import router from '@router'
import { useMenuStore } from '@store/menuStore'
// import { useDyRoutesStore } from '@store/dyRoutesStore'
import { storeToRefs } from 'pinia'

// 添加路由

// 全局前置导航守卫
router.beforeEach((to, from, next) => {
  const white = ['/login']
  const token = localStorage.getItem('token')

  const menuStore = useMenuStore()
  const { getMenuInfo } = menuStore
  // const mapRoutes = useDyRoutesStore()
  // const { dyRoutes } = storeToRefs(mapRoutes)

  // console.log(dyRoutes.value)

  // dyRoutes.value.forEach((item) => router.addRoute(item.parentView ?? item.name, item))

  // 是否在白名单
  if (white.includes(to.path)) {
    next()
  } else {
    // token 不存在 重定向登录页
    if (!token) {
      next('/login')
    } else {
      // 如果没有匹配到路径
      getMenuInfo()
      if (!to.redirectedFrom) {
        // getMenuInfo()
        // console.log('1', router.getRoutes())
        next({ ...to })
        // next()
      } else {
        // console.log(2, router.getRoutes())

        next()
      }

      // // return
      // if (router.hasRoute(to.fullPath)) {
      //   next()
      // }

      // next({ replace: true })
    }
  }
})

// 全局后置导航守卫
router.afterEach(() => {
  console.log('前置')
})
