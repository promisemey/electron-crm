<script lang="ts" setup>
import { useResetPinia } from '@hooks/useResetPinia'
import { useUserStore } from '@store/userStore'
import { ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'

const userStore = useUserStore()

const router = useRouter()
// 退出登录
const onExit = () => {
  ElMessageBox.confirm('确认退出登录?', '退出', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      ElMessage({
        type: 'success',
        message: '退出成功'
      })

      router.replace('/login')
      // 清空本地存储
      useResetPinia()
      window.electron.ipcRenderer.invoke('user-logout')
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消退出'
      })
    })
}

// 最小化  全屏  关闭
const onMin = () => {
  window.electron.ipcRenderer.invoke('win-min')
}
const onFull = () => {
  window.electron.ipcRenderer.invoke('win-full')
}
const onClose = () => {
  window.electron.ipcRenderer.send('exit-app')
}
</script>
<template>
  <div class="tools flex items-center gap-5">
    <el-dropdown>
      <span class="flex items-center gap-2 overflow-hidden">
        <img :src="userStore.userInfo?.avatar ?? ''" class="w-8 rounded-full" alt="" />
        <el-icon>
          <arrow-down />
        </el-icon>
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="onExit">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>

    <div class="tools-little flex items-center gap-7 cursor-pointer">
      <!-- 消息 -->
      <el-icon size="20"><ChatDotRound /></el-icon>
      <!-- 下载 -->
      <el-icon size="20"><Download /></el-icon>
      <!-- 最小 -->
      <el-icon size="20" @click="onMin"><Minus /></el-icon>
      <!-- 全屏 -->
      <el-icon size="20" @click="onFull"><FullScreen /></el-icon>
      <!-- 关闭 -->
      <el-icon size="20" @click="onClose"><Close /></el-icon>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
