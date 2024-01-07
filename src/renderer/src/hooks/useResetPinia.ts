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

  const reme_tut = localStorage.getItem('reme_tut')
  localStorage.clear()

  reme_tut && localStorage.setItem('reme_tut', reme_tut)
}
