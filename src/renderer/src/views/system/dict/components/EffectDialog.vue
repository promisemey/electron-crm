<script lang="tsx" setup>
import { DictTypePayloadType } from '@api/dictionary/types'
import { ElDialog, ElForm, ElFormItem, ElInput, FormInstance, FormRules } from 'element-plus'
import { ref, reactive } from 'vue'
import { useResetForm } from '@hooks/useResetForm'
import { postDictTypeApi, updateDictTypeApi } from '@api/dictionary'
import { useDictStore } from '@store/dictStore'

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
// 请求中  禁止修改
const request = ref<boolean>(false)

// 字典类型
const { setDictComparison } = useDictStore()

const formRef = ref<FormInstance>()

// 表单数据
const formData = reactive<DictTypePayloadType>({
  name: '',
  type: '',
  remarks: '',
  id: ''
})
const { dictComparison } = useDictStore()

const validType = (_rule: any, value: any, callback: any) => {
  console.log(value)

  if (value === '') {
    callback(new Error('类型编码不能为空'))
  } else {
    if (dictComparison.get(value)) callback(new Error('类型编码已存在!'))
    callback()
  }
}

// 验证规则
const formRules = reactive<FormRules<DictTypePayloadType>>({
  name: [{ required: true, message: '字典名称不能为空！', trigger: 'blur' }],
  type: [{ validator: validType, trigger: 'blur' }]
})

// 提交  新增/修改
const handleSubmit = (formEl: FormInstance | undefined) => {
  if (!formEl) return

  formEl.validate(async (valid) => {
    if (valid) {
      request.value = true

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

        // 同步  字典类型集
        await setDictComparison()
      }

      visible.value = false
      // 关闭
      request.value = false
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
      :disabled="dialogStatus == 1 || request"
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
      <el-form-item label="备注" prop="remarks">
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
