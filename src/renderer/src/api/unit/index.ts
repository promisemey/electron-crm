// /system/unit/tree

import request from '@utils/request'
import { GetUnitTreeResType } from './types'

// 机构树
export const getUnitTreeApi = () => {
  return request.get<GetUnitTreeResType>('/system/unit/tree')
}
