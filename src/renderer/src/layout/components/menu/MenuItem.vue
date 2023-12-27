<script lang="ts" setup>
import { useSelectMenu } from '@hooks/useSelectMenu'
import { useMenuStore } from '@store/menuStore'

// 菜单数据
const menuStore = useMenuStore()

const onChangeRoutes = (path: string, title: string) => {
  useSelectMenu({ path, title }, 1)
}
</script>
<template>
  <div class="menu-item h-full">
    <!-- 二级菜单 -->
    <div class="h-full">
      <el-row class="h-14 text-2xl flex pl-6 items-center drop-shadow-md font-bold border-b-[1px]">
        {{ menuStore.currentMenu }}
      </el-row>
      <!-- <el-divider class="!m-0" direction="horizontal" content-position="left"></el-divider> -->
      <div class="h-full">
        <el-scrollbar height="80vh">
          <el-menu
            class="!border-none !bg-transparent"
            :default-active="menuStore.childDefaultActive"
            :collapse="!menuStore.isCollapse"
          >
            <!-- <template v-for="item in childMenu" :key="`${defaultActive}-${item.id}`"> -->
            <template v-for="item in menuStore.childMenu" :key="item.id">
              <el-menu-item :index="item.path" @click="onChangeRoutes(item.path, item.meta.title)">
                <el-icon>
                  <component :is="item.meta.icon.replace('el-icon-', '') || 'user'"></component>
                </el-icon>
                <template #title>{{ item.meta.title }}</template>
              </el-menu-item>
            </template>
          </el-menu>
        </el-scrollbar>
      </div>
    </div>
    <!-- 二级菜单 -->
  </div>
</template>

<style lang="scss" scoped></style>
