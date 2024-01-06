import { useUserStore } from '@store/userStore'

export const ButtonAuthDirective = {
  name: 'auth',
  mounted: (el: HTMLElement, bind) => {
    const userStore = useUserStore()

    // 最高权限
    if (userStore.userInfo.permissions?.includes('*:*:*')) return

    if (!userStore.userInfo.permissions?.includes(bind.value)) {
      const parentNode = el.parentElement
      console.log(bind, el, '-222-')

      parentNode && parentNode.removeChild(el)
    }
  }
}
