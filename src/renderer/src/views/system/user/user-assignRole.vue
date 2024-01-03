<!-- eslint-disable @typescript-eslint/no-non-null-assertion -->
<script lang="tsx" setup>
import { RoleType } from '@api/role/types'
import { onMounted, ref, reactive } from 'vue'
import { ElCheckbox } from 'element-plus'

import type { FunctionalComponent } from 'vue'
import type { CheckboxValueType, Column } from 'element-plus'
import { FixedDir } from 'element-plus/es/components/table-v2/src/constants'
import { useRoute } from 'vue-router'
import { getUserCheckedApi } from '@api/user'
import router from '@router'

const route = useRoute()

type SelectionCellProps = {
  value: boolean
  intermediate?: boolean
  onChange: (value: CheckboxValueType) => void
}

// 多选框
const SelectionCell: FunctionalComponent<SelectionCellProps> = ({
  value,
  intermediate = false,
  onChange
}) => {
  return <ElCheckbox onChange={onChange} modelValue={value} indeterminate={intermediate} />
}

// 列配置
const columns: Column<unknown>[] = [
  {
    key: 'selection',
    width: 50,
    fixed: FixedDir.LEFT,
    align: 'center',
    cellRenderer: ({ rowData }: { rowData: RoleType }) => {
      const onChange = (value: CheckboxValueType) => {
        // 删除未选中
        if (!value) checkMap.delete(rowData.id)
        // 添加选中
        else checkMap.set(rowData.id, value)
      }

      return <SelectionCell value={Boolean(checkMap.get(rowData.id))} onChange={onChange} />
    },
    headerCellRenderer: () => {
      const onChange = (value: CheckboxValueType) => {
        if (!value) return checkMap.clear()
        tableData.forEach((item) => checkMap.set(item.id, value))
      }
      // 全选样式
      const allSelected = checkMap.size === tableData.length
      // 选中但未全选样式
      const containsChecked = checkMap.size > 0

      return (
        <SelectionCell
          value={allSelected}
          intermediate={containsChecked && !allSelected}
          onChange={onChange}
        />
      )
    }
  },
  {
    key: 'idd',
    dataKey: 'id',
    title: '角色编码',
    width: 300
  },
  {
    key: 'roleName',
    dataKey: 'roleName',
    title: '角色名称',
    width: 200
  },
  { key: 'rolePerm', dataKey: 'rolePerm', title: '权限字符', width: 200 },
  { key: 'createTime', dataKey: 'createTime', title: '创建时间', width: 200, fixed: FixedDir.RIGHT }
]

// 取消
const handleCancel = () => {
  router.back()
}
// 提交
const handleSubmit = () => {}

const tableData = reactive<RoleType[]>([])
// const tableData1 = []

// 虚拟列表  高度自适应
const height = ref()
const width = ref()
const checkMap = reactive(new Map())

// 基本信息
type Query = { userId: string; userName: string; realName: string }
const formData = reactive({
  realName: '',
  userName: ''
})
onMounted(async () => {
  // 获取选中角色  全部角色
  const query = route.query as Query
  const res = await getUserCheckedApi(query.userId)

  Object.assign(formData, query)

  if (res.code != '200') return
  const { checkedRoleIds, roles } = res.data

  // 当前用户选中的角色
  checkedRoleIds.forEach((item) => checkMap.set(item, true))

  Object.assign(tableData, roles)

  // 内容区域
  const tableBody = document.querySelector('.el-table-v2__root')
  height.value = tableBody!.getBoundingClientRect().height
  width.value = tableBody!.getBoundingClientRect().width
})

// 窗口大小改变 适应虚拟列表内容区
window.onresize = () => {
  const tableBody = document.querySelector('.el-table-v2__root')
  height.value = tableBody!.getBoundingClientRect().height
  width.value = tableBody!.getBoundingClientRect().width
}
</script>
<template>
  <div class="user-assign-role h-full flex flex-col">
    <el-card :body-style="{ padding: 0 }">
      <template #header>
        <span class="font-bold">基本信息</span>
      </template>
      <el-form
        class="flex items-center h-full mt-5"
        :model="formData"
        inline="inline"
        label-width="70"
      >
        <el-form-item label="姓名">
          <el-input v-model="formData.realName" disabled></el-input>
        </el-form-item>
        <el-form-item label="用户名称">
          <el-input v-model="formData.userName" disabled></el-input>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="mt-5 flex flex-col flex-1 w-full" body-style="height:100%">
      <template #header>
        <div class="flex justify-between">
          <span class="font-bold">角色信息</span>
          <span class="submit">
            <el-button @click="handleCancel">取消</el-button>
            <el-button type="primary" @click="handleSubmit">提交</el-button>
          </span>
        </div>
      </template>
      <div class="table w-full h-full">
        <el-table-v2
          :columns="columns"
          :data="tableData"
          class="!h-full !w-full"
          :width="+width"
          :height="+height"
          fixed
        />
      </div>
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
.el-form-item {
  min-width: 44%;
}
</style>
