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
