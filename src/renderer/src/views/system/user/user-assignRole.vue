<!-- eslint-disable @typescript-eslint/no-non-null-assertion -->
<script lang="tsx" setup>
import { RoleType } from '@api/role/types'
import { ref, reactive, onActivated } from 'vue'
import { ElCheckbox } from 'element-plus'

import type { FunctionalComponent } from 'vue'
import type { CheckboxValueType, Column } from 'element-plus'
import { FixedDir } from 'element-plus/es/components/table-v2/src/constants'
import { useRoute, useRouter } from 'vue-router'
import { getUserCheckedApi, postUserGrantRoleApi } from '@api/user'
import { useTabsStore } from '@store/tabsStore'
import { UserGrantRolePayloadType } from '@api/user/types'
import { onDeactivated } from 'vue'

const route = useRoute()
// const userStore = useUserStore()
// const { assignUserId } = storeToRefs(userStore)
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
        else checkMap.set(rowData.id, query.userId)
      }

      return <SelectionCell value={Boolean(checkMap.get(rowData.id))} onChange={onChange} />
    },
    headerCellRenderer: () => {
      const onChange = (value: CheckboxValueType) => {
        if (!value) return checkMap.clear()
        tableData.value.forEach((item) => checkMap.set(item.id, query.userId))
      }
      // 全选样式
      const allSelected = Boolean(checkMap.size) && checkMap.size === tableData.value.length
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
const tabsStore = useTabsStore()
const { removeTab } = tabsStore
const router = useRouter()

const handleCancel = () => {
  const currentTab = { index: '/system', title: '分配角色', path: '/system/user/user-assignRole' }
  removeTab(JSON.stringify(currentTab), {
    index: '/system',
    title: '用户管理',
    path: '/system/user'
  })
  // useSelectMenu({ path: '/system/user', title: '用户管理' }, 1)

  router.push('/system/user')
}
// 提交
const loading = ref<boolean>(false)
const handleSubmit = async () => {
  // let
  const payload: UserGrantRolePayloadType[] = []
  for (const key in Object.fromEntries(checkMap)) {
    payload.push({
      userId: query.userId,
      roleId: key
    })
  }

  // return
  loading.value = true
  const res = await postUserGrantRoleApi(payload)
  if (res.code == '200') handleCancel()
  loading.value = false
}

const tableData = ref<RoleType[]>([])
// const tableData1 = []

// 虚拟列表  高度自适应
// const height = ref()
// const width = ref()
const checkMap = reactive(new Map())

const formData = reactive({
  realName: '',
  userName: ''
})

const getTableData = async () => {
  // 获取选中角色  全部角色
  const res = await getUserCheckedApi(query.userId)

  Object.assign(formData, query)

  if (res.code != '200') return
  const { checkedRoleIds, roles } = res.data

  // 当前用户选中的角色
  checkedRoleIds.forEach((item) => checkMap.set(item, query.userId))

  tableData.value = roles
}

// 基本信息
type Query = { userId: string; userName: string; realName: string }
const query = reactive<Query>({ userId: '', userName: '', realName: '' })

onActivated(async () => {
  const routeQuery = route.query as Query

  query.userId = routeQuery.userId
  query.userName = routeQuery.userName
  query.realName = routeQuery.realName

  console.log(routeQuery, 'in')

  if (query.userId) {
    localStorage.setItem('user-assign', JSON.stringify(query))
    console.log('set => ', query)
  }

  if (!query.userId) {
    const localUserAssign = localStorage.getItem('user-assign')
    Object.assign(query, localUserAssign ? JSON.parse(localUserAssign) : {})
    console.log('get => ', query)
  }

  getTableData()
  console.log(checkMap)
})

onDeactivated(() => {
  checkMap.clear()
})
// onMounted(async () => {
//   // 内容区域
//   // 提前  防止获取不到高度 empty 不居中
//   // const tableBody = document.querySelector('.el-table-v2__root')
//   // height.value = tableBody!.getBoundingClientRect().height
//   // width.value = tableBody!.getBoundingClientRect().width

//   if (!query.userId) return

//   console.log(query, '===moun')

//   // 获取选中角色  全部角色
//   const res = await getUserCheckedApi(query.userId)

//   Object.assign(formData, query)

//   if (res.code != '200') return
//   const { checkedRoleIds, roles } = res.data

//   // 当前用户选中的角色
//   checkedRoleIds.forEach((item) => checkMap.set(item, assignUserId.value))

//   tableData.value = roles
// })

// 窗口大小改变 适应虚拟列表内容区
// window.onresize = () => {
//   const tableBody = document.querySelector('.el-table-v2__root')
//   height.value = tableBody!.getBoundingClientRect().height
//   width.value = tableBody!.getBoundingClientRect().width
// }
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
            <el-button type="primary" :loading="loading" @click="handleSubmit">提交</el-button>
          </span>
        </div>
      </template>
      <div class="table w-full h-full">
        <el-auto-resizer>
          <template #default="{ height, width }">
            <el-table-v2
              :columns="columns"
              :data="tableData"
              class="!h-full !w-full"
              :width="width"
              :height="height"
              fixed
            />
          </template>
        </el-auto-resizer>
      </div>
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
.el-form-item {
  min-width: 44%;
}
</style>
