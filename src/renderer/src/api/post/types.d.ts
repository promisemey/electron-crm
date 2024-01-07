import { BaseResponse, BaseRecord, PageDataType, ResType } from '@api/types'

export type PostType = {
  id: string
  sort: number //排序
  postName: string
  postCode: string
  enabled: number
} & Omit<BaseRecord, 'name'>

export interface GetAllPostResType extends ResType {
  data: PostType[]
}

export interface GetPostPagePayloadType {
  current: number
  size: number
  postName?: string
  postCode?: string
  enabled?: string
}

export interface PostPageResType extends ResType {
  data: {
    records: PostType[]
  } & BaseResponse['data']
}

export interface PostPayloadType {
  remark: string
  sort: number | string //排序
  postName: string
  postCode: string
  enabled: number | string
}

export interface UpdatePostPayloadType extends PostPayloadType {
  id: string
}
