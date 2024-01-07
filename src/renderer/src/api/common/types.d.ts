import { ResType } from '@api/types'

export interface GetCaptchaPayloadType {
  key: string
}
export type GetCaptchaResType = ArrayBuffer

export interface PostUserPayloadType {
  password: string //密码（需要使用AES加密）
  username: string //用户名（需要使用AES加密）
  key: string //图形验证码中随机UUID
  captcha: string
}
export interface PostUserResType {
  code: string | number
  data: string
  msg: string
}
export interface UserLoginResType extends PostUserResType {}

export interface GetDyCaptchaPayloadType {
  mobile: string // AES
}
export interface GetDyCaptchaResType extends PostUserResType {}

export interface PostPhonePayloadType {
  mobile: string // AES
  captcha: string
}
export interface PostPhoneResType extends PostUserResType {}

export interface UserInfo {
  //用户信息
  id: string //用户ID
  username: string //用户名
  realName: string //真实姓名
  userType: 0 | 1 //用户类型（0：普通账号；1：超级管理员）
  email: string //用户邮箱
  phone: string //手机号码
  gender: 0 | 1 | 2 //用户性别（1：男；2：女；0：未知）
  avatar: string //头像路径
  enabled: 0 | 1 //帐号状态（0：禁用；1：正常
  delFlag: 0 | 1 //是否删除（0：有效；1：删除）
  remark: string | null //备注
  permissions: string[]
}
export interface Permissions {
  [index: number]: string
}
export interface Role {
  id: string //角色ID
  roleName: string //角色名称
  rolePerm: string //角色权限
}
export interface Units {
  //机构信息
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
  system: 0 | 1 //是否为系统内置（1：是；0：否）
  enabled: 0 | 1 //是否启用（1：启用；0：禁用）
  leaderId: string | null //领导用户ID
  createBy: string
  createTime: 1657935135000
  updateBy: string | null
  updateTime: string | null
  address: string //地址
}

type AddStringType<T> = {
  [K in keyof T]: T[K] | string
}

interface WeChatOriginal {
  avatar: string
  blog: null
  company: null
  email: null
  gender: string
  id: string
  location: string
  mpOpenId: string
  nickname: string
  remark: null
  source: string
  unionId: string
  userId: string
  username: string
  uuid: string
}

type StringOrNull = string | null

export interface WeChat extends Record<keyof WeChatOriginal, StringOrNull> {}

// 用户信息
interface GetUserInfoResType extends PostUserResType {
  data: {
    //数据
    userInfo: UserInfo
    permissions: Permissions
    units: Units
    roles: Role[]
    wechat: WeChat
  }
}

// 路由
interface Meta {
  title: string //标题
  icon: string //图标
  noCache: boolean //是否缓存
  link: null | string //外链
  affix: false
  hidden: true
  breadCrumbs?: Meta
}

interface Children extends Menu {}

interface Menu {
  id: string //ID
  name: string //路由名称
  hidden?: boolean //显示状态
  redirect: string //重写向地址
  component: any //组件路径
  alwaysShow?: boolean //是否总显示
  query?: string //路由参数
  path: string //路由地址
  parentView: string
  meta: Meta
  children: Children[]
}

export interface GetMenuResType extends PostUserResType {
  data: Menu[]
}

// 重构Router

// meta
export interface RouteMetaBasicType {
  affix: boolean
  hidden: boolean
  title: string //标题
  icon: string //图标
  link: null | string //外链
  noCache: boolean //是否缓存
}

export interface RouteMetaType extends RouteMetaBasicType {
  breadCrumbs?: RouteMetaBasicType
}

// Route基础属性
export interface RouterItemType {
  id: string //ID
  name: string //路由名称
  hidden?: boolean //显示状态
  redirect: string //重写向地址
  component: string | null //组件路径
  alwaysShow?: boolean //是否总显示
  query?: string //路由参数
  path: string //路由地址
  parentView: string
  meta: RouteMetaType
  children: RouterItemType[] | null
}

export interface RoutersResType extends ResType {
  data: RouterItemType[]
}
