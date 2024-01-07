import { Menu, Meta } from '@api/common/types'

type OmitMenuType = Omit<Menu, 'meta' | 'children'>
type OmitMenuMoreType = Omit<OmitMenuType, 'query' | 'id' | 'hidden' | 'alwaysShow'>

type ComponentViews = Component | undefined

type MetaType = Record<string | number | symbol, unknown> & Meta

interface MenuStore extends Omit<Menu, 'meta'> {
  meta: MetaType
  children?: RoutesItem[]
}

interface ResetMenu extends OmitMenuType {
  meta: MetaType
  children?: RoutesItem[]
}

// 添加面包屑
// interface ResetChild extends ResetMenu {
//   breadCrumbs: Meta[]
// }

interface Menu {
  id: string //ID
  name: string //路由名称
  hidden?: boolean //显示状态
  redirect: string //重写向地址
  component: any //组件路径
  alwaysShow?: boolean //是否总显示
  query?: string //路由参数
  path: string //路由地址
  meta: Meta
  parentView: string
  children: Children[]
}

interface RoutesItem extends OmitMenuType {
  id: string //ID
  hidden?: boolean //显示状态
  alwaysShow?: boolean //是否总显示
  query?: string //路由参数
  children?: ChildItem[]
  meta: MetaType | Meta
  [k: string]: any
}

// route meta类型扩展

interface ChildItem extends RoutesItem {}

// 标签页
interface TabsType {
  title: string
  path: string
  index: string
}

type TabsType = {
  index: string
  title: string
  path: string
}
