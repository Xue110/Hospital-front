<template>
  <scroll-view scroll-y class="content">
    <!-- 地图显示 -->
    <map
      class="map"
      :latitude="currentLatitude"
      :longitude="currentLongitude"
      scale="8"
      show-compass
      show-scale
      enable-3D
      enable-scroll
      :markers="markers"
      @markertap="onMarkerTap"
    />

    <!-- 浮动的标题和打卡按钮 -->
    <view class="floating-header">
      <!-- 左上角 "健康打卡" 按钮 -->
      <button class="check-in-button" @click="onCheckIn">健康打卡</button>
      <!-- 中间 "吉诊宝" 字样 -->
      <text class="title">{{ title }}</text>
    </view>
    <!-- 查看附近医院按钮 -->
    <button class="nearby-button" @click="onNearbyHospitals">
      查看附近医院
    </button>

    <!-- 知识科普 -->
    <view class="knowledge-population">
      <!-- 疾病百科 -->
      <navigator
        url="/pages/disease/disease"
        open-type="navigate"
        hover-class="navigator-hover"
        class="disease-baike"
      >
        <text class="disease-baike-title">疾病百科</text>
      </navigator>

      <!-- 药品百科 -->
      <navigator
        url="/pages/medicine/medicine"
        open-type="navigate"
        hover-class="navigator-hover"
        class="medicine-baike"
      >
        <text class="medicine-baike-title">药品百科</text>
      </navigator>
    </view>

    <view v-if="flag" class="rank">
      <view class="popup-content">
        <image
          class="popup-icon"
          src="../../static/image/delete.png"
          mode="scaleToFill"
          @click="flag = false"
        />
        <text class="popup-title">打卡成功</text>
        <text class="popup-subtitle">恭喜你完成打卡，点击查看排行榜</text>
        <button class="popup-btn" @click="goRank()">查看排行榜</button>
      </view>
    </view>

    <view v-if="hospitalFlag" class="hospital-message">
      <image
        class="hospial-icon"
        src="../../static/image/delete.png"
        mode="scaleToFill"
        @click="hospitalFlag = false"
      />
      <!-- 左侧医院图片 -->
      <view class="hospital-image">
        <image :src="clickedHospital.image" mode="aspectFill" class="image" />
      </view>

      <!-- 右侧医院信息 -->
      <view class="hospital-info">
        <!-- 医院名称 -->
        <view class="hospital-name">{{ clickedHospital.name }}</view>

        <!-- 医院电话 -->
        <view class="hospital-phone">电话：{{ clickedHospital.phone }}</view>

        <!-- 医院简介，限制为1-2行 -->
        <view class="hospital-description">{{
          clickedHospital.description
        }}</view>

        <!-- 右侧医院距离与进入按钮 -->
        <view class="hospital-footer">
          <view class="enter-button" @click="enter()">进入</view>
        </view>
      </view>
    </view>
  </scroll-view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import hospitalIcon from '../../static/image/hospital.png';
import patientIcon from '../../static/image/patient.png';
import QQMapWX from '../../components/qqmap-wx-jssdk1.2/qqmap-wx-jssdk.js';
import { healthCheck, healthRank, getHospitals } from '../../services/index.ts';

// 当前位置经纬度
const currentLatitude = ref(43.878); // 默认为长春市经纬度
const currentLongitude = ref(125.322);
const location = ref({});
const flag = ref(false);
const hospitalFlag = ref(false);
const nearbyHospitals = ref<any[]>([]);

const title = ref('吉诊宝');
// 医院信息
const hospitals = [];

