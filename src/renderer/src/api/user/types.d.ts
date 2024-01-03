import { RoleType } from '@api/role/types'
import { ResType } from '@api/types'

type UserAttr = ['username', 'realName', 'email', 'phone', 'gender', 'enabled', 'unitId']
type UserPage = Record<UserAttr[number], string>

export interface GetUserPagePayloadType extends Partial<UserPage> {
  current: string | numer
  size: string | numer
}

export interface UserType extends UserPage {
  id: string
  userType: number
  phone: string
  gender: number | string
  avatar: string
  enabled: number | string
  delFlag: number
  loginIp: string
  loginDate: number
  createBy?: string | null
  createTime: number
  updateBy: string
  updateTime: number
  remark?: string | null
}

export interface GetUserPageResType extends ResType {
  data: { records: UserType[] } & BaseResponse['data']
}

type RolePostId = {
  roleIds: string[] //角色
  postIds: string[] //岗位
}

// 添加用户
export interface PostAddUserPayloadType extends UserPage, RolePostId {
  password: string //密码
  gender: number | string //用户性别（1：男；2：女；0：未知）
  avatar: string //头像
  remark: string //备注
  phone: string //手机号
  enabled: number | string //帐号状态（0：禁用；1：正常）
  // roleIds: string[] //角色
  // postIds: string[] //岗位
}

export interface GetUserDetailResType extends ResType {
  data: {
    roleIds: string[] //角色
    postIds: string[] //岗位
    user: UserType
  } & RolePostId
}

export interface UpdateUserPayloadType extends UserPage, RolePostId {
  remark: string
  gender: string | number
  enabled: string | number
}

export interface UserCheckedResType extends ResType {
  data: {
    checkedRoleIds: string[]
    roles: RoleType[]
  }
}
