import { BaseResponse, ResType, BasePayload } from '@api/types'
import { keysOf } from 'element-plus/es/utils'

type Dictionary = {
  id: string | number //字典ID
  typeId: string //字典类型ID
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

// 字典类型列表
export interface DictTypePagePayloadType {
  current: string | number
  size: string | number
  name?: string
  type?: string
}

export type DictType = {
  id: string //ID
  name: string //字典类型名称
  type: string //分类编码
  remarks: string //描述
  updateTime: null
  updateBy: null
  createTime: null
  createBy: null
}

export interface DictTypePageResType extends ResType {
  data: {
    records: DictType[]
  } & BaseResponse['data']
}

export interface DictTypeDetailResType extends ResType {
  data: DictType
}

// 新增/修改字典类型
export interface DictTypePayloadType {
  id?: string
  name: string
  type: string
  remarks: string
}

// 字典项
export interface DictItem extends Dictionary {}

export interface DictItemPagePayloadType extends BasePayload {
  dictType?: string
  key?: string
  value?: string
}

// 字典项列表
export interface DictItemPageResType extends ResType {
  data: {
    records: DictItem[]
  } & BaseResponse['data']
}

// 新增/修改字典项类型
export interface DictItemPayloadType {
  id?: string // 修改需要
  typeId: string
  k: string //键
  v: string //值
  sort: number //排序
  remark: string //描述
}
