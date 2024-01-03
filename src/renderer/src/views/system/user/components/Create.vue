<script lang="ts" setup>
import { Dictionary } from '@api/dictionary/types'
import { getAllRoleApi } from '@api/role'
import { RoleType } from '@api/role/types'
import { PostAddUserPayloadType } from '@api/user/types'
import { useDictStore } from '@store/dictStore'
import type { FormInstance, FormRules } from 'element-plus'
import { onBeforeMount, reactive, watch } from 'vue'
import { Ref, ref } from 'vue'
import { getAllPostApi } from '@api/post'
import { PostType } from '@api/post/types'
import { getUnitTreeApi } from '@api/unit'
import { UnitTreeType } from '@api/unit/types'
import { getUserDetailApi, postAddUserApi, updateUserApi } from '@api/user'

const visible = ref<boolean>(false)
const userRef = ref<FormInstance>()
const init = {
  username: '', //用户名
  password: '', //密码
  realName: '', //真实姓名
  email: '', //邮箱
  gender: '1', //用户性别（1：男；2：女；0：未知）
  avatar: '', //头像
  remark: '', //备注
  phone: '', //手机号
  enabled: '1', //帐号状态（0：禁用；1：正常）
  roleIds: [], //角色
  postIds: [], //岗位
  unitId: '' //机构ID
}
const copyInit = Object.freeze(JSON.parse(JSON.stringify(init)))
const userFormData = reactive<PostAddUserPayloadType>(init)

const userId = ref<string>('')

const rules = reactive<FormRules<PostAddUserPayloadType>>({
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  realName: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
  unitId: [{ required: true, message: '请选择机构', trigger: 'change' }],
  postIds: [{ required: true, message: '请选择岗位', trigger: 'change' }],
  roleIds: [{ required: true, message: '请分配角色', trigger: 'change' }]
})

// 提交

const loading = ref<boolean>(false)

const handleSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      // 开启loading
      loading.value = true

      let res
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...other } = userFormData

      // 添加/修改
      switch (props.createStatus) {
        case 0:
          res = await updateUserApi(other)
          break
        case 1:
          res = await postAddUserApi(userFormData)
          break
      }

      if (res.code == '200') {
        props.refresh()
        visible.value = false
        formEl.resetFields()
      } else {
        ElMessage.error(res.msg)
      }

      loading.value = false
    } else {
      console.log('error submit!', fields)
    }
  })
}

const resetForm = (formEl: FormInstance | undefined) => {
  visible.value = false
  if (!formEl) return
  formEl.resetFields()
}

// 回显
watch(userId, async (n) => {
  if (n) {
    const res = await getUserDetailApi(userId.value)
    userFormData.roleIds = res.data.roleIds
    userFormData.postIds = res.data.postIds
    userFormData.unitId = res.data.user.unitId
  }
})

const handleCloseDialog = () => {
  resetForm(userRef.value)
  userId.value = ''
  // 清空数据
  Object.assign(userFormData, copyInit)
}

const dictStore = useDictStore()
const { postDict } = dictStore

type Dict = ['system_global_gender', 'system_global_status']
const status = reactive<Dictionary[]>([])
const gender = reactive<Dictionary[]>([])
const rolePage = ref<RoleType[]>([])
const postPage = ref<PostType[]>([])
const unitTreePage = ref<UnitTreeType[]>([])

onBeforeMount(async () => {
  const dist = await postDict<Dict>(['system_global_gender', 'system_global_status'])

  Object.assign(status, dist.system_global_status)
  Object.assign(gender, dist.system_global_gender)

  // 查找本地
  const localUserFields = localStorage.getItem('userFields')
  const parseLocal = localUserFields ? JSON.parse(localUserFields) : []

  console.log(userId)

  if (parseLocal.length) {
    rolePage.value = parseLocal[0].value.data
    postPage.value = parseLocal[1].value.data
    unitTreePage.value = parseLocal[2].value.data
    return
  }

  Promise.allSettled([getAllRoleApi(), getAllPostApi(), getUnitTreeApi()]).then(
    ([allRole, allPost, unitTree]) => {
      if (allRole.status === 'fulfilled') {
        rolePage.value = allRole.value.data
      }

      if (allPost.status === 'fulfilled') {
        postPage.value = allPost.value.data
      }

      if (unitTree.status === 'fulfilled') {
        unitTreePage.value = unitTree.value.data
      }

      localStorage.setItem('userFields', JSON.stringify([allRole, allPost, unitTree]))
    }
  )
})

enum CreateStatus {
  edit,
  add
}
const props = defineProps<{
  refresh: () => void
  createStatus: CreateStatus
}>()

defineExpose<{
  visible: Ref<boolean>
  userId: Ref<string>
  userFormData: PostAddUserPayloadType
}>({
  visible,
  userId,
  userFormData
})
</script>
<template>
  <div class="create_user">
    <el-dialog
      v-model="visible"
      :title="['编辑用户', '新增用户'][createStatus]"
      width="50%"
      align-center
      @closed="handleCloseDialog"
    >
      <el-form
        ref="userRef"
        :rules="rules"
        :model="userFormData"
        inline="inline"
        class="flex flex-wrap"
        label-width="86"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userFormData.username"></el-input>
        </el-form-item>
        <el-form-item v-if="createStatus" label="密码" prop="password">
          <el-input v-model="userFormData.password" show-password></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="realName">
          <el-input v-model="userFormData.realName"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="userFormData.email"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-select v-model="userFormData.gender" placeholder="请选择性别" clearable filterable>
            <el-option v-for="item in gender" :key="item.id" :label="item.k" :value="item.v">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="userFormData.phone"></el-input>
        </el-form-item>
        <el-form-item label="启用状态">
          <el-radio-group v-model="userFormData.enabled">
            <el-radio v-for="item in status" :key="item.id" :label="item.v">{{ item.k }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="机构" prop="unitId">
          <el-tree-select
            v-model="userFormData.unitId"
            :data="unitTreePage"
            placeholder="请选择所属岗位"
            :render-after-expand="false"
            :props="{ label: 'name' }"
            :auto-expand-parent="true"
            :default-expand-all="true"
            node-key="id"
            check-strictly
          />
        </el-form-item>
        <el-form-item label="岗位" prop="postIds">
          <el-select
            v-model="userFormData.postIds"
            multiple
            collapse-tags
            collapse-tags-tooltip
            placeholder="请分配岗位"
            :max-collapse-tags="3"
          >
            <el-option
              v-for="item in postPage"
              :key="item.id"
              :label="item.postName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="分配角色" prop="roleIds">
          <el-select
            v-model="userFormData.roleIds"
            multiple
            collapse-tags
            collapse-tags-tooltip
            placeholder="请分配角色"
            :max-collapse-tags="6"
          >
            <el-option
              v-for="item in rolePage"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="备注" class="min-w-min">
          <el-row>
            <el-input
              v-model="userFormData.remark"
              type="textarea"
              show-word-limit
              maxlength="200"
            ></el-input>
          </el-row>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="resetForm(userRef)">取消</el-button>
          <el-button type="primary" :loading="loading" @click="handleSubmit(userRef)"
            >确认</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.el-form-item {
  flex: 1;
  align-items: center;
  min-width: 44%;

  .el-select {
    width: 100%;
  }

  .el-textarea {
    min-width: 200px;
  }
}
</style>
