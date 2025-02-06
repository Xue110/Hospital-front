<template>
  <view class="reservation">
    <view class="reservation-title">
      <text class="reservation-title-text">{{ departmentName }}</text>
    </view>
    <view class="reservation-time">
      <view class="reservation-time-top">
        <text>{{ time }}</text>
      </view>
      <scroll-view scroll-x class="no-scrollbar">
        <view class="reservation-time-bottom">
          <view
            v-for="(item, index) in dateRange"
            :key="index"
            class="reservation-time-bottom-item"
            @click="toggleDate(index)"
            :style="{
              backgroundColor:
                dayIndex === index ? 'rgb(63, 134, 255)' : 'rgb(172, 167, 167)',
            }"
          >
            <text>{{ item.weekDay }}</text>
            <text>{{ item.day }}</text>
          </view>
        </view>
      </scroll-view>
    </view>
    <scroll-view scroll-y>
      <view class="reservation">
        <!-- 医生列表 -->
        <view class="reservation-doctor">
          <!-- 如果医生列表有数据 -->
          <template v-if="filteredDoctors.length > 0">
            <view
              v-for="(item, index) in filteredDoctors"
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
                <view class="reservation-doctor-item-right-middle">
                  <text
                    >挂号费用：<text style="color: #ff0000"
                      >￥{{ item.fee }}</text
                    ></text
                  >
                  <text>
                    剩余预约：<text style="color: green">{{
                      item.availableAppointments
                    }}</text></text
                  >
                </view>
                <view class="reservation-doctor-item-right-bottom">
                  <text>{{ item.description }}</text>
                </view>
              </view>
            </view>
          </template>
          <!-- 如果医生列表没有数据 -->
          <template v-else>
            <view class="no-doctor">
              <text>当前日期暂无值班医生</text>
            </view>
          </template>
        </view>
      </view>
    </scroll-view>

    <view>
      <uni-popup ref="popup" background-color="#fff" @change="change">
        <view class="popup-content">
          <!-- 标题部分 -->
          <view class="popup-header">
            <text class="title">预约时间</text>
            <text class="description">请选择您希望预约的时间段</text>
          </view>

          <!-- 时间段按钮部分 -->
          <view class="time-buttons">
            <view
              v-for="(selectByTime, index) in timeSlots"
              :key="index"
              class="button-container"
            >
              <button @click="selectTime(selectByTime)" class="time-button">
                {{ selectByTime }}
              </button>
            </view>
          </view>
        </view>
      </uni-popup>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { getDoctorList, register } from '@/services/index.ts';
import { useMemberStore } from '@/stores';
// 获取页面的传参
const query = defineProps<{
  hospitalId: string;
  departmentId: string;
  departmentName: string;
}>();
const hospitalId = ref(query.hospitalId);
const departmentId = ref(query.departmentId);
const departmentName = JSON.parse(decodeURIComponent(query.departmentName));
const time = ref<string>('');
const year = ref<number>();
const month = ref<number>();
const today = ref<number>(); // 当前日期
const popup = ref<any>(null);
// 定义一个方法来打开弹窗
const open = () => {
  // 通过组件引用 popup 调用 open 方法
  popup.value.open('bottom');
};
const selectByTime = ref();
// 定义一个时间段数组从 8:00 到 4:00
const timeSlots = [
  '08:00:00 - 09:30:00',
  '09:30:00 - 11:00:00',
  '11:00:00 - 12:00:00',
  '13:00:00 - 14:30:00',
  '14:30:00 - 16:00:00',
];
// 弹窗内容改变的事件处理
const change = (e) => {
  console.log('Popup change:', e);
};
const startTime = ref('08:00');
const endTime = ref('17:00');
// 选择时间段时的处理
const selectTime = (selectByTime) => {
  console.log('Selected time:', selectByTime);
  startTime.value = selectedDate.value + ' ' + selectByTime.split(' - ')[0];
  endTime.value = selectedDate.value + ' ' + selectByTime.split(' - ')[1];
  onRegister();
  popup.value.close();
};
// 根据选定日期筛选医生
const filteredDoctors = ref([]);
const selectedDate = ref<string>('');
const dateRange = ref<Array<{ day: number; weekDay: string }>>([]); // 日期范围
const selectDoctor = ref();
const dayIndex = ref(0); // 当前日期索引

// 获取医生列表
const doctorList = ref([]);

// 获取医生列表数据
const getDoctorListData = async () => {
  try {
    const res = await getDoctorList(
      Number(hospitalId.value),
      Number(departmentId.value)
    );
    doctorList.value = res.data;
  } catch (error) {
    console.error('Failed to fetch doctor list:', error);
  }
};

// 更新日期范围
const setDateRange = () => {
  const date = new Date();
  today.value = date.getDate();
  const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']; // 周几数组

  // 使用 Set 来确保日期不重复
  const uniqueDates = new Set<string>();
  for (let i = 0; i < 10; i++) {
    const newDate = new Date(date.getTime() + i * 24 * 60 * 60 * 1000);
    const month = newDate.getMonth() + 1;
    const day = newDate.getDate();
    const weekDay = weekDays[newDate.getDay()]; // 获取周几
    const dateString = `${month}-${day}`;
    if (!uniqueDates.has(dateString)) {
      dateRange.value.push({
        day,
        weekDay,
      });
      uniqueDates.add(dateString);
    }
  }
};

// 获取当前时间
const getTime = () => {
  const date = new Date();
  const yearValue = date.getFullYear();
  const monthValue = date.getMonth() + 1;
  today.value = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
  time.value = `${yearValue}年${monthValue}月`;
  year.value = yearValue;
  month.value = monthValue;
  selectedDate.value = `${yearValue}-${
    monthValue < 10 ? '0' + monthValue : monthValue
  }-${today.value}`; // 格式化选中的日期
  getDoctors();
};

