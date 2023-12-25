import { useMenuStore } from '@store/menuStore'
import { useUserStore } from '@store/userStore'
import router from '@router'

export const useLogin = async (res) => {
  //   const router = useRouter()
  if (res.code != 200) return ElMessage.error(res.msg)

  const token = res.data

  // 持久化存储
  localStorage.setItem('token', token || '')

  // 获取用户信息
  await useUserStore().getUserInfo()
  // 获取菜单数据
  await useMenuStore().getMenuInfo()
  ElMessage.success(res.msg)
  router.push('/')
  return
}
