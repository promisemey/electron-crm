<script lang="ts" setup>
import { onBeforeMount } from 'vue'
import { ref } from 'vue'
import { TableColumnCtx } from 'element-plus'
import { reactive } from 'vue'
import { deleteUserApi, getResetUserPwdApi, getUserPageApi } from '@api/user/index'
import { GetUserPagePayloadType, UserType } from '@api/user/types'
import { PageDataType } from '@api/types'
import { useDictStore } from '@store/dictStore'
import { Dictionary } from '@api/dictionary/types'
const { postDict } = useDictStore()

// 全选
const handleSelectionChange = () => {}

// 格式化时间戳
const formatter = (_row: UserType, _column: TableColumnCtx<UserType>, timeNum: Date) => {
  const timestamp = new Date(timeNum)
  return `${timestamp.toLocaleDateString()} ${timestamp.toLocaleTimeString()}`
}

// 筛选
const formData = reactive<GetUserPagePayloadType>({
  current: 1,
  size: 10,
  username: '',
  realName: '',
  email: '',
  phone: '',
  gender: '',
  enabled: ''
})

// 搜索
const onSubmit = () => {
  getUserData()
}
// 重置
const onReset = () => {
  Object.assign(formData, {
    username: '',
    realName: '',
    email: '',
    phone: '',
    gender: '',
    enabled: ''
  })
  getUserData()
}

// 获取用户列表

// table数据
const tableData = ref<UserType[]>([])
const handleEdit = (row: UserType) => {
  createStatus.value = 0
  createRef.value.visible = true

  createRef.value.userId = row.id

  console.log(row)
  Object.assign(createRef.value.userFormData, {
    ...row,
    gender: row.gender.toString(),
    enabled: row.enabled.toString()
  })
}
const handleDel = (row: any) => {
  useConfirm(row.id, deleteUserApi, getUserData)
}

// 重置密码
const handleResetPwd = (row: any) => {
  useConfirm(row.id, getResetUserPwdApi, getUserData, '此操作将重置为初始密码,是否继续?')
}

// 分配角色
const router = useRouter()
const handleAssignRole = (row: UserType) => {
  // /system/user/user-assignRole

  router.push({
    path: '/system/user/user-assignRole',
    query: { userId: row.id, userName: row.username, realName: row.realName, card: 'nouse' }
  })
}

const getUserData = async (unitId = { unitId: '' }) => {
  const res = await getUserPageApi({ ...formData, ...unitId })

  if (res.code == '200') {
    const { records, ...other } = res.data

    tableData.value = records
    Object.assign(pagination, other)
  }
}

// 分页
const pagination = reactive<Partial<PageDataType>>({})

const onSizeChange = (pagesize: number) => {
  formData.size = pagesize
  getUserData()
}
const onCurrentChange = (current: number) => {
  formData.current = current
  getUserData()
}

// 字典
const status = reactive<Dictionary[]>([])
const gender = reactive<Dictionary[]>([])

type Dict = ['system_global_gender', 'system_global_status']

onBeforeMount(async () => {
  const dist = await postDict<Dict>(['system_global_gender', 'system_global_status'])

  Object.assign(status, dist.system_global_status)
  Object.assign(gender, dist.system_global_gender)

  getUserData()
})

// 新增用户
import Create from './Create.vue'
import { useConfirm } from '@hooks/useConfirm'
import { useRouter } from 'vue-router'
const createRef = ref()
const handleAdd = () => {
  createStatus.value = 1
  createRef.value.visible = true
}

const createStatus = ref<number>(1) // 默认添加
// defineProps<{ roleStatus: Dictionary[] }>()

const isExpand = ref<boolean>(false)

defineExpose({
  getUserData,
  formData
})
</script>
<template>
  <div class="role h-full flex flex-col">
    <!-- 筛选 -->
    <el-card shadow="never" class="mb-5 flex items-center" body-class="w-full">
      <el-form ref="form" :model="formData" label-width="80" class="-mb-5 flex flex-wrap">
        <el-form-item label="用户名称">
          <el-input v-model="formData.username" placeholder="请输入角色名称"></el-input>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="formData.realName" placeholder="请输入角色编码"></el-input>
        </el-form-item>

        <el-form-item v-show="isExpand" label="邮箱">
          <el-input v-model="formData.email" placeholder="请输入角色编码"></el-input>
        </el-form-item>
        <el-form-item v-show="isExpand" label="手机号">
          <el-input v-model="formData.phone" placeholder="请输入角色编码"></el-input>
        </el-form-item>
        <el-form-item v-show="isExpand" label="性别">
          <el-select v-model="formData.gender" placeholder="请选择性别" clearable filterable>
            <el-option v-for="item in gender" :key="item.id" :label="item.k" :value="item.v">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-show="isExpand" label="状态">
          <el-select v-model="formData.enabled" placeholder="请选择启用状态" clearable filterable>
            <el-option v-for="item in status" :key="item.id" :label="item.k" :value="item.v">
            </el-option>
          </el-select>
        </el-form-item>

        <el-row class="">
          <el-form-item label-width="10" label=" ">
            <el-button type="primary" @click="onSubmit">搜索</el-button>
            <el-button @click="onReset">重置</el-button>
            <el-button link type="primary" @click="isExpand = !isExpand">
              {{ isExpand ? '收起' : '展开' }}
              <el-icon v-if="isExpand"><ArrowUpBold /></el-icon>
              <el-icon v-else><ArrowDownBold /></el-icon>
            </el-button>
          </el-form-item>
        </el-row>
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
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" />
        <el-table-column prop="username" label="用户名称" min-width="150" />
        <el-table-column prop="realName" label="姓名" min-width="120" />
        <el-table-column prop="userType" label="用户类型" min-width="120">
          <template #default="{ row }">
            <el-tag :type="['', 'danger'][row.userType]">{{
              ['普通账号', '超级管理员'][row.userType]
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="手机号码" min-width="120" />
        <el-table-column label="性别" min-width="120">
          <template #default="{ row }">
            <el-tag :type="['danger', 'warning', ''][row.gender]">{{
              ['未知', '男', '女'][row.gender]
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="enabled" label="冻结" width="82">
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

        <el-table-column fixed="right" a label="操作" width="250" :resizable="false">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button link type="danger" size="small" @click="handleDel(row)">删除</el-button>
            <el-button link type="warning" size="small" @click="handleResetPwd(row)"
              >重置密码</el-button
            >
            <el-button link type="success" size="small" @click="handleAssignRole(row)"
              >分配角色</el-button
            >
            <!-- <el-button link type="primary" size="small" @click="handleEdit"></el-button>
            <el-button link type="primary" size="small">Edit</el-button> -->
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
      <Create ref="createRef" :create-status="createStatus" :refresh="getUserData" />
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
