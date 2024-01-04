<script lang="ts" setup>
import Role from './components/Role.vue'
import Recycle from './components/Recycle.vue'
import { onBeforeMount } from 'vue'

import { ref } from 'vue'
// import type { TabsPaneContext } from 'element-plus'
import { useDictStore } from '@store/dictStore'
import { reactive } from 'vue'
import { Dictionary } from '@api/dictionary/types'
import { useMainStore } from '@store'
import { storeToRefs } from 'pinia'
// import CreateRole from './components/CreateRole.vue'
const mainStore = useMainStore()
const { roleVisit } = storeToRefs(mainStore)
// 面板默认选中
const activeName = ref('role')

// 面板
const editableTabs = [
  {
    title: '角色管理',
    name: 'role',
    content: Role
  },
  {
    title: '回收站',
    name: 'recycle',
    content: Recycle
  }
]

// tabs
// const handleClick = (tab: TabsPaneContext, event: Event) => {
//   console.log(tab, event)
// }

const roleOrRecycle = ref()

const { postDict } = useDictStore()

const roleStatus = reactive<Dictionary[]>([])

// const refresh = () => {
//   roleOrRecycle.value[0].getRoleData()
// }

onBeforeMount(async () => {
  const dist = await postDict<['system_global_status']>(['system_global_status'])

  Object.assign(roleStatus, dist.system_global_status)
})

// 创建角色
// const createRoleRef = ref()
const handleCreateRole = () => {
  roleVisit.value = true
}
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
        <component :is="item.content" ref="roleOrRecycle" :role-status="roleStatus"></component>
      </el-tab-pane>

      <!-- 创建角色 -->
      <el-tab-pane key="add" name="add" disabled>
        <template #label>
          <el-button type="primary" class="flex w-full" size="default" @click="handleCreateRole">
            创建角色
          </el-button>
        </template>
      </el-tab-pane>
      <!-- 创建角色 -->
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
