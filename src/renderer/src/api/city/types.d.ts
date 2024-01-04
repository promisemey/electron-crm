import { ResType } from '@api/types'

type CityType = {
  id: string //地区ID
  areaName: string //地区名称
  parentId: number //上级地区ID
  shortName: string //地区简称
  lng: string //经度
  lat: string //纬度
  level: number //级别
  sort: number //排序
}

export interface CityByParentIdResType extends ResType {
  data: CityType[]
}

export interface CityByIdResType extends ResType {
  data: CityType
}
