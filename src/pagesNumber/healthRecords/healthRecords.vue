<template>
  <view class="healthRecords">
    <view class="healthRecords__title">健康档案</view>
    <view class="healthRecords__content">
      <view class="healthRecords__content__item">
        <view class="healthRecords__content__item__title">姓名</view>
        <view class="healthRecords__content__item__value">{{
          healthData.userName ? healthData.userName : '暂无数据'
        }}</view>
      </view>
      <view class="healthRecords__content__item">
        <view class="healthRecords__content__item__title">身高</view>
        <view class="healthRecords__content__item__value"
          >{{ healthData.height ? healthData.height : '暂无数据'}}cm</view
        >
      </view>
      <view class="healthRecords__content__item">
        <view class="healthRecords__content__item__title">体重</view>
        <view class="healthRecords__content__item__value"
          >{{ healthData.weight ? healthData.weight : '暂无数据'}}kg</view
        >
      </view>
      <view class="healthRecords__content__item">
        <view class="healthRecords__content__item__title">疾病名</view>
        <view class="healthRecords__content__item__value">{{
          healthData.diseaseName ? healthData.diseaseName.join(',') : '暂无数据'
        }}</view>
      </view>
      <view class="healthRecords__content__item">
        <view class="healthRecords__content__item__title">药品名</view>
        <view class="healthRecords__content__item__value">{{
          healthData.medicationName ? healthData.medicationName.join(',') : '暂无数据'
        }}</view>
      </view>
      <view class="healthRecords__content__item">
        <view class="healthRecords__content__item__title">血压</view>
        <view class="healthRecords__content__item__value"
          >{{ healthData.bloodPressure ? healthData.bloodPressure : '暂无数据'}}mmHg</view
        >
      </view>
      <view class="healthRecords__content__item">
        <view class="healthRecords__content__item__title">血糖</view>
        <view class="healthRecords__content__item__value"
          >{{ healthData.bloodSugar ? healthData.bloodSugar : '暂无数据'}}mmol/L</view
        >
      </view>
      <view class="healthRecords__content__item">
        <view class="healthRecords__content__item__title">过敏原</view>
        <view class="healthRecords__content__item__value">{{
          healthData.allergyInfo ? healthData.allergyInfo : '暂无数据'
        }}</view>
      </view>
    </view>
    <view class="healthRecords__update">
      <navigator
        url="/pagesNumber/updateHealth/updateHealth?type=1"
        open-type="navigate"
        hover-class="navigator-hover"
      >
        <button>更新健康档案</button>
      </navigator>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useHealthStore } from '@/stores';
import {getHealthInfo} from '@/services/my.ts';

const healthStore = useHealthStore();
const healthData = ref({});
healthData.value = healthStore.health;
console.log(healthData.value);
</script>

<style lang="scss" scoped>
.healthRecords {
  background-color: #f4f7fc; /* 背景色柔和 */
  padding: 20px;
  height: 100vh;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1); /* 阴影效果 */
}

.healthRecords__title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  text-align: center;
  margin-bottom: 20px;
}

.healthRecords__content {
  background-color: #ffffff; /* 白色背景 */
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.healthRecords__content__item {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.healthRecords__content__item:last-child {
  border-bottom: none;
}

.healthRecords__content__item__title {
  font-size: 16px;
  font-weight: 500;
  color: #555;
}

.healthRecords__content__item__value {
  font-size: 16px;
  color: #333;
  font-weight: 400;
  text-align: right;
  flex: 1;
  word-break: break-word;
}
.healthRecords__update {
  margin-top: 20px;
  text-align: center;
}

.healthRecords__update button {
  background-color: #007aff;
  color: #fff;
  border: none;
}
</style>
