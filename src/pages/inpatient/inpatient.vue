<template>
  <scroll-view scroll-y>
    <view class="reservation">
      <view class="reservation-title">
        <text class="reservation-title-text">{{ departmentName }}</text>
      </view>
      <view class="reservation-search">
        <input
          v-model="searchText"
          placeholder="请输入医生姓名"
          placeholder-class="input-placeholder"
          @input="onSearch()"
        />
      </view>
      <!-- 医生列表 -->
      <view class="reservation-doctor">
        <!-- 如果医生列表有数据 -->
        <template v-if="doctorList.length > 0">
          <view class="hospital-time-selector">
            <picker
              mode="date"
              :start="startDate"
              :end="endDate"
              @change="onDateChange"
            >
              <view
                v-for="(item, index) in doctorList"
                :key="index"
                class="reservation-doctor-item"
                @click="reserveDoctor(item)"
              >
                <view class="reservation-doctor-item-left">
                  <image :src="item.image" mode="aspectFill" />
                </view>
                <view class="reservation-doctor-item-right">
                  <view class="reservation-doctor-item-right-top">
                    <text>{{ item.name }}</text>
                    <text>{{ item.qualification }}</text>
                  </view>
                  <view class="reservation-doctor-item-right-bottom">
                    <text>{{ item.description }}</text>
                  </view>
                </view>
              </view>
            </picker>
          </view>
        </template>
        <!-- 如果医生列表没有数据 -->
        <template v-else>
          <view class="no-doctor">
            <text>暂无负责医生</text>
          </view>
        </template>
      </view>
    </view>
  </scroll-view>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { searchDoctor, getInpatient } from '@/services/index.ts';
// 获取页面的传参
const query = defineProps<{
  hospitalId: string;
  departmentId: string;
  departmentName: string;
}>();
console.log(query.hospitalId);
const hospitalId = ref(query.hospitalId);
const departmentId = ref(query.departmentId);
const departmentName = JSON.parse(decodeURIComponent(query.departmentName));
const searchText = ref('');
const selectedDate = ref('');
const selectDoctor = ref();
const startDate = ref('2023-01-01');
const endDate = ref('2025-12-31');

// 获取医生列表
const doctorList = ref([]);

// 获取医生列表数据
const getDoctorListData = async () => {
  try {
    const data = {
      hospitalId: Number(hospitalId.value),
      departmentId: Number(departmentId.value),
      name: '',
    };
    const res = await searchDoctor(data);
    doctorList.value = res.data;
  } catch (error) {
    console.error('Failed to fetch doctor list:', error);
  }
};

let timeout = null;
const onSearch = () => {
  // 如果存在一个定时器，则清除它
  if (timeout) {
    clearTimeout(timeout);
  }

  // 设置一个新的定时器，300ms 后执行搜索逻辑
  timeout = setTimeout(async () => {
    console.log('搜索内容:', searchText.value);
    const data = {
      hospitalId: Number(hospitalId.value),
      departmentId: Number(departmentId.value),
      name: searchText.value,
    };
    const res = await searchDoctor(data);
    doctorList.value = res.data;
  }, 100);
};

const reserveDoctor = (item: any) => {
  selectDoctor.value = item;
};

const onDateChange = async (event: any) => {
  selectedDate.value = event.detail.value;
  const data = {
    hospitalId: Number(hospitalId.value), // 转换为数字
    departmentId: Number(departmentId.value), // 转换为数字
    doctorId: selectDoctor.value ? selectDoctor.value.doctorId : null, // 如果selectDoctor.value存在，取doctorId，否则为null
    admissionDate: selectedDate.value || '', // 如果没有选择日期，默认为空字符串
    roomsId: uni.getStorageSync('roomsId') || '', // 使用uni.getStorageSync同步获取，避免异步问题
    bedId: uni.getStorageSync('bedId') || '', // 同样使用uni.getStorageSync
  };
  uni.setStorageSync('inpatientData', data);
  const res = await getInpatient(data);
  if (res.code === 200) {
    uni.showToast({
      title: '办理成功',
      icon: 'success',
      success: () => {
        setTimeout(() => {
          uni.navigateTo({
            url: '/pages/my/my ',
          });
        }, 1000);
      },
    });
  } else {
    uni.showToast({
      title: '办理失败',
      icon: 'none',
    });
  }
};

