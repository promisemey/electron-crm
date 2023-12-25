import { useMenuStore } from '@store/menuStore'
import { storeToRefs } from 'pinia'
import { ComponentViews, ResetMenu, RoutesItem } from '@types'

export const mapRoutes = () => {
  const menuStore = useMenuStore()
  const { menuInfo } = storeToRefs(menuStore)

  const views = (component): ComponentViews => {
    if (!component) return
    const module = import.meta.glob('@renderer/views/**/*.vue')
    component = component.match('index')?.length >= 1 ? component : `${component}/index`
    return module[`/src/views/${component}.vue`]
  }

  const addRouteDy = (menu: ResetMenu[], routes: RoutesItem[] = [], path = ''): RoutesItem[] => {
    if (menu.length == 0 || routes == undefined) return []

    menu.forEach((item): void => {
      const routesItem: RoutesItem = {
        path: item.path.match(path)
          ? item.path
          : `${path}/${item.path}`.replace('//', '/').replace('/home/', '/'),
        name: item.name,
        redirect: item.redirect,
        parentView: item.parentView,
        meta: item.meta,
        children: item.children ?? [],
        component: item.component ?? null
      }
      // 父级路由
      if (!item.component) {
        routesItem.children = []
      } else {
        routesItem.component = views(item.component)
      }
      routes.push(routesItem)

      if (item.children != null) addRouteDy(item.children, routesItem.children, item.path)
    })

    return routes
  }

  return addRouteDy(menuInfo.value)
}
