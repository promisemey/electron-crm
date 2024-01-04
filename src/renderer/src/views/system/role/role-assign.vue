<!-- eslint-disable @typescript-eslint/no-non-null-assertion -->
<script lang="tsx" setup>
import { AssignUserPayloadType, RoleType } from '@api/role/types'
import { onMounted, ref, reactive } from 'vue'
import { ElButton, ElCheckbox } from 'element-plus'

import type { FunctionalComponent } from 'vue'
import type { CheckboxValueType, Column } from 'element-plus'
import { FixedDir } from 'element-plus/es/components/table-v2/src/constants'
import { useRoute, useRouter } from 'vue-router'
import { useTabsStore } from '@store/tabsStore'
import { UserGrantRolePayloadType, UserType } from '@api/user/types'
import { GetAssignUserApi } from '@api/role'
import { postCancelRoleApi } from '@api/user'
import { useConfirm } from '@hooks/useConfirm'

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

// 选中
const checkMap = reactive(new Map())

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
        else checkMap.set(rowData.id, query.roleId)
      }

      return <SelectionCell value={Boolean(checkMap.get(rowData.id))} onChange={onChange} />
    },
    headerCellRenderer: () => {
      const onChange = (value: CheckboxValueType) => {
        if (!value) return checkMap.clear()
        tableData.value.forEach((item) => checkMap.set(item.id, query.roleId))
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
    key: 'id',
    dataKey: 'id',
    title: '角色编码',
    width: 300
  },
  {
    key: 'username',
    dataKey: 'username',
    title: '用户名称',
    width: 200
  },
  { key: 'realName', dataKey: 'realName', title: '姓名', width: 200 },
  { key: 'email', dataKey: 'email', title: '邮箱', width: 200 },
  { key: 'phone', dataKey: 'phone', title: '手机号', width: 200 },
  { key: 'createTime', dataKey: 'createTime', title: '创建时间', width: 200 },
  {
    key: 'operate',
    title: '操作',
    width: 100,
    align: 'center',
    fixed: FixedDir.RIGHT,
    cellRenderer: ({ rowData }: { rowData: RoleType }) => {
      const handelCancelAuth = () => {
        useConfirm(
          [{ roleId: query.roleId, userId: rowData.id }],
          postCancelRoleApi,
          getAssignUser,
          '确认要取消对该用户的授权吗?'
        )
      }

      return (
        <>
          <ElButton onClick={handelCancelAuth} link type="danger">
            取消授权
          </ElButton>
        </>
      )
    }
  }
]

// 翻页
// const handleScroll = () => {
//   if (AssignUserData.current >= pages.value) return
//   AssignUserData.current += 1
//   getAssignUser()
// }

// 取消
const tabsStore = useTabsStore()
const { removeTab } = tabsStore
const router = useRouter()

// 关闭授权
const handleCancel = () => {
  const currentTab = { index: '/system', title: '角色授权', path: '/system/role/role-assign' }
  removeTab(JSON.stringify(currentTab), {
    index: '/system',
    title: '角色管理',
    path: '/system/role'
  })

  router.push('/system/role')
}
// 提交
const loading = ref<boolean>(false)

// 多选取消
const handleSubmitCancelAuth = async () => {
  if (!checkMap.size) return

  const payload: UserGrantRolePayloadType[] = []
  for (const key in Object.fromEntries(checkMap)) {
    payload.push({
      roleId: query.roleId,
      userId: key
    })
  }
  loading.value = true
  const res: any = useConfirm(
    payload,
    postCancelRoleApi,
    getAssignUser,
    '确认要取消对该用户的授权吗?'
  )

  if (res) {
    handleCancel()
  }
  loading.value = false
}

const tableData = ref<UserType[]>([])

// 搜索
const formData = reactive({
  phone: '',
  userName: ''
})

// 获取授权角色用户
const AssignUserData = reactive<AssignUserPayloadType>({
  current: 1,
  size: 10,
  roleId: ''
})
// 请求参数  角色Id
type Query = { roleId: string }
const query = route.query as Query
const getAssignUser = async () => {
  // 获取角色授权
  const res = await GetAssignUserApi(AssignUserData)

  if (res.code != '200') return

  // 获取总条数
  AssignUserData.size = +res.data.total

  const result = await GetAssignUserApi(AssignUserData)

  tableData.value = result.data.records

  console.log(tableData, '=======', result.data.records)
}

onMounted(() => {
  // 角色Id
  Object.assign(AssignUserData, query)
  getAssignUser()
})
</script>
<template>
  <div class="h-full flex flex-col">
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
        <el-form-item label="手机号">
          <el-input v-model="formData.phone" disabled></el-input>
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
            <el-button @click="handleCancel">关闭</el-button>
            <el-button type="danger" :loading="loading" @click="handleSubmitCancelAuth"
              >取消授权</el-button
            >
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
