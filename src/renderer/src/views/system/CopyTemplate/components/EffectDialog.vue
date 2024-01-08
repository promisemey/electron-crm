<script lang="tsx" setup>
import { DictTypePayloadType } from '@api/dictionary/types'
import { ElDialog, ElForm, ElFormItem, ElInput, FormInstance, FormRules } from 'element-plus'
import { ref, reactive } from 'vue'
import { useResetForm } from '@hooks/useResetForm'
import { postDictTypeApi, updateDictTypeApi } from '@api/dictionary'

// dialog 新增/编辑/查看
enum EffectStatus {
  add,
  look,
  edit
}

// 表单显示
const visible = ref<boolean>(false)
// 表头
const dialogStatus = ref<EffectStatus>(EffectStatus.add)

const formRef = ref<FormInstance>()

// 表单数据
const formData = reactive<DictTypePayloadType>({
  name: '',
  type: '',
  remarks: '',
  id: ''
})

// 验证规则
const formRules = reactive<FormRules<DictTypePayloadType>>({
  name: [{ required: true, message: '字典名称不能为空！', trigger: 'blur' }],
  type: [{ required: true, message: '类型编码不能为空', trigger: 'blur' }]
})

// 提交
const handleSubmit = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(async (valid) => {
    if (valid) {
      let res

      switch (dialogStatus.value) {
        case EffectStatus.add:
          res = await postDictTypeApi(formData)
          break
        case EffectStatus.edit:
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          res = await updateDictTypeApi({ ...formData, id: formData.id! })
          break
      }

      // 重置 table
      if (res.code == '200') {
        Promise.allSettled([props.refresh()])
      }

      visible.value = false

      // 重置表单
      return formEl.resetFields()
    } else {
      console.log('error submit!', formData)
      return false
    }
  })
}

// 重置数据
const handleReset = (formEl: FormInstance | undefined) => {
  formEl?.resetFields()
  visible.value = false
  useResetForm(formData)
  // if (!formEl) return
}

const props = defineProps<{
  refresh: () => Promise<void>
}>()

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
    :title="`${['新增', '查看', '编辑'][dialogStatus]}字典`"
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
      <el-form-item label="字典名称" prop="name">
        <el-input v-model="formData.name" placeholder="请输入字典名称"></el-input>
      </el-form-item>
      <el-form-item label="类型编号" prop="type">
        <el-input v-model="formData.type" placeholder="请输入类型编号"> </el-input>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="formData.remarks" placeholder="请输入备注" type="textarea"></el-input>
      </el-form-item>
    </el-form>

    <template v-if="dialogStatus != EffectStatus.look" #footer>
      <el-button @click="handleReset(formRef)">取消</el-button>
      <el-button type="primary" @click="handleSubmit(formRef)">{{
        dialogStatus ? '修改' : '添加'
      }}</el-button>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped></style>
