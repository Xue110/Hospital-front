<template>
  <view class="settings">
    <view class="orders list">
      <navigator
        class="navigator"
        url="/pagesNumber/updatePwd/updatePwd"
        hover-class="none"
      >
        修改密码
        <text class="iconfont icon-right"></text>
      </navigator>
    </view>
    <view class="orders list">
        <button
          hover-class="button-hover"
          @click="handleExit"
        >
          退出登录
        </button>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
const handleExit = () => {
  uni.clearStorageSync()
  uni.navigateTo({
    url: '/pages/login/login'
  })
}
</script>

<style lang="scss" scoped>
.settings {
  background-color: #f5f5f5;
  height: 100vh;
}
.list {
  margin: 5rpx 20rpx 0 !important;
  .icon-shezhi {
    color: #4076fe;
  }
  .icon-right {
    color: #939393;
    margin-left: 440rpx;
    font-size: 40rpx;
  }
}
.list1 {
  position: relative;
  margin: 0rpx 20rpx 0 !important;
  .end{
    position: absolute;
    right: 80rpx;
    color: #939393;
  }
}
.list1::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%; /* 让伪元素从中间开始 */
  width: 95%; /* 设置边框的长度，调整此值来控制中间部分的长度 */
  height: 1rpx; /* 边框的高度 */
  background-color: rgba(192, 182, 182, 0.12); /* 边框颜色 */
  transform: translateX(-50%); /* 使其水平居中 */
}
.orders {
  position: relative;
  z-index: 99;
  padding: 30rpx;
  margin: 50rpx 20rpx 0;
  background-color: #fff;
  border-radius: 10rpx;
}
</style>
