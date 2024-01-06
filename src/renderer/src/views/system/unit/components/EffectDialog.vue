<script lang="ts" setup>
import { Dictionary } from '@api/dictionary/types'
import { PostUnitApi, UpdateUnitApi, getUnitTreeApi } from '@api/unit'
import { AddUnitPayloadType, UnitTreeType } from '@api/unit/types'
import { FormInstance, FormRules } from 'element-plus'
import { ref, reactive, onBeforeMount } from 'vue'
import { Search } from '@element-plus/icons-vue'
import People from './People.vue'
import { useResetForm } from '@hooks/useResetForm'

const visible = ref<boolean>(false)

const formData = reactive<AddUnitPayloadType>({
  name: '',
  contact: '',
  mobile: '',
  email: '',
  web: '',
  parentId: '',
  enabled: '',
  leaderId: null,
  address: ''
})
const formRef = ref<FormInstance>()
const formRules = reactive<FormRules<AddUnitPayloadType>>({
  name: [{ required: true, message: '部门名称不能为空！', trigger: 'blur' }],
  parentId: [{ required: true, message: '上级机构不能为空', trigger: 'blur' }],
  mobile: [{ pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }],
  web: [
    {
      pattern: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w.-]*)*\/?$/,
      message: '请输入正确的网址',
      trigger: 'blur'
    }
  ],
  email: [
    {
      pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(.[a-zA-Z0-9_-]+)+$/,
      message: '请输入正确的邮箱',
      trigger: 'blur'
    }
  ]
})

// 获取机构数据
const unitData = ref<UnitTreeType[]>([])
const getUnitData = async () => {
  const res = await getUnitTreeApi()

  if (res.code == '200') {
    const result = useResetForm<UnitTreeType>(res.data[0], { returnResult: true, copy: true })

    // 创建一级机构
    unitData.value = [...res.data, { ...result, id: '-1', name: '新一级', system: 1 }]
  }
}

const peopleRef = ref()

// 弹出选择领导 dialog
const handleSelectLeader = () => {
  peopleRef.value.peopleVisible = true
}

// 设置领导
const handlAcceptLeader = (row) => {
  formData.leaderId = row.username
}

// 提交
const handleSubmit = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(async (valid) => {
    if (valid) {
      let res

      switch (dialogStatus.value) {
        case EffectStatus.add:
          res = await PostUnitApi(formData)
          break
        case EffectStatus.edit:
          res = await UpdateUnitApi(formData)
          break
      }

      if (res.code == '200') {
        Promise.allSettled([props.refresh(), getUnitData()])
      }
      visible.value = false
      return formEl.resetFields()
    } else {
      console.log('error submit!', formData)
      return false
    }
  })
}

// 重置数据
const handleReset = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  visible.value = false
  formEl.resetFields()
}

enum EffectStatus {
  add,
  look,
  edit
}

const props = defineProps<{
  status: Dictionary[]
  refresh: () => Promise<void>
}>()

const dialogStatus = ref<EffectStatus>(EffectStatus.add)

onBeforeMount(() => {
  getUnitData()
})

const onBeforeClose = () => {
  // 关闭前清空数据
  useResetForm(formData)
  visible.value = false
}

defineExpose({
  visible,
  formData,
  dialogStatus
})
</script>
<template>
  <el-dialog
    v-model="visible"
    :title="`${['新增', '查看', '编辑'][dialogStatus]}机构`"
    min-width="500px"
    :before-close="onBeforeClose"
  >
    <el-form
      ref="formRef"
      :rules="formRules"
      :disabled="dialogStatus == 1"
      :model="formData"
      label-width="80px"
      :inline="false"
    >
      <el-form-item label="上级部门" prop="parentId">
        <!-- <el-input v-model="formData.parentId"></el-input> -->
        <el-tree-select
          v-model="formData.parentId"
          :props="{ label: 'name' }"
          check-strictly
          node-key="id"
          :data="unitData"
          :render-after-expand="false"
        />
      </el-form-item>
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="formData.name"></el-input>
      </el-form-item>
      <el-form-item label="部门领导" prop="leaderId">
        <el-input v-model="formData.leaderId" disabled placeholder="请选择部门领导">
          <template #append> <el-button :icon="Search" @click="handleSelectLeader" /> </template>
        </el-input>
      </el-form-item>
      <el-form-item label="联系人" prop="contact">
        <el-input v-model="formData.contact"></el-input>
      </el-form-item>
      <el-form-item label="联系电话" prop="mobile">
        <el-input v-model="formData.mobile"></el-input>
      </el-form-item>
      <el-form-item label="联系邮箱" prop="email">
        <el-input v-model="formData.email"></el-input>
      </el-form-item>
      <el-form-item label="网址" prop="web">
        <el-input v-model="formData.web"></el-input>
      </el-form-item>
      <el-form-item label="启用状态" prop="enabled">
        <el-switch
          v-model="formData.enabled"
          :active-value="status[0].v"
          :active-text="status[0].k"
          :inactive-value="status[1].v"
          :inactive-text="status[1].k"
        >
        </el-switch>
      </el-form-item>
      <el-form-item label="地址" prop="address">
        <el-input v-model="formData.address" type="textarea"></el-input>
      </el-form-item>
    </el-form>

    <template v-if="dialogStatus != EffectStatus.look" #footer>
      <el-button @click="handleReset(formRef)">取消</el-button>
      <el-button type="primary" @click="handleSubmit(formRef)">{{
        dialogStatus ? '修改' : '添加'
      }}</el-button>
    </template>
    <People ref="peopleRef" @select-leader="handlAcceptLeader" />
  </el-dialog>
</template>

<style lang="scss" scoped></style>
