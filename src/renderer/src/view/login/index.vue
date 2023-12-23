<script lang="ts" setup>
import { ref } from 'vue'
import MoveWindows from '@components/MoveWindows.vue'
import passwordForm from './components/passwordForm.vue'
import phoneForm from './components/phoneForm.vue'

// import electron from 'electron'

// 微信登录
/**
 * 无法真正实现
 * 域名必须和微信公众平台绑定的域名一致
 */
// const weChatLogin = () => {
//   window.electron.ipcRenderer.invoke('render-to-main', {
//     name: 'wx',
//     event: 'event',
//     data: null
//   })
// }
const account = ref()
const phone = ref()
const onLeave = (active) => {
  if (active == 1) {
    account.value.resetForm(account.value.ruleFormRef)
  }
  if (active == 0) {
    phone.value.resetForm(phone.value.ruleFormRef)
  }
}

// 创建子页面
const onListWindow = () => {
  window.electron.ipcRenderer.invoke('new-list')
}
</script>

<template>
  <MoveWindows :title-btn="true">
    <div class="login">
      <!--左边-->
      <div class="login_left">
        <div class="login_adv__title">
          <h2>{{ $t('login.name') }}</h2>
          <h4>{{ $t('login.system') }}</h4>
          <p>{{ $t('login.slogan') }}</p>
        </div>
        <div class="login_adv__mask"></div>
        <div class="login_adv__imgage">
          <img src="../../assets/images/data.png" width="100%" @dragstart.prevent />
        </div>
        <div class="login_adv__bottom">{{ $t('login.versions') }}</div>
      </div>
      <!--左边-->

      <!-- 右边 -->
      <div class="login-main">
        <div class="login-form">
          <div class="login-header">
            <div class="login-img">
              <img src="@assets/svg/logo.svg" @dragstart.prevent />

              <label>{{ $t('login.systemName') }}</label>
            </div>
          </div>
          <el-tabs :before-leave="onLeave" class="h-[330px]">
            <el-tab-pane :label="$t('login.accountLogin')"
              ><passwordForm ref="account" />
            </el-tab-pane>
            <el-tab-pane :label="$t('login.mobileLogin')"><phoneForm ref="phone" /></el-tab-pane>
            <el-tab-pane label="子页面">
              <el-button type="primary" size="default" @click="onListWindow">子页面</el-button>
            </el-tab-pane>
          </el-tabs>
          <template v-if="true">
            <el-divider>{{ $t('login.signInOther') }}</el-divider>
            <div class="login-oauth">
              <!--微信按钮-->
              <el-button circle size="large">
                <el-icon size="20">
                  <img src="@assets/svg/wechat.svg" alt="" @dragstart.prevent />
                </el-icon>
              </el-button>
            </div>
          </template>
        </div>
      </div>
      <!-- 右边 -->
    </div>
  </MoveWindows>
</template>

<style lang="scss" scoped>
.login {
  width: 100vw;
  height: 100vh;
  display: flex;

  .login_left {
    background-image: url('../../assets/images/auth_banner.jpg');
    width: 40%;
    position: relative;

    .login_adv__title {
      color: #fff;
      padding: 40px;
      position: absolute;
      top: 0px;
      left: 0px;
      right: 0px;
      z-index: 2;
    }
    .login_adv__title h2 {
      font-size: 40px;
    }

    .login_adv__title h4 {
      font-size: 18px;
      margin-top: 10px;
      font-weight: normal;
    }

    .login_adv__title p {
      font-size: 14px;
      margin-top: 10px;
      line-height: 1.8;
      color: rgba(255, 255, 255, 0.6);
    }

    .login_adv__title div {
      margin-top: 10px;
      display: flex;
      align-items: center;
    }

    .login_adv__imgage {
      position: absolute;
      left: 0px;
      right: 0px;
      bottom: 80px;
      padding: 40px;
      z-index: 3;
    }

    .login_adv__imgage img {
      width: 100%;
    }

    .login_adv__bottom {
      position: absolute;
      left: 0px;
      right: 0px;
      bottom: 0px;
      color: #fff;
      padding: 0 40px 40px 40px;
      background-image: linear-gradient(transparent, #000);
      z-index: 3;
    }

    .login_adv__mask {
      position: absolute;
      top: 0px;
      left: 0px;
      right: 0px;
      bottom: 0px;
      background: rgba(0, 0, 0, 0.5);
      z-index: 1;
    }
  }

  .login-main {
    flex: 1;
    display: flex;
    overflow: auto;

    .login-form {
      width: 400px;
      margin: auto;
      padding: 80px 0 0 0;

      .login-header {
        margin-bottom: 40px;

        .login-img {
          display: flex;
          justify-content: center;
          align-items: center;

          img {
            width: 40px;
            height: 40px;
            vertical-align: bottom;
            margin-right: 10px;
          }

          label {
            font-size: 26px;
            font-weight: bold;
          }
        }
      }

      .login-oauth {
        display: flex;
        justify-content: space-around;
      }
    }
  }
}
</style>
