<script lang="ts" setup>
import { ref, reactive, onBeforeMount } from 'vue'
import { deleteUserApi } from '@api/user/index'
import { UserType } from '@api/user/types'
import { useDictStore } from '@store/dictStore'
import { Dictionary } from '@api/dictionary/types'
import EffectDialog from './EffectDialog.vue'

const { postDict } = useDictStore()

/** ------- 搜索 -------  */

const formData = reactive<GetUnitPayloadType>({
  name: '',
  enabled: '',
  code: ''
})

const getTableData = async () => {
  const res = await getUnitTreeApi(formData)

  if (res.code == '200') {
    tableData.value = res.data
  }
}
// 搜索
const onSubmit = async () => {
  const res = await getUnitPageApi(formData)
  if (res.code == '200') {
    tableData.value = res.data
  }
}
// 重置
const onReset = () => {
  useResetForm(formData)

  getTableData()
}

/** ------- 搜索 -------  */

/** ------- 表格 -------  */

// 格式化时间戳
const formatter = (_row: UserType, _column: TableColumnCtx<UserType>, timeNum: Date) => {
  const timestamp = new Date(timeNum)
  return `${timestamp.toLocaleDateString()} ${timestamp.toLocaleTimeString()}`
}

// 全选
const handleSelectionChange = () => {}

// 获取用户列表
// table数据
const tableData = ref<UnitType[]>([])

/** ------- 表格 -------  */

/** ------- 操作 -------  */

// 字典
const status = reactive<Dictionary[]>([])
const gender = reactive<Dictionary[]>([])

type Dict = ['system_global_gender', 'system_global_status']

onBeforeMount(async () => {
  const dist = await postDict<Dict>(['system_global_gender', 'system_global_status'])

  Object.assign(status, dist.system_global_status)
  Object.assign(gender, dist.system_global_gender)

  getTableData()
})

// 新增用户

import { useConfirm } from '@hooks/useConfirm'
import { GetUnitPayloadType, UnitType } from '@api/unit/types'
import { getUnitPageApi, getUnitTreeApi } from '@api/unit'
import { TableColumnCtx } from 'element-plus'
import { useResetForm } from '@hooks/useResetForm'

enum EffectStatus {
  add,
  look,
  edit
}

// const EffectDialogStatus = ref<EffectStatus>(EffectStatus.add) // 默认添加

const handleAdd = () => {
  effectDialogRef.value.dialogStatus = EffectStatus.add
  effectDialogRef.value.visible = true
}

// 查看用户详情
const handleLook = (row: UnitType) => {
  effectDialogRef.value.dialogStatus = EffectStatus.look
  effectDialogRef.value.visible = true
  Object.assign(effectDialogRef.value.formData, { ...row, enabled: row.enabled.toString() })
}

const handleEdit = (row: UserType) => {
  effectDialogRef.value.dialogStatus = EffectStatus.edit
  effectDialogRef.value.visible = true
  Object.assign(effectDialogRef.value.formData, { ...row, enabled: row.enabled.toString() })
}
// 删除
const handleDel = (row: UnitType) => {
  useConfirm(row.id, deleteUserApi, getTableData)
}
/** ------- 操作 -------  */

/** ------- dialog -------  */
const effectDialogRef = ref()
/** ------- dialog -------  */

defineExpose({
  getTableData,
  formData
})
</script>
<template>
  <div class="role h-full flex flex-col">
    <!-- 筛选 -->
    <el-card shadow="never" class="mb-5 flex items-center" body-class="w-full">
      <el-form ref="form" :model="formData" label-width="80" class="-mb-5 flex flex-wrap">
        <el-form-item label="用户名称">
          <el-input v-model="formData.name" placeholder="请输入机构名称"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="formData.enabled" placeholder="请选择启用状态" clearable filterable>
            <el-option v-for="item in status" :key="item.id" :label="item.k" :value="item.v">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label-width="10" label=" ">
          <el-button type="primary" @click="onSubmit">搜索</el-button>
          <el-button @click="onReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 筛选 -->

    <!-- table -->
    <el-card shadow="never" class="flex-1" body-class="flex flex-col">
      <div class="mb-4">
        <el-button type="primary" icon="Plus" @click="handleAdd">新增</el-button>
      </div>
      <el-table
        :data="tableData"
        class="flex-1 !h-full"
        row-key="id"
        border
        @current-change="handleSelectionChange"
      >
        <el-table-column type="index" width="50" />
        <el-table-column prop="name" label="机构名称" min-width="150" />
        <el-table-column prop="contact" label="负责人" min-width="120" />
        <el-table-column prop="mobile" label="联系电话" min-width="120" />
        <el-table-column prop="address" label="地址" min-width="200" />
        <el-table-column prop="enabled" label="启用状态" width="82">
          <template #default="{ row }">
            <el-tag :type="row.enabled ? '' : 'danger'">{{
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

        <el-table-column fixed="right" align="center" label="操作" width="250" :resizable="false">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleLook(row)">查看</el-button>
            <el-button v-if="row.system != 1" link type="warning" @click="handleEdit(row)"
              >编辑</el-button
            >
            <el-button v-if="row.system != 1" link type="danger" @click="handleDel(row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- table -->

    <!-- dialog -->
    <!-- <teleport to="#app"> -->
    <EffectDialog ref="effectDialogRef" :refresh="getTableData" :status="status" />
    <!-- </teleport> -->
    <!-- dialog -->
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
