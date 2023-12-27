import { getUserInfoApi } from '@api/common'
import { Role, UserInfo } from '@api/common/types'
import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
// 你可以对 `defineStore()` 的返回值进行任意命名，但最好使用 store 的名字，同时以 `use` 开头且以 `Store` 结尾。(比如 `useUserStore`，`useCartStore`，`useProductStore`)
// 第一个参数是你的应用中 Store 的唯一 ID。
export const useUserStore = defineStore('userStore', () => {
  // 用户信息
  const localUser = localStorage.getItem('userInfo')
  const localRole = localStorage.getItem('role')
  const localRolePerm = localStorage.getItem('rolePerm')

  const userInfo = reactive<Partial<UserInfo>>(localUser ? JSON.parse(localUser) : {})
  // 角色
  const role = reactive<Role[]>(localRole ? JSON.parse(localRole) : [])
  // 角色权限
  const rolePerm = ref(localRolePerm ?? '')

  // 获取用户数据
  const getUserInfo = async () => {
    const res = await getUserInfoApi()
    if (res.code == 200) {
      const {
        data: { userInfo: info, roles }
        // data: { userInfo: info, roles, wechat, permissions, units }
      } = res

      Object.assign(userInfo, info)
      Object.assign(role, roles)
      rolePerm.value = role[0].rolePerm

      localStorage.setItem('userInfo', JSON.stringify(userInfo))
      localStorage.setItem('role', JSON.stringify(role))
      localStorage.setItem('rolePerm', rolePerm.value)
    }
  }

  return {
    userInfo,
    role,
    rolePerm,
    getUserInfo
  }
})
