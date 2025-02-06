import { http } from '@/utils/http';

// 健康打卡
export const healthCheck = () => {

  return http({
    url: '/user/bank/sign',
    method: 'POST',
  });
};

// 健康排行榜
export const healthRank = () => {
  return http({
    url: '/user/bank/score/rank',
    method: 'GET',
  });
};

// 获取医院列表
export const getHospitals = () => {
  return http({
    url: '/user/user/hospital',
    method: 'GET',
  });
}

// 获取科室列表
export const getDepartmentList = () => {
  return http({
    url: '/user/registration/department',
    method: 'GET',
  });
};

// 获取医生列表
export const getDoctorList = (hospitalId: number, departmentId: number) => {
  return http({
    url: `/user/registration/doctor?hospitalId=${hospitalId}&departmentId=${departmentId}`,
    method: 'GET',
  });
};
// 挂号
export const register = (data: any) => {
  return http({
    url: '/user/registration/registration',
    method: 'POST',
    data: data,
  });
};

//获取订单详情
export const getOrderDetail = (orderId: number) => {
  return http({
    url: `/user/order/payOrder/${orderId}`,
    method: 'POST',
  });
};

// 支付
export const pay = (orderId: number) => {
  return http({
    url: `/user/order/pay/${orderId}`,
    method: 'POST',
  });
}

//取消订单
export const cancelOrder = (orderId: number) => {
  return http({
    url: `/user/order/cancelPay/${orderId}`,
    method: 'POST',
  });
}

// 删除订单
export const deleteOrder = (orderId: number) => {
  const ids = [orderId];
  return http({
    url: `/user/order/delete/batchDelete?ids=${ids}`,
    method: 'DELETE',
  });
}

// 搜索医生
export const searchDoctor = (data: any) => {
  return http({
    url: '/user/inpatient/getDoctors',
    method: 'POST',
    data: data,
  });
}

// 办理住院
export const getInpatient = (data: any) => {
  return http({
    url: '/user/inpatient/admit',
    method: 'POST',
    data: data,
  });
}

// 选择床位
export const chooseBed = (departmentId: any) => {
  return http({
    url: `/user/inpatient/beds/${departmentId}`,
    method: 'GET',
  });
}

// 选择床位信息
export const chooseBedInfo = (data: any) => {
  return http({
    url: '/user/inpatient/beds/reserve',
    method: 'POST',
    data: data,
  });
}

// 获取住院信息
export const getInpatientInfo = () => {
  return http({
    url: '/user/user/myRooms',
    method: 'GET',
  });
}