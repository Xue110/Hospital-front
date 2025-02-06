<script lang="ts" setup>
import {
  useMemberStore,
  useHealthStore,
  useDiseaseStore,
  useMedicineStore,
} from '@/stores';
import { ref, onMounted } from 'vue';
import {
  getHealthInfo,
  getDiseaseInfo,
  getMedicineInfo,
} from '@/services/my.ts';
import { onShow } from '@dcloudio/uni-app'
// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = uni.getSystemInfoSync();

// 获取会员信息
const memberStore = useMemberStore();
const nickName = ref(
  memberStore.profile ? memberStore.profile.username : '默认昵称'
);
const avatarUrl = ref(memberStore.profile ? memberStore.profile.image : null);
console.log(nickName, avatarUrl);
// 记录选项
const orderTypes = [
  { type: 1, text: '挂号记录', icon: 'icon-guahaojilu' },
  { type: 2, text: '病床信息', icon: 'icon-tubiao-zhuyuanb' },
  { type: 3, text: '就诊记录', icon: 'icon-a-12jiuzhenjilu:' },
  { type: 4, text: '预约记录', icon: 'icon-yuyuejilu' },
];

const healthStore = useHealthStore();
const healthFiles = ref({});
const getInfo = async () => {
  const res = await getHealthInfo(); // 健康信息 API
  healthStore.setHealth(res.data);
  healthFiles.value = res.data;
};

const diseaseStore = useDiseaseStore();
const fetchDiseaseInfo = async () => {
  // 修改函数名，避免与外部 API 函数名冲突
  const res = await getDiseaseInfo(); // 疾病信息 API
  diseaseStore.setDisease(res.data);
};

const medicineStore = useMedicineStore();
const fetchMedicineInfo = async () => {
  // 修改函数名，避免与外部 API 函数名冲突
  const res = await getMedicineInfo(); // 药物信息 API
  medicineStore.setMedicine(res.data);
};

onShow(() => {
  getInfo();
  fetchDiseaseInfo();
  fetchMedicineInfo();
});
// 监听事件以刷新页面
uni.$on('getAgain', () => {
  getInfo();
  healthFiles.value = healthStore.health;
});
// 用于格式化数组数据，截取前 1 个并加上 '...'
const formatText = (arr) => {
  // 检查传入的 arr 是否是数组并且不为空
  if (arr && Array.isArray(arr) && arr.length > 0) {
    const maxLength = 1; // 设置最大显示项目数为 1
    const truncatedArray = arr.slice(0, maxLength); // 获取数组的前 1 个元素
    const displayText = truncatedArray.join(', '); // 将数组项连接成字符串
    // 如果数组长度大于 maxLength，显示第一个元素并加上 '...'
    if (arr.length > maxLength) {
      return displayText + '...'; // 超过 1 个元素时加上 '...'
    }
    return displayText; // 如果数组元素只有 1 个，直接显示
  }
  return ''; // 如果不是数组或空数组，返回空字符串
};
</script>

