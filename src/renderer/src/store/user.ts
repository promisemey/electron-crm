import { defineStore } from 'pinia'
import { reactive } from 'vue'

// 你可以对 `defineStore()` 的返回值进行任意命名，但最好使用 store 的名字，同时以 `use` 开头且以 `Store` 结尾。(比如 `useUserStore`，`useCartStore`，`useProductStore`)
// 第一个参数是你的应用中 Store 的唯一 ID。
export const useUserStore = defineStore('userStore', () => {
  // 其他配置...
  const userInfo = reactive({
    id: 14,
    uuid: '64fd6d02-1fca-4db3-a144-e258a968533d',
    username: 'meyou',
    sex: 0,
    avatar: 'http://117.72.41.180:3000/static/avatar/1684471162402_2023_5_19.png',
    address: '{"text": "安徽/亳州/利辛县", "value": "3,51,498"}',
    phone: '15605671969',
    birth: '932313600000',
    createtime: '2023-05-19T04:39:42.000Z',
    role: 1
  })

  return {
    userInfo
  }
})
