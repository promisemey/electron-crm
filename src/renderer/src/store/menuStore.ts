import { getMenuInfoApi } from '@api/common'
import { defineStore, storeToRefs } from 'pinia'
import { useUserStore } from './userStore'
import { reactive, ref } from 'vue'
import { Menu } from '@api/common/types'

export const useMenuStore = defineStore('menuStore', () => {
  const localMenu = localStorage.getItem('menu')

  const menuInfo = reactive<Menu[]>(localMenu ? JSON.parse(localMenu) : [])

  // 二级菜单
  const childMenu = reactive<Menu[]>([])
  const defaultActive = ref('1')
  // 二级菜单  默认选中该
  const childDefaultActive = ref<string>('1-2')
  // 一级标题
  const currentMenu = ref<string>('')
  const isCollapse = ref<boolean>(true)

  // 获取路由信息
  const getMenuInfo = async () => {
    const res = useUserStore()
    const { rolePerm } = storeToRefs(res)
    console.log(menuInfo)

    const menu = await getMenuInfoApi(rolePerm.value)
    if (menu.code == 200) {
      Object.assign(menuInfo, menu.data)
      localStorage.setItem('menu', JSON.stringify(menu.data))
    }
  }

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
