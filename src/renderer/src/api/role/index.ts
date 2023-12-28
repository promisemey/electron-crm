import request from '@utils/request'
import { GetRolePayloadyType, GetRoleResType } from './types'

export const getRole = (params: GetRolePayloadyType) => {
  return request.get<GetRoleResType>('/system/role/page', params)
}
