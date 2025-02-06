<template>
  <scroll-view scroll-y class="hospital-info">
    <swiper
      class="hospital-image"
      :indicator-dots="true"
      :autoplay="true"
      :interval="3000"
      :duration="500"
      indicator-active-color="#007aff"
      indicator-inactive-color="#cccccc"
    >
      <swiper-item v-for="(image, index) in images" :key="index">
        <image :src="image.image" mode="aspectFit" class="image" />
      </swiper-item>
    </swiper>

    <!-- 挂号 -->
    <view class="hospital-register">
      <view class="hospital-name">{{ hospitalInfo.name }}</view>
      <view class="reservation" @click="goReservation()">
        <view class="reservation-content">
          <text>预约挂号</text>
          <text>可预约七天内号源</text>
        </view>
        <view class="reservation-image">
          <image
            src="../../static/image/hospitalMessage/reservation.png"
            mode="aspectFill"
          />
        </view>
      </view>
      <view class="reservation-bottom">
        <view class="reservation-bottom-item" @click="payRegister()">
          挂号支付
        </view>
        <view class="reservation-bottom-item" @click="cancelRegister()">
          取消挂号
        </view>
      </view>
    </view>

    <!-- 住院 -->
    <view class="hospital-inpatient">
      <view class="inpatient-title">住院</view>
      <view class="inpatient-content">
        <view class="inpatient-now" @click="onInpatient()">
          <view class="inpatient-now-content">
            <text class="inpatient-now-text">预约床位</text>
          </view>
          <view class="inpatient-now-image">
            <image
              src="../../static/image/hospitalMessage/inpatient.png"
              mode="aspectFill"
            />
          </view>
        </view>
        <view class="inpatient-bottom">
          <view class="inpatient-bottom-item" @click="onAdmission()">
            办理住院
          </view>
          <view class="inpatient-bottom-item" @click="onSee()">
            查看病床信息
          </view>
        </view>
        <view class="inpatient-item">
          <view class="inpatient-item-title">住院须知</view>
          <view class="inpatient-item-content">
            <view class="inpatient-item-content-item" @click="onProcess()"
              >住院流程</view
            >
            <view class="inpatient-item-content-item" @click="onDescribe()"
              >住院须知</view
            >
            <view class="inpatient-item-content-item" @click="onPrice()"
              >住院费用</view
            >
          </view>
        </view>
      </view>
    </view>
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
  </scroll-view>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { pay, cancelOrder, getInpatientInfo } from '@/services/index.ts';
// 创建响应式变量来存储医院信息
const hospitalInfo = ref({});

const images = [
  {
    image:
      'https://img1.baidu.com/it/u=3587681563,1612499472&fm=253&fmt=auto&app=138&f=JPEG?w=700&h=308',
  },
  {
    image:
      'https://img1.baidu.com/it/u=3759697976,1147848165&fm=253&fmt=auto&app=138&f=JPEG?w=700&h=300',
  },
  {
    image:
      'https://img0.baidu.com/it/u=3118611775,2494822295&fm=253&fmt=auto&app=138&f=JPEG?w=700&h=300',
  },
];

// 获取页面的传参
const query = defineProps<{ hospital: string }>();
const goReservation = () => {
  uni.navigateTo({
    url: '/pages/department/department?hospitalId=' + hospitalInfo.value.id,
  });
};
const payRegister = () => {
  uni.showModal({
    title: '挂号支付',
    content: '您确定要支付挂号费用吗？(最近一笔订单)',
    success: async function (res) {
      if (res.confirm) {
        console.log('用户点击确定');
        const res = await pay(orderId.value);
        if (res.code === 200) {
          uni.showToast({
            title: '支付成功',
            icon: 'success',
          });
        } else {
          uni.showToast({
            title: '支付失败',
            icon: 'error',
          });
        }
      } else if (res.cancel) {
        console.log('用户点击取消');
      }
    },
  });
};
const cancelRegister = () => {
  uni.showModal({
    title: '取消挂号',
    content: '您确定要取消挂号吗？(最近一笔订单)',
    success: async function (res) {
      if (res.confirm) {
        console.log('用户点击确定');
        const res = await cancelOrder(orderId.value);
        if (res.code === 200) {
          uni.showToast({
            title: '取消成功',
            icon: 'success',
          });
        } else {
          uni.showToast({
            title: '取消失败',
            icon: 'error',
          });
        }
      } else if (res.cancel) {
        console.log('用户点击取消');
      }
    },
  });
};

const onProcess = () => {
  uni.showModal({
    title: '住院流程',
    content:
      '1.预约床位\n2.办理入院手续\n3.办理住院手续\n4.接受治疗\n5.出院结算',
    showCancel: false,
  });
};

const onDescribe = () => {
  uni.showModal({
    title: '住院须知',
    content:
      '1.请提前预约床位\n2.请携带身份证、医保卡等\n3.请遵守医院规定\n4.如有需要，请提前联系医生',
    showCancel: false,
  });
};