// 获取医院数据
const getHospitalList = async () => {
  const res = await getHospitals();
  hospitals.value = res.data;

  markers.value = hospitals.value.map((hospital) => ({
    id: hospital.id,
    image: hospital.image,
    latitude: hospital.latitude,
    longitude: hospital.longitude,
    title: hospital.name, // 标题为医院名称
    iconPath: hospitalIcon,
    width: 40,
    height: 40,
  }));

  const batchSize = 5;
  let index = 0;

  // 控制请求并发量
  const processRequests = async () => {
    for (let i = 0; i < hospitals.value.length; i++) {
      if (i % batchSize === 0 && i !== 0) {
        // 每发起5个请求后，等待1秒钟
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
      await getAddressWithDelay(hospitals.value[i].address);
    }
  };

  processRequests(); // 开始请求
};

// 动态生成地图标记
const markers = ref();

const onNearbyHospitals = async () => {
  try {
    await getNearbyHospitals();
    const list = encodeURIComponent(JSON.stringify(nearbyHospitals.value));
    uni.navigateTo({
      url: `/pages/hospitalList/hospitalList?list=${list}`,
    });
  } catch (error) {
    console.error('获取医院数据失败:', error);
    uni.showToast({
      title: '获取附近医院数据失败',
      icon: 'none',
    });
  }
};
// 获取当前位置信息
const getCurrentPlace = () => {
  // 获取当前位置
  uni.getLocation({
    type: 'gcj02',
    success: function (res) {
      currentLatitude.value = res.latitude;
      currentLongitude.value = res.longitude;
      const qqmapsdk = new QQMapWX({
        key: 'O2PBZ-M6FL7-5TFXN-PJB7P-W7L35-N5FS4',
      });
      qqmapsdk.reverseGeocoder({
        location: {
          latitude: res.latitude,
          longitude: res.longitude,
        },
        success: function (res) {
          currentLatitude.value = res.result.location.lat;
          currentLongitude.value = res.result.location.lng;
          location.value = res.result.address;
          markers.value.push({
            id: 100,
            latitude: res.result.location.lat,
            longitude: res.result.location.lng,
            name: '当前位置',
            iconPath: patientIcon,
            width: 30,
            height: 30,
          });
        },
        fail: function (err) {
          console.log('获取位置失败', err);
        },
      });
    },
    fail: function (err) {
      console.log('获取位置失败', err);
    },
  });
};

// 获取附近医院信息（假设已知所有医院的经纬度）
const getNearbyHospitals = () => {
  const nearby = hospitals.value.filter((hospital) => {
    const distance = getDistance(
      currentLatitude.value,
      currentLongitude.value,
      hospital.latitude,
      hospital.longitude
    );
    //将距离添加到医院对象中
    hospital.distance = distance.toFixed(2);
    return distance <= 100; // 10公里以内
  });
  nearbyHospitals.value = nearby;
};

// 计算两点之间的距离（单位：公里）
const getDistance = (lat1, lon1, lat2, lon2) => {
  // 将经纬度转换为弧度
  const radLat1 = (lat1 * Math.PI) / 180.0;
  const radLat2 = (lat2 * Math.PI) / 180.0;
  const radLon1 = (lon1 * Math.PI) / 180.0;
  const radLon2 = (lon2 * Math.PI) / 180.0;
  // 计算纬度差和经度差
  const dLat = radLat2 - radLat1;
  const dLon = radLon2 - radLon1;
  // Haversine公式
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(radLat1) *
      Math.cos(radLat2) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.asin(Math.sqrt(a)); // 两点间的角距离（弧度）
  // 地球半径（单位：公里）
  const R = 6371;
  // 计算距离
  const distance = R * c;
  return distance; // 返回公里数
};

// 根据地址获取经纬度
const getAddress = (address) => {
  const qqmapsdk = new QQMapWX({
    key: 'O2PBZ-M6FL7-5TFXN-PJB7P-W7L35-N5FS4',
  });
  qqmapsdk.geocoder({
    address: address,
    success: function (res) {
      const { lat, lng } = res.result.location;
      const markerIndex = hospitals.value.findIndex(
        (h) => h.address === address
      );
      if (markerIndex !== -1) {
        markers.value[markerIndex].latitude = lat;
        markers.value[markerIndex].longitude = lng;
      }
      // 更新医院的经纬度
      hospitals.value.forEach((hospital) => {
        if (hospital.address === address) {
          hospital.latitude = lat;
          hospital.longitude = lng;
        }
      });
    },
    fail: function (err) {
      console.log('获取经纬度失败', err);
    },
  });
};

// 打卡按钮点击事件
const onCheckIn = async () => {
  // 在这里可以添加打卡的逻辑，比如记录用户打卡的时间等
  const res = await healthCheck();
  if (res.code === 200) {
    flag.value = true;
  } else {
    uni.showToast({
      title: '今日已打卡',
      icon: 'none',
    });
  }
};
const goRank = () => {
  uni.navigateTo({
    url: '/pages/rangkingList/rangkingList',
  });
};
// 标记点击事件
const clickedHospital = ref();
const onMarkerTap = (event) => {
  const { markerId } = event.detail; // 获取点击的标记ID
  clickedHospital.value = hospitals.value.find((h) => h.id === markerId);
  if (clickedHospital) {
    hospitalFlag.value = true;
  }
};
const enter = () => {
  uni.navigateTo({
    url:
      '/pages/hospitalInfo/hospitalInfo?hospital=' +
      encodeURIComponent(JSON.stringify(clickedHospital.value)),
  });
};
const getAddressWithDelay = (address) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      getAddress(address);
      resolve();
    }, 0); // 0延时即尽快执行，但控制并发量
  });
};

