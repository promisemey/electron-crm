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

interface RoutesItem extends OmitMenuType {
  id: string //ID
  hidden?: boolean //显示状态
  alwaysShow?: boolean //是否总显示
  query?: string //路由参数
  children: ChildItem[] | null
  meta: MetaType | Meta
  [k: string]: unknown
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
