<template>
  <scroll-view scroll-y class="medicine">
    <view class="medicine-list">
      <view class="medicine-item" v-for="item in medicineData" :key="item.id">
        <view class="medicine-name">{{ item.name }}</view>
        <view class="medicine-description">{{ item.description }}</view>
      </view>
    </view>
  </scroll-view>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { getMedicineInfo } from '@/services/my.ts';

const medicineData = ref([
  {
    id: 1,
    name: '感冒药',
    description: '用于治疗感冒引起的发热、咳嗽、头痛等症状',
  },
  {
    id: 2,
    name: '止咳药',
    description: '用于治疗咳嗽、痰多等症状',
  },
  {
    id: 3,
    name: '止痛药',
    description: '用于治疗疼痛、炎症等症状',
  },
  {
    id: 4,
    name: '抗过敏药',
    description: '用于治疗过敏性疾病引起的症状',
  },
  {
    id: 5,
    name: '抗生素',
    description: '用于治疗细菌感染引起的症状',
  },
]);

//获取疾病列表
const getmedicineList = async () => {
  const res = await getMedicineInfo();
  medicineData.value = res.data;
};

onMounted(() => {
  getmedicineList();
});
</script>

<style lang="scss" scoped>
.medicine {
  padding: 20rpx;

  .medicine-list {
    margin-top: 20rpx;

    .medicine-item {
      padding: 24rpx;
      border-bottom: 1rpx solid #e0e0e0;
      border-radius: 12rpx;
      background-color: #fff;
      margin-bottom: 16rpx;
      box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.1);

      .medicine-name {
        font-size: 30rpx;
        font-weight: bold;
        color: #333;
      }

      .medicine-description {
        font-size: 24rpx;
        color: #666;
        margin-top: 12rpx;
        line-height: 1.5;
      }
    }
  }
}
</style>
