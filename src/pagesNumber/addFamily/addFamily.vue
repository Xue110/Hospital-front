<template>
  <view class="addFamily">
    <view class="top" :style="{ paddingTop: safeAreaInsets?.top + 'px' }"
      ><view class="title">添加家庭成员</view></view
    >
    <view class="content">
      <!-- 姓名输入框 -->
      <input
        v-model="newFamily.name"
        class="phoneInput name"
        type="text"
        placeholder="请输入姓名"
        placeholder-class="input-placeholder"
        @input="checkPhoneNumber"
      />
      <!-- 身份证输入框 -->
      <input
        v-model="newFamily.IdentityCard"
        class="phoneInput idcart"
        type="number"
        placeholder="请输入身份证号"
        placeholder-class="input-placeholder"
        @input="checkPhoneNumber"
      />
      <!-- 手机号输入框 -->
      <input
        v-model="newFamily.phone"
        class="phoneInput"
        type="number"
        placeholder="请输入手机号"
        placeholder-class="input-placeholder"
        @input="checkPhoneNumber"
      />
      <button @click="add" class="btn">添加</button>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { addFamily } from '@/services/my.ts';
const { safeAreaInsets } = uni.getSystemInfoSync();
const newFamily = ref({
  name: '',
  IdentityCard: '',
  phone: '',
});
const add = async () => {
  console.log(newFamily.value)
  const res = await addFamily(newFamily.value);
  if (res.code === 200) {
    uni.showToast({
      title: '添加成功',
      icon: 'success',
    });
    uni.navigateBack();
    uni.$emit('refreshPage');
  } else {
    uni.showToast({
      title: '添加失败',
      icon: 'error',
    });
  }
};
</script>

<style lang="scss">
.addFamily {
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  .top {
    background-color: rgb(79, 198, 235);
    height: 400rpx;
    width: 100%;
    line-height: 150rpx;
    border-radius: 0 0 100% 100%;
    .title {
      text-align: center;
      font-size: 50rpx;
      font-family: '楷体';
      color: white;
      padding: 20rpx 0;
    }
  }
  .content {
    margin-top: -100rpx;
    border-radius: 20rpx;
    display: flex;
    flex-direction: column;
    background-color: #fff;
    width: 90%;
    height: 600rpx;
    padding: 40rpx 20rpx 20rpx;
    .input-error {
      border-color: red; /* 错误时输入框边框变红 */
    }
    .phoneInput {
      margin-bottom: 20rpx;
      border-radius: 72rpx;
      border-bottom: 1rpx solid #ddd;
      padding-left: 85rpx;
      height: 110rpx;
      font-size: 28rpx;
      background: url(@/static/image/phone.png) no-repeat 0 0;
      background-position: 12px 15px;
      background-size: 50rpx 50rpx;
    }
    .name {
      background: url(@/static/image/name.png) no-repeat 0 0;
      background-position: 10px 15px;
      background-size: 50rpx 50rpx;
    }
    .idcart {
      background: url(@/static/image/idcard.png) no-repeat 0 0;
      background-position: 10px 19px;
      background-size: 50rpx 35rpx;
    }
    .btn {
      width: 80%;
      height: 100rpx;
      background-color: rgb(79, 198, 235);
      color: white;
      border-radius: 72rpx;
      font-size: 30rpx;
      margin-top: 20rpx;
      line-height: 100rpx;
      letter-spacing: 10rpx;
    }
  }
}
</style>