onMounted(() => {
  getDoctorListData(); // 加载医生列表
});
</script>

<style lang="scss" scoped>
/* 统一的容器 padding */
.reservation-doctor {
  padding: 20rpx;
  margin-top: 30rpx;
}
.reservation-title {
  padding: 0 20rpx;
  font-size: 36rpx;
  font-weight: bold;
  color: rgb(63, 134, 255);
  margin: 20rpx 0;
  text-align: center;
}
/* 单个医生项布局 */
.reservation-doctor-item {
  display: flex;
  margin-bottom: 20rpx;
  border-bottom: 1px solid #e5e5e5;
  padding-bottom: 10rpx;
}

/* 医生头像 */
.reservation-doctor-item-left {
  width: 150rpx;
  height: 200rpx;
  margin-right: 15rpx;
}

.reservation-doctor-item-left image {
  width: 100%;
  height: 100%;
}

/* 医生信息部分 */
.reservation-doctor-item-right {
  flex: 1;
}

/* 顶部信息（姓名、职位等） */
.reservation-doctor-item-right-top {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8rpx;
}

.reservation-doctor-item-right-top text {
  font-size: 32rpx;
  font-weight: bold;
}

/* 中间信息（例如科室、擅长领域等） */
.reservation-doctor-item-right-middle {
  margin-bottom: 8rpx;
}

.reservation-doctor-item-right-middle text {
  font-size: 24rpx;
  color: #888;
}

/* 底部描述，控制文字行数 */
.reservation-doctor-item-right-bottom {
  font-size: 24rpx;
  color: #555;
  width: 540rpx;
  display: -webkit-box; /* 设置为弹性布局 */
  -webkit-box-orient: vertical; /* 垂直排列 */
  overflow: hidden; /* 隐藏超出部分 */
  -webkit-line-clamp: 4; /* 限制显示三行 */
  line-height: 33rpx; /* 行高，确保每行有足够的空间 */
  max-height: 125rpx; /* 最大高度，确保三行能正确显示 */
  margin-top: 20rpx;
}

/* 没有医生时的提示 */
.no-doctor {
  text-align: center;
  font-size: 28rpx;
  color: #ff5722;
  padding: 20rpx;
  background-color: #f8f8f8;
  border-radius: 8rpx;
  transition: all 0.3s ease; /* 增加平滑过渡效果 */
}
.no-scrollbar {
  -webkit-overflow-scrolling: touch; /* 平滑滚动 */
  overflow-x: auto; /* 启用横向滚动 */
}
/* 父容器 */
.reservation-search {
  margin: 20rpx; /* 上下边距 */
  padding: 0 30rpx; /* 左右内边距 */
  border-radius: 20rpx; /* 圆角 */
  background-color: #f9f9f9; /* 背景颜色 */
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1); /* 阴影 */
}

/* 输入框样式 */
.reservation-search input {
  width: 100%; /* 宽度占满父容器 */
  padding: 20rpx 30rpx; /* 内边距 */
  font-size: 28rpx; /* 字体大小 */
  height: 80rpx; /* 高度 */
  border: 1rpx solid #ddd; /* 边框颜色 */
  border-radius: 30rpx; /* 圆角 */
  background-color: #fff; /* 背景色 */
  color: #333; /* 文字颜色 */
  outline: none; /* 去掉输入框聚焦时的外边框 */
  transition: all 0.3s ease; /* 平滑过渡 */
}

/* 输入框聚焦时的样式 */
.reservation-search input:focus {
  border-color: #4caf50; /* 聚焦时的边框颜色 */
  box-shadow: 0 0 5rpx rgba(76, 175, 80, 0.5); /* 聚焦时的阴影 */
}

/* 占位符样式 */
.input-placeholder {
  color: #888; /* 占位符颜色 */
  font-size: 22rpx; /* 占位符字体大小 */
}
</style>
