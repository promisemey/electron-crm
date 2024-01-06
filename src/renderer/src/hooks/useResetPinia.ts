import { useMenuStore } from '@store/menuStore'
import { useTabsStore } from '@store/tabsStore'
import { useUserStore } from '@store/userStore'

export const useResetPinia = () => {
  const menuStore = useMenuStore()
  const userStore = useUserStore()
  const tabsStore = useTabsStore()

  menuStore.reset()
  userStore.reset()
  tabsStore.reset()

  localStorage.removeItem('token')
  localStorage.removeItem('userInfo')
  localStorage.removeItem('role')
  localStorage.removeItem('rolePerm')
  localStorage.removeItem('menu_info')
  localStorage.removeItem('mapRoutes')
}
