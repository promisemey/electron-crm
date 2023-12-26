import { Menu, Meta } from '@api/common/types'

type OmitMenuType = Omit<Menu, 'meta' | 'children'>
type OmitMenuMoreType = Omit<OmitMenuType, 'query' | 'id' | 'hidden' | 'alwaysShow'>

type ComponentViews = Component | undefined

type MetaType = Record<string | number | symbol, unknown>

interface ResetMenu extends OmitMenuType {
  meta: MetaType
  children: ResetChild[]
}

interface ResetChild extends ResetMenu {}

interface RoutesItem extends OmitMenuMoreType {
  children?: ChildItem[]
  meta: MetaType
}

// route meta类型扩展

interface ChildItem extends RoutesItem {}

interface extensionMeta extends RouteLocationNormalizedLoaded {
  meta: Meta
}
