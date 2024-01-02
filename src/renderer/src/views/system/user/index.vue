<script lang="ts" setup>
import User from './components/User.vue'
import Recycle from './components/Recycle.vue'

import { ref } from 'vue'

// 面板默认选中
const activeName = ref('user')

// 面板
const editableTabs = [
  {
    title: '用户管理',
    name: 'user',
    content: User
  },
  {
    title: '回收站',
    name: 'recycle',
    content: Recycle
  }
]

const roleOrRecycle = ref()
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
        <component :is="item.content" ref="roleOrRecycle"></component>
      </el-tab-pane>
    </el-tabs>
  </div>
  <!-- <Teleport to="#app">
    <CreateRole ref="createRoleRef" :refresh="refresh" :role-status="roleStatus" />
  </Teleport> -->
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

  /* :deep(.el-tabs__content) {
    flex: 1;
  }


  :deep(.el-table__inner-wrapper) {
    flex: 1;
  } */
}

:deep(.el-card__body) {
  height: 100%;
}
</style>
