import { getMenuInfoApi } from '@api/common'
import { defineStore, storeToRefs } from 'pinia'
import { useUserStore } from './userStore'
import { ref } from 'vue'
import { ComponentViews } from '@types'
import router from '@router'
import { Menu, RouterItemType } from '@api/common/types'
// import { RouteRecordRaw } from 'vue-router'

export const useMenuStore = defineStore(
  'menuStore',
  () => {
    // const localMenu = localStorage.getItem('menu_info')
    // const menu_info = ref<Menu[]>(localMenu ? JSON.parse(localMenu) : [])

    // const menu_info = ref<Menu[]>([])

    // 二级菜单
    const childMenu = ref<RouterItemType[]>([])
    const defaultActive = ref<string>('/home')
    // 二级菜单  默认选中该
    const childDefaultActive = ref<string>('')
    // 一级标题
    const currentMenu = ref<string>('')
    const isCollapse = ref<boolean>(true)

    // 本地路由信息
    // const localRoutes = localStorage.getItem('mapRoutes')
    const dyRoutes = ref<RouterItemType[]>([])
    // const dyRoutes = ref<RoutesItem[]>([])

    const views = (component): ComponentViews => {
      if (!component) return
      const module = import.meta.glob('@renderer/views/**/*.vue')

      component = component.match('home')?.length >= 1 ? `${component}/index` : component

      // console.log(module)

      return module[`/src/views/${component}.vue`]
    }

    // 映射路由数据
    const addRouteDy = <T extends RouterItemType>(
      menu: T[],
      routes = [] as T[],
      parent?: Record<string, unknown>
    ): RouterItemType[] => {
      // 原始菜单
      if (menu.length && routes.length) return []

      return menu
        .reduce((acc: RouterItemType[], cur: RouterItemType): RouterItemType[] => {
          const routesItem: RouterItemType = {
            id: cur.id,
            path: `/${cur.path}`.replace('//', '/'),
            name: cur.name,
            redirect: cur.redirect,
            parentView: cur.parentView,
            meta: Object.assign(cur.meta, parent),
            children: cur.children ?? [],
            component: cur.component
          }
          // 父级路由
          // if (routesItem.component) routesItem.component = views(cur.component)
          // 子菜单 有数据
          if (routesItem.children != null && routesItem.children?.length)
            routesItem.children = addRouteDy(routesItem.children, [], {
              breadCrumbs: { ...cur.meta },
              parent: cur.path
            })

          acc.push(routesItem)

          return acc
        }, routes)
        .filter((item) => !item.component?.includes('//'))
        .sort((a, b) => Number(BigInt(a.id) - BigInt(b.id)))
    }

    // 获取路由信息
    const getMenuInfo = async () => {
      // 本地无数据

      console.log(!dyRoutes.value.length, 'route-')

      if (!dyRoutes.value.length) {
        const res = useUserStore()
        const { rolePerm } = storeToRefs(res)

        // 角色权限
        if (rolePerm.value) {
          const menuInfo = await getMenuInfoApi(rolePerm.value)

          console.log(menuInfo, '========')

          if (menuInfo.code == '200') {
            dyRoutes.value = addRouteDy(menuInfo.data)
          }
        }
      }

      if (dyRoutes.value.length) {
        setRoutes(JSON.parse(JSON.stringify(dyRoutes.value)))
      }
    }

    // 添加route

    const setRoutes = (routeMenu) => {
      routeMenu.forEach((item) => {
        if (item.component) item.component = views(item.component)

        router.addRoute(item.parentView ?? 'layout', item)
        if (item.children?.length) setRoutes(item.children)
      })
    }

    const reset = () => {
      currentMenu.value = ''
      dyRoutes.value = []
    }

    return {
      dyRoutes,
      childMenu,
      defaultActive,
      childDefaultActive,
      isCollapse,
      currentMenu,
      getMenuInfo,
      reset
    }
  },
  {
    persist: {
      paths: ['dyRoutes']
    }
  }
)
