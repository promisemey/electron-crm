<script lang="tsx" setup>
import { Dictionary } from '@api/dictionary/types'
import { ElDialog, ElForm, ElFormItem, ElInput, FormInstance, FormRules } from 'element-plus'
import { ref, reactive } from 'vue'
import { useResetForm } from '@hooks/useResetForm'
import { PostPayloadType } from '@api/post/types'
import { postAddPostApi, updatePostApi } from '@api/post'

const visible = ref<boolean>(false)

const formData = reactive<PostPayloadType>({
  enabled: '1',
  postCode: '',
  postName: '',
  sort: 1,
  remark: ''
})

const formRef = ref<FormInstance>()
const formRules = reactive<FormRules<PostPayloadType>>({
  postName: [{ required: true, message: '岗位名称不能为空！', trigger: 'blur' }],
  postCode: [{ required: true, message: '岗位编码不能为空', trigger: 'blur' }],
  sort: [{ required: true, message: '排序不能为空', trigger: 'change' }]
})

const id = ref<string>('')

// 提交
const handleSubmit = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(async (valid) => {
    if (valid) {
      let res

      switch (dialogStatus.value) {
        case EffectStatus.add:
          res = await postAddPostApi(formData)
          break
        case EffectStatus.edit:
          console.log({ ...formData, id: id.value })
          res = await updatePostApi({ ...formData, id: id.value })
          break
      }

      if (res.code == '200') {
        Promise.allSettled([props.refresh()])
      }
      visible.value = false

      formEl.resetFields()

      return useResetForm(formData, { omit: ['enabled', 'sort'] })
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
  useResetForm(formData, { omit: ['enabled', 'sort'] })
  // if (!formEl) return
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

const onBeforeClose = () => {
  // 关闭前清空数据
  useResetForm(formData)
  visible.value = false
}

defineExpose({
  visible,
  formData,
  dialogStatus,
  id
})
</script>
<template>
  <el-dialog
    v-model="visible"
    :title="`${['新增', '查看', '编辑'][dialogStatus]}岗位`"
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
      <el-form-item label="岗位名称" prop="postName">
        <el-input v-model="formData.postName" placeholder="请输入岗位名称"></el-input>
      </el-form-item>
      <el-form-item label="岗位编号" prop="postCode">
        <el-input v-model="formData.postCode" placeholder="请输入岗位编号"> </el-input>
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input v-model.number="formData.sort" placeholder="请输入排序序号"></el-input>
      </el-form-item>
      <el-form-item label="启用状态" prop="enabled">
        <el-radio-group v-model="formData.enabled">
          <el-radio v-for="item in status" :key="item.v" :label="item.v.toString()"
            >{{ item.k }}
          </el-radio>
        </el-radio-group>
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
