<script lang="ts" setup>
import { onBeforeMount, reactive, ref } from 'vue'
import { type FormInstance, type FormRules } from 'element-plus'
import type { PostUserPayloadType } from '@api/common/types'
import { getCaptchaApi, postUserLoginApi } from '@api/common/index'
import { Decrypt, Encrypt } from '@renderer/utils/aes'
import { useI18n } from 'vue-i18n'
import { useLogin } from '@hooks/useLogin'

const { t } = useI18n() // use as global scope
// 变量

const captchaUrl = ref<string>('')
const isLoding = ref<boolean>(false)
const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive<PostUserPayloadType>({
  username: '', //用户名（需要使用AES加密）
  password: '', //密码（需要使用AES加密）
  key: '', //图形验证码中随机UUID
  captcha: ''
})

// 校验规则
const rules = reactive<FormRules<PostUserPayloadType>>({
  username: [{ required: true, message: t('login.userError'), trigger: 'change' }],
  password: [{ required: true, message: t('login.PWError'), trigger: 'change' }],
  captcha: [{ required: true, message: t('login.smsError'), trigger: 'change' }]
})

// 方法

// 获取验证码
const getCaptcha = async () => {
  const key = crypto.randomUUID()
  ruleForm.key = key

  const res = await getCaptchaApi({ key })

  // 转换为链接
  const blob = new Blob([res], { type: 'application/vnd.ms-excel' })
  captchaUrl.value = URL.createObjectURL(blob)
}

// 账号登录接口
const postlogin = async () => {
  const account = { username: Encrypt(ruleForm.username), password: Encrypt(ruleForm.password) }

  // const res = await postUserLoginApi({
  //   ...ruleForm,
  //   ...account
  // })

  // 记住密码
  if (isRemember.value) {
    localStorage.setItem('reme_tut', JSON.stringify(account))
  } else {
    localStorage.removeItem('reme_tut')
  }

  useLogin<PostUserPayloadType>(postUserLoginApi, {
    ...ruleForm,
    ...account
  })
}

const onChangeCaptCha = () => {
  getCaptcha()
}

// 登录
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      isLoding.value = true
      await postlogin()
      isLoding.value = false
    } else {
      console.log('error submit!', fields)
    }
  })
}

// 重置
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}

onBeforeMount(() => {
  getCaptcha()
})

defineExpose({
  ruleForm,
  ruleFormRef,
  resetForm
})

const isRemember = ref<boolean>(true)

const onRemeber = () => {
  localStorage.setItem('isRemember', String(isRemember.value))

  // rememberPwd.value = !rememberPwd.value
  // const rememberPassWord = localStorage.getItem('reme_tut')
  // const setRememberPassWord = (account:) => {
  //   localStorage.setItem('reme_tut', JSON.parse())
  // }
}

onBeforeMount(() => {
  isRemember.value = localStorage.getItem('isRemember') == 'true'

  if (isRemember.value) {
    const localAccount = localStorage.getItem('reme_tut')
    const account = localAccount ? JSON.parse(localAccount) : ''

    if (account) {
      ruleForm.username = Decrypt(account.username)
      ruleForm.password = Decrypt(account.password)
    }
  }
  // ruleForm
})
</script>
<template>
  <div class="password_form">
    <el-form
      ref="ruleFormRef"
      :hide-required-asterisk="true"
      label-position="left"
      label-width="auto"
      :model="ruleForm"
      :rules="rules"
      :inline="false"
      size="large"
    >
      <el-form-item :label="$t('login.account')" prop="username">
        <el-input
          v-model.trim="ruleForm.username"
          :placeholder="t('login.userPlaceholder')"
          prefix-icon="User"
        ></el-input>
      </el-form-item>

      <el-form-item :label="$t('login.password')" prop="password">
        <el-input
          v-model.trim="ruleForm.password"
          clearable
          show-password
          prefix-icon="Lock"
          :placeholder="$t('login.PWPlaceholder')"
        ></el-input>
      </el-form-item>

      <el-form-item :label="$t('login.captcha')" prop="captcha">
        <div class="code">
          <el-input
            v-model="ruleForm.captcha"
            :placeholder="$t('login.cptPlaceholder')"
            prefix-icon="CircleCheck"
            clearable
          ></el-input>
          <el-image class="cursor-pointer" :src="captchaUrl" @click="onChangeCaptCha" />
        </div>
      </el-form-item>

      <div class="flex justify-between my-3 -mt-3">
        <el-checkbox
          v-model="isRemember"
          :label="$t('login.rememberPw')"
          @change="onRemeber"
        ></el-checkbox>
        <el-link type="primary" :underline="false" href="" target="_blank"
          >{{ $t('login.forgetPassword') }}?</el-link
        >
      </div>

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
.password_form {
  .code {
    display: flex;
    justify-content: space-between;
    height: 40px;
    width: 100%;
    .el-input {
      /* flex-shrink: 1; */
      width: 65%;
    }
    .el-image {
      /* width: 100px; */

      width: 33%;
    }
  }
}
</style>
