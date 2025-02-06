import { http } from '@/utils/http'

/**
 *  ai问诊
 * 
 */
export const aiInquiry = (data: any) => {
  return http({
    url: `/user/ai/generate?message=${data}`,
    method: 'GET'
  })
}