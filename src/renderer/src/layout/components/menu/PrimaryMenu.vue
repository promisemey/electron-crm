<script lang="ts" setup>
import { onMounted } from 'vue'
import { useMenuStore } from '@store/menuStore'
import { useRoute } from 'vue-router'
import { useSelectMenu } from '@hooks/useSelectMenu'
import { Meta } from '@api/common/types'
import { storeToRefs } from 'pinia'

// 菜单数据
const menuStore = useMenuStore()
const { dyRoutes, childMenu } = storeToRefs(menuStore)
const route = useRoute()

// 查找二级菜单
const onClickMenu = (active) => {
  useSelectMenu(active)
}

// const onClickMenu = (active) => {
//   // if (route.path.includes(active.index)) return
//   // 更新二级数据

//   const menuItem = menuStore.menuInfo.find((item) => item.path == active.index)

//   const childData = menuItem?.children

//   if (childData?.length) {
//     menuStore.childMenu = childData
//     Object.assign(childData.values, childData)
//     menuStore.defaultActive = active.index

//     menuStore.childDefaultActive = childData[0].path + childData[0].meta.title
//     menuStore.currentMenu = menuItem?.meta.title

//     // 跳转二级首项
//     let routePath = childData[0].path

//     if (active.index === '/logger') routePath = active.index + routePath

//     router.push(routePath)
//   }
// }

onMounted(() => {
  // const res = route.fullPath.split('/')[1].replace('', '/')

  const parentMenu: string = route.meta.parent as string

  menuStore.defaultActive = parentMenu

  // 解决 仪表盘页面刷新 一级选中丢失问题
  if (route.fullPath == '/dashboard') menuStore.defaultActive = '/home'

  // 二级菜单 初始数据
  const parent = dyRoutes.value.find((item) => item.path === parentMenu)

  if (parent?.children) {
    childMenu.value = parent?.children
  }

  // 二级默认选中
  menuStore.childDefaultActive = route.fullPath

  // 一级菜单 标题
  menuStore.currentMenu = (route.meta.breadCrumbs as Meta)?.title || ''
})
</script>
<template>
  <div class="primary-menu shadow-lg h-full">
    <el-menu
      class="!border-none !bg-transparent"
      :default-active="menuStore.defaultActive"
      :collapse="true"
      router
    >
      <template v-for="menu in dyRoutes" :key="menu.id">
        <el-menu-item :index="menu.path" @click="onClickMenu">
          <el-icon class="m-0">
            <component :is="menu.meta.icon.replace('el-icon-', '')"></component>
          </el-icon>
          <template #title>
            <span class="bg-pink">
              {{ menu.meta.title }}
            </span>
          </template>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>

<style lang="scss" scoped></style>
