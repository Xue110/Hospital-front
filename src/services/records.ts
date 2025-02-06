import { http } from '@/utils/http';

//获取挂号记录
export const getRecords = () => {
  return http({
    url: '/user/user/myRegistration',
    method: 'GET',
  });
}
// 获取床位信息
export const getBedInfo = () => {
  return http({
    url: '/user/user/myRooms',
    method: 'GET',
  });
}
// 获取就诊记录
export const getMedicalRecords = () => {
  return http({
    url: '/user/user/myMedicalRecord',
    method: 'GET',
  });
}
// 获取预约记录
export const getAppointmentRecords = () => {
  return http({
    url: '/user/user/myAppointment',
    method: 'GET',
  });
}