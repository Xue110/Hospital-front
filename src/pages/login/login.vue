<script setup lang="ts">
import { ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { useMemberStore } from '@/stores';
import type { LoginResult } from '@/types/member';
import { postLoginWxMinAPI, postSendCodeAPI } from '@/services/login';
// 存储用户信息
const userInfo = ref<any>(null);
// 手机号格式错误状态
const phoneError = ref(false);
// 验证码按钮禁用状态
const isCodeDisabled = ref(false);
// 验证码按钮文本
const codeButtonText = ref('获取验证码');
// 倒计时
const countdown = ref(60);
// 定时器
let timer: ReturnType<typeof setInterval> | null = null;
const loginData = ref({
  phone: '',
  code: '',
});
// 校验手机号格式
const checkPhoneNumber = () => {
  const phonePattern = /^1[3-9]\d{9}$/; // 简单的手机号格式验证
  phoneError.value = !phonePattern.test(loginData.value.phone);
};
// 获取验证码
const handleGetCode = async () => {
  if (phoneError.value) {
    uni.showToast({
      title: '手机号格式不正确',
      icon: 'none',
    });
    return;
  }

  if (!loginData.value.phone) {
    uni.showToast({
      title: '请输入手机号',
      icon: 'none',
    });
    return;
  }

  const res = await postSendCodeAPI(Number(loginData.value.phone));
  if (res.code === 200) {
    uni.showToast({
      title: '验证码发送成功，请注意查收',
      icon: 'success',
    });
    // 禁用验证码按钮
    isCodeDisabled.value = true;
    // 启动倒计时
    timer = setInterval(() => {
      if (countdown.value === 0) {
        if (timer) {
          clearInterval(timer);
        }
        isCodeDisabled.value = false;
        countdown.value = 60;
        codeButtonText.value = '获取验证码';
      } else {
        countdown.value--;
        codeButtonText.value = `已发送 ${countdown.value}s`;
      }
    }, 1000);
  }
};

const handleLogin = async () => {
  const res = await postLoginWxMinAPI(loginData.value);
  loginSuccess(res.data);
};

//封装成功函数
const loginSuccess = (profile: LoginResult) => {
  //保存会员信息
  const memberStore = useMemberStore();
  memberStore.setProfile(profile);
  //成功提示
  uni.showToast({
    title: '登录成功',
    icon: 'success',
  });
  setTimeout(() => {
  // 获取启动参数
  const launchOptions = uni.getLaunchOptionsSync();
  
  if (launchOptions.scene === 1001) {  
    // 如果是首次启动（登录后），跳转到首页
    uni.switchTab({
      url: '/pages/index/index'
    });
  } else {
    // 如果是从其他页面跳转回来，返回上一页
    uni.navigateBack();
  }
}, 500);
};
</script>

<template>
  <view class="viewport">
    <view class="logo">
      <image src="@/static/image/logo.png" mode="aspectFit"></image>
    </view>
    <text class="title">吉诊宝-吉林省综合医疗服务平台</text>
    <view class="login">
      <!-- 手机号输入框 -->
      <input
        v-model="loginData.phone"
        class="phoneInput"
        type="number"
        placeholder="请输入手机号"
        placeholder-class="input-placeholder"
        @input="checkPhoneNumber"
        :class="{ 'input-error': phoneError }"
      />
      <view class="hang">
        <!-- 验证码输入框 -->
        <input
          v-model="loginData.code"
          class="codeInput"
          type="number"
          placeholder="请输入验证码"
          placeholder-class="input-placeholder"
        />
        <!-- 获取验证码按钮 -->
        <button
          class="button code"
          :style="{
            backgroundColor: !isCodeDisabled ? 'rgb(40, 153, 187)' : '#f0f0f0',
            color: !isCodeDisabled ? 'rgb(255, 255, 255)' : '#999',
          }"
          :disabled="isCodeDisabled"
          @click="handleGetCode"
        >
          {{ codeButtonText }}
        </button>
      </view>
      <button class="button phone" @click="handleLogin">登录/注册</button>
      <view class="tips"
        >登录/注册即视为你同意《服务条款》和《吉医通隐私协议》</view
      >
    </view>
  </view>
</template>

<style lang="scss">
page {
  height: 100%;
}
.title {
  font-size: 40rpx;
  font-weight: bold;
  margin-top: 30rpx;
  margin-bottom: 10rpx;
  color: #333;
  text-align: center;
}
.phoneInput {
  margin-bottom: 20rpx;
  border-radius: 72rpx;
  border: 1rpx solid #ddd;
  padding-left: 75rpx;
  height: 80rpx;
  font-size: 28rpx;
  background: url(@/static/image/phone.png) no-repeat 0 0;
  background-position: 10px 7px;
  background-size: 50rpx 50rpx;
}
.hang {
  display: flex;
  justify-content: space-between;
}
.codeInput {
  margin-bottom: 20rpx;
  border-radius: 72rpx;
  border: 1rpx solid #ddd;
  padding-left: 75rpx;
  height: 80rpx;
  flex: 2;
  font-size: 28rpx;
  background: url(@/static/image/code.png) no-repeat 0 0;
  background-position: 12px 9px;
  background-size: 40rpx 40rpx;
}
.code {
  background-color: #f0f0f0;
  color: rgb(255, 255, 255);
  border-radius: 72rpx;
  border: 1rpx solid #ddd;
  text-align: center;
  height: 80rpx;
  flex: 1;
}
.viewport {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 20rpx 40rpx;
}

.logo {
  flex: 1;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  image {
    width: 260rpx;
    height: 260rpx;
    margin-top: 15vh;
    border-radius: 20%;
  }
}

.login {
  display: flex;
  flex-direction: column;
  height: 60vh;
  padding: 40rpx 20rpx 20rpx;

  .input {
    width: 100%;
    height: 80rpx;
    font-size: 28rpx;
    border-radius: 72rpx;
    border: 1rpx solid #ddd;
    padding-left: 30rpx;
    margin-bottom: 20rpx;
  }

  .input-placeholder {
    color: #aaa;
  }

  .input-error {
    border-color: red; /* 错误时输入框边框变红 */
  }

  .button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 80rpx;
    font-size: 28rpx;
    border-radius: 72rpx;
    color: #fff;
    .icon {
      font-size: 40rpx;
      margin-right: 6rpx;
    }
  }

  .phone {
    background-color: rgb(40, 153, 187);
  }

  .code {
    background-color: #f0f0f0;
    color: #aaa;
  }
}

.tips {
  position: absolute;
  bottom: 80rpx;
  left: 20rpx;
  right: 20rpx;
  font-size: 22rpx;
  color: #999;
  text-align: center;
}
</style>
