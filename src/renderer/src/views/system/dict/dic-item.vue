<script lang="ts" setup>
import { ref } from 'vue'

import Recycle from './components/Recycle.vue'
import List from './components/dictItem/List.vue'
// 面板默认选中
const activeName = ref('list')

// 面板
const editableTabs = [
  {
    title: '字典项',
    name: 'list',
    content: List
  },
  {
    title: '回收站',
    name: 'recycle',
    content: Recycle
  }
]

// 面板 ref
const tabsRef = ref()
</script>
<template>
  <div class="role h-full overflow-hidden">
    <el-tabs v-model="activeName" class="h-full flex flex-col !border-none">
      <el-tab-pane
        v-for="item in editableTabs"
        :key="item.name"
        :label="item.title"
        :name="item.name"
        class="h-full"
      >
        <component :is="item.content" ref="tabsRef"></component>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style lang="scss" scoped>
.el-tabs {
  :deep(.el-tabs__nav-wrap) {
    &::after {
      background-color: transparent !important;
    }

    .el-tabs__item {
      &.is-disabled {
        cursor: default !important;
      }
    }

    .el-tabs__nav {
      width: 100%;

      #tab-add {
        flex: 1;
        display: flex;
        justify-content: flex-end;

        .el-button {
          width: 100px;
        }
      }
    }
  }
}

:deep(.el-card__body) {
  height: 100%;
}
</style>
