<script lang="ts" setup>
import { onBeforeMount } from 'vue'
import { useMenuStore } from '@store/menuStore'
import { storeToRefs } from 'pinia'

// 菜单数据
const menuStore = useMenuStore()

const { menuInfo, defaultActive, childDefaultActive, childMenu, currentMenu, isCollapse } =
  storeToRefs(menuStore)
defaultActive.value = menuInfo.value[0].id

interface Active {
  index: string
}
// 查找二级菜单
const onClickMenu = (active: Active | string) => {
  console.log(active)
  // 清空原二级菜单
  childMenu.value.length = 0

  const parentId = typeof active === 'object' ? active.index : active
  defaultActive.value = parentId

  const parentIndex = menuInfo.value.findIndex((menuChild) => menuChild.id === parentId)
  // 当前一级菜单
  currentMenu.value = menuInfo.value[parentIndex].name

  // 拷贝二级菜单
  Object.assign(childMenu.value, menuInfo.value[parentIndex].children)

  // 二级菜单默认选中
  childDefaultActive.value = `${parentId}-${childMenu.value[0].id}`
}
onBeforeMount(() => {
  onClickMenu(defaultActive.value)
})
</script>
<template>
  <div class="primary-menu">
    <el-menu
      class="!border-none !bg-transparent"
      :default-active="defaultActive"
      :collapse="isCollapse"
    >
      <el-menu-item v-for="menu in menuInfo" :key="menu.id" :index="menu.id" @click="onClickMenu">
        <el-icon class="m-0">
          <component :is="menu.meta.icon.replace('el-icon-', '')"></component>
        </el-icon>
        <template #title>
          <span class="bg-pink">
            {{ menu.name }}
          </span>
        </template>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<style lang="scss" scoped></style>
