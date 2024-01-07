<script lang="tsx" setup>
import { ref, reactive } from 'vue'
import { UserType } from '@api/user/types'
import { useDictStore } from '@store/dictStore'
import { Dictionary } from '@api/dictionary/types'
import EffectDialog from './EffectDialog.vue'
import { useConfirm } from '@hooks/useConfirm'
import { ElTable, ElTableColumn, ElTag, TableColumnCtx, ElButton } from 'element-plus'
import { useResetForm } from '@hooks/useResetForm'
import { delPostApi, getPostPageApi } from '@api/post'
import { GetPostPagePayloadType, PostType } from '@api/post/types'
import { FunctionalComponent } from 'vue'
import { onMounted } from 'vue'
import { Delete, Edit, View } from '@element-plus/icons-vue'

const { postDict } = useDictStore()

/** ------- 搜索 -------  */

const formData = reactive<GetPostPagePayloadType>({
  current: 1,
  size: 10,
  postName: '',
  postCode: '',
  enabled: ''
})

// 搜索
const onSubmit = async () => {
  getTableData()
}
// 重置
const onReset = () => {
  useResetForm(formData, { omit: ['current', 'size'] })

  getTableData()
}

/** ------- 搜索 -------  */

/** ------- 表格 -------  */

// 获取用户列表
// table数据
// 格式化时间戳
const formatter = (_row: UserType, _column: TableColumnCtx<UserType>, timeNum: Date) => {
  const timestamp = new Date(timeNum)
  return `${timestamp.toLocaleDateString()} ${timestamp.toLocaleTimeString()}`
}

const tableData = ref<PostType[]>([])
const count = ref<number>(0)

const onSizeChange = (pagesize: number) => {
  formData.size = pagesize
  getTableData()
}
const onCurrentChange = (current: number) => {
  formData.current = current
  getTableData()
}

const getTableData = async () => {
  const res = await getPostPageApi(formData)

  if (res.code == '200') {
    tableData.value = res.data.records
    count.value = +res.data.pages
  }
}

const columns: Partial<TableColumnCtx<any>>[] = [
  { prop: 'postName', label: '岗位名称', minWidth: '200' },
  { prop: 'postCode', label: '岗位编码', minWidth: '200' },
  { prop: 'sort', label: '岗位排序', minWidth: '200' },
  {
    prop: 'enabled',
    label: '启用状态',
    minWidth: '200',
    renderCell({ enabled }: PostType) {
      return <ElTag type={enabled ? '' : 'danger'}>{['禁用', '启用'][enabled]}</ElTag>
    }
  },
  { prop: 'createTime', label: '创建时间', minWidth: '200', formatter: formatter },
  {
    label: '操作',
    minWidth: '250',
    fixed: 'right',
    align: 'center',
    renderCell: (row: PostType) => {
      // 查看用户详情

      return (
        <>
          <ElButton type="primary" size="small" onClick={() => handleLook(row)} link icon={View}>
            查看
          </ElButton>
          <ElButton type="primary" size="small" onClick={() => handleEdit(row)} link icon={Edit}>
            编辑
          </ElButton>
          <ElButton type="danger" size="small" onClick={() => handleDel(row)} link icon={Delete}>
            删除
          </ElButton>
        </>
      )
    }
  }
]

const TsxTable: FunctionalComponent = (props: any) => {
  return (
    <ElTable
      data={props.data}
      className="flex-1 !h-full"
      border
      onCurrent-change={handleSelectionChange}
      rowKey={props.data.id}
    >
      <ElTableColumn type="selection" width="50" />

      {columns.map((item) => (
        <ElTableColumn
          fixed={item.fixed}
          key={item.prop}
          prop={item.prop}
          label={item.label}
          min-width={item.minWidth}
          formatter={item.formatter}
          columnKey=""
        >
          {{
            default: (scope: { row: PostType }) =>
              item.renderCell ? item.renderCell(scope.row) : null
          }}
        </ElTableColumn>
      ))}
    </ElTable>
  )
}

// 全选
const handleSelectionChange = () => {}

/** ------- 表格 -------  */

/** ------- 操作 -------  */

// 字典
const status = reactive<Dictionary[]>([])
const gender = reactive<Dictionary[]>([])

type Dict = ['system_global_gender', 'system_global_status']

onMounted(async () => {
  const dist = await postDict<Dict>(['system_global_gender', 'system_global_status'])

  Object.assign(status, dist.system_global_status)
  Object.assign(gender, dist.system_global_gender)

  getTableData()
})

// 新增用户

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
const handleLook = (row: PostType) => {
  effectDialogRef.value.dialogStatus = EffectStatus.look
  effectDialogRef.value.visible = true
  Object.assign(effectDialogRef.value.formData, { ...row, enabled: row.enabled.toString() })
}

const handleEdit = (row: PostType) => {
  effectDialogRef.value.dialogStatus = EffectStatus.edit
  effectDialogRef.value.visible = true
  effectDialogRef.value.id = row.id
  Object.assign(effectDialogRef.value.formData, {
    postName: row.postName,
    postCode: row.postCode,
    sort: row.sort,
    remark: row.remark,
    enabled: row.enabled.toString()
  })
}

// 删除
const handleDel = (row: PostType) => {
  useConfirm(row.id, delPostApi, getTableData)
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
          <el-input v-model="formData.postName" placeholder="请输入机构名称"></el-input>
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

      <TsxTable :data="tableData"></TsxTable>
      <Pagination
        :current="formData.current"
        :size="formData.size"
        :count="count"
        @size-change="onSizeChange"
        @current-change="onCurrentChange"
      ></Pagination>
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
