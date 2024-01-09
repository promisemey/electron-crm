import request from '@utils/request'
import {
  DictItemPagePayloadType,
  DictItemPageResType,
  DictItemPayloadType,
  DictTypeDetailResType,
  DictTypePagePayloadType,
  DictTypePageResType,
  DictTypePayloadType,
  GetDictPagePayloadType,
  GetDictPageResType,
  PostDictPayloayType,
  PostDictResType
} from './types'
import { ResType } from '@api/types'

// 查询字典列表
export const getDictPageApi = (params: GetDictPagePayloadType) => {
  return request.get<GetDictPageResType>('/system/dict/item/page', params)
}

// 批量
export const postDictBatchApi = <T>(params: PostDictPayloayType) => {
  // const  k = params
  return request.post<PostDictResType<T>>('/system/dict/item/queryBatch', params)
}

// ----------------⬆️⬆️⬆️⬆️⬆️⬆️ 准备重写 ⬆️⬆️⬆️⬆️⬆️⬆️-------------------------

// 字典类型列表
export const getDictTypePageApi = (params: DictTypePagePayloadType) => {
  return request.get<DictTypePageResType>('/system/dict/type/page', params)
}

// 字典类型详情  byId
export const getDictTypeDetailApi = (id: string) => {
  return request.get<DictTypeDetailResType>(`/system/dict/type/get/${id}`)
}

// 新增字典类型列表
export const postDictTypeApi = (params: DictTypePayloadType) => {
  return request.post<ResType>('/system/dict/type/add', params)
}

// 修改字典类型列表
export const updateDictTypeApi = (params: DictTypePayloadType & { id: string }) => {
  return request.post<ResType>('/system/dict/type/update', params)
}

// 删除字典类型列表
export const delDictTypeApi = (id: string) => {
  return request.get<ResType>(`/system/dict/type/delete/${id}`)
}

// 字典项列表
export const getDictItemPageApi = (params: DictItemPagePayloadType) => {
  return request.get<DictItemPageResType>('/system/dict/item/page', params)
}

// 新增字典项
export const postDictItemApi = (params: DictItemPayloadType) => {
  return request.post<ResType>('/system/dict/item/add', params)
}

// 修改字典项
export const updateDictItemApi = (params: DictItemPayloadType & { id: string }) => {
  return request.post<ResType>('/system/dict/item/update', params)
}

// 删除字典项
export const delDictItemApi = (id: string) => {
  return request.get<ResType>(`/system/dict/item/delete/${id}`)
}

// 查询字典项列表
export const getDictTypeItemsApi = (params: GetDictPagePayloadType) => {
  return request.get<GetDictPageResType>('/system/dict/item/page', params)
}

// 批量
export const postDictTypeItemsBatchApi = <T>(params: PostDictPayloayType) => {
  // const  k = params
  return request.post<PostDictResType<T>>('/system/dict/item/queryBatch', params)
}
