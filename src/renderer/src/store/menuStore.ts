import { getMenuInfoApi } from '@api/common'
import { defineStore, storeToRefs } from 'pinia'
import { useUserStore } from './userStore'
import { reactive, ref } from 'vue'
import { ComponentViews, MenuStore, ResetMenu, RoutesItem } from '@types'
import router from '@router'
import { Menu } from '@api/common/types'
import { RecordsItem } from '@api/role/types'
// import { RouteRecordRaw } from 'vue-router'

export const useMenuStore = defineStore('menuStore', () => {
  const localMenu = localStorage.getItem('menu_info')

  const menu_info = ref<Menu[]>(localMenu ? JSON.parse(localMenu) : [])

  // 二级菜单
  const childMenu = reactive<RoutesItem[]>([])
  const defaultActive = ref('/home')
  // 二级菜单  默认选中该
  const childDefaultActive = ref<string>('')
  // 一级标题
  const currentMenu = ref<unknown>('')
  const isCollapse = ref<boolean>(true)

  // 本地路由信息
  // const localRoutes = localStorage.getItem('mapRoutes')
  const dyRoutes = ref<RoutesItem[]>([])

  const views = (component): ComponentViews => {
    if (!component) return
    const module = import.meta.glob('@renderer/views/**/*.vue')

    component = component.match('home')?.length >= 1 ? `${component}/index` : component
    return module[`/src/views/${component}.vue`]
  }

  // 映射路由数据
  const addRouteDy = <T extends ResetMenu>(
    menu: T[],
    routes: RoutesItem[] = [],
    parent?: Record<string, unknown>
  ): RoutesItem[] => {
    // 原始菜单
    if (menu.length == 0 || routes == undefined) return []

    menu.forEach((item): void => {
      const routesItem: RoutesItem = {
        id: item.id,
        path: `/${item.path}`.replace('//', '/'),
        name: item.name,
        redirect: item.redirect,
        parentView: item.parentView,
        meta: Object.assign(item.meta, parent),
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

      // 子菜单 有数据
      if (item.children != null && item.children?.length)
        addRouteDy(item.children, routesItem.children, {
          breadCrumbs: { ...item.meta },
          parent: item.path
        })
    })

    return routes
  }

  // 获取路由信息
  const getMenuInfo = async () => {
    // 本地无数据
    if (!dyRoutes.value.length) {
      const res = useUserStore()
      const { rolePerm } = storeToRefs(res)

      if (rolePerm.value) {
        const menuInfo = await getMenuInfoApi(rolePerm.value)

        if (menuInfo.code == 200) {
          menu_info.value = menuInfo.data.filter((item) => !item.path.includes('//'))

          localStorage.setItem('menu_info', JSON.stringify(menu_info.value))
          setDyRoutes(menu_info.value)
        }
      }
    } else {
      setDyRoutes(menu_info.value)
    }
  }

  // 添加route
  const setDyRoutes = (menuData) => {
    const mapRoutes = addRouteDy(menuData)
    dyRoutes.value = mapRoutes
    localStorage.setItem('mapRoutes', JSON.stringify(mapRoutes))

    const setRoutes = (routeMenu) => {
      routeMenu.forEach((item) => {
        router.addRoute(item.parentView ?? 'layout', item)
        if (item.children?.length) setRoutes(item.children)
      })
    }

    setRoutes(mapRoutes)
  }

  const reset = () => {
    menu_info.value = []
    currentMenu.value = ''
    dyRoutes.value = []
  }

  return {
    dyRoutes,
    menu_info,
    childMenu,
    defaultActive,
    childDefaultActive,
    isCollapse,
    currentMenu,
    getMenuInfo,
    reset
  }
})
