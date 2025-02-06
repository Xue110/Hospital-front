<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getOrderList } from '@/services/order.ts';
import { deleteOrder, pay } from '@/services/index.ts';
import {
  getRecords,
  getBedInfo,
  getMedicalRecords,
  getAppointmentRecords,
} from '@/services/records.ts';
// tabs 数据
const orderTabs = ref([
  { orderState: 0, title: '全部' },
  { orderState: 1, title: '挂号记录' },
  { orderState: 2, title: '床位信息' },
  { orderState: 3, title: '就诊记录' },
  { orderState: 4, title: '预约记录' },
]);

// 获取页面参数
const query = defineProps<{
  type: string;
}>();

// 游标位置
const cursor = ref(
  orderTabs.value.findIndex((v) => v.orderState === Number(query.type))
);

const orderList = ref([]);
// 获取全部订单
const getAllOrder = async () => {
  const res = await getOrderList();
  orderList.value = res.data;
};

// 更新游标的值
const updateCursor = async (orderState: number) => {
  cursor.value = orderState;
  if (orderState === 0) {
    console.log('获取全部订单');
    getAllOrder();
  } else if (orderState === 1) {
    console.log('获取挂号订单');
    const res = await getRecords();
    orderList.value = res.data;
  } else if (orderState === 2) {
    console.log('获取床位信息');
    const res = await getBedInfo();
    orderList.value = res.data;
  } else if (orderState === 3) {
    console.log('获取就诊记录');
    const res = await getMedicalRecords();
    orderList.value = res.data;
  } else if (orderState === 4) {
    console.log('获取预约记录');
    const res = await getAppointmentRecords();
    orderList.value = res.data;
  } else {
    console.log('未知状态');
  }
};

const paymentStatusText = (status: number) => {
  switch (status) {
    case 1:
      return '待支付';
    case 2:
      return '已支付';
    case 3:
      return '已取消';
    case 4:
      return '已超时';
    default:
      return '未知状态';
  }
};

// 删除订单
const onDelete = async (item: any) => {
  await deleteOrder(item.id);
  updateCursor(cursor.value);
};

const pay = async (item: any) => {
  const res = await pay(item.id);
  if (res.code == 200) {
    uni.showToast({ title: '支付成功', icon: 'success' });
    updateCursor(cursor.value);
  } else {
    uni.showToast({ title: '支付失败', icon: 'error' });
  }
};

onMounted(() => {
  updateCursor(cursor.value);
});
</script>

