type Options = { returnResult?: boolean; copy?: boolean; omit?: string[] }

type ResetForm = {
  <T extends object>(formData: T): void
  <T extends object>(formData: T, options: Options): T
}

export const useResetForm: ResetForm = <T extends object>(
  formData: T,
  options?: Options
): void | T => {
  let _copy: T

  let keys = Object.keys(formData)

  if (options?.copy) {
    _copy = JSON.parse(JSON.stringify(formData))
  } else {
    _copy = formData
  }

  // 过滤 不需要清空数据
  if (options?.omit) keys = keys.filter((item) => !new Set(options.omit).has(item))

  keys.forEach((item) => (_copy[item] = ''))

  console.log('-----', formData)

  // 配置项
  if (options && options.returnResult) {
    return _copy
  }
}
