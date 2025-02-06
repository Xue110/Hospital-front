<script setup lang="ts">
import { getMyInfo, updateMyInfo } from '@/services/my.ts';
import { useMemberStore } from '@/stores';
import { ref,onMounted } from 'vue';
// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = uni.getSystemInfoSync();
const userProfile = ref({});
// 获取个人信息
const memberStore = useMemberStore();
const getMemberProfileData = async () => {
  const res = await getMyInfo(memberStore.profile.id);
  userProfile.value = res.data;
};
onMounted(() => {
  getMemberProfileData();
});

const onAvatarChange = () => {
  uni.chooseMedia({
    count: 1,
    mediaType: ['image'],
    success: (res) => {
      const { tempFilePath } = res.tempFiles[0];
      console.log(tempFilePath);
      // 文件上传
      uni.uploadFile({
        url: 'http://localhost:8077/admin/upload',
        filePath: tempFilePath,
        name: 'image',
        success: (res) => {
          try {
            const data = JSON.parse(res.data); // 解析 JSON 对象
            userProfile.value.image = data.data; // 假设返回的字段是 url
            uni.showToast({
              title: '上传成功',
              icon: 'success',
            });
          } catch (e) {
            uni.showToast({
              title: '上传失败',
              icon: 'none',
            });
          }
        },
        fail: () => {
          uni.showToast({
            title: '上传失败',
            icon: 'none',
          });
        },
      });
    },
  });
};

//修改地址
const onAddressChange: UniHelper.RegionPickerOnChange = (e) => {
  userProfile.value!.address = e.detail.value.join(' ');
  console.log(userProfile.value.address);
};
const onsubmit = async () => {
  saveToLocal();
  const res = await updateMyInfo(userProfile);
  console.log(res);
  memberStore.setProfile(userProfile.value, ...memberStore.profile);
  uni.showToast({
    title: '修改成功',
    icon: 'success',
  });
  uni.switchTab({ url: '/pages/my/my' });
};
</script>

<template>
  <view class="viewport">
    <!-- 导航栏 -->
    <view class="navbar" :style="{ paddingTop: safeAreaInsets?.top + 'px' }">
      <navigator
        open-type="navigateBack"
        class="back icon-left"
        hover-class="none"
      ></navigator>
      <view class="title">个人信息</view>
    </view>
    <!-- 头像 -->
    <view class="avatar">
      <view @tap="onAvatarChange" class="avatar-content">
        <image class="image" :src="userProfile.image" mode="aspectFill" />
        <text class="text">点击修改头像</text>
      </view>
    </view>
    <!-- 表单 -->
    <view class="form">
      <!-- 表单内容 -->
      <view class="form-content">
        <view class="form-item">
          <text class="label">昵称</text>
          <input
            class="input"
            type="text"
            placeholder="请填写用户名"
            v-model="userProfile.username"
          />
        </view>
        <view class="form-item">
          <text class="label">身份证号</text>
          <input
            class="input"
            type="text"
            placeholder="请填写身份证号"
            v-model="userProfile.IdentityCard"
          />
        </view>
        <view class="form-item">
          <text class="label">手机号</text>
          <input
            class="input"
            type="text"
            placeholder="请填写手机号"
            disabled="true"
            v-model="userProfile.phone"
          />
        </view>
        <view class="form-item">
          <text class="label">城市</text>
          <picker
            @change="onAddressChange"
            class="picker"
            mode="region"
            :value="userProfile.address?.split(' ')"
          >
            <view v-if="userProfile.address">{{ userProfile.address }}</view>
            <view class="placeholder" v-else>请选择城市</view>
          </picker>
        </view>
        <view class="form-item">
          <text class="label">余额</text>
          <input
            class="input"
            type="text"
            placeholder="请填写余额"
            disabled="true"
            v-model="userProfile.balance"
          />
        </view>
      </view>
      <!-- 提交按钮 -->
      <button @tap="onsubmit" class="form-button">保 存</button>
    </view>
  </view>
</template>

<style lang="scss">
page {
  background-color: #f4f4f4;
}

.viewport {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: rgb(79, 198, 235);
}

// 导航栏
.navbar {
  position: relative;

  .title {
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 16px;
    font-weight: 500;
    color: #fff;
  }

  .back {
    position: absolute;
    height: 40px;
    width: 40px;
    left: 0;
    font-size: 20px;
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

// 头像
.avatar {
  text-align: center;
  width: 100%;
  height: 260rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .image {
    width: 160rpx;
    height: 160rpx;
    border-radius: 50%;
    background-color: #eee;
  }

  .text {
    display: block;
    padding-top: 20rpx;
    line-height: 1;
    font-size: 26rpx;
    color: #fff;
  }
}

// 表单
.form {
  background-color: #f4f4f4;

  &-content {
    margin: 20rpx 20rpx 0;
    padding: 0 20rpx;
    border-radius: 10rpx;
    background-color: #fff;
  }

  &-item {
    display: flex;
    height: 96rpx;
    line-height: 46rpx;
    padding: 25rpx 10rpx;
    background-color: #fff;
    font-size: 28rpx;
    border-bottom: 1rpx solid #ddd;

    &:last-child {
      border: none;
    }

    .label {
      width: 180rpx;
      color: #333;
    }

    .account {
      color: #666;
    }

    .input {
      flex: 1;
      display: block;
      height: 46rpx;
    }

    .radio {
      margin-right: 20rpx;
    }

    .picker {
      flex: 1;
    }
    .placeholder {
      color: #808080;
    }
  }

  &-button {
    height: 80rpx;
    text-align: center;
    line-height: 80rpx;
    margin: 30rpx 20rpx;
    color: #fff;
    border-radius: 80rpx;
    font-size: 30rpx;
    background-color: rgb(79, 198, 235);
  }
}
</style>