<template>
  <view class="order">
    <!-- tabs -->
    <view class="tabs">
      <text
        class="item"
        v-for="item in orderTabs"
        :key="item.orderState"
        @tap="updateCursor(item.orderState)"
      >
        {{ item.title }}
      </text>
      <!-- 游标 -->
      <view class="cursor" :style="{ left: cursor * 20 + '%' }"></view>
    </view>
    <!-- 滑动容器 -->
    <swiper
      class="swiper"
      :current="cursor"
      @change="updateCursor($event.detail.current)"
    >
      <!-- 滑动项 -->
      <swiper-item v-for="item in orderTabs" :key="item.orderState">
        <!-- 订单列表 -->
        <scroll-view scroll-y class="orders">
          <!-- 全部记录 -->
          <view
            class="card"
            v-if="cursor == 0"
            v-for="item in orderList"
            :key="item.id"
          >
            <!-- 订单信息 -->
            <view class="status">
              <text class="date">{{ item.date }}</text>
              <!-- 订单状态文字 -->
              <text>{{ paymentStatusText(item.paymentStatus) }}</text>
              <!-- 待评价/已完成/已取消 状态: 展示删除订单 -->
              <text class="icon-delete"></text>
            </view>
            <!-- 订单信息，点击订单跳转到订单详情，不是订单详情 -->
            <navigator
              class="goods"
              :url="`/pages/orderDetail/orderDetail?id=${item.id}`"
              hover-class="none"
            >
              <view class="meta">
                <view class="name ellipsis"
                  >订单号: {{ item.id }}</view
                >
                <view class="name ellipsis"
                  >患者名: {{ item.patientName }}</view
                >
                <view class="name ellipsis"
                  >类型：{{
                    item.type === 1 ? '挂号' : item.type === 2 ? '住院' : '其他'
                  }}</view
                >
                <view class="type"
                  >支付方式：{{
                    item.paymentMethod === 1
                      ? '微信'
                      : item.paymentMethod === 2
                      ? '支付宝'
                      : '余额支付'
                  }}</view
                >
              </view>
            </navigator>
            <!-- 支付信息 -->
            <view class="payment">
              <text>实付</text>
              <text class="amount">
                <text class="symbol">¥</text>{{ item.total }}</text
              >
            </view>
            <!-- 订单操作按钮 -->
            <view class="action">
              <!-- 待付款状态：显示去支付按钮 -->
              <template v-if="item.paymentStatus === 1">
                <view class="button primary" @click="pay(item)">去支付</view>
              </template>
              <template v-else>
                <view class="button secondary" @click="onDelete(item)">
                  删除订单
                </view>
              </template>
            </view>
          </view>

          <!-- 挂号记录 -->
          <view
            class="card"
            v-if="cursor == 1 || cursor == 3 || cursor == 4"
            v-for="item in orderList"
            :key="item.id"
          >
            <!-- 订单信息 -->
            <view class="status">
              <text class="date">{{ item.date }}</text>
              <!-- 订单状态文字 -->
              <text>{{ paymentStatusText(item.paymentStatus) }}</text>
              <!-- 待评价/已完成/已取消 状态: 展示删除订单 -->
              <text class="icon-delete"></text>
            </view>
            <!-- 订单信息，点击订单跳转到订单详情，不是订单详情 -->
            <view class="goods">
              <view class="meta">
                <view class="name ellipsis"
                  >患者名: {{ item.patientName }}</view
                >
                <view class="name ellipsis">医生名: {{ item.doctorName }}</view>
                <view class="name ellipsis"
                  >科室名: {{ item.departmentName }}</view
                >
                <view class="name ellipsis"
                  >医院名: {{ item.hospitalName }}</view
                >
                <view class="name ellipsis"
                  >诊疗时间: {{ item.startTime }} - {{ item.endTime }}</view
                >
                <view class="type">{{
                  item.status === 1
                    ? '待确认'
                    : item.status === 2
                    ? '已确认'
                    : item.status === 3
                    ? '已就诊'
                    : '已取消'
                }}</view>
              </view>
            </view>
            <!-- 支付信息 -->
            <view class="payment">
              <text>实付</text>
              <text class="amount">
                <text class="symbol">¥</text>{{ item.paymentAmount }}</text
              >
            </view>
          </view>

          <!-- 床位信息 -->
          <view
            class="card"
            v-if="cursor == 2"
            v-for="item in orderList"
            :key="item.id"
          >
            <!-- 订单信息 -->
            <view class="status">
              <text class="date">{{ item.date }}</text>
              <!-- 订单状态文字 -->
              <text>{{ paymentStatusText(item.paymentStatus) }}</text>
              <!-- 待评价/已完成/已取消 状态: 展示删除订单 -->
              <text class="icon-delete"></text>
            </view>
            <!-- 订单信息，点击订单跳转到订单详情，不是订单详情 -->
            <view class="goods">
              <view class="meta">
                <view class="name ellipsis"
                  >病房床位号: {{ item.roomNumber }}</view
                >
                <view class="name ellipsis"
                  >科室名: {{ item.departmentName }}</view
                >
                <view class="type"
                  >{{
                    item.status === 1
                      ? '待确认'
                      : item.status === 2
                      ? '已确认'
                      : '已就诊'
                  }}--支付状态：{{
                    item.paymentStatus === 1
                      ? '未支付'
                      : item.paymentStatus === 2
                      ? '已支付'
                      : '已取消'
                  }}</view
                >
              </view>
            </view>
            <!-- 支付信息 -->
            <view class="payment">
              <text>实付</text>
              <text class="amount">
                <text class="symbol">¥</text>{{ item.paymentAmount }}</text
              >
            </view>
          </view>
        </scroll-view>
      </swiper-item>
    </swiper>
  </view>
