type Options = { returnResult?: boolean; copy?: boolean }

type ResetForm = {
  <T extends object>(formData: T): void
  <T extends object>(formData: T, options: Options): T
}

export const useResetForm: ResetForm = <T extends object>(
  formData: T,
  options?: Options
): void | T => {
  let _copy: T

  if (options?.copy) {
    _copy = JSON.parse(JSON.stringify(formData))
  } else {
    _copy = formData
  }

  Object.keys(formData).forEach((item) => (_copy[item] = ''))

  // 配置项
  if (options && options.returnResult) {
    return _copy
  }
}
