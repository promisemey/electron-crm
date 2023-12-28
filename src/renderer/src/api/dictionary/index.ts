import request from '@utils/request'
import {
  GetDictPagePayloadType,
  GetDictPageResType,
  PostDictPayloayType,
  PostDictResType
} from './types'

// 查询字典列表

export const getDictPage = (params: GetDictPagePayloadType) => {
  return request.get<GetDictPageResType>('/system/dict/item/page', params)
}

export const postDictBatch = <T>(params: PostDictPayloayType) => {
  // const  k = params
  return request.post<PostDictResType<T>>('/system/dict/item/queryBatch', params)
}
