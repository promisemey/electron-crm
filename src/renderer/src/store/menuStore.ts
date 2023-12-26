import { getMenuInfoApi } from '@api/common'
import { defineStore, storeToRefs } from 'pinia'
import { useUserStore } from './userStore'
import { reactive, ref } from 'vue'
import { Children, Menu } from '@api/common/types'
import { ComponentViews, ResetMenu, RoutesItem } from '@types'
import router from '@router'
// import { RouteRecordRaw } from 'vue-router'

export const useMenuStore = defineStore('menuStore', () => {
  const localMenu = localStorage.getItem('menu')

  const menuInfo = reactive<Menu[]>(localMenu ? JSON.parse(localMenu) : [])

  // 二级菜单
  const childMenu = reactive<Children[]>([])
  const defaultActive = ref('/home')
  // 二级菜单  默认选中该
  const childDefaultActive = ref<string>('')
  // 一级标题
  const currentMenu = ref<unknown>('')
  const isCollapse = ref<boolean>(true)

  // 本地路由信息
  const localRoutes = localStorage.getItem('mapRoutes')
  const dyRoutes = reactive<RoutesItem[]>(localRoutes ? JSON.parse(localRoutes) : [])

  const views = (component): ComponentViews => {
    if (!component) return
    const module = import.meta.glob('@renderer/views/**/*.vue')

    component = component.match('index')?.length >= 1 ? component : `${component}/index`
    return module[`/src/views/${component}.vue`]
  }

  // 映射路由数据
  const addRouteDy = (
    menu: ResetMenu[],
    routes: RoutesItem[] = [],
    path?: string
  ): RoutesItem[] => {
    if (menu.length == 0 || routes == undefined) return []

    menu.forEach((item): void => {
      // if (path) {
      //   console.log(
      //     `${path}${path}`,
      //     `${path + item.path.replace('/channel-', '')}`
      //       .replace('//', '/')
      //       .replaceAll(`${path}${path}`.replace('//', '/'), path)
      //       .replace('/home/dashboard', '/dashboard')
      //   )
      // }
      // console.log(path, '-----', item.path.match(path) ? item.path : `1${item.path}`, '-----------')

      const routesItem: RoutesItem = {
        // path: item.path.replace(path, '/').replace('//', ''),
        path: path
          ? `${path + item.path.replace('/channel-', '')}`
              .replace('//', '/')
              .replaceAll(`${path}${path}`.replace('//', '/'), path)
              .replace('/home/dashboard', '/dashboard')
          : item.path,
        // path: item.path.match(path)
        //   ? item.path.replace('channel/channel-', 'channel/')
        //   : `${path}/${item.path}`.replace('//', '/').replace('/home', ''),
        name: item.path,
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

      if (item.children != null) addRouteDy(item.children, routesItem.children, item.path + '/')
    })

    return routes
  }

  // 获取路由信息
  const getMenuInfo = async () => {
    // 本地无数据
    if (!menuInfo.length) {
      const res = useUserStore()
      const { rolePerm } = storeToRefs(res)

      const menu = await getMenuInfoApi(rolePerm.value)
      if (menu.code == 200) {
        Object.assign(menuInfo, menu.data)
        localStorage.setItem('menu', JSON.stringify(menu.data))
      }
    }

    const mapRoutes = addRouteDy(menuInfo as any)

    localStorage.setItem('mapRoutes', JSON.stringify(mapRoutes))

    Object.assign(dyRoutes, mapRoutes)

    // for (let i = 0; i < dyRoutes.length; i++) {
    dyRoutes.forEach((item) => router.addRoute(item.parentView ?? 'layout', item))
    // }
  }

  // dyRoutes.forEach((item) => router.addRoute(item.parentView ?? item.name, item))

  return {
    menuInfo,
    childMenu,
    defaultActive,
    childDefaultActive,
    isCollapse,
    currentMenu,

    getMenuInfo
  }
})
