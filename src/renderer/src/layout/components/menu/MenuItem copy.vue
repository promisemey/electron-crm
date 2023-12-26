<script lang="ts" setup>
import { useMenuStore } from '@store/menuStore'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

const router = useRouter()

// const route = useRoute()

// 菜单数据
const menuStore = useMenuStore()
const { childDefaultActive, childMenu, currentMenu, isCollapse } = storeToRefs(menuStore)

console.log(childMenu.value)

const onChangeRoutes = (path: string) => {
  childDefaultActive.value = path
  // if(path.includes('channel-'))
  if (path.includes('channel-')) path = path.replace('/channel-', '')

  router.push(path)
}
</script>
<template>
  <div class="menu-item">
    <!-- 二级菜单 -->
    <div class="flex-1">
      <el-row class="h-14 text-2xl flex pl-6 items-center font-bold">
        {{ currentMenu }}
      </el-row>
      <el-divider class="!m-0" direction="horizontal" content-position="left"></el-divider>

      <el-scrollbar height="80vh">
        <el-menu
          class="!border-none !bg-transparent"
          :default-active="childDefaultActive"
          :collapse="!isCollapse"
        >
          <!-- <template v-for="item in childMenu" :key="`${defaultActive}-${item.id}`"> -->
          <template v-for="item in childMenu" :key="item.id">
            <el-menu-item :index="item.path" @click="onChangeRoutes(item.path)">
              <el-icon>
                <component :is="item.meta.icon.replace('el-icon-', '') || 'user'"></component>
              </el-icon>
              <template #title>{{ item.meta.title }}</template>
            </el-menu-item>
          </template>
        </el-menu>
      </el-scrollbar>
    </div>
    <!-- 二级菜单 -->
  </div>
</template>

<style lang="scss" scoped></style>
