<script lang="ts" setup>
import { useSelectMenu } from '@hooks/useSelectMenu'
import { useMenuStore } from '@store/menuStore'

// 菜单数据
const menuStore = useMenuStore()

const onIsCollapse = () => {
  menuStore.isCollapse = !menuStore.isCollapse
}

const onChangeRoutes = (path: string, title: string) => {
  useSelectMenu({ path, title }, 1)
}
</script>
<template>
  <!-- 二级菜单 -->
  <div class="h-full flex flex-col">
    <el-row class="h-14 text-lg flex justify-center items-center">
      {{ menuStore.currentMenu }}
    </el-row>
    <!-- <el-divider class="!m-0" direction="horizontal" content-position="left"></el-divider> -->

    <div class="flex-1 overflow-hidden">
      <el-scrollbar>
        <el-menu
          class="!border-none !bg-transparent w-52"
          :default-active="menuStore.childDefaultActive"
          :collapse="!menuStore.isCollapse"
          :collapse-transition="true"
        >
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

    <!-- 展开 收起 -->
    <div
      class="flex justify-center items-center h-14 drop-shadow-lg hover:bg-slate-50 cursor-pointer"
      @click="onIsCollapse"
    >
      <el-icon v-if="menuStore.isCollapse" size="26">
        <Fold />
      </el-icon>
      <el-icon v-else size="26"><Expand /></el-icon>
    </div>
  </div>
  <!-- 二级菜单 -->
</template>

<style lang="scss" scoped>
/* .el-menu {
  width: 200px;
} */
.el-aside {
  width: 200px !important;
  transition: width 0.5s;
  -webkit-transition: width 0.5s;
  -moz-transition: width 0.5s;
  -webkit-transition: width 0.5s;
  -o-transition: width 0.5s;
}
</style>
