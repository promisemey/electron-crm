<script lang="ts" setup></script>
<template>
  <!-- <div class="drag"></div> -->
  <router-view></router-view>
</template>

<style lang="scss">
@import './assets/css/styles.scss';
// 解决取消标题栏 不能拖拽问题
/* .drag {
  position: absolute;
  background-color: pink;
  width: 100%;
  height: 40px;
  -webkit-app-region: drag;
  z-index: 999;
} */
</style>
