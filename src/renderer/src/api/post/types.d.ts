import { PageDataType, ResType } from '@api/types'

export interface PostType {
  id: string //岗位ID
  postName: string //岗位名称
  postCode: string //岗位编码
  sort: number //排序
  enabled: number //是否启用（1：启用；0：禁用）
  remark?: string //备注
  createBy?: string
  createTime?: string
  updateBy?: string
  updateTime?: string
}

export interface GetAllPostResType extends ResType {
  data: PostType[]
}
