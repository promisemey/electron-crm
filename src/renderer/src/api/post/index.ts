import request from '@utils/request'
import { GetAllPostResType } from './types'

export const getAllPostApi = () => {
  return request.get<GetAllPostResType>('/system/post/all')
}
