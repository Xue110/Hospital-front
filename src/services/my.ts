import { http } from '@/utils/http';

/**
 * 获取个人信息
 * id 请求参数
 */

export const getMyInfo = (id: number) => {
  return http({
    url: `/user/user/profile/${id}`,
    method: 'GET',
  });
};

/**
 * 修改个人信息
 * id 请求参数
 * data 请求参数
 */
export const updateMyInfo = (data: any) => {
  return http({
    url: '/user/user/profile/update',
    method: 'PUT',
    data,
  });
};

/**
 * 获取家庭成员列表
 * @param userId 请求参数
 */
export const getFamilyList = (userId: number) => {
  return http({
    url: `/user/user/family?userId=${userId}`,
    method: 'GET',
  });
};

/**
 * 添加家庭成员
 * @param data 请求参数
 */
export const addFamily = (data: any) => {
  return http({
    url: '/user/user/family/insert',
    method: 'POST',
    data,
  });
};

/**
 * 切换家庭成员
 * @param userId 请求参数
 */
export const changeFamily = (userId: number) => {
  return http({
    url: `/user/user/switch/${userId}`,
    method: 'POST',
  });
};
/**
 * 删除家庭成员
 * @param userId 请求参数
 *  */
export const deleteFamily = (userId: number) => {
  const ids = [userId];
  return http({
    url: `/user/user/family/delete?ids=${ids}`,
    method: 'DELETE',
  });
};

/**
 * 获取健康档案信息
 */
export const getHealthInfo = () => {
  return http({
    url: '/user/medicalRecord/info',
    method: 'GET',
  });
};

/**
 * 修改健康档案信息
 * @param data 请求参数
 * */
export const updateHealthInfo = (data: any) => {
  return http({
    url: '/user/medicalRecord/update',
    method: 'POST',
    data,
  });
};

/**
 * 新建健康档案信息
 * @param data 请求参数
 * */
export const addHealthInfo = (data: any) => {
  return http({
    url: '/user/medicalRecord/add',
    method: 'POST',
    data,
  });
};

/**
 * 获取疾病信息
 * */
export const getDiseaseInfo = () => {
  return http({
    url: '/user/user/disease',
    method: 'GET',
  });
}

/**
 * 获取药物信息
 * */
export const getMedicineInfo = () => {
  return http({
    url: '/user/user/medication',
    method: 'GET',
  });
}