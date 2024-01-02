import { ResType } from '@api/types'
import { keysOf } from 'element-plus/es/utils'

type Dictionary = {
  id: string | number //字典ID
  typeId: string | number //字典类型ID
  k: string //键
  v: string //值
  sort: number //排序
  remark: string //描述
  createBy: string
  createTime: string
  updateBy?: null
  updateTime?: null
}

// 字典项列表
export interface GetDictPagePayloadType {
  current: string | number
  size: string | number
  dictType?: string
  key?: string
  value?: string
}

export interface GetDictPageResType extends ResType {
  data: {
    records: Dictionary[]
    total: number
    size: number
    current: number
    orders: string[]
    optimizeCountSql: boolean
    searchCount: boolean
    countId: null
    maxLimit: null
    pages: number
  }
}

// 批量查询
export type PostDictPayloayType = string[]

export interface PostDictResType<T> extends ResType {
  data: {
    [k in T[number]]: Dictionary[]
  }
}
