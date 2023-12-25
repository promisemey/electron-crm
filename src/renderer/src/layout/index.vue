<script lang="ts" setup>
import MoveWindows from '@components/MoveWindows.vue'
import { onBeforeMount } from 'vue'
import PrimaryMenu from './components/menu/PrimaryMenu.vue'
import MenuItem from './components/menu/MenuItem.vue'
import Logo from '@components/Logo.vue'
// 调整窗口大小
onBeforeMount(() => {
  // window.electron.ipcRenderer.invoke('resize-frame')
})
</script>

<template>
  <MoveWindows>
    <div class="layout w-full h-full flex overflow-hidden">
      <div class="left w-[240px] flex">
        <!-- 一级菜单 -->
        <div class="w-16 bg-gray-200">
          <div class="h-16 flex justify-center items-center">
            <div class="w-9 h-9">
              <Logo />
            </div>
          </div>

          <PrimaryMenu />
        </div>
        <!-- 一级菜单 -->

        <!-- 二级菜单 -->
        <div class="flex-1">
          <MenuItem />
        </div>
        <!-- 二级菜单 -->
      </div>

      <!-- 内容区 -->
      <div class="right flex-1">
        <router-view />
      </div>
      <!-- 内容区 -->
    </div>
  </MoveWindows>
</template>

<style lang="scss" scoped></style>
