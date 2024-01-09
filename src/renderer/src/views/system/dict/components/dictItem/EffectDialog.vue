<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script lang="tsx" setup>
import { DictItem, DictItemPayloadType } from '@api/dictionary/types'
import { ElDialog, ElForm, ElFormItem, ElInput, FormInstance, FormRules } from 'element-plus'
import { ref, reactive, computed } from 'vue'
import { useResetForm } from '@hooks/useResetForm'
import { postDictItemApi, updateDictItemApi } from '@api/dictionary'
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

const formRef = ref<FormInstance>()

// 表单数据
const formData = reactive<DictItemPayloadType>({
  id: '', // 修改需要
  typeId: '',
  k: '', //键
  v: '', //值
  sort: 1, //排序
  remark: '' //描述
})

// 验证规则
const validatorVal = (_rule, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('字典值不能为空！'))
  } else {
    const rule = /^(true|false|\d+|\d+\.\d+)$/

    if (!formRef.value) return
    if (!rule.test(formData.v)) {
      callback(new Error('字典值只能为true/false、或number'))
    }

    callback()
    // formRef.value.validateField('v', () => null)
  }
}

const formRules = reactive<FormRules<DictItemPayloadType>>({
  k: [{ required: true, message: '字典键不能为空！', trigger: 'blur' }],
  v: [{ validator: validatorVal, required: true }],
  sort: [{ required: true, message: '字典排序为空！', trigger: 'blur' }]
})

const { getCurrentDictType } = useDictStore()

// 字典类型
const dictName = computed(() => {
  // const current = dictComparison.get('current') as bigint

  // if (!current) return ''

  // const dict = dictComparison.get(current) as ResiVal

  // return dict.dictNameType

  // console.log(getCurrentDictType(), '==========')

  return getCurrentDictType()?.dictNameType ?? ''
})

// 提交
const handleSubmit = (formEl: FormInstance | undefined) => {
  if (!formEl) return

  formEl.validate(async (valid) => {
    if (valid) {
      let res
      console.log(formData.typeId, '-----------')

      switch (dialogStatus.value) {
        case EffectStatus.add:
          formData.typeId = getCurrentDictType().id
          res = await postDictItemApi(formData)
          break
        case EffectStatus.edit:
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          res = await updateDictItemApi({ ...formData, id: formData.id! })
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
  useResetForm(formData, { omit: ['sort'] })

  // if (!formEl) return
}

const onBeforeClose = () => {
  // 关闭前清空数据
  useResetForm(formData, { omit: ['sort'] })
  visible.value = false
}

// 字典类型  名称/类别
const dictType = ref<string>('')

// const dictType = computed(() => {
//   return `${props.typeParams.name}(${props.typeParams.type})`
// })

const props = defineProps<{
  refresh: () => Promise<DictItem[]>
  //   typeParams: { typeId: string; name: string; type: string }
}>()

defineExpose({
  visible,
  formData,
  dialogStatus,
  dictType
})
</script>

<template>
  <el-dialog
    v-model="visible"
    :title="`${['新增', '查看', '编辑'][dialogStatus]}字典键值`"
    min-width="500px"
    :before-close="onBeforeClose"
  >
    <el-form
      ref="formRef"
      :rules="formRules"
      :disabled="dialogStatus == EffectStatus.look"
      :model="formData"
      label-width="80px"
      :inline="false"
    >
      <el-form-item label="字典类型" prop="typeId">
        <el-input v-model="formData.typeId" type="hidden" placeholder="请输入字典名称"></el-input>
        <el-input :value="dictName" disabled placeholder="请输入字典名称"></el-input>
      </el-form-item>
      <el-form-item label="字典键" prop="k">
        <el-input v-model="formData.k" placeholder="请输入字典名称"></el-input>
      </el-form-item>
      <el-form-item label="字典值" prop="v">
        <el-input v-model="formData.v" placeholder="请输入字典名称"></el-input>
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input-number v-model="formData.sort" :min="1" :max="999" />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="formData.remark" placeholder="请输入备注" type="textarea"></el-input>
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
