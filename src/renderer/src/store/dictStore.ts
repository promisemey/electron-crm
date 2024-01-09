import { getDictTypePageApi, postDictBatchApi } from '@api/dictionary'
import { DictType } from '@api/dictionary/types'
import { defineStore } from 'pinia'
import { reactive } from 'vue'

// type MapValObj = { name: string; id: string }

// type MapValType = any

export type ResiVal = { name: string; id: string; type: string; dictNameType: string }

type MapValType = {
  current: bigint
  dictTypePage: DictType[]
  tempCurrent: ResiVal
}
// 字典
export const useDictStore = defineStore('dictStore', () => {
  const dict = reactive({})

  // 比对
  // const dictComparison = reactive(new Map<string, any>())
  const dictComparison = reactive(
    new Map<keyof MapValType | bigint, MapValType[keyof MapValType] | ResiVal>()
  )

  // 设置 字典初始类型数据
  // const setInitDictComparison = async () => {
  const setInitDictComparison = async () => {
    // 全部
    const res = await getDictTypePageApi({ current: 1, size: 999 })

    if (res.code == '200') {
      // 将字典类型  存入Map结构
      res.data.records.forEach((item) => {
        // dictComparison.set(item.type, { name: item.name, id: item.id })
        dictComparison.set(BigInt(item.id), {
          id: item.id,
          name: item.name,
          type: item.type,
          dictNameType: `${item.name}/${item.type}`
        })
      })

      // 总数据
      dictComparison.set('dictTypePage', res.data.records)
    }
  }

  // 修改/新增/删除
  const setDictComparison = async (key?: string) => {
    // 删除
    if (key) {
      // const typeVal = dictComparison.get(key)
      const typeVal = dictComparison.get(BigInt(key))

      // 值为对象
      if (typeof typeVal !== 'object' || typeVal == null) return

      // 获取类型 id
      // if (!('id' in typeVal)) return

      const dictTypePage = dictComparison.get('dictTypePage')

      if (!Array.isArray(dictTypePage)) return

      dictComparison.set(
        'dictTypePage',
        dictTypePage.filter((item) => item.id != key)
      )

      dictComparison.delete(BigInt(key))
      return
    }

    // 新增/修改
    await setInitDictComparison()
  }

  // 返回当前 字典类型 详情
  const getCurrentDictType = (): ResiVal => {
    const current = dictComparison.get('current') as bigint

    return dictComparison.get(current) as ResiVal
  }
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
    setInitDictComparison,
    setDictComparison,
    getCurrentDictType,
    dict,
    dictComparison
  }
})