onMounted(() => {
  getCurrentPlace();
  getHospitalList();
});
</script>

<style scoped>
.content {
  position: relative;
  height: 100vh;
}

.map {
  position: relative;
  top: 0;
  width: 100%;
  left: 0;
  right: 0;
  height: 75%;
}

.floating-header {
  position: absolute;
  top: 20rpx; /* 距离页面顶部一些间距 */
  left: 20rpx; /* 距离页面左侧一些间距 */
  right: 20rpx; /* 保证右侧不会被遮挡 */
  width: 100%; /* 使浮动区域宽度适应整个屏幕 */
  padding: 10rpx;
  z-index: 10; /* 确保浮动内容在地图之上 */
}

.title {
  position: relative;
  top: -57rpx;
  left: 42%;
  text-align: center;
  font-size: 30rpx;
  font-weight: bold;
  color: black;
  flex-grow: 1; /* 使标题占据剩余空间 */
}

.check-in-button {
  padding: 5rpx 15rpx;
  background-color: #007aff;
  position: relative;
  left: 65%;
  color: white;
  border-radius: 25rpx;
  border: none;
  font-size: 24rpx;
  width: 200rpx;
  margin-left: 20rpx; /* 保证按钮离左侧有一定的距离 */
}
.nearby-button {
  padding: 5rpx 15rpx;
  background-color: #007aff;
  position: absolute;
  left: 33%;
  color: white;
  border-radius: 25rpx;
  border: none;
  font-size: 24rpx;
  width: 200rpx;
  margin-top: -100rpx;
  margin-left: 20rpx; /* 保证按钮离左侧有一定的距离 */
}
/* 容器整体样式 */
.knowledge-population {
  padding: 15rpx;
  display: flex;
  justify-content: space-between;
  gap: 10rpx; /* 添加间隙 */
}

/* 疾病百科卡片 */
.disease-baike,
.medicine-baike {
  width: 48%; /* 改变宽度，避免卡片过于紧凑 */
  padding: 20rpx;
  height: 270rpx;
  line-height: 120rpx;
  text-align: left;
  border-radius: 15rpx; /* 圆角效果 */
  background: linear-gradient(135deg, #007aff, #1e90ff); /* 渐变背景 */
  color: white; /* 文字颜色 */
  font-size: 28rpx; /* 字体大小 */
  font-weight: bold; /* 加粗字体 */
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.15); /* 轻微阴影 */
  transition: all 0.3s ease; /* 动画过渡 */
}
.disease-baike {
  background-image: url('../../static/image/disease.png');
  background-size: cover;
  background-position: 60rpx 0; /* 背景图片右对齐 */
}
.medicine-baike {
  background-image: url('../../static/image/medicine.png');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: 60rpx 0; /* 背景图片右对齐 */
}
/* 增加hover效果 */
.disease-baike:hover,
.medicine-baike:hover {
  transform: translateY(-5rpx); /* 鼠标悬浮时的升高效果 */
  box-shadow: 0 6rpx 16rpx rgba(0, 0, 0, 0.2); /* 鼠标悬浮时更明显的阴影 */
}

