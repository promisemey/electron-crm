import request from '@utils/request'
import { CityByIdResType, CityByParentIdResType } from './types'

export const getCityByParentApi = (parentId: number) => {
  return request.get<CityByParentIdResType>('/system/area/getAreaByParentId', { parentId })
}

export const getCityByIdApi = (id: number) => {
  return request.get<CityByIdResType>('/system/area/getAreaById', { id })
}
