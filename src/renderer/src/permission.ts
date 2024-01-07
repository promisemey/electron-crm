import router from '@router'
import { useMenuStore } from '@store/menuStore'

// 全局前置导航守卫
router.beforeEach(async (to, _from, next) => {
  const white = ['/login']
  const token = localStorage.getItem('TOKEN')
  const menuStore = useMenuStore()
  const { getMenuInfo } = menuStore

  // 是否在白名单
  if (white.includes(to.path)) {
    next()
  } else {
    // token 不存在 重定向登录页
    if (!token) {
      next('/login')
    }
    // 加载动态路由
    await getMenuInfo()

    if (!to.redirectedFrom) {
      next({ ...to, replace: true })
    } else {
      // 首次打开 直接进入首页时
      // 统计 是否开始进入死循环
      const count = Reflect.get(to.redirectedFrom, '_count')

      if (to.name === '404' && count === undefined) {
        next({ path: to.path, replace: true })
      } else {
        next()
      }
    }
  }
})

// 全局后置导航守卫
router.afterEach(() => {
  console.log('前置')
})
