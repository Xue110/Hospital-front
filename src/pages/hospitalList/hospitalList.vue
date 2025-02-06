<template>
  <view class="hospital-list">
    <view v-for="item in list" :key="item.id" class="hospital-item">
      <!-- 左侧医院图片 -->
      <view class="hospital-image">
        <image :src="item.image" mode="aspectFill" class="image" />
      </view>

      <!-- 右侧医院信息 -->
      <view class="hospital-info">
        <!-- 医院名称 -->
        <view class="hospital-name">{{ item.name }}</view>

        <!-- 医院电话 -->
        <view class="hospital-phone">电话：{{ item.phone }}</view>

        <!-- 医院简介，限制为1-2行 -->
        <view class="hospital-description">{{ item.description }}</view>

        <!-- 右侧医院距离与进入按钮 -->
        <view class="hospital-footer">
          <view class="hospital-distance">距离：{{ item.distance }}km</view>
          <view class="enter-button" @click="enter(item)">进入</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
// 获取页面传递的 list 参数，并进行类型声明
const query = defineProps<{ list: string }>();
// 尝试解析 list 参数并提供错误处理
let list = ref<any[]>([]); // 使用 ref 包裹数组，方便响应式更新
try {
  // 如果传递的 list 存在，则解析 JSON 数据
  if (query.list) {
    list.value = JSON.parse(decodeURIComponent(query.list));
    list.value.sort((a, b) => a.distance - b.distance);
  }
} catch (e) {
  console.error('解析医院数据失败:', e);
  // 如果解析失败，可以设置为一个空数组或者给用户一个提示
  list.value = [];
}

const enter = (item:any) => {
  uni.navigateTo({
    url: '/pages/hospitalInfo/hospitalInfo?hospital=' + encodeURIComponent(JSON.stringify(item)),
  });
};
</script>

<style lang="scss" scoped>
/* Hospital list styles */
.hospital-list {
  display: flex;
  flex-direction: column;
  padding: 20rpx;
  background-color: #f5f5f5; /* 添加背景色 */
}

/* Hospital item container */
.hospital-item {
  display: flex;
  margin-bottom: 20rpx;
  border-radius: 12rpx;
  padding: 20rpx;
  background-color: #fff; /* 背景色白色 */
  box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.1); /* 添加阴影效果 */
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.hospital-item:hover {
  transform: translateY(-5rpx); /* 悬浮时的效果 */
  box-shadow: 0 6rpx 15rpx rgba(0, 0, 0, 0.15); /* 悬浮时的阴影效果 */
}

/* Hospital image styles */
.hospital-image {
  flex-shrink: 0;
  width: 160rpx;
  height: 160rpx;
  margin-right: 20rpx;
  border-radius: 10rpx;
  overflow: hidden;
}

.image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 10rpx;
}

/* Hospital information area */
.hospital-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 10rpx 0;
}

/* Hospital name */
.hospital-name {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 10rpx;
  line-height: 1.4;
  letter-spacing: 0.5rpx; /* 字母间距 */
}

/* Hospital phone */
.hospital-phone {
  font-size: 28rpx;
  color: #666;
  margin-bottom: 10rpx;
}

/* Hospital description */
.hospital-description {
  font-size: 28rpx;
  color: #333;
  line-height: 1.5;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2; /* 限制为最多2行 */
  -webkit-box-orient: vertical;
  margin-bottom: 10rpx;
}

/* Footer area */
.hospital-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Distance text */
.hospital-distance {
  font-size: 28rpx;
  color: #333;
  font-weight: 600;
}

/* Enter button */
.enter-button {
  background: linear-gradient(45deg, #0066cc, #3399ff); /* 渐变效果 */
  color: white;
  padding: 12rpx 24rpx;
  border-radius: 12rpx;
  cursor: pointer;
  font-size: 28rpx;
  box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.1); /* 按钮阴影 */
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.enter-button:hover {
  transform: translateY(-3rpx); /* 悬浮时的按钮效果 */
  background: linear-gradient(45deg, #3399ff, #0066cc);
}

.enter-button:active {
  transform: translateY(1rpx); /* 点击时的按钮效果 */
}
</style>
