export interface GetCaptchaPayloadType {
  key: string
}
export type GetCaptchaResType = ArrayBuffer

export interface PostUserPayloadType {
  password: string //密码（需要使用AES加密）
  username: string //用户名（需要使用AES加密）
  key: string //图形验证码中随机UUID
  captcha: string
}
export interface PostUserResType {
  code: string | number
  data: string
  msg: string
}

export interface GetDyCaptchaPayloadType {
  mobile: string // AES
}
export interface GetDyCaptchaResType extends PostUserResType {}

export interface PostPhonePayloadType {
  mobile: string // AES
  captcha: string
}
export interface PostPhoneResType extends PostUserResType {}
