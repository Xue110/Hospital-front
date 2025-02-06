<template>
  <scroll-view scroll-y class="container">
    <view
      class="ranking-header"
      :style="{ paddingTop: safeAreaInsets!.top + 'px' }"
    >
      <text class="title">健康打卡排行榜</text>
      <p class="subtitle">激励每一位参与者，展示最佳成绩！</p>
    </view>

    <view
      v-for="(item, index) in healthRankInfo"
      :key="item.id"
      class="ranking-item"
    >
      <view class="rank" :style="getRankColor(index)">{{ index + 1 }}</view>
      <view class="user-info">
        <image
          class="avatar"
          :src="item.avatar || defaultAvatar"
          mode="scaleToFill"
          alt="用户头像"
        />
        <view class="username">{{ item.username }}</view>
        <view class="user-details">
          <view class="points">{{ item.point ? item.point : 0}} 分</view>
        </view>
      </view>
    </view>
  </scroll-view>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { healthRank } from '../../services/index.ts';
const { safeAreaInsets } = uni.getSystemInfoSync();
const healthRankInfo = ref([
  {
    id: 1,
    userId: 104,
    username: '张三',
    point: 100,
    avatar: '../../static/image/name.png',
  },
]);
healthRankInfo.value.sort((a, b) => b.point - a.point);
const defaultAvatar = '../../static/image/name.png';

const getRankColor = (index: number) => {
  if (index === 0) {
    return { color: '#ff9900' }; // 第一名，金色
  } else if (index === 1) {
    return { color: '#00cc33' }; // 第二名，绿色
  } else if (index === 2) {
    return { color: '#ff3300' }; // 第三名，红色
  } else {
    return { color: '#0066cc' }; // 其他排名，蓝色
  }
};

const getHealthRank = async () => {
  try {
    const res = await healthRank()
    if (res && Array.isArray(res.data)) {
      healthRankInfo.value = res.data
    }
  } catch (error) {
    console.error("获取排行榜数据失败", error)
  }
}

onMounted(() => {
  getHealthRank();
});
</script>

<style lang="scss" scoped>
/* 整体容器样式 */
.container {
  background: linear-gradient(135deg, #f9f9f9, #ffffff); /* 渐变背景 */
  padding: 30rpx;
  border-radius: 25rpx; /* 圆角更大，视觉效果更软化 */
  overflow: hidden;
  width: 100%;
  margin: auto;
  max-width: 1100rpx;
  min-height: 100vh;
  box-shadow: 0 8rpx 30rpx rgba(0, 0, 0, 0.1); /* 更深的阴影，提升立体感 */
  transition: box-shadow 0.3s ease; /* 容器的过渡效果 */
}

.container:hover {
  box-shadow: 0 12rpx 40rpx rgba(0, 0, 0, 0.15); /* 鼠标悬停时增加阴影 */
}

/* 排名头部样式 */
.ranking-header {
  text-align: center;
  margin-bottom: 50rpx; /* 增加底部间距 */
}

.title {
  font-size: 60rpx; /* 更大字体，显得更醒目 */
  font-weight: 700;
  color: #333; /* 深色文字 */
  text-shadow: 2rpx 2rpx 8rpx rgba(0, 0, 0, 0.15); /* 增加阴影效果 */
}

.subtitle {
  font-size: 32rpx;
  color: #888; /* 更浅的灰色文字 */
  margin-top: 10rpx;
}

/* 排名项样式 */
.ranking-item {
  background: rgba(255, 255, 255, 0.9); /* 更为清透的背景 */
  padding: 25rpx 30rpx;
  margin-top: 35rpx;
  border-radius: 20rpx; /* 较大的圆角 */
  display: flex;
  align-items: center;
  box-shadow: 0 6rpx 20rpx rgba(0, 0, 0, 0.08); /* 微弱的阴影 */
  transition: transform 0.3s ease, box-shadow 0.3s ease,
    background-color 0.3s ease; /* 动画效果 */
  overflow: hidden;
}

.ranking-item:hover {
  transform: translateY(-8rpx); /* 更强烈的上移效果 */
  box-shadow: 0 12rpx 30rpx rgba(0, 0, 0, 0.12); /* 更强的阴影效果 */
  background-color: rgba(240, 240, 240, 0.9); /* 悬停时改变背景色 */
}

.rank {
  font-size: 50rpx; /* 更大的排名数字 */
  font-weight: bold;
  text-align: center;
}

/* 用户信息区样式 */
.user-info {
  display: flex;
  align-items: center;
}

.avatar {
  width: 70rpx;
  height: 70rpx;
  border-radius: 50%;
  margin-left: 50rpx;
  border: 4rpx solid #f5f5f5; /* 增加边框并调整颜色 */
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1); /* 给头像添加轻微的阴影 */
  transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease; /* 动画效果 */
}

.avatar:hover {
  transform: scale(1.1); /* 放大头像 */
  border-color: #007bff; /* 悬停时头像边框颜色变为蓝色 */
  box-shadow: 0 4rpx 15rpx rgba(0, 0, 0, 0.15); /* 悬停时更强的阴影 */
}

.user-details {
  color: #333;
  text-align: right;
}

.username {
  margin-left: 30rpx;
  font-size: 28rpx;
  width:  340rpx;
  font-weight: bold;
  color: #333; /* 深色用户名 */
}

.points {
  font-size: 28rpx;
  color: #ff9900; /* 金色分数，提升视觉焦点 */
  margin-top: 5rpx;
}

/* 动画效果样式 */
@keyframes bounceIn {
  0% {
    transform: scale(0.3);
    opacity: 0;
  }
  50% {
    transform: scale(1.05);
    opacity: 1;
  }
  100% {
    transform: scale(1);
  }
}

.ranking-item {
  animation: bounceIn 0.5s ease-out; /* 使用进入动画 */
}
</style>
