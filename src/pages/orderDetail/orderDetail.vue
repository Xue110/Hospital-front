<script setup lang="ts">
import { ref, onMounted } from 'vue';
import {
  getOrderDetail,
  pay,
  cancelOrder,
  deleteOrder,
} from '@/services/index.ts';
import { onReady } from '@dcloudio/uni-app';

// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = uni.getSystemInfoSync();
// 弹出层组件
const popup = ref<UniHelper.UniPopupInstance>();
// 取消挂号原因列表
const reasonList = ref(['不想挂号了', '医生太忙了', '其他原因']);
// 取消预定病床原因列表
const bedReasonList = ref(['不想预定病床了', '医生太忙了', '其他原因']);
// 挂号取消原因
const reason = ref('');

// 获取页面栈
const pages = getCurrentPages();
// 获取当前页面实例，数组最后一项
const pageInstance = pages.at(-1) as any;

// 复制内容
const onCopy = (id: string) => {
  // 设置系统剪贴板的内容
  uni.setClipboardData({ data: id });
};
// 获取页面的传参
const query = defineProps<{
  orderId: string;
  type: string;
}>();
const orderDetail = ref({});


const payOrder = async (id) => {
  const res = await pay(id);
  if (res.code == 200) {
    uni.showToast({ title: '支付成功', icon: 'success' });
    orderDetail.value.paymentStatus = 2;
    flag.value = false;
  } else {
    uni.showToast({ title: '支付失败', icon: 'error' });
  }
};

const cancelOrdered = async () => {
  const res = await cancelOrder(query.orderId);
  if (res.code == 200) {
    uni.showToast({ title: '取消成功', icon: 'success' });
    orderDetail.value.paymentStatus = 3;
    flag.value = false;
  } else {
    uni.showToast({ title: '取消失败', icon: 'error' });
  }
};

const deleteOrdered = async () => {
  const res = await deleteOrder(query.orderId);
  if (res.code == 200) {
    uni.showToast({ title: '删除成功', icon: 'success' });
    uni.navigateBack();
  } else {
    uni.showToast({ title: '删除失败', icon: 'error' });
  }
};

const onScrolltolower = () => {
  // 滚动到底部时，弹出取消挂号弹窗
  popup.value?.open();
};

const flag = ref(false);
onMounted(async () => {
  const res = await getOrderDetail(query.orderId);
  orderDetail.value = res.data;
  flag.value = orderDetail.value.paymentStatus == 1;
});
</script>

