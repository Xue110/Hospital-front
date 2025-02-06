import type { LoginResult } from '@/types/member'
import { http } from '@/utils/http'

type LoginParams = {
  code: string
}
/**
 * 小程序登录
 * @param data 请求参数
 */
export const postLoginWxMinAPI = (data: LoginParams) => {
  return http<LoginResult>({
    method: 'POST',
    url: '/user/user/login',
    data,
  })
}

/**
 * 获取验证码
 * @param data 请求参数
 * */
export const postSendCodeAPI = (phone: number) => {
  return http({
    method: 'GET',
    url: `/user/user/code?phone=${phone}`,
  })
}

/**
 * 修改密码
 * @param data 请求参数
 * */
export const postChangePasswordAPI = (data: { phone: number; code: string; password: string }) => {
  return http({
    method: 'POST',
    url: '/user/user/changePassword',
    data,
  })
}