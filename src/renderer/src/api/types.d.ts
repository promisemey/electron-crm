export interface ResType {
  code: string
  msg: string
}

export interface PageDataType {
  total: number | string
  size: number | string
  current: number | string
  orders?: Array
  optimizeCountSql?: boolean
  searchCount?: boolean
  countId?: unknown
  maxLimit?: unknown
  pages: number | string
}

export interface BaseResponse extends ResType {
  data: PageDataType
}

export interface BaseRecord {
  id: string //菜单ID
  name: string //菜单权限名称
  createBy: null
  createTime: null
  updateBy: null
  updateTime: null
  remark?: null //备注
}

// cache: number //是否缓存（0：缓存；1：不缓存）
// type: number //菜单类型（0：目录；1：菜单；2：按钮）
// visible: number //显示状态（0：显示；1：隐藏）
// enabled: number //菜单状态（0：禁用；1：启用）
export enum Cache {
  Yes,
  No
}
export enum MenuType {
  Catalog,
  Menu,
  Button
}
export enum Visible {
  Show,
  Hidden
}
export enum Enabled {
  Forbidden,
  enable
}
