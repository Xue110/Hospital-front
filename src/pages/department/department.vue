<template>
  <scroll-view scroll-y>
    <view class="container">
      <view class="department" v-for="item in department" :key="item.id">
        <view class="department-box" @click="goReservation(item)">
          <view class="department-icon">
            <image
              src="../../static/image/hospitalMessage/department.png"
              mode="aspectFill"
            />
          </view>
          <view class="department-info">
            <view class="department-name">{{ item.name }}</view>
          </view>
        </view>
      </view>
    </view>
  </scroll-view>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { getDepartmentList } from '@/services/index.ts';

// 获取页面的传参
const query = defineProps<{ hospitalId: string; type: string }>();
const hospitalId = query.hospitalId;

// 获取科室信息
const department = ref([
  { id: 1, name: '内科' },
  { id: 2, name: '外科' },
  { id: 3, name: '儿科' },
  { id: 4, name: '妇产科' },
  { id: 5, name: '眼科' },
  { id: 6, name: '耳鼻喉科' },
  { id: 7, name: '口腔科' },
  { id: 8, name: '皮肤科' },
  { id: 9, name: '精神科' },
  { id: 10, name: '传染科' },
]);
const getDepartment = async () => {
  const res = await getDepartmentList();
  department.value = res.data;
};

const goReservation = (item: any) => {
  const encodedDepartmentName = encodeURIComponent(JSON.stringify(item.name)); // 编码部门名称
  if (query.type === '2') {
    uni.navigateTo({
      url: `/pages/inpatient/inpatient?departmentId=${item.id}&hospitalId=${hospitalId}&departmentName=${encodedDepartmentName}&type=2`,
    });
  } else if (query.type == '1') {
        uni.navigateTo({
      url: `/pages/bed/bed?departmentId=${item.id}&hospitalId=${hospitalId}&departmentName=${encodedDepartmentName}&type=1`,
    });
  }
  else {
    uni.navigateTo({
      url: `/pages/reservation/reservation?departmentId=${item.id}&hospitalId=${hospitalId}&departmentName=${encodedDepartmentName}`,
    });
  }
};
onMounted(() => {
  getDepartment();
});
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 20rpx;
}

.department {
  width: 48%;
  height: 200rpx; /* 调整高度使卡片更小 */
  background-color: #fff;
  border-radius: 12rpx; /* 较小的圆角 */
  margin-bottom: 15rpx; /* 减小底部间距 */
  box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5rpx); /* 稍微减小悬浮时的上升效果 */
  }

  .department-box {
    display: flex;
    align-items: center;
    height: 100%;
    padding: 12rpx; /* 减少内边距 */
  }

  .department-icon {
    width: 100rpx; /* 缩小图标 */
    height: 100rpx;
    background-color: #f0f0f0;
    border-radius: 50%;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;

    image {
      width: 50%; /* 缩小图标内的图片 */
      height: 50%;
      object-fit: contain;
    }
  }

  .department-info {
    margin-left: 15rpx;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;

    .department-name {
      font-size: 28rpx; /* 调整字体大小 */
      font-weight: 500;
      color: #444; /* 更柔和的字体颜色 */
      line-height: 36rpx; /* 增加行高，使得文字显示更清晰 */
    }
  }
}

/* 响应式设计 */
@media screen and (max-width: 750rpx) {
  .department {
    width: 100%;
    height: auto;
  }
}
</style>
