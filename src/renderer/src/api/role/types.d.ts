import { PageDataType, ResType } from '@api/types'

// 角色列表
export interface GetRolePayloadyType {
  current: string | number
  size: string | number
  roleName?: string
  rolePerm?: string
  enabled?: string | number
}

export interface RoleType {
  id: number | string //角色ID
  roleName: string //角色名称
  rolePerm: number | string //角色权限字符
  unitId: number | string //机构ID
  dataPrivileges: number //数据权限
  enabled: 0 | 1 //是否启用（0：禁用；1：启用）
  createBy?: null
  createTime: number
  updateBy?: null
  updateTime?: null
  descript?: null //描述
}

interface RolePageType extends PageDataType {
  records: RoleType[]
}

export interface GetRoleResType extends ResType {
  data: RolePageType
}
