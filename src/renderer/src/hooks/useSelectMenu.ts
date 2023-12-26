import { useMenuStore } from '@store/menuStore'

import router from '@router'
// 菜单数据
const menuStore = useMenuStore()

interface Active {
  index: string
}

// 查找二级菜单
export const useSelectMenu = (active: Active) => {
  // if (route.path.includes(active.index)) return
  // 更新二级数据

  console.log(active)

  const menuItem = menuStore.menuInfo.find((item) => item.path == active.index)

  console.log(menuItem)

  const childData = menuItem?.children

  if (childData?.length) {
    menuStore.childMenu = childData
    Object.assign(childData.values, childData)
    menuStore.defaultActive = active.index

    menuStore.childDefaultActive = childData[0].path + childData[0].meta.title
    menuStore.currentMenu = menuItem?.meta.title

    // 跳转二级首项
    let routePath = childData[0].path

    if (active.index === '/logger') routePath = active.index + routePath

    console.log(routePath)

    router.push(routePath)
  }
}
