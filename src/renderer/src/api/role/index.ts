import request from '@utils/request'
import {
  GetAllRoleResType,
  GetDelRoleResType,
  GetRoleDetailResType,
  GetRolePayloadyType,
  GetRoleResType,
  GetRoleTreeResType,
  PostAddRoleRayloadType,
  PostAddRoleResType,
  PostUpdateRolePayloadType,
  PostUpdateRoleResType
} from './types'

export const getRoleApi = (params: GetRolePayloadyType) => {
  return request.get<GetRoleResType>('/system/role/page', params)
}

export const getAllRoleApi = () => {
  return request.get<GetAllRoleResType>('/system/role/all')
}

export const getRoleTreeApi = () => {
  return request.get<GetRoleTreeResType>('/system/menu/tree')
}

export const postAddRoleApi = (params: PostAddRoleRayloadType) => {
  return request.post<PostAddRoleResType>('/system/role/add', params)
}

export const getDelRoleApi = (params: number) => {
  return request.get<GetDelRoleResType>(`/system/role/delete/${params}`)
}

export const getRoleDetailApi = (params: string) => {
  return request.get<GetRoleDetailResType>(`/system/role/get/${params}`)
}

export const postUpdateRolelApi = (params: PostUpdateRolePayloadType) => {
  return request.post<PostUpdateRoleResType>(`/system/role/update`, params)
}