<template>
  <!-- 自定义导航栏: 默认透明不可见, scroll-view 滚动到 50 时展示 -->
  <view class="navbar" :style="{ paddingTop: safeAreaInsets?.top + 'px' }">
    <view class="wrap">
      <navigator
        v-if="pages.length > 1"
        open-type="navigateBack"
        class="back icon-left"
      ></navigator>
      <navigator
        v-else
        url="/pages/index/index"
        open-type="switchTab"
        class="back icon-home"
      >
      </navigator>
      <view class="title">挂号详情</view>
    </view>
  </view>
  <scroll-view
    scroll-y
    class="viewport"
    id="scroller"
    enable-back-to-top
    @scrolltolower="onScrolltolower"
  >
    <template v-if="orderDetail">
      <!-- 挂号状态 -->
      <view
        class="overview"
        :style="{ paddingTop: safeAreaInsets!.top + 20 + 'px' }"
      >
        <!-- 待付款状态:展示去支付按钮和倒计时 -->
        <template v-if="flag">
          <view class="status icon-clock">等待付款</view>
          <view class="tips">
            <text class="money">应付金额: ¥ {{ orderDetail.total }}</text>
            <text class="time">支付剩余</text>
            <!-- 倒计时组件 -->
            <uni-countdown
              second="3600"
              color="#fff"
              splitor-color="#fff"
              :show-day="false"
              :show-colon="false"
            />
          </view>
          <view class="button" @click="payOrder(orderDetail.id)">去支付</view>
        </template>
        <!-- 其他挂号状态:展示再次购买按钮 -->
        <template v-if="orderDetail.paymentStatus === 2">
          <!-- 挂号状态文字 -->
          <view class="status">
            {{ orderDetail.type == 1 ? '已挂号' : '已住院' }}
          </view>
        </template>
        <template v-if="orderDetail.paymentStatus === 3">
          <!-- 挂号状态文字 -->
          <view class="status"> 已取消 </view>
          <view class="button-group">
            <navigator
              class="button"
              :url="
                '/pages/department/department?hospitalId=' +
                orderDetail.hospitalId
              "
              hover-class="none"
            >
              {{ orderDetail.type == 1 ? '重新挂号' : '重新住院' }}
            </navigator>
          </view>
        </template>
        <template v-if="orderDetail.paymentStatus === 4">
          <!-- 挂号状态文字 -->
          <view class="status"> 已超时 </view>
          <view class="button-group">
            <navigator
              class="button"
              :url="
                '/pages/department/department?hospitalId=' +
                orderDetail.hospitalId
              "
              hover-class="none"
            >
              {{ orderDetail.type == 1 ? '重新挂号' : '重新住院' }}
            </navigator>
          </view>
        </template>
      </view>

      <!-- 商品信息 -->
      <view class="goods">
        <!-- 合计 -->
        <view class="total">
          <view class="row">
            <view class="text">患者姓名 </view>
            <view class="symbol">{{ orderDetail.patientName }}</view>
          </view>
          <view class="row">
            <view class="text">医院姓名 </view>
            <view class="symbol">{{ orderDetail.hospitalName }}</view>
          </view>
          <view class="row">
            <view class="text">就诊时间 </view>
            <view class="symbol">{{ orderDetail.date }} </view>
          </view>
          <view class="row"
            ><view class="text">类型 </view
            ><view class="symbol">
              {{
                orderDetail.type == 1
                  ? '挂号'
                  : orderDetail.type == 2
                  ? '住院'
                  : '其他'
              }}</view
            ></view
          >
          <view class="row">
            <view class="text">应付金额: </view>
            <view class="symbol primary">¥{{ orderDetail.total }}</view>
          </view>
        </view>
      </view>

      <!-- 挂号信息 -->
      <view class="detail">
        <view class="title">挂号信息</view>
        <view class="row">
          <view class="item">
            挂号编号: {{ orderDetail.id }}
            <text class="copy" @tap="onCopy(orderDetail.id)">复制</text>
          </view>
        </view>
      </view>

      <!-- 底部操作栏 -->
      <view
        class="toolbar-height"
        :style="{ paddingBottom: safeAreaInsets?.bottom + 'px' }"
      ></view>
      <view
        class="toolbar"
        :style="{ paddingBottom: safeAreaInsets?.bottom + 'px' }"
      >
        <!-- 待付款状态:展示支付按钮 -->
        <template v-if="flag">
          <view class="button primary" @click="payOrder(orderDetail.id)"> 去支付 </view>
          <view class="button" @tap="popup?.open?.()"> 取消预约 </view>
        </template>
        <!-- 其他挂号状态:按需展示按钮 -->
        <template v-if="orderDetail.paymentStatus === 2">
          <!-- 待评价/已完成/已取消 状态: 展示删除挂号 -->
          <view class="button delete" @click="cancelOrdered()"> 取消预约 </view>
        </template>
        <template
          v-if="
            orderDetail.paymentStatus === 3 || orderDetail.paymentStatus === 4
          "
        >
          <!-- 待评价/已完成/已取消 状态: 展示删除挂号 -->
          <view class="button delete" @click="deleteOrdered()"> 删除订单 </view>
        </template>
      </view>
    </template>
    <template v-else>
      <!-- 骨架屏组件 -->
      <PageSkeleton />
    </template>
  </scroll-view>
  <!-- 取消挂号弹窗 -->
  <uni-popup ref="popup" type="bottom" background-color="#fff">
    <view class="popup-root">
      <view class="title">{{orderDetail.type == 1 ? '挂号' : '住院'}}取消</view>
      <view class="description">
        <view class="tips">{{ orderDetail.type == 1 ? '挂号' : '住院' }}取消后，将无法恢复</view>
        <view
          class="cell"
          v-for="item in orderDetail.type == 1 ? reasonList : bedReasonList"
          :key="item"
          @tap="reason = item"
        >
          <text class="text">{{ item }}</text>
          <text class="icon" :class="{ checked: item === reason }"></text>
        </view>
      </view>
      <view class="footer">
        <view class="button" @tap="popup?.close?.()">取消</view>
        <view class="button primary" @click="cancelOrdered()">确认</view>
      </view>
    </view>
  </uni-popup>
