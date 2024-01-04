import { PageDataType, ResType } from '@api/types'
import { UserType } from '@api/user/types'

// 角色列表
export interface GetRolePayloadyType {
  current: string | number
  size: string | number
  roleName?: string
  rolePerm?: string
  enabled?: string | number
}

export interface RoleType {
  checked?: boolean | string | number
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

export interface GetAllRoleResType extends ResType {
  data: RoleType[]
}

interface TreeType {
  id: string | number //菜单ID
  name: string //菜单权限名称
  parentId: string //上级ID
  sort: number //排序
  path: string //路由地址
  query: null //路由参数
  component: string //组件路径
  cache: number //是否缓存（0：缓存；1：不缓存）
  type: number //菜单类型（0：目录；1：菜单；2：按钮）
  visible: number //显示状态（0：显示；1：隐藏）
  redirect: string //重定向
  enabled: number //菜单状态（0：禁用；1：启用）
  perms: string //权限标识
  icon: string //图标
  remark: null //备注
  createTime: null
}

interface RoleTreeType extends TreeType {
  createBy: null
  updateBy: null
  updateTime: null
  children: TreeType[]
}

export interface GetRoleTreeResType extends ResType {
  data: RoleTreeType[]
}

export interface PostAddRoleRayloadType {
  roleName: string //角色名称
  rolePerm: string //角色权限编码
  enabled: number | string //是否启用（0：禁用；1：启用）
  descript: number | string //描述
  permissionIds: string[] //菜单ID
}
export interface PostAddRoleResType extends ResType {}

export interface GetDelRolePayloadType {
  id: number
}
export interface GetDelRoleResType extends ResType {}

export interface GetRoleDetailResType extends ResType {
  data: {
    role: RoleType
    permissions: string[]
  }
}

export interface PostUpdateRolePayloadType extends PostAddRoleRayloadType {
  id: string
}
export interface PostUpdateRoleResType extends ResType {}

export interface AssignUserPayloadType {
  current: number
  size: number
  roleId: string
  username?: string
  mobile?: string
}

export interface AssignUserResType extends ResType {
  data: { records: UserType[] } & PageDataType
}