/* 疾病百科标题 */
.disease-baike-title {
  font-size: 38rpx;
  font-weight: 600;
  color: #007aff;
  text-transform: uppercase; /* 大写字母 */
}

/* 药品百科标题 */
.medicine-baike-title {
  font-size: 38rpx;
  font-weight: 600;
  color: #007aff;
  text-transform: uppercase; /* 大写字母 */
}
.rank {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5); /* 半透明背景 */
  z-index: 999; /* 确保弹窗显示在最上层 */
}

.popup-content {
  background-color: #fff;
  border-radius: 10rpx; /* 圆角边框 */
  padding: 20px;
  width: 80%;
  display: flex;
  flex-direction: column;
  max-width: 600rpx; /* 最大宽度 */
  text-align: center;
}

.popup-title {
  font-size: 44rpx;
  font-weight: bold;
  color: #4caf50; /* 绿色文字 */
  margin-bottom: 10rpx;
}

.popup-subtitle {
  font-size: 26rpx;
  color: #666;
  margin-bottom: 20rpx;
}

.popup-btn {
  padding: 10rpx 20rpx;
  background-color: #007bff; /* 按钮背景色 */
  color: white;
  font-size: 26rpx;
  border: none;
  border-radius: 100rpx;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.popup-btn:hover {
  background-color: #0056b3; /* 按钮 hover 效果 */
}

.popup-btn:active {
  background-color: #004085; /* 按钮点击效果 */
}
.popup-icon {
  position: absolute;
  width: 30rpx;
  height: 30rpx;
  right: 15%;
}
.hospital-message {
  position: fixed; /* 使用fixed定位，固定在页面上 */
  top: 50%; /* 垂直居中 */
  left: 50%; /* 水平居中 */
  transform: translate(-50%, -50%); /* 精确地居中弹窗 */
  width: 80%; /* 设置宽度适应屏幕 */
  max-width: 600rpx; /* 最大宽度，避免弹窗过大 */
  padding: 20rpx; /* 内边距 */
  display: flex;
  flex-direction: row; /* 水平排列医院图片和信息 */
  align-items: center; /* 垂直居中对齐 */
  justify-content: space-between; /* 两部分内容左右分布 */
  background-color: rgba(0, 0, 0, 0.5); /* 半透明背景 */
  z-index: 999; /* 确保弹窗在最上层 */
  border-radius: 10rpx; /* 边角圆润 */
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.3); /* 弹窗阴影 */
}

.hospial-icon {
  position: absolute;
  top: 10rpx;
  right: 10rpx;
  width: 30rpx;
  height: 30rpx;
  cursor: pointer; /* 设置为指针手型 */
}

.hospital-image {
  width: 150rpx; /* 固定宽度，避免图片拉伸 */
  height: 150rpx;
  border-radius: 75rpx; /* 圆形图片 */
  overflow: hidden; /* 图片超出部分隐藏 */
}

.hospital-info {
  flex: 1;
  margin-left: 20rpx;
  color: #fff; /* 文字颜色 */
}

.hospital-name {
  font-size: 28rpx;
  font-weight: bold;
  margin-bottom: 10rpx;
}

.hospital-phone,
.hospital-description {
  font-size: 24rpx;
  margin-bottom: 8rpx;
}

.hospital-footer {
  margin-top: 20rpx;
}

.enter-button {
  padding: 10rpx 20rpx;
  background-color: #00bcd4; /* 进入按钮的背景色 */
  color: white;
  border-radius: 5rpx;
  text-align: center;
  cursor: pointer;
}

.enter-button:hover {
  background-color: #0097a7; /* 悬停时的颜色 */
}
</style>
