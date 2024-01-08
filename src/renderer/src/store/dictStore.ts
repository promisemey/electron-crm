import { postDictBatchApi } from '@api/dictionary'
import { defineStore } from 'pinia'
import { reactive } from 'vue'

// 字典
export const useDictStore = defineStore('dictStore', () => {
  const dict = reactive({})

  const dictComparison = reactive(new Map())

  // 批量查询字典
  const postDict = async <T extends string[]>(query: string[]) => {
    const field = query.filter((item) => dict[item])

    if (field.length !== query.length) {
      const res = await postDictBatchApi<T>(query)
      if (res.code == '200') {
        Object.assign(dict, { ...res.data })
      }
    }

    return dict as Record<T[number], number>
  }

  return {
    postDict,
    dict,
    dictComparison
  }
})
