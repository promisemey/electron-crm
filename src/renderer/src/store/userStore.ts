import { getUserInfoApi } from '@api/common'
import { Role, UserInfo } from '@api/common/types'
import { useResetForm } from '@hooks/useResetForm'
import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
// 你可以对 `defineStore()` 的返回值进行任意命名，但最好使用 store 的名字，同时以 `use` 开头且以 `Store` 结尾。(比如 `useUserStore`，`useCartStore`，`useProductStore`)
// 第一个参数是你的应用中 Store 的唯一 ID。
export const useUserStore = defineStore(
  'userStore',
  () => {
    //
    // const localUser = localStorage.getItem('userInfo')
    // const localRole = localStorage.getItem('role')
    // const localRolePerm = localStorage.getItem('rolePerm')

    const userInfo = reactive<Partial<UserInfo>>({})
    // 角色
    const role = ref<Role[]>([])
    // 角色权限
    const rolePerm = ref('')
    // 分配角色
    const assignUserId = ref<string>('')

    // 获取用户数据
    const getUserInfo = async () => {
      const res = await getUserInfoApi()
      // console.log(res, '====login')

      if (res.code == 200) {
        const {
          data: { userInfo: info, roles }
          // data: { userInfo: info, roles, wechat, permissions, units }
        } = res

        // console.log(res, '====login')

        Object.assign(userInfo, info)
        role.value = roles
        rolePerm.value = role.value[0].rolePerm
      }

      return res
    }

    const reset = () => {
      role.value = []
      rolePerm.value = ''
      useResetForm(userInfo)
    }

    return {
      userInfo,
      role,
      rolePerm,
      assignUserId,
      reset,
      getUserInfo
    }
  },
  {
    persist: {
      paths: ['userInfo']
    }
  }
)
