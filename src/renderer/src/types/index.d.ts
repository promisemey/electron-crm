import { Menu } from '@api/common/types'

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

interface ChildItem extends RoutesItem {}
