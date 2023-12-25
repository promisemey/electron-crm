<script lang="ts" setup>
import { onBeforeMount } from 'vue'
import { useMenuStore } from '@store/menuStore'
import { storeToRefs } from 'pinia'
import { useRouter, useRoute } from 'vue-router'
import { watch } from 'vue'
const router = useRouter()
// 菜单数据
const menuStore = useMenuStore()

const { menuInfo, defaultActive, childDefaultActive, childMenu, currentMenu, isCollapse } =
  storeToRefs(menuStore)
// defaultActive.value = menuInfo.value[0].id

interface Active {
  index: string
}
const route = useRoute()
// 查找二级菜单
const onClickMenu = (active: Active) => {
  if (route.path.includes(defaultActive.value)) return

  // 清空原二级菜单
  childMenu.value.length = 0

  // const parentId = typeof active === 'object' ? active.index : active
  defaultActive.value = active.index

  const parentIndex = menuInfo.value.findIndex((menuChild) => menuChild.path === active.index)
  // 当前一级菜单
  // currentMenu.value = menuInfo.value[parentIndex].name
  currentMenu.value = menuInfo.value[parentIndex].name

  // 拷贝二级菜单
  Object.assign(childMenu.value, menuInfo.value[parentIndex].children)

  // 二级菜单默认选中
  childDefaultActive.value = `${childMenu.value[0].path}`

  console.log(childDefaultActive)
  // router.push(childDefaultActive.value)
}

watch(defaultActive, (nVal) => {
  // console.log(nVal)
  // menuInfo.value.forEach((item) => {

  console.log(nVal)

  // if (route.path.includes(item.path)) {
  //   childMenu.value = item.children
  //   defaultActive.value = item.path
  //   childDefaultActive.value = childMenu.value[0].path

  //   return
  // }
  // })
  // onClickMenu({ index: defaultActive.value })
})

onBeforeMount(() => {
  console.log(route)
  const res = route.fullPath.split('/')[1].replace('', '/')
  defaultActive.value = res
  // onClickMenu({ index: '/home' })
})
</script>
<template>
  <div class="primary-menu">
    <el-menu
      class="!border-none !bg-transparent"
      :default-active="defaultActive"
      :collapse="isCollapse"
      router
    >
      {{ defaultActive }}
      <el-menu-item v-for="menu in menuInfo" :key="menu.id" :index="menu.path" @click="onClickMenu">
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
