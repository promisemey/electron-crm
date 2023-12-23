import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useUserStore } from './user'
// 你可以对 `defineStore()` 的返回值进行任意命名，但最好使用 store 的名字，同时以 `use` 开头且以 `Store` 结尾。(比如 `useUserStore`，`useCartStore`，`useProductStore`)
// 第一个参数是你的应用中 Store 的唯一 ID。
export const useStore = defineStore('mainStore', () => {
  // 其他配置...
  const userInfo = useUserStore()
  const count = ref(100)
  // const a = ref(19)
  // const a = computed(() => {
  //   return 'userInfo.userInfo.id'
  // })

  return {
    count,
    userInfo
  }
})
