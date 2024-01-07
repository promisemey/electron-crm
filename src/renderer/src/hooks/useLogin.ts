import { useMenuStore } from '@store/menuStore'
import { useUserStore } from '@store/userStore'
import router from '@router'
import { PostPhoneResType, PostUserResType } from '@api/common/types'
import { AxiosError } from 'axios'

export const useLogin = async <T>(
  loginFn: (params: T) => Promise<PostUserResType | PostPhoneResType>,
  params: T
) => {
  try {
    const login = await loginFn(params)
    if (login.code != '200') return
    localStorage.setItem('TOKEN', login.data)
    await useUserStore().getUserInfo()
    await useMenuStore().getMenuInfo()
    router.push('/')
  } catch (e) {
    const error = e as AxiosError

    console.log('err')

    const reme_tut = localStorage.getItem('reme_tut')
    localStorage.clear()

    ElMessage.error((error.response?.data as any).msg || error.message)

    reme_tut && localStorage.setItem('reme_tut', reme_tut)
  }
}
