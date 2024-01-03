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

interface RoutesItem extends OmitMenuType {
  children?: ChildItem[]
  meta: MetaType
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
