import { useMenuStore } from '@store/menuStore'

import router from '@router'
// 菜单数据
const menuStore = useMenuStore()

interface MenuItem {
  path?: string
  title?: string
}
interface MenuValType extends MenuItem {
  index?: string
}

// 查找二级菜单
enum Level {
  PRIMARY,
  MenuItem
}

export const useSelectMenu = (active: MenuValType, level?: Level) => {
  if (!level && active.index) {
    // 更新二级数据
    const menuItem = menuStore.dyRoutes.find((item) => item.path == active.index)

    const childData = menuItem?.children

    if (childData?.length) {
      menuStore.childMenu = childData
      Object.assign(childData.values, childData)
      menuStore.defaultActive = active.index

      if (!active.path || !active.title) {
        active.path = childData[0].path
        active.title = childData[0].meta.title
      }

      console.log(menuItem, '-----')

      menuStore.currentMenu = menuItem?.name

      // 跳转二级首项
      // let routePath = childData[0].path
      // if (active.index === '/logger') routePath = active.index + routePath
      // // router.push(routePath)
    }
  }

  useChangeMenuItem({ path: active.path, title: active.title })
}

const useChangeMenuItem = ({ path, title }: MenuItem) => {
  // console.log('path, title', path, title)

  if (path && title) {
    menuStore.childDefaultActive = path
    router.push(path)
  }
}
