import request from '@utils/request'
import {
  GetUserDetailResType,
  GetUserPagePayloadType,
  GetUserPageResType,
  PostAddUserPayloadType,
  UpdateUserPayloadType,
  UserCheckedResType,
  UserGrantRolePayloadType
} from './types'
import { ResType } from '@api/types'

export const getUserPageApi = (params: GetUserPagePayloadType) => {
  return request.get<GetUserPageResType>('/system/user/page', params)
}

export const postAddUserApi = (params: PostAddUserPayloadType) => {
  return request.post<ResType>('/system/user/add', params)
}

export const getUserDetailApi = (id: string) => {
  return request.get<GetUserDetailResType>(`/system/user/get/${id}`)
}

export const updateUserApi = (params: UpdateUserPayloadType) => {
  return request.post<ResType>(`/system/user/update`, params)
}

export const deleteUserApi = (id: string) => {
  return request.get<ResType>(`/system/user/delete/${id}`)
}

export const getResetUserPwdApi = (id: string) => {
  return request.get<ResType>(`/system/user/reset/${id}`)
}

export const getUserCheckedApi = (id: string) => {
  return request.get<UserCheckedResType>(`/system/user/checked/${id}`)
}

export const postUserGrantRoleApi = (params: UserGrantRolePayloadType[]) => {
  return request.post<ResType>(`/system/user/grant`, params)
}

export const postCancelRoleApi = (params: UserGrantRolePayloadType[]) => {
  return request.post<ResType>(`/system/role/cancel`, params)
}