<template>
  <scroll-view class="viewport" scroll-y enable-back-to-top>
    <!-- 个人资料 -->
    <view class="profile" :style="{ paddingTop: safeAreaInsets!.top + 'px' }">
      <!-- 情况1：已登录 -->
      <view class="overview" v-if="memberStore.profile">
        <navigator url="/pagesNumber/profile/profile" hover-class="none">
          <image class="avatar" mode="aspectFill" :src="avatarUrl"></image>
        </navigator>
        <view class="meta">
          <view class="nickname"> {{ nickName }} </view>
          <navigator
            class="extra"
            url="/pagesNumber/family/family"
            hover-class="none"
          >
            <text class="update"
              ><text class="iconfont icon-jiaren"></text> 我的家人</text
            >
          </navigator>
        </view>
        <navigator
          class="settings"
          url="/pagesNumber/profile/profile"
          hover-class="none"
        >
          修改个人信息<text class="iconfont icon-right"></text>
        </navigator>
      </view>
      <!-- 情况2：未登录 -->
      <view class="overview" v-else>
        <navigator url="/pages/login/login" hover-class="none">
          <image
            class="avatar gray"
            mode="aspectFill"
            src="https://img2.baidu.com/it/u=148072212,2491081866&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=501"
          ></image>
        </navigator>
        <view class="meta">
          <navigator
            url="/pages/login/login"
            hover-class="none"
            class="nickname"
          >
            未登录
          </navigator>
          <view class="extra">
            <text class="tips">点击登录账号</text>
          </view>
        </view>
      </view>
    </view>
    <!-- 医院服务记录 -->
    <view class="orders">
      <view class="title">
        服务记录
        <navigator
          class="navigator"
          url="/pages/records/records?type=0"
          hover-class="none"
        >
          查看全部记录<text class="iconfont icon-right"></text>
        </navigator>
      </view>
      <view class="section">
        <!-- 记录 -->
        <navigator
          v-for="item in orderTypes"
          :key="item.type"
          :class="item.icon"
          :url="`/pages/records/records?type=${item.type}`"
          class="navigator"
          hover-class="none"
        >
          {{ item.text }}
        </navigator>
        <!-- 客服 -->
        <button class="contact iconfont icon-kefu" open-type="contact">
          客服
        </button>
      </view>
    </view>
    <!-- 健康档案 -->
    <view class="orders files">
      <view class="title"
        >健康档案
        <navigator
          class="navigator"
          url="/pagesNumber/healthRecords/healthRecords"
          hover-class="none"
        >
          查看档案<text class="iconfont icon-right"></text>
        </navigator>
      </view>
      <view class="content">
        <view v-if="Object.keys(healthFiles).length === 0" class="no-data">
          当前无健康档案
          <navigator
            class="navigator"
            url="/pagesNumber/updateHealth/updateHealth?type=0"
            hover-class="none"
          >
            新建档案
          </navigator>
        </view>
        <view v-else class="health-info">
          <view class="info-row">
            <view class="info-item">
              <text class="label">患者姓名</text>
              <text class="value">{{
                healthFiles.userName ? healthFiles.userName : '未填写'
              }}</text>
            </view>
            <view class="info-item">
              <text class="label">疾病</text>
              <text class="value">{{
                formatText(healthFiles.diseaseName)
                  ? formatText(healthFiles.diseaseName)
                  : '未填写'
              }}</text>
            </view>
          </view>
          <view class="info-row">
            <view class="info-item">
              <text class="label">药物</text>
              <text class="value">{{
                formatText(healthFiles.medicationName)
                  ? formatText(healthFiles.medicationName)
                  : '未填写'
              }}</text>
            </view>
            <view class="info-item">
              <text class="label">血压</text>
              <text class="value"
                >{{
                  healthFiles.bloodPressure
                    ? healthFiles.bloodPressure
                    : '未填写'
                }}mmHg</text
              >
            </view>
          </view>
          <view class="info-row">
            <view class="info-item">
              <text class="label">血糖</text>
              <text class="value"
                >{{
                  healthFiles.bloodSugar ? healthFiles.bloodSugar : '未填写'
                }}mmol/L</text
              >
            </view>
            <view class="info-item">
              <text class="label">过敏原</text>
              <text class="value">{{
                healthFiles.allergyInfo ? healthFiles.allergyInfo : '未填写'
              }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>
    <view class="orders list">
      <navigator
        class="navigator"
        url="/pagesNumber/settings/settings"
        hover-class="none"
      >
        <text class="iconfont icon-shezhi"></text> 设置
        <text class="iconfont icon-right"></text>
      </navigator>
    </view>
    <view class="orders list1">
      <navigator
        class="navigator"
        url="/pagesNumber/aboutUs/aboutUs"
        hover-class="none"
      >
        <text class="iconfont icon-guanyuwomen"></text> 关于我们
        <text class="iconfont icon-right"></text>
      </navigator>
    </view>
  </scroll-view>
</template>

<style lang="scss">
page {
  height: 100%;
  overflow: hidden;
  background-color: #f7f7f8;
}

.viewport {
  position: relative;
  height: 100%;
}
.icon-jiaren {
  font-size: 20rpx;
}
.viewport::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 25%; /* 只显示背景的一半 */
  background-color: rgb(79, 198, 235);
}

