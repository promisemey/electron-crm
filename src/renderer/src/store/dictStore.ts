import { postDictBatch } from '@api/dictionary'
import { defineStore } from 'pinia'

// 字典
export const useDictStore = defineStore('dictStore', () => {
  // 批量查询字典
  const postDict = async <T>(query: string[]) => {
    return await postDictBatch<T>(query)
  }

  return {
    postDict
  }
})
