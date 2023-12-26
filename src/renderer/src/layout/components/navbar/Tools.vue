<script lang="ts" setup></script>
<template>
  <div class="tools flex items-center gap-5">
    <el-dropdown>
      <span class="flex items-center gap-2">
        <img src="@assets/svg/logo.svg" class="w-8" alt="" />
        <el-icon>
          <arrow-down />
        </el-icon>
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item>Action 1</el-dropdown-item>
          <el-dropdown-item disabled>Action 4</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>

    <div class="tools-little flex items-center gap-7 cursor-pointer">
      <el-icon><Download /></el-icon>
      <el-icon><ChatDotRound /></el-icon>
      <el-icon><Minus /></el-icon>
      <el-icon><FullScreen /></el-icon>
      <el-icon><Close /></el-icon>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
