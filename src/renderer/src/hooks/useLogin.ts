import { useMenuStore } from '@store/menuStore'
import { useUserStore } from '@store/userStore'
import router from '@router'
import { PostPhoneResType, PostUserResType } from '@api/common/types'
import { AxiosError } from 'axios'

export const useLogin = async <T>(
  loginFn: (params: T) => Promise<PostUserResType | PostPhoneResType>,
  params: T
): Promise<unknown> => {
  try {
    const login = await loginFn(params)
    if (login.code != '200') return ElMessage.error(login.msg)

    localStorage.setItem('TOKEN', login.data)

    await useUserStore().getUserInfo()
    await useMenuStore().getMenuInfo()

    router.push('/')
    return
  } catch (e) {
    const error = e as AxiosError

    // console.log(error)

    const reme_tut = localStorage.getItem('reme_tut')
    const isRemember = localStorage.getItem('isRemember')
    localStorage.clear()

    isRemember && localStorage.setItem('isRemember', isRemember)
    reme_tut && localStorage.setItem('reme_tut', reme_tut)

    return ElMessage.error((error.response?.data as any)?.msg || error.message || '未知错误')
  }
}
