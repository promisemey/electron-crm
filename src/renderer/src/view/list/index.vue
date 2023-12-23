<script lang="ts" setup>
import MoveWindows from '@components/MoveWindows.vue'

const onClose = () => {
  console.log(111)
  window.electron.ipcRenderer.send('list-close')
}

// 禁用快捷键关闭
window.onbeforeunload = (e) => {
  e.returnValue = false
}
</script>
<template>
  <MoveWindows class="">
    <template #title>
      <el-button class="h-full" type="primary" size="default" @click="onClose">关闭</el-button>
    </template>
    <div class="child">我是子页面</div>
  </MoveWindows>
</template>

<style lang="scss" scoped></style>
