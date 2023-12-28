<script lang="ts" setup>
import { onBeforeMount } from 'vue'
// 获取角色列表
import { getRole } from '@api/role'
import { RoleType } from '@api/role/types'
import { ref } from 'vue'
import { TableColumnCtx } from 'element-plus'
import type { DICTIONARY } from '@api/dictionary/types'
import { reactive } from 'vue'

// table数据
const tableData = ref<RoleType[]>([])

// 全选
const handleSelectionChange = () => {}

// 格式化时间戳
const formatter = (_row: RoleType, _column: TableColumnCtx<RoleType>, timeNum: Date) => {
  const timestamp = new Date(timeNum)
  return `${timestamp.toLocaleDateString()} ${timestamp.toLocaleTimeString()}`
}

interface FormData {
  current: number | string
  size: number | string
  roleName?: string
  rolePerm?: string
  enabled?: number | string
}

// 筛选
const formData = reactive<FormData>({
  current: 1,
  size: 20,
  roleName: '',
  rolePerm: '',
  enabled: ''
})

const getRoleData = async () => {
  const res = await getRole(formData)

  if (res.code == '200') {
    tableData.value = res.data.records
  }
}

onBeforeMount(() => {
  getRoleData()
})

// 搜索
const onSubmit = () => {
  getRoleData()
}

const onReset = () => {
  Object.assign(formData, { current: 1, size: 20, roleName: '', rolePerm: '', enabled: '' })
  getRoleData()
}

// table
const handleEdit = () => {
  console.log('click')
}

defineProps<{ roleStatus: DICTIONARY[] }>()

// defineExpose({
//   options
// })
</script>
<template>
  <div class="role h-full flex flex-col">
    <!-- 筛选 -->
    <el-card shadow="always" class="mb-5 flex items-center">
      <el-form ref="form" :model="formData" :inline="true" label-width="80" class="-mb-5">
        <el-form-item label="角色名称">
          <el-input v-model="formData.roleName" placeholder="请输入角色名称"></el-input>
        </el-form-item>
        <el-form-item label="角色编码">
          <el-input v-model="formData.rolePerm" placeholder="请输入角色编码"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="formData.enabled" placeholder="请选择启用状态" clearable filterable>
            <el-option v-for="item in roleStatus" :key="item.id" :label="item.k" :value="item.v">
            </el-option>
          </el-select>
        </el-form-item>
        <el-row class="">
          <el-form-item label-width="10" label=" ">
            <el-button type="primary" @click="onSubmit">搜索</el-button>
            <el-button @click="onReset">重置</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </el-card>

    <!-- 筛选 -->

    <!-- table -->
    <el-card shadow="always" class="flex-1">
      <el-table
        :data="tableData"
        class="flex-1 !h-full"
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" />
        <el-table-column prop="roleName" label="角色名称" min-width="150" />
        <el-table-column prop="rolePerm" label="权限字符" min-width="120" />
        <el-table-column prop="enabled" label="冻结" width="82">
          <template #default="{ row }">
            {{}}
            <el-tag :type="(row as RoleType).enabled ? '' : 'danger'">{{
              row.enabled ? '未冻结' : '冻结'
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          min-width="200"
          :formatter="formatter"
        />

        <el-table-column fixed="right" label="操作" width="200">
          <template #default>
            <el-button link type="primary" size="small" @click="handleEdit">Detail</el-button>
            <el-button link type="primary" size="small">Edit</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- table -->
  </div>
</template>

<style lang="scss" scoped></style>