</template>

<style lang="scss">
page {
  height: 100%;
  overflow: hidden;
}

.order {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #fff;
}

// tabs
.tabs {
  display: flex;
  justify-content: space-around;
  line-height: 60rpx;
  margin: 0 10rpx;
  background-color: #fff;
  box-shadow: 0 4rpx 6rpx rgba(240, 240, 240, 0.6);
  position: relative;
  z-index: 9;

  .item {
    flex: 1;
    text-align: center;
    padding: 10rpx;
    font-size: 28rpx;
    color: #262626;
  }

  .cursor {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 20%;
    height: 6rpx;
    padding: 0 50rpx;
    background-color: #007aff;
    /* 过渡效果 */
    transition: all 0.4s;
  }
}

// swiper
.swiper {
  background-color: #f7f7f8;
}

// 订单列表
.orders {
  .card {
    min-height: 100rpx;
    padding: 20rpx;
    margin: 20rpx 20rpx 0;
    border-radius: 10rpx;
    background-color: #fff;

    &:last-child {
      padding-bottom: 40rpx;
    }
  }

  .status {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 28rpx;
    color: #999;
    margin-bottom: 15rpx;

    .date {
      color: #666;
      flex: 1;
    }

    .primary {
      color: #ff9240;
    }

    .icon-delete {
      line-height: 1;
      margin-left: 10rpx;
      padding-left: 10rpx;
      border-left: 1rpx solid #e3e3e3;
    }
  }

  .goods {
    display: flex;
    margin-bottom: 20rpx;

    .cover {
      width: 170rpx;
      height: 170rpx;
      margin-right: 20rpx;
      border-radius: 10rpx;
      overflow: hidden;
      position: relative;
    }

    .quantity {
      position: absolute;
      bottom: 0;
      right: 0;
      line-height: 1;
      padding: 6rpx 4rpx 6rpx 8rpx;
      font-size: 24rpx;
      color: #fff;
      border-radius: 10rpx 0 0 0;
      background-color: rgba(0, 0, 0, 0.6);
    }

    .meta {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .name {
      height: 60rpx;
      font-size: 30rpx;
      color: #444;
    }

    .type {
      line-height: 1.8;
      padding: 0 15rpx;
      margin-top: 10rpx;
      font-size: 24rpx;
      align-self: flex-start;
      border-radius: 4rpx;
      color: #888;
      background-color: #f7f7f8;
    }

    .more {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 22rpx;
      color: #333;
    }
  }

  .payment {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    line-height: 1;
    padding: 20rpx 0;
    text-align: right;
    color: #999;
    font-size: 28rpx;
    border-bottom: 1rpx solid #eee;

    .quantity {
      font-size: 24rpx;
      margin-right: 16rpx;
    }

    .amount {
      color: #444;
      margin-left: 6rpx;
    }

    .symbol {
      font-size: 20rpx;
    }
  }

  .action {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding-top: 20rpx;

    .button {
      width: 180rpx;
      height: 60rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-left: 20rpx;
      border-radius: 60rpx;
      border: 1rpx solid #ccc;
      font-size: 26rpx;
      color: #444;
    }

    .secondary {
      color: #007aff;
      border-color: #007aff;
    }

    .primary {
      color: #fff;
      background-color: #007aff;
    }
  }

  .loading-text {
    text-align: center;
    font-size: 28rpx;
    color: #666;
    padding: 20rpx 0;
  }
}
</style>
