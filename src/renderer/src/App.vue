<script lang="ts" setup>
import { computed } from 'vue'
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

const i18n = useI18n()

// 配置国际化
const locale = computed(() => {
  // console.log(i18n.messages.value[i18n.locale.value])
  return i18n.messages.value[i18n.locale.value].el
})

onMounted(() => {
  console.log(i18n, '----')
})
</script>
<template>
  <!-- <div class="drag"></div> -->
  <el-config-provider :locale="locale">
    <router-view></router-view>
  </el-config-provider>
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
