<script lang="ts" setup>
import User from './components/User.vue'
import Recycle from './components/Recycle.vue'

import { ref, watch } from 'vue'
import { onMounted } from 'vue'
import { getUnitTreeApi } from '@api/unit'
import { UnitTreeType } from '@api/unit/types'
import { ElTree } from 'element-plus'

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

const userOrRecycle = ref()

const unitForm = ref<string>('')

interface Tree {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}

watch(unitForm, (val) => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  treeRef.value!.filter(val)
})
// 过滤树节点
const treeRef = ref<InstanceType<typeof ElTree>>()
const filterNode = (value: string, data: Tree) => {
  if (!value) return true
  return data.name.includes(value)
}

const handleNodeClick = (data: Tree) => {
  const userRef = userOrRecycle.value[0]

  userRef.getUserData({ unitId: data.id })
}

const defaultProps = {
  children: 'children',
  label: 'name'
}

const data = ref<UnitTreeType[]>([])

onMounted(async () => {
  const res = await getUnitTreeApi()
  if (res.code == '200') data.value = res.data
})
</script>
<template>
  <div class="role h-full overflow-hidden flex">
    <div class="w-[280px] h-full bg-white border">
      <el-input
        v-model="unitForm"
        prefix-icon="Search"
        placeholder="请输入部门名称"
        class="p-4 border-b"
        clearable
      ></el-input>
      <el-tree
        ref="treeRef"
        :data="data"
        :props="defaultProps"
        :default-expand-all="true"
        class="p-4 border-b"
        :filter-node-method="filterNode"
        @node-click="handleNodeClick"
      />
    </div>
    <el-tabs
      v-model="activeName"
      class="h-full flex-1 bg-white overflow-hidden p-3 flex flex-col !border-none"
    >
      <el-tab-pane
        v-for="item in editableTabs"
        :key="item.name"
        :label="item.title"
        :name="item.name"
        class="h-full"
      >
        <component :is="item.content" :key="item.name" ref="userOrRecycle"></component>
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
