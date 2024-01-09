<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script lang="tsx" setup>
import { ref, reactive } from 'vue'
import { UserType } from '@api/user/types'
import { DictType, DictTypePagePayloadType } from '@api/dictionary/types'
import EffectDialog from './EffectDialog.vue'
import { useConfirm } from '@hooks/useConfirm'
import { ElTable, ElTableColumn, TableColumnCtx, ElButton } from 'element-plus'
import { useResetForm } from '@hooks/useResetForm'
import { FunctionalComponent } from 'vue'
import { onMounted } from 'vue'
import { Delete, Edit } from '@element-plus/icons-vue'
import { delDictTypeApi, getDictTypePageApi } from '@api/dictionary'
import { unref } from 'vue'
import { useRouter } from 'vue-router'
import { useDictStore } from '@store/dictStore'

/** ------- 搜索 -------  */

const formData = reactive<DictTypePagePayloadType>({
  current: 1,
  size: 10,
  name: '',
  type: ''
})

// 搜索
const onSubmit = async () => {
  await getTableData()
}

// 重置
const onReset = async () => {
  useResetForm(formData, { omit: ['current', 'size'] })

  await getTableData()
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

// table数据
const tableData = ref<DictType[]>([])
// table页数
const count = ref<number>(0)

// 获取table数据
const getTableData = async () => {
  const res = await getDictTypePageApi(formData)

  if (res.code == '200') {
    tableData.value = res.data.records
    count.value = +res.data.pages
  }
}

// 全选
const handleSelectionChange = () => {}

// 每页显示
const onSizeChange = (pagesize: number) => {
  formData.size = pagesize
  getTableData()
}
// 当前页
const onCurrentChange = (current: number) => {
  formData.current = current
  getTableData()
}

const router = useRouter()

// table 列配置

const { setInitDictComparison, setDictComparison, dictComparison } = useDictStore()

const columns: Partial<TableColumnCtx<any>>[] = [
  { prop: 'name', label: '字典类型名称', minWidth: '200' },
  {
    prop: 'type',
    label: '分类编码',
    minWidth: '200',
    renderCell(row: DictType) {
      // 跳转字典项
      const onJump = (row: DictType) => {
        dictComparison.set('current', BigInt(row.id))
        router.push({
          path: '/system/dict-item'
        })
      }

      return (
        <ElButton link={true} type="primary" onClick={() => onJump(row)}>
          {row.type}
        </ElButton>
      )
    }
  },
  { prop: 'remarks', label: '字典描述', minWidth: '200' },
  { prop: 'createTime', label: '创建时间', minWidth: '200', formatter: formatter },
  {
    label: '操作',
    minWidth: '250',
    fixed: 'right',
    align: 'center',
    renderCell: (row: DictType) => {
      // 查看用户详情

      return (
        <>
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

// table TSX渲染
const TsxTable: FunctionalComponent = () => {
  const tableDatas = unref(tableData.value)

  return (
    <ElTable
      data={tableDatas}
      className="flex-1 !h-full"
      border
      onCurrent-change={handleSelectionChange}
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
            default: (scope: { row: DictType }) =>
              item.renderCell ? item.renderCell(scope.row) : null
          }}
        </ElTableColumn>
      ))}
    </ElTable>
  )
}

/** ------- 表格 -------  */

/** ------- 操作 -------  */

// dialog类型 新增/查看/编辑
enum EffectStatus {
  add,
  look,
  edit
}

const effectDialogRef = ref()

// 新增
const handleAdd = (): void => {
  effectDialogRef.value.dialogStatus = EffectStatus.add
  effectDialogRef.value.visible = true
}

// // 查看
// const handleLook = (row: PostType): void => {
//   effectDialogRef.value.dialogStatus = EffectStatus.look
//   effectDialogRef.value.visible = true
//   Object.assign(effectDialogRef.value.formData, { ...row, enabled: row.enabled.toString() })
// }

// 编辑
const handleEdit = (row: DictType): void => {
  effectDialogRef.value.dialogStatus = EffectStatus.edit
  effectDialogRef.value.visible = true
  Object.assign(effectDialogRef.value.formData, {
    id: row.id,
    name: row.name,
    type: row.type,
    remarks: row.remarks
  })
}

// 删除
const handleDel = async (row: DictType) => {
  const res = await useConfirm(row.id, delDictTypeApi, getTableData)

  if (res) await setDictComparison(row.id)

  // setDictComparison(row.type)
}
/** ------- 操作 -------  */

onMounted(async () => {
  await getTableData()
  await setInitDictComparison()
})

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
        <el-form-item label="字典名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入字典名称"></el-input>
        </el-form-item>
        <el-form-item label="类型编码" prop="type">
          <el-input v-model="formData.type" placeholder="请输入分类编码"></el-input>
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

      <TsxTable></TsxTable>
      <!-- 分页 -->
      <Pagination
        :current="formData.current"
        :size="formData.size"
        :count="count"
        @size-change="onSizeChange"
        @current-change="onCurrentChange"
      ></Pagination>
      <!-- 分页 -->
    </el-card>
    <!-- table -->

    <EffectDialog ref="effectDialogRef" :refresh="getTableData" />
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