</template>

<style lang="scss">
page {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.navbar {
  width: 750rpx;
  color: #000;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9;
  /* background-color: #f8f8f8; */
  background-color: transparent;

  .wrap {
    position: relative;

    .title {
      height: 44px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 32rpx;
      /* color: #000; */
      color: transparent;
    }

    .back {
      position: absolute;
      left: 0;
      height: 44px;
      width: 44px;
      font-size: 44rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      /* color: #000; */
      color: #fff;
    }
  }
}

.viewport {
  background-color: #f7f7f8;
}

.overview {
  display: flex;
  flex-direction: column;
  align-items: center;

  line-height: 1;
  padding-bottom: 30rpx;
  color: #fff;
  background-image: url(https://pcapi-xiaotuxian-front-devtest.itheima.net/miniapp/images/order_bg.png);
  background-size: cover;

  .status {
    font-size: 36rpx;
  }

  .status::before {
    margin-right: 6rpx;
    font-weight: 500;
  }

  .tips {
    margin: 30rpx 0;
    display: flex;
    font-size: 14px;
    align-items: center;

    .money {
      margin-right: 30rpx;
    }
  }

  .button-group {
    margin-top: 30rpx;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .button {
    width: 260rpx;
    height: 64rpx;
    margin: 0 10rpx;
    text-align: center;
    line-height: 64rpx;
    font-size: 28rpx;
    color: #27ba9b;
    border-radius: 68rpx;
    background-color: #fff;
  }
}

.shipment {
  line-height: 1.4;
  padding: 0 20rpx;
  margin: 20rpx 20rpx 0;
  border-radius: 10rpx;
  background-color: #fff;

  .locate,
  .item {
    min-height: 120rpx;
    padding: 30rpx 30rpx 25rpx 75rpx;
    background-size: 50rpx;
    background-repeat: no-repeat;
    background-position: 6rpx center;
  }

  .locate {
    background-image: url(https://pcapi-xiaotuxian-front-devtest.itheima.net/miniapp/images/locate.png);

    .user {
      font-size: 26rpx;
      color: #444;
    }

    .address {
      font-size: 24rpx;
      color: #666;
    }
  }

  .item {
    background-image: url(https://pcapi-xiaotuxian-front-devtest.itheima.net/miniapp/images/car.png);
    border-bottom: 1rpx solid #eee;
    position: relative;

    .message {
      font-size: 26rpx;
      color: #444;
    }

    .date {
      font-size: 24rpx;
      color: #666;
    }
  }
}

.goods {
  margin: 20rpx 20rpx 0;
  padding: 0 20rpx;
  border-radius: 10rpx;
  background-color: #fff;

  .item {
    padding: 30rpx 0;
    border-bottom: 1rpx solid #eee;

    .navigator {
      display: flex;
      margin: 20rpx 0;
    }

    .cover {
      width: 170rpx;
      height: 170rpx;
      border-radius: 10rpx;
      margin-right: 20rpx;
    }

    .meta {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      position: relative;
    }

    .name {
      height: 80rpx;
      font-size: 26rpx;
      color: #444;
    }

    .type {
      line-height: 1.8;
      padding: 0 15rpx;
      margin-top: 6rpx;
      font-size: 24rpx;
      align-self: flex-start;
      border-radius: 4rpx;
      color: #888;
      background-color: #f7f7f8;
    }

    .price {
      display: flex;
      margin-top: 6rpx;
      font-size: 24rpx;
    }

    .symbol {
      font-size: 20rpx;
    }

    .original {
      color: #999;
      text-decoration: line-through;
    }

    .actual {
      margin-left: 10rpx;
      color: #444;
    }

    .text {
      font-size: 22rpx;
    }

    .quantity {
      position: absolute;
      bottom: 0;
      right: 0;
      font-size: 24rpx;
      color: #444;
    }

    .action {
      display: flex;
      flex-direction: row-reverse;
      justify-content: flex-start;
      padding: 30rpx 0 0;

      .button {
        width: 200rpx;
        height: 60rpx;
        text-align: center;
        justify-content: center;
        line-height: 60rpx;
        margin-left: 20rpx;
        border-radius: 60rpx;
        border: 1rpx solid #ccc;
        font-size: 26rpx;
        color: #444;
      }

      .primary {
        color: #27ba9b;
        border-color: #27ba9b;
      }
    }
  }

  .total {
    line-height: 1;
    font-size: 26rpx;
    padding: 20rpx 0;
    color: #666;

    .row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10rpx 0;
    }

    .primary {
      color: #cf4444;
      font-size: 36rpx;
    }
  }
}

.detail {
  line-height: 1;
  padding: 30rpx 20rpx 0;
  margin: 20rpx 20rpx 0;
  font-size: 26rpx;
  color: #666;
  border-radius: 10rpx;
  background-color: #fff;

  .title {
    font-size: 30rpx;
    color: #444;
  }

  .row {
    padding: 20rpx 0;

    .item {
      padding: 10rpx 0;
      display: flex;
      align-items: center;
    }

    .copy {
      border-radius: 20rpx;
      font-size: 20rpx;
      border: 1px solid #ccc;
      padding: 5rpx 10rpx;
      margin-left: 10rpx;
    }
  }
}

.toolbar-height {
  height: 100rpx;
  box-sizing: content-box;
}

.toolbar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: calc(var(--window-bottom));
  z-index: 1;

  height: 100rpx;
  padding: 0 20rpx;
  display: flex;
  align-items: center;
  flex-direction: row-reverse;
  border-top: 1rpx solid #ededed;
  border-bottom: 1rpx solid #ededed;
  background-color: #fff;
  box-sizing: content-box;

  .button {
    display: flex;
    justify-content: center;
    align-items: center;

    width: 200rpx;
    height: 72rpx;
    margin-left: 15rpx;
    font-size: 26rpx;
    border-radius: 72rpx;
    border: 1rpx solid #ccc;
    color: #444;
  }

  .delete {
    order: 4;
  }

  .button {
    order: 3;
  }

  .secondary {
    order: 2;
    color: #27ba9b;
    border-color: #27ba9b;
  }

  .primary {
    order: 1;
    color: #fff;
    background-color: #007aff;
  }
}

.popup-root {
  padding: 30rpx 30rpx 0;
  border-radius: 10rpx 10rpx 0 0;
  overflow: hidden;

  .title {
    font-size: 30rpx;
    text-align: center;
    margin-bottom: 30rpx;
  }

  .description {
    font-size: 28rpx;
    padding: 0 20rpx;

    .tips {
      color: #444;
      margin-bottom: 12rpx;
    }

    .cell {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15rpx 0;
      color: #666;
    }

    .icon::before {
      content: '\e6cd';
      font-family: 'erabbit' !important;
      font-size: 38rpx;
      color: #999;
    }

    .icon.checked::before {
      content: '\e6cc';
      font-size: 38rpx;
      color: #27ba9b;
    }
  }

  .footer {
    display: flex;
    justify-content: space-between;
    padding: 30rpx 0 40rpx;
    font-size: 28rpx;
    color: #444;

    .button {
      flex: 1;
      height: 72rpx;
      text-align: center;
      line-height: 72rpx;
      margin: 0 20rpx;
      color: #444;
      border-radius: 72rpx;
      border: 1rpx solid #ccc;
    }

    .primary {
      color: #fff;
      background-color: #007aff;
      border: none;
    }
  }
}
</style>
