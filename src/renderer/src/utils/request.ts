// 导入Axios
import { useMainStore } from '@store'
import type { AxiosInstance, AxiosRequestConfig, AxiosError, AxiosResponse } from 'axios'
import axios from 'axios' // pnpm add axios

// 创建axios实例
const request: AxiosInstance = axios.create({
  baseURL: '/api',
  timeout: 6000,
  headers: {
    // 'content-type': 'application/x-www-form-urlencoded'
  }
})

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    const mainStore = useMainStore()
    mainStore.loading = true
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = token
    }
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  (response: AxiosResponse) => {
    const mainStore = useMainStore()

    mainStore.loading = false

    return response.data
  },
  (error: AxiosError) => {
    // const mainStore = useMainStore()
    // mainStore.loading = false
    return Promise.reject(error)
  }
)

// 导出useAxios
const get = <T>(url: string, params: object = {}, option: AxiosRequestConfig = {}): Promise<T> => {
  return request.get(url, { params, ...option })
}

const del = <T>(url: string, params: object = {}, option: AxiosRequestConfig = {}): Promise<T> => {
  return request.delete(url, { params, ...option })
}

const post = <T>(url: string, data: object = {}, option: AxiosRequestConfig = {}): Promise<T> => {
  return request.post(url, data, option)
}

const put = <T>(url: string, data: object = {}, option: AxiosRequestConfig = {}): Promise<T> => {
  return request.put(url, data, option)
}

export default {
  get,
  del,
  post,
  put
}
