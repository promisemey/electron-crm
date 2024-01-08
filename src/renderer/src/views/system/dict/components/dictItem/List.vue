<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script lang="tsx" setup>
import { ref, reactive } from 'vue'
import { UserType } from '@api/user/types'
import { DictItem, DictItemPagePayloadType, DictType } from '@api/dictionary/types'
import EffectDialog from './EffectDialog.vue'
import { useConfirm } from '@hooks/useConfirm'
import { ElTable, ElTableColumn, TableColumnCtx, ElButton } from 'element-plus'
import { useResetForm } from '@hooks/useResetForm'
import { FunctionalComponent } from 'vue'
import { onMounted } from 'vue'
import { Delete, Edit } from '@element-plus/icons-vue'
import { delDictTypeApi, getDictItemPageApi, getDictTypePageApi } from '@api/dictionary'
import { unref } from 'vue'
import { useRoute } from 'vue-router'
import { onActivated } from 'vue'
import { useDictStore } from '@store/dictStore'

/** ------- 搜索 -------  */
// 字典名称数组

const formData = reactive<DictItemPagePayloadType>({
  current: 1,
  size: 10,
  dictType: '',
  key: '',
  value: ''
})

// select
const handleSelect = (_value) => {}

// 搜索
const onSubmit = async () => {
  await getTableData()

  // 获取字典类型
  const dict = dictComparison.get(formData.dictType)

  // 设置当前字典项
  dictComparison.set('current', formData.dictType)

  if (dict) {
    effectDialogRef.value.dictType = `${dict.name}(${formData.dictType})`
    // typeId
    effectDialogRef.value.formData.typeId = dict.id
  }
}
// 重置
const onReset = async () => {
  useResetForm(formData, { omit: ['current', 'size', 'dictType'] })

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
const tableData = ref<DictItem[]>([])
// table页数
const count = ref<number>(0)

// 获取table数据
const getTableData = async () => {
  const res = await getDictItemPageApi(formData)

  if (res.code == '200') {
    tableData.value = res.data.records
    count.value = +res.data.pages
  }
}

// 字典类型名称列表
const dictName = ref<DictType[]>([])

// dict比对表
const { dictComparison } = useDictStore()

// 字典类型名称列表
const getDictType = async () => {
  if (dictComparison?.get('dictTypePage'))
    return (dictName.value = dictComparison?.get('dictTypePage'))

  const res = await getDictTypePageApi({ current: 1, size: 999 })
  if (res.code == '200') {
    dictName.value = res.data.records

    // 存入
    res.data.records.forEach((item) => {
      dictComparison.has(item.type) ||
        dictComparison.set(item.type, { name: item.name, id: item.id })
    })

    dictComparison.set('dictTypePage', res.data.records)
  }
}

// 全选
const handleSelectionChange = () => {}

// 每页显示
const onSizeChange = async (pagesize: number) => {
  formData.size = pagesize
  await getTableData()
}
// 当前页
const onCurrentChange = async (current: number) => {
  formData.current = current
  await getTableData()
}

// table 列配置
const columns: Partial<TableColumnCtx<any>>[] = [
  { prop: 'k', label: '字典键名', minWidth: '200' },
  { prop: 'v', label: '字典键值', minWidth: '200' },
  { prop: 'sort', label: '排序', minWidth: '200' },
  { prop: 'remark', label: '字典描述', minWidth: '200' },
  { prop: 'createTime', label: '创建时间', minWidth: '200', formatter: formatter },
  {
    label: '操作',
    minWidth: '250',
    fixed: 'right',
    align: 'center',
    renderCell: (row: DictItem) => {
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

// 字典类型  名称/类别
// const getDictTypeDetail = async (id: string) => {
//   const res = await getDictTypeDetailApi(id)
//   if (res.code != '200') return ''
//   return `${res.data.name}(${res.data.type})`
// }

// 新增
const handleAdd = (): void => {
  effectDialogRef.value.dialogStatus = EffectStatus.add
  effectDialogRef.value.visible = true
}

// 编辑
const handleEdit = async (row: DictItem): Promise<void> => {
  // effectDialogRef.value.dictType = await getDictTypeDetail(row.typeId)

  effectDialogRef.value.dictType

  effectDialogRef.value.dialogStatus = EffectStatus.edit
  effectDialogRef.value.visible = true
  Object.assign(effectDialogRef.value.formData, { ...row, v: +row.v })
}

// 删除
const handleDel = (row: DictItem) => {
  useConfirm(row.id, delDictTypeApi, getTableData)
}
/** ------- 操作 -------  */

// 接收传递的query参数
const route = useRoute()

type Query = { typeId: string; name: string; type: string }

const query = route.query as Query

onActivated(async () => {
  formData.dictType = dictComparison.get('current') || ''
  await getTableData()
})

// onDeactivated(() => {
//   dictComparison.delete('current')
//   console.log(dictComparison)
// })

onMounted(async () => {
  formData.dictType = dictComparison.get('current') || ''

  await getDictType()
  await getTableData()
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
          <el-select
            v-model="formData.dictType"
            value-key=""
            placeholder=""
            clearable
            filterable
            @change="handleSelect"
          >
            <el-option
              v-for="item in dictName"
              :key="item.id"
              :label="item.name"
              :value="item.type"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="字典键" prop="key">
          <el-input v-model="formData.key" placeholder="请输入字典键"></el-input>
        </el-form-item>
        <el-form-item label="字典值" prop="value">
          <el-input v-model="formData.value" placeholder="请输入字典值"></el-input>
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
      {{ dictComparison.get('current') }}
      <div v-if="dictComparison.get('current')" class="mb-4">
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

    <EffectDialog ref="effectDialogRef" :refresh="getTableData" :type-params="query" />
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
