<script lang="ts" setup>
import { onBeforeMount } from 'vue'
// 获取角色列表
import { getDelRoleApi, getRoleApi } from '@api/role'
import { RoleType } from '@api/role/types'
import { ref } from 'vue'
import { TableColumnCtx } from 'element-plus'
import type { Dictionary } from '@api/dictionary/types'
import { reactive } from 'vue'
import { PageDataType } from '@api/types'
import { useConfirm } from '@hooks/useConfirm'
import CreateRole from './CreateRole.vue'
import { useStore } from '@store'
import { storeToRefs } from 'pinia'
const mainStore = useStore()
const { roleVisit } = storeToRefs(mainStore)

// table数据
const tableData = ref<RoleType[]>([])

// 全选
const handleSelectionChange = () => {}

// 格式化时间戳
const formatter = (_row: RoleType, _column: TableColumnCtx<RoleType>, timeNum: Date) => {
  const timestamp = new Date(timeNum)
  return `${timestamp.toLocaleDateString()} ${timestamp.toLocaleTimeString()}`
}

// 分页
const pagination = reactive<Partial<PageDataType>>({})

const onSizeChange = (pagesize: number) => {
  formData.size = pagesize
  getRoleData()
}
const onCurrentChange = (current: number) => {
  formData.current = current
  getRoleData()
}

// 筛选
interface FormData {
  current: number | string
  size: number | string
  roleName?: string
  rolePerm?: string
  enabled?: number | string
}

const formData = reactive<FormData>({
  current: 1,
  size: 10,
  roleName: '',
  rolePerm: '',
  enabled: '1'
})

// 搜索
const onSubmit = () => {
  getRoleData()
}

const onReset = () => {
  Object.assign(formData, { current: 1, size: 20, roleName: '', rolePerm: '', enabled: '' })
  getRoleData()
}

// 获取角色列表
const getRoleData = async () => {
  const res = await getRoleApi(formData)

  if (res.code == '200') {
    const { records, ...other } = res.data
    tableData.value = records
    Object.assign(pagination, other)
  }
}

onBeforeMount(() => {
  getRoleData()
})

// const id = ref<string>()
// table
const handleEdit = (row: RoleType) => {
  roleVisit.value = true
  createRoleRef.value.formData.id = row.id as string
  createRoleRef.value.getDetail(row.id)
}
const handleDel = async (id: number) => {
  useConfirm(id, getDelRoleApi, getRoleData)
  // const res = await getDelRoleApi(id)
}

// 创建角色
const createRoleRef = ref()

defineProps<{ roleStatus: Dictionary[] }>()

defineExpose({
  getRoleData
})
</script>
<template>
  <div class="role h-full flex flex-col">
    <!-- 筛选 -->
    <el-card shadow="always" class="mb-5 flex items-center" body-class="w-full">
      <el-form
        ref="form"
        :model="formData"
        :inline="true"
        label-width="80"
        class="-mb-5 flex flex-wrap"
      >
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
    <el-card shadow="always" class="flex-1" body-class="flex flex-col">
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
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button link type="primary" size="small" @click="handleDel(row.id)">删除</el-button>
            <el-button link type="primary" size="small" @click="handleEdit"></el-button>
            <el-button link type="primary" size="small">Edit</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->

      <Pagination
        :current="formData.current"
        :size="formData.size"
        :count="pagination.pages"
        @size-change="onSizeChange"
        @current-change="onCurrentChange"
      ></Pagination>

      <!-- 分页  -->
    </el-card>
    <!-- table -->

    <!-- 编辑/创建 -->
    <Teleport to="#app">
      <CreateRole ref="createRoleRef" :refresh="getRoleData" :role-status="roleStatus" />
    </Teleport>
    <!-- 编辑/创建 -->
  </div>
</template>

<style lang="scss" scoped>
.el-form-item {
  flex-grow: 1;

  .el-form-item__content {
    min-width: 200px;
  }

  .el-select {
    width: 100%;
  }
}

:deep(.el-row) {
  width: 100%;
}
</style>