const getDoctors = () => {
  filteredDoctors.value = doctorList.value.filter((doctor) => {
    return doctor.date === selectedDate.value;
  });
};

// 根据选定日期筛选医生
const toggleDate = (index: number) => {
  dayIndex.value = index;
  const selectedDay =
    dateRange.value[index].day < 10
      ? `0${dateRange.value[index].day}`
      : dateRange.value[index].day;
  selectedDate.value = `${year.value}-${
    month.value < 10 ? '0' + month.value : month.value
  }-${selectedDay}`;
  filteredDoctors.value = doctorList.value.filter(
    (doctor) => doctor.date === selectedDate.value
  );
};

const reserveDoctor = (item: any) => {
  // 处理预约逻辑
  console.log('预约医生:', item);
  selectDoctor.value = item;
  open();
};

const onRegister = async () => {
  // 数据验证
  if (
    !hospitalId.value ||
    !selectDoctor.value ||
    !departmentId.value ||
    !selectedDate.value ||
    !startTime.value ||
    !endTime.value
  ) {
    uni.showToast({
      title: '请完善信息',
      icon: 'none',
      duration: 2000,
    });
    return; // 如果有空缺字段则退出
  }
  const memberStore = useMemberStore();
  // 构建请求数据
  const data = {
    id: memberStore.profile.id,
    hospitalId: Number(hospitalId.value),
    doctorId: Number(selectDoctor.value.doctorId),
    paymentAmount: Number(selectDoctor.value.fee),
    departmentId: Number(departmentId.value),
    date: selectedDate.value,
    startTime: startTime.value,
    endTime: endTime.value,
  };
  console.log('提交的挂号数据:', data);

  try {
    // 发起挂号请求
    const res = await register(data);
    uni.setStorageSync('orderId', res.data);
    if (res.code === 200) {
      // 如果挂号成功，显示成功提示
      uni.showToast({
        title: '挂号成功',
        icon: 'success',
        duration: 2000,
        success: () => {
          uni.showToast({
            title: '正在跳转订单详情页...',
            icon: 'none',
            duration: 2000,
            success: () => {
              // 跳转到订单详情页
              uni.navigateTo({
                url: '/pages/orderDetail/orderDetail?orderId=' + res.data,
              });
            },
          });
        },
      });
    } else {
      // 如果返回的状态码不是200，显示挂号失败
      uni.showToast({
        title: '挂号失败，请稍后再试',
        icon: 'error',
        duration: 2000,
      });
    }
  } catch (error) {
    // 网络请求错误处理
    console.error('挂号请求失败:', error);
    uni.showToast({
      title: '网络请求失败，请检查网络',
      icon: 'error',
      duration: 2000,
    });
  }
};
onMounted(async () => {
  await getDoctorListData(); // 加载医生列表
  getTime();
  setDateRange();
});
</script>

<style lang="scss" scoped>
.reservation {
  .reservation-title {
    padding: 0 20rpx;
    font-size: 36rpx;
    font-weight: bold;
    color: rgb(63, 134, 255);
    margin: 20rpx 0;
    text-align: center;
  }
  .reservation-time {
    padding: 20rpx;
    box-shadow: 0 0 10rpx rgba(0, 0, 0, 0.1);
    border-radius: 20rpx;
    height: 220rpx;
    .reservation-time-top {
      font-size: 40rpx;
      color: rgb(96, 96, 96);
    }
    .reservation-time-bottom {
      width: 1400rpx;
      height: 100rpx;
      display: flex;
      margin-top: 20rpx;
      .reservation-time-bottom-item {
        width: 200rpx;
        height: 100rpx;
        background-color: rgb(172, 167, 167);
        color: #fff;
        font-size: 30rpx;
        text-align: center;
        margin-right: 20rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 20rpx;
        flex-direction: column;
      }
    }
  }
  /* 统一的容器 padding */
  .reservation-doctor {
    padding: 20rpx;
    margin-top: 30rpx;
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
    -webkit-line-clamp: 3; /* 限制显示三行 */
    line-height: 33rpx; /* 行高，确保每行有足够的空间 */
    max-height: 60rpx; /* 最大高度，确保三行能正确显示 */
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

  /* 小程序中无法使用 webkit-scrollbar 隐藏滚动条，但是可以通过系统样式来隐藏 */
  .no-scrollbar {
    -ms-overflow-style: none; /* 在 IE 和 Edge 中隐藏滚动条 */
    scrollbar-width: none; /* Firefox 隐藏滚动条 */
    overflow-x: scroll; /* 允许横向滚动 */
  }
  .popup-content {
    padding: 20rpx;
  }

  .popup-header {
    text-align: center;
    margin-bottom: 20rpx;
    display: flex;
    flex-direction: column;
  }

  .title {
    font-size: 34rpx;
    font-weight: bold;
    color: #333;
  }

  .description {
    font-size: 24rpx;
    color: #777;
  }

  .time-buttons {
    display: flex;
    flex-direction: column;
    gap: 10rpx;
  }

  .button-container {
    display: flex;
    justify-content: center;
  }

  .time-button {
    width: 90%;
    padding: 12rpx;
    background-color: #007aff;
    color: white;
    border: none;
    border-radius: 5rpx;
    font-size: 26rpx;
    transition: background-color 0.3s ease;
  }

  .time-button:hover {
    background-color: #005bb5;
  }

  .time-button:active {
    background-color: #004080;
  }
}
</style>
