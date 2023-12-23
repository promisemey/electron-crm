import request from '@renderer/utils/request'
import {
  GetCaptchaPayloadType,
  GetCaptchaResType,
  GetDyCaptchaPayloadType,
  GetDyCaptchaResType,
  PostPhonePayloadType,
  PostPhoneResType,
  PostUserPayloadType,
  PostUserResType
} from './types'

/**
 *
 * @param key
 * @type string
 * @description 获取图形验证码
 * @returns 图片流
 */
export const getCaptchaApi = (params: GetCaptchaPayloadType) => {
  return request.get<GetCaptchaResType>('/captcha/image', params, { responseType: 'arraybuffer' })
}

export const postUserLoginApi = (param: PostUserPayloadType) => {
  return request.post<PostUserResType>('/u/loginByJson', param)
}

export const postPhoneLoginApi = (param: PostPhonePayloadType) => {
  return request.post<PostPhoneResType>('/u/loginByMobile', param)
}

export const getDyCaptchaLoginApi = (param: GetDyCaptchaPayloadType) => {
  return request.get<GetDyCaptchaResType>('/captcha/sendRegisterOrLoginCaptcha', param)
}
