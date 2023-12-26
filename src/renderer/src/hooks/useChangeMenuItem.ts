import { useMenuStore } from '@store/menuStore'
import router from '@router'

// 菜单数据
const menuStore = useMenuStore()

interface MenuItem {
  path: string
  title: string
}

export const useChangeMenuItem = ({ path, title }: MenuItem) => {
  menuStore.childDefaultActive = path + title
  // if(path.includes('channel-'))

  if (path.includes('channel-')) path = path.replace('/channel-', '')

  router.push(path.replace('/log/', '/logger/log/'))
}
