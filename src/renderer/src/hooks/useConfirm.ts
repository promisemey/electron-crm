import { ResType } from '@api/types'
import { ElMessageBox, ElMessage } from 'element-plus'

type RequestApi = (params: any) => Promise<ResType>

type TableData = () => void

export const useConfirm = (
  params: unknown,
  requestApi: RequestApi,
  onTableData: TableData,
  text?: string
) => {
  // 先询问确认删除吗？
  ElMessageBox.confirm(text ?? '确定删除该条数据吗?', '温馨提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async (): Promise<any> => {
      // 确认去请求接口让后端把仓库数据删掉
      // ElMessage.error('等待请求接口')
      const { code, msg } = await requestApi(params)
      if (code == '200') {
        onTableData() // 获取最新数据
        ElMessage.success(msg)
        return true
      } else {
        ElMessage.error(msg)
      }
    })
    .catch(() => {
      // 取消就提示一下
      ElMessage.info('取消删除')
    })
}
