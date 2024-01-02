<!-- eslint-disable @typescript-eslint/no-non-null-assertion -->
<script lang="tsx" setup>
import { getAllRoleApi } from '@api/role'
import { RoleType } from '@api/role/types'
import { onMounted, ref, reactive, unref } from 'vue'
import { ElCheckbox } from 'element-plus'

import type { FunctionalComponent } from 'vue'
import type { CheckboxValueType, Column } from 'element-plus'

type SelectionCellProps = {
  value: boolean
  intermediate?: boolean
  onChange: (value: CheckboxValueType) => void
}

const SelectionCell: FunctionalComponent<SelectionCellProps> = ({
  value,
  intermediate = false,
  onChange
}) => {
  return <ElCheckbox onChange={onChange} modelValue={value} indeterminate={intermediate} />
}

const formData = reactive({
  realName: '',
  username: ''
})

const columns: Column<any>[] = [
  {
    key: 'selection',
    width: 50,
    cellRenderer: ({ rowData }) => {
      const onChange = (value: CheckboxValueType) => (rowData.checked = value)
      return <SelectionCell value={rowData.checked} onChange={onChange} />
    },
    headerCellRenderer: () => {
      const _data = unref(tableData)
      const onChange = (value: CheckboxValueType) =>
        Object.assign(
          tableData,
          _data.map((row) => {
            if (row.checked == undefined) {
              row.checked = value
            }
            row.checked = value

            return row
          })
        )
      const allSelected = _data.every((row) => row.checked)
      const containsChecked = _data.some((row) => row.checked)

      console.log(allSelected)

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
    key: 'roleName',
    dataKey: 'roleName',
    title: '角色名称',
    width: 200
  },
  { key: 'rolePerm', dataKey: 'rolePerm', title: '权限字符', width: 200 },
  { key: 'createTime', dataKey: 'createTime', title: '创建时间', width: 200 }
]

const tableData = reactive<RoleType[]>([])

// 虚拟列表  高度自适应
const height = ref()
const width = ref()
onMounted(async () => {
  const res = await getAllRoleApi()

  const data = res.data.map((item) => {
    return { roleName: item.roleName, rolePerm: item.roleName, createTime: item.createTime }
  })

  Object.assign(tableData, data)

  const tableBody = document.querySelector('.el-table-v2__root')
  height.value = tableBody!.getBoundingClientRect().height
  width.value = tableBody!.getBoundingClientRect().width
})

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
          <el-input v-model="formData.username" disabled></el-input>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="mt-5 flex flex-col flex-1 w-full" body-style="height:100%">
      <template #header>
        <span class="font-bold">角色信息</span>
      </template>
      <div class="table bg-red-100 w-full h-full">
        <el-table-v2
          :columns="columns"
          :data="tableData"
          class="!h-full !w-full"
          :width="+width"
          :height="+height"
        />
        <!-- <el-auto-resizer>
          <template #default="{ height, width }">
            <el-table-v2
              :columns="columns"
              :data="tableData"
              :width="width"
              :height="height"
              fixed
            />
          </template>
        </el-auto-resizer> -->
      </div>
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
.el-form-item {
  min-width: 44%;
}
</style>
