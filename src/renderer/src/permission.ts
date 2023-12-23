import router from './router'

// 全局前置导航守卫
router.beforeEach(() => {
  console.log('前置')
  return true
})

// 全局后置导航守卫
router.afterEach(() => {
  console.log('前置')
})
