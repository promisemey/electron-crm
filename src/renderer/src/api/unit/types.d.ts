import { ResType } from '@api/types'

export interface UnitType {
  id: string //机构ID
  name: string //机构名称
  code: string //机构编码
  codeseq: string //机构层级
  contact: string //联系人
  mobile: string //联系人手机
  email: string //联系人邮箱
  web: string //网址
  parentId: string //上级机构ID
  hasChildren: number //是否有孩子
  system: number //是否为系统内置（1：是；0：否）
  enabled: number //是否启用（1：启用；0：禁用）
  leaderId?: string | null //领导用户ID
  createBy: string
  createTime: string
  updateBy?: null
  updateTime?: null
  address: string //地址
}

export type UnitTreeType = {
  children: UnitType[]
} & UnitType

export interface GetUnitTreeResType extends ResType {
  data: UnitTreeType[]
}
