<script lang="ts" setup>
import { useStore } from '../store/index'
const store = useStore()
console.log(store, store.count, store.userInfo)
</script>
<template>
  <div>首1</div>
  <el-row class="mb-4">
    <el-button>Default</el-button>
    <el-button type="primary">Primary</el-button>
    <el-button type="success">Success</el-button>
    <el-button type="info">Info</el-button>
    <el-button type="warning">Warning</el-button>
    <el-button type="danger">Danger</el-button>
  </el-row>
</template>

<style lang="scss" scoped></style>
