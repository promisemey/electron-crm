// /system/unit/tree

import request from '@utils/request'
import { AddUnitPayloadType, GetUnitPayloadType, GetUnitResType, GetUnitTreeResType } from './types'
import { ResType } from '@api/types'

// 机构树
export const getUnitTreeApi = (params?: GetUnitPayloadType) => {
  return request.get<GetUnitTreeResType>('/system/unit/tree', params)
}

// 机构列表
export const getUnitPageApi = (params: GetUnitPayloadType) => {
  return request.get<GetUnitResType>('/system/unit/list', params)
}

// 添加机构
export const PostUnitApi = (params: AddUnitPayloadType) => {
  return request.post<ResType>('/system/unit/add', params)
}

// 删除机构
export const DelUnitApi = (id: number) => {
  return request.get<ResType>(`/system/unit/delete/${id}`)
}

// 修改机构
export const UpdateUnitApi = (params: AddUnitPayloadType) => {
  return request.post<ResType>(`/system/unit/update`, params)
}
