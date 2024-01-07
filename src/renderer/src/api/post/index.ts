import request from '@utils/request'
import {
  GetAllPostResType,
  GetPostPagePayloadType,
  PostPageResType,
  PostPayloadType,
  UpdatePostPayloadType
} from './types'
import { ResType } from '@api/types'

export const getAllPostApi = () => {
  return request.get<GetAllPostResType>('/system/post/all')
}

export const getPostPageApi = (params: GetPostPagePayloadType) => {
  return request.get<PostPageResType>('/system/post/page', params)
}

// 新增岗位
export const postAddPostApi = (params: PostPayloadType) => {
  return request.post<ResType>('/system/post/add', params)
}

// 修改岗位
export const updatePostApi = (params: UpdatePostPayloadType) => {
  return request.post<ResType>('/system/post/update', params)
}

// 删除岗位
export const delPostApi = (id: string) => {
  return request.get<ResType>(`/system/post/delete/${id}`)
}
