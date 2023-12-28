<script lang="ts" setup>
import Role from './components/Role.vue'
import Recycle from './components/Recycle.vue'

import { ref } from 'vue'
import type { TabsPaneContext } from 'element-plus'
import { onBeforeMount } from 'vue'
import { useDictStore } from '@store/dictStore'
import { reactive } from 'vue'
import { DICTIONARY } from '@api/dictionary/types'

// import { getDictPage } from '@api/dictionary'

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
const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}

const roleOrRecycle = ref()

const { postDict } = useDictStore()

const roleStatus = reactive<DICTIONARY[]>([])
onBeforeMount(async () => {
  const dist = await postDict<['system_global_status']>(['system_global_status'])
  // const a = await getDictPage({ current: 1, size: 1000 })
  Object.assign(roleStatus, dist.data.system_global_status)
  // console.log(roleOrRecycle.value)
})
</script>
<template>
  <div class="role h-full overflow-hidden">
    <el-tabs v-model="activeName" class="h-full flex flex-col" @tab-click="handleClick">
      <el-tab-pane
        v-for="item in editableTabs"
        :key="item.name"
        :label="item.title"
        :name="item.name"
        class="h-full"
      >
        <component :is="item.content" ref="roleOrRecycle" :role-status="roleStatus"></component>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-tabs__content) {
  flex: 1;
}

:deep(.el-card__body) {
  height: 100%;
}

:deep(.el-table__inner-wrapper) {
  flex: 1;
  /* max-height: 400px; */
}

.el-input,
.el-option {
  /* width: 20%; */
  width: 200px;
}
/* .el-tabs--card {
  height: calc(100vh - 110px);
}
.el-tab-pane {
  height: calc(100vh - 110px);
  overflow-y: auto;
} */
</style>
