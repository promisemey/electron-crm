<script lang="ts" setup>
import { onBeforeMount } from 'vue'
import { useMenuStore } from '@store/menuStore'
import { useRoute } from 'vue-router'
import { useSelectMenu } from '@hooks/useSelectMenu'
// const router = useRouter()
// 菜单数据
const menuStore = useMenuStore()
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

onBeforeMount(() => {
  const res = route.fullPath.split('/')[1].replace('', '/')
  menuStore.defaultActive = res

  // 解决 仪表盘页面刷新 一级选中丢失问题
  if (route.fullPath == '/dashboard') menuStore.defaultActive = '/home'

  // 二级菜单 初始数据
  menuStore.childMenu = route.matched[1].children as any

  // 解决  渠道（账号 管理） 刷新都选中问题
  // let title: null | string = null
  // if (res[1] && res[1] === '/channel') title = localStorage.getItem('title')

  // 二级默认选中
  menuStore.childDefaultActive = route.fullPath + route.meta.title
  // 一级菜单 标题
  menuStore.currentMenu = route.matched[1].meta.title
})
</script>
<template>
  <div class="primary-menu shadow-lg h-full">
    <el-menu
      class="!border-none !bg-transparent"
      :default-active="menuStore.defaultActive"
      :collapse="menuStore.isCollapse"
      router
    >
      <template v-for="menu in menuStore.menuInfo" :key="menu.id">
        <el-menu-item v-if="menu.meta.title !== '小鹿线'" :index="menu.path" @click="onClickMenu">
          <el-icon class="m-0">
            <component :is="menu.meta.icon.replace('el-icon-', '')"></component>
          </el-icon>
          <template #title>
            <span class="bg-pink">
              {{ menu.name }}
            </span>
          </template>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>

<style lang="scss" scoped></style>
