type Options<T> = { returnResult?: boolean; copy?: boolean; omit?: (keyof T)[] }

type ResetForm = {
  <T extends object>(formData: T): void
  <T extends object>(formData: T, options: Options<T>): T
}

export const useResetForm: ResetForm = <T extends object>(
  formData: T,
  options?: Options<T>
): void | T => {
  let _copy: T

  let keys = Object.keys(formData)

  if (options?.copy) {
    _copy = JSON.parse(JSON.stringify(formData))
  } else {
    _copy = formData
  }

  // 过滤 不需要清空数据
  if (options?.omit) keys = keys.filter((item) => !new Set(options.omit).has(item as keyof T))

  keys.forEach((item) => (_copy[item] = ''))

  // 配置项
  if (options && options.returnResult) {
    return _copy
  }
}
