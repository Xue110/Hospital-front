import { http } from '@/utils/http';

// 获取全部订单列表
export const getOrderList = () => {
  return http({
    url: '/user/order/selectAll',
    method: 'GET',
  });
}

// 获取我的订单
export const getMyOrderList = () => {
  return http({
    url: '/user/user/myOrder',
    method: 'GET',
  });
}