/* 用户信息 */
.profile {
  position: relative;
  .overview {
    display: flex;
    height: 120rpx;
    padding: 0 36rpx;
    color: #fff;
  }

  .avatar {
    width: 120rpx;
    height: 120rpx;
    border-radius: 50%;
    background-color: #eee;
  }

  .gray {
    filter: grayscale(100%);
  }

  .meta {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    line-height: 30rpx;
    padding: 16rpx 0;
    margin-left: 20rpx;
  }

  .nickname {
    max-width: 350rpx;
    margin-bottom: 16rpx;
    font-size: 30rpx;

    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .extra {
    display: flex;
    font-size: 20rpx;
  }

  .tips {
    font-size: 22rpx;
  }

  .update {
    padding: 3rpx 10rpx 1rpx;
    color: rgba(255, 255, 255, 0.8);
    border: 1rpx solid rgba(255, 255, 255, 0.8);
    margin-right: 10rpx;
    border-radius: 30rpx;
  }

  .settings {
    position: absolute;
    bottom: 0;
    right: 40rpx;
    font-size: 27rpx;
    color: #fff;
  }
}
.icon-right {
  position: relative;
  top: 1rpx;
  right: 1rpx;
}
/* 我的订单 */
.files {
  margin: 20rpx 20rpx 0 !important;
  min-height: 400rpx;
}
.list {
  margin: 20rpx 20rpx 0 !important;
  .icon-shezhi {
    color: #4076fe;
  }
  .icon-right {
    color: #939393;
    margin-left: 485rpx;
    font-size: 40rpx;
  }
}
.list1 {
  position: relative;
  margin: 0rpx 20rpx 0 !important;

  .icon-guanyuwomen {
    color: #4076fe;
  }
  .icon-right {
    color: #939393;
    margin-left: 420rpx;
    font-size: 40rpx;
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
  box-shadow: 0 4rpx 6rpx rgba(240, 240, 240, 0.6);

  .title {
    height: 40rpx;
    line-height: 40rpx;
    font-size: 28rpx;
    color: #1e1e1e;

    .navigator {
      font-size: 24rpx;
      color: #939393;
      float: right;
    }
  }

  .section {
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding: 40rpx 20rpx 10rpx;
    .navigator,
    .contact {
      text-align: center;
      font-size: 24rpx;
      color: #333;
      &::before {
        display: block;
        font-size: 60rpx;
        color: #4076fe;
        margin-bottom: 1rpx;
      }
    }
    .navigator {
      font-family: 'iconfont';
    }
    .contact {
      padding: 0;
      margin: 0;
      border: 0;
      background-color: transparent;
      line-height: inherit;
    }
  }
}

.content {
  /* 外部容器，增加边距 */
  padding: 20rpx;
  .no-data {
    text-align: center;
    padding: 40rpx 20rpx; /* 增加内边距，提升整体视觉 */
    font-size: 28rpx;
    color: #999;
  }
  .navigator {
    margin-top: 20rpx;
    background-color: #007aff;
    color: white;
    padding: 14rpx 30rpx;
    border-radius: 25rpx;
    text-decoration: none;
  }
  .info-row {
    display: flex;
    justify-content: space-between;
    margin-top: 20rpx;
    margin-bottom: 30rpx;
    gap: 20rpx; /* 设置元素间距，使得信息项之间的空隙更均匀 */
    flex-wrap: wrap; /* 让信息项在屏幕较小的情况下换行 */
    .info-item {
      flex: 1;
      text-align: center;
      padding: 10rpx;
      display: flex;
      height: 150rpx;
      min-width: 200rpx;
      flex-direction: column;
      justify-content: center;
      box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
      align-items: center;
      .label {
        font-size: 27rpx;
        color: #666;
        font-family: '华文雅黑';
        letter-spacing: 0.5rpx;
      }
      .value {
        margin-top: 12rpx;
        font-size: 30rpx;
        color: #333;
        font-family: '华文雅黑';
        font-weight: bold;
        letter-spacing: 0.5rpx;
      }
    }
  }
}
</style>
