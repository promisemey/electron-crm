<script lang="ts" setup>
import MoveWindows from '@components/MoveWindows.vue'
import { ref } from 'vue'
import PrimaryMenu from './components/menu/PrimaryMenu.vue'
import MenuItem from './components/menu/MenuItem.vue'
import Logo from '@components/Logo.vue'
import BreadCrums from './components/navbar/BreadCrums.vue'
import Tools from './components/navbar/Tools.vue'
import TagsMenu from './components/navbar/TagsMenu.vue'
import { onMounted } from 'vue'
// 调整窗口大小
onMounted(() => {
  try {
    window.electron.ipcRenderer.invoke('resize-frame')
  } catch (error) {
    /* empty */
  }
})

const tagMenuRef = ref()

console.log(tagMenuRef)
</script>

<template>
  <MoveWindows>
    <div class="layout w-full h-full flex overflow-hidden">
      <!-- 菜单区域 -->
      <div class="left flex">
        <!-- 一级菜单 -->
        <div class="w-16">
          <div class="h-16 flex justify-center items-center">
            <div class="w-9 h-9">
              <Logo />
            </div>
          </div>

          <PrimaryMenu />
        </div>
        <!-- 一级菜单 -->

        <!-- 二级菜单 -->
        <div class="flex-1 !transition-all">
          <MenuItem />
        </div>
        <!-- 二级菜单 -->
      </div>
      <!-- 菜单区域 -->

      <!-- 内容区 -->
      <div class="right flex-1 flex flex-col overflow-hidden">
        <!-- navbar -->
        <div class="px-5 h-14 items-center border-b-[1px] flex justify-between">
          <!-- 面包屑 -->
          <BreadCrums />
          <!-- 面包屑 -->
          <!-- <el-button type="primary" size="default" @click="addTab"></el-button> -->

          <!-- 工具 -->
          <Tools class="drop-shadow-none" />
          <!-- 工具 -->
        </div>
        <!-- navbar -->

        <!-- tag -->
        <TagsMenu ref="tagMenuRef" />
        <!-- tag -->

        <!-- main -->

        <main class="flex-1 h-full overflow-hidden m-4 drop-shadow-lg">
          <router-view v-if="$route.query.card == 'nouse'" />

          <el-card
            v-else
            shadow="always"
            class="h-full overflow-hidden"
            body-class="h-full overflow-hidden"
          >
            <router-view />
          </el-card>
        </main>

        <!-- main -->
      </div>

      <!-- 内容区 -->
    </div>
  </MoveWindows>
</template>

<style lang="scss" scoped>
.el-tabs--border-card {
  border: none;
}
</style>