const onPrice = () => {
  uni.showModal({
    title: '住院费用',
    content:
      '1.住院费用包括床位费、药费、检查费等\n2.具体费用请以医院实际收费为准\n3.如有需要，请提前联系医生',
    showCancel: false,
  });
};

const onInpatient = () => {
  uni.navigateTo({
    url:
      '/pages/department/department?hospitalId=' +
      hospitalInfo.value.id +
      '&type=1',
  });
};

const onAdmission = () => {
  uni.showModal({
    title: '入院须知',
    content:
      '1.请提前预约床位\n2.请携带身份证、医保卡等\n3.请遵守医院规定\n4.如有需要，请提前联系医生',
    showCancel: false,
    success: (success) => {
      if (success.confirm) {
        uni.navigateTo({
          url:
            '/pages/department/department?hospitalId=' +
            hospitalInfo.value.id +
            '&type=2',
        });
      }
    },
  });
};

const onSee = async () => {
  const res = await getInpatientInfo();
  const content =
    '房间号' +
    res.data[0].roomNumber +
    '\n' +
    '床位号' +
    res.data[0].bedId +
    '\n' +
    '科室' +
    res.data[0].departmentName +
    '\n' +
    '费用' +
    res.data[0].paymentAmount;
  uni.showModal({
    title: '住院信息',
    content: content,
    showCancel: false,
  });
};

// 在组件挂载后，从query中获取医院信息并赋值给响应式变量
const orderId = ref();
onMounted(() => {
  if (query.hospital) {
    hospitalInfo.value = JSON.parse(decodeURIComponent(query.hospital));
  }
  orderId.value = uni.getStorageSync('orderId');
});
</script>

<style lang="scss" scoped>
.hospital-info {
  padding: 20rpx;
  background-color: #f8f9fa;
  font-family: Arial, sans-serif;

  .hospital-image {
    width: 100%;
    height: 300rpx;
    border-radius: 15rpx;
    overflow: hidden;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);

    .image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .hospital-register {
    margin-top: 20rpx;
    background-color: #ffffff;
    border-radius: 20rpx;
    padding: 20rpx;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    border: 1px solid #f0f0f0;

    .hospital-name {
      font-size: 32rpx;
      font-weight: 600;
      color: #333;
      margin-bottom: 15rpx;
      text-align: center;
    }

    .reservation {
      border-radius: 15rpx;
      padding: 15rpx;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: #f5f5f5;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);

      .reservation-content {
        display: flex;
        flex-direction: column;
        text {
          &:nth-child(1) {
            font-size: 30rpx;
            font-weight: 600;
            color: #007aff;
          }
          &:nth-child(2) {
            font-size: 22rpx;
            color: #aaaaaa;
            margin-top: 10rpx;
          }
        }
      }

      .reservation-image {
        width: 90rpx;
        height: 90rpx;
        image {
          width: 100%;
          height: 100%;
          border-radius: 15rpx;
        }
      }
    }
  }

  .hospital-inpatient {
    margin-top: 20rpx;
    background-color: #ffffff;
    border-radius: 20rpx;
    padding: 20rpx;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    border: 1px solid #f0f0f0;
  }

  .inpatient-title {
    font-size: 30rpx;
    font-weight: 600;
    color: #007aff;
    margin-bottom: 15rpx;
  }

  .inpatient-content {
    .inpatient-item {
      margin-bottom: 15rpx;

      .inpatient-item-title {
        font-size: 26rpx;
        font-weight: 600;
        color: #333;
        margin-bottom: 10rpx;
      }

      .inpatient-item-content {
        display: flex;
        justify-content: space-between;

        .inpatient-item-content-item {
          font-size: 24rpx;
          color: #007aff;
          cursor: pointer;
          &:hover {
            text-decoration: underline;
          }
        }
      }
    }

    .inpatient-now {
      margin-top: 20rpx;
      margin-bottom: 20rpx;
      text-align: center;
      width: 100%;
      display: flex;
      padding: 20rpx;
      justify-content: space-between;
      align-items: center;
      border: 1px solid rgb(63, 134, 255);
      border-radius: 15rpx;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
      .inpatient-now-content {
        display: flex;
        flex-direction: column;
        text {
          font-size: 30rpx;
          font-weight: 600;
          color: #007aff;
        }
      }

      .inpatient-now-image {
        width: 90rpx;
        height: 90rpx;
        image {
          width: 100%;
          height: 100%;
          border-radius: 15rpx;
        }
      }
    }
  }
  .reservation-bottom,
  .inpatient-bottom {
    margin-top: 20rpx;
    margin-bottom: 20rpx;
    text-align: center;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .reservation-bottom-item,
    .inpatient-bottom-item {
      display: flex;
      flex-direction: column;
      font-size: 30rpx;
      font-weight: 600;
      color: #007aff;
      border: 1px solid rgb(63, 134, 255);
      border-radius: 15rpx;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
      width: 300rpx;
      height: 80rpx;
      line-height: 80rpx;
    }
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
}
uni-modal .uni-modal__bd {
  white-space: pre-wrap;
}
</style>
