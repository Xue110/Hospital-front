<template>
  <view class="family">
    <scroll-view class="scroll-view" scroll-y>
      <view class="top">
        <view class="title"
          ><text style="font-size: 55rpx; margin-top: 5rpx">{{
            family.length
          }}</text
          >名家庭成员</view
        >
      </view>
      <view class="content">
        <view v-if="family.length === 0" class="empty">
          <view class="empty-text">暂无家庭成员</view>
        </view>
        <uni-swipe-action v-else>
          <uni-swipe-action-item v-for="item in updatedFamily" :key="item.id">
            <view class="item">
              <view class="image">
                <image
                  src="https://img1.baidu.com/it/u=2682750248,1148624836&fm=253&fmt=auto&app=138&f=PNG?w=500&h=500"
                  mode="aspectFill"
                />
              </view>
              <view class="text">
                <view class="name">{{ item.name }}</view>
                <view class="identityCard">{{ item.identityCard }}</view></view
              >
              <view class="icon" @click="onSwitch(item.userId)">
                <image src="@/static/image/switch.png" mode="asepectFill" />
              </view>
            </view>
            <!-- 删除按钮 -->
            <template #right>
              <button @tap="onDelete(item.id)" class="delete-button">
                删除
              </button>
            </template>
          </uni-swipe-action-item>
        </uni-swipe-action>
      </view>
    </scroll-view>
    <view class="add">
      <navigator
        url="/pagesNumber/addFamily/addFamily"
        class="navigator"
        hover-class="none"
      >
        <button class="add-button" hover-class="button-hover">添加成员</button>
      </navigator>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import { useMemberStore } from '@/stores';
import { getFamilyList, changeFamily, deleteFamily } from '@/services/my.ts';

const memberStore = useMemberStore();
const family = ref<any[]>([]); // 更明确的类型
const newFamily = ref({
  name: '',
  identityCard: '',
  phone: '',
});

// 获取family列表
const getFamily = async () => {
  try {
    const res = await getFamilyList(Number(memberStore.profile.id));
    if (res && res.data) {
      family.value = res.data;
    }
  } catch (error) {
    console.error("获取家庭成员列表失败:", error);
    uni.showToast({
      title: '获取家庭成员列表失败',
      icon: 'none',
      duration: 2000,
    });
  }
};

// 监听 'refreshPage' 事件
uni.$on('refreshPage', async () => {
  await getFamily();
});

// 页面加载时获取家庭列表
onMounted(() => {
  getFamily();
});

// 页面销毁时解绑事件监听
onBeforeUnmount(() => {
  uni.$off('refreshPage');
});

// 删除家庭成员
const onDelete = async (id: number) => {
  try {
    const res = await deleteFamily(id);
    if (res.code === 200) {
      uni.showToast({
        title: '删除成功',
        icon: 'success',
        duration: 2000,
      });
      getFamily(); // 删除成功后重新获取列表
    }
  } catch (error) {
    console.error("删除家庭成员失败:", error);
    uni.showToast({
      title: '删除失败',
      icon: 'none',
      duration: 2000,
    });
  }
};

// 更新family数组的name和identityCard展示方式
const updatedFamily = computed(() => {
  return family.value.map((member) => {
    const name = member.name || '';
    const identityCard = member.identityCard || '';

    // 处理name
    let displayedName = '';
    if (name.length === 2) {
      displayedName = '*' + name.charAt(1);
    } else if (name.length === 3) {
      displayedName = name.charAt(0) + '*' + name.charAt(2);
    } else {
      displayedName = name; // 如果没有符合的长度，直接显示
    }

    // 处理identityCard
    const displayedIdentityCard =
      identityCard.slice(0, 3) + '***********' + identityCard.slice(-4); // 显示开头三位和后四位

    return {
      ...member,
      name: displayedName,
      identityCard: displayedIdentityCard,
    };
  });
});

// 切换家庭成员
const onSwitch = async (userId: number) => {
  try {
    const res = await changeFamily(userId);
    if (res.code === 200) {
      memberStore.setProfile(res.data);
      uni.navigateTo({
        url: 'pages/my/my',
      });
    } else {
      uni.showToast({
        title: '切换失败',
        icon: 'none',
        duration: 2000,
      });
    }
  } catch (error) {
    console.error("切换家庭成员失败:", error);
    uni.showToast({
      title: '切换失败',
      icon: 'none',
      duration: 2000,
    });
  }
};

</script>

<style lang="scss">
.family {
  background-color: #f5f5f5;
  height: 100vh;
  .top {
    background-image: url(@/static/image/familyBanner.png);
    background-size: 100% 100%;
    height: 300rpx;
    background-repeat: no-repeat;
    background-position: center;
    padding: 20rpx;
    .title {
      font-size: 40rpx;
      font-weight: 600;
      color: white;
      margin: 150rpx 100rpx;
      letter-spacing: 5rpx;
    }
  }
  /* 删除按钮 */
  .delete-button {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 50px;
    height: 100%;
    font-size: 28rpx;
    color: #fff;
    border-radius: 0;
    padding: 0;
    background-color: #cf4444;
  }

  .content {
    background-color: #fff;
    margin-top: -20rpx;
    border-radius: 20rpx 20rpx 0 0;
    padding: 20rpx;
    .item {
      border-bottom: rgba(192, 182, 182, 0.12) 1px solid;
      margin: 20rpx;
      padding: 20rpx;
      width: 100%;
      background-color: #fff;
      border-radius: 20rpx;
      display: flex;
      align-items: center;

      .image {
        flex: 1;
        width: 100rpx;
        height: 100rpx;
        border-radius: 50%;
        overflow: hidden;
        ma image {
          width: 100%;
          height: 100%;
        }
      }
      .text {
        flex: 3;
        margin-left: 50rpx;
        .name {
          font-size: 35rpx;
          margin-bottom: 10rpx;
        }
        .identityCard {
          font-size: 23rpx;
          color: #999;
        }
      }
      .icon {
        flex: 2;
        text-align: right;
        image {
          width: 65rpx;
          height: 65rpx;
        }
      }
    }
  }
  .add {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: #fff;
    padding: 20rpx;
    box-shadow: 0 0 10rpx rgba(0, 0, 0, 0.1);
    z-index: 9999;
    .add-button {
      width: 90%;
      background-color: #4076fe;
      border: 1px solid #ccc;
      border-radius: 10rpx;
      padding: 10rpx 20rpx;
      font-size: 30rpx;
      color: #fff;
      letter-spacing: 5rpx;
      &:active {
        background-color: rgba(64, 118, 254, 0.39);
      }
    }
  }
  .empty {
    text-align: center;
    min-height: 300rpx;
    line-height: 300rpx;
    font-size: 30rpx;
    color: #999;
  }
}
</style>
