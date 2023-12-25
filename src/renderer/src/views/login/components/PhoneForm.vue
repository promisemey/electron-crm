<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { type FormInstance, type FormRules } from 'element-plus'
import type { PostPhonePayloadType } from '@api/common/types'
import { getDyCaptchaLoginApi, postPhoneLoginApi } from '@api/common/index'
import { Encrypt } from '@renderer/utils/aes'
import { useI18n } from 'vue-i18n'
import { useLogin } from '@hooks/useLogin'

const { t } = useI18n() // use as global scope
// 变量
const isLoding = ref<boolean>(false)
const isDisabled = ref<boolean>(false)
const time = ref<number>(60)
const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive<PostPhonePayloadType>({
  mobile: '',
  captcha: ''
})

// 校验规则
const validatorTel = (rule: any, value: string, callback: any) => {
  console.log(rule)
  const telRule = /^(?:(?:\+|00)86)?1\d{10}$/
  if (value === '') {
    callback(new Error(t('login.mobileError')))
  } else {
    telRule.test(value) ? callback() : callback(t('login.mobileCorrectError'))
  }
}
// 校验规则
const validatorSms = (rule: any, value: string, callback: any) => {
  console.log(rule)
  if (value === '') {
    callback(new Error(t('login.smsError')))
  } else {
    callback()
  }
}

const rules = reactive<FormRules<PostPhonePayloadType>>({
  mobile: [{ validator: validatorTel, trigger: 'change' }],
  captcha: [{ validator: validatorSms, trigger: 'change' }]
})

// 方法
// 获取手机验证码
const onGetDyCaptcha = async () => {
  const validate = await ruleFormRef.value?.validateField('mobile', () => null)
  if (!validate) return ElMessage.error('请输入正确的手机号')
  // 17611557182
  const res = await getDyCaptchaLoginApi({ mobile: Encrypt(ruleForm.mobile) })

  // if (res.code == 200) ElMessage.success('发送成功')
  if (res.code != 200) return ElMessage.success(res.msg)
  ElMessage.success('发送成功')
  // 禁用按钮
  isDisabled.value = true
  time.value = 10
  const timer = setInterval(() => {
    time.value--
    if (time.value === 0) {
      clearInterval(timer)
      isDisabled.value = false
    }
  }, 1000)
  return
}

// 验证码登录
const postCaptchaLogin = async () => {
  const res = await postPhoneLoginApi({
    mobile: Encrypt(ruleForm.mobile),
    captcha: Encrypt(ruleForm.captcha)
  })

  useLogin(res)
}

// 登录
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      isLoding.value = true
      postCaptchaLogin()
      console.log('submit!')
    } else {
      console.log('error submit!', fields)
    }
  })
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  console.log(222)
  formEl.resetFields()
}

defineExpose({
  ruleForm,
  ruleFormRef,
  resetForm
})
</script>
<template>
  <div class="phone_form">
    <el-form
      ref="ruleFormRef"
      :hide-required-asterisk="true"
      label-position="left"
      label-width="60"
      :model="ruleForm"
      :rules="rules"
      :inline="false"
      size="large"
    >
      <el-form-item :label="$t('login.mobile')" prop="mobile">
        <el-input
          v-model.trim="ruleForm.mobile"
          :placeholder="t('login.mobilePlaceholder')"
          prefix-icon="Phone"
        >
          <template #prepend>+86</template>
        </el-input>
      </el-form-item>

      <el-form-item :label="t('login.captcha')" prop="captcha">
        <div class="code">
          <el-input
            v-model="ruleForm.captcha"
            :placeholder="$t('login.cptPlaceholder')"
            prefix-icon="CircleCheck"
            clearable
          ></el-input>
          <el-button size="large" :disabled="isDisabled" @click="onGetDyCaptcha">
            {{ $t('login.smsGet') }}
            <span v-if="isDisabled">({{ time }})</span>
          </el-button>

          <!-- <el-image class="cursor-pointer" :src="captchaUrl" @click="onChangeCaptCha" /> -->
        </div>
      </el-form-item>

      <el-form-item label-width="0">
        <el-button
          type="primary"
          style="width: 100%"
          :loading="isLoding"
          @click="submitForm(ruleFormRef)"
        >
          {{ $t('login.signIn') }}
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style lang="scss" scoped>
.phone_form {
  .code {
    display: flex;
    justify-content: space-between;
    height: 40px;
    width: 100%;
    .el-input {
      /* flex-shrink: 1; */
      width: 65%;
    }
    .el-image,
    .el-button {
      /* width: 100px; */

      width: 33%;
    }
  }
}
</style>
