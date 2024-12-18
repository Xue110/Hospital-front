/** 小程序登录 登录用户信息 */
export type LoginResult = {
    /** 用户ID */
    id: number
    /** 身份信息 */
    openId: string
    /** 登录凭证 */
    token: string
  }
  
  /** 个人信息 用户详情信息 */
  export type ProfileDetail = {
    /** 用户ID */
    id: number
    /** 头像  */
    avatar: string
    /** 账户名  */
    username: string
    /** 省市区 */
    address?: string
  }
  