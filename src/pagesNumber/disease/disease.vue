<template>
  <scroll-view class="viewport" scroll-y enable-back-to-top>
    <view class="disease">
      <!-- 保存按钮和已选择疾病粘性定位 -->
      <view class="save-container">
        <button @click="handleSave" class="save-button">保存</button>
        <view class="selected-diseases">
          <text class="selected-text">已选择的疾病：</text>
          <text class="selected-names">{{
            selectedDiseasesNames.join(', ') || '请选择疾病'
          }}</text>
        </view>
      </view>

      <!-- 疾病选择框 -->
      <view class="content">
        <view class="checkbox-group">
          <checkbox-group :value="selectedDiseases" @change="onDiseaseChange">
            <view
              v-for="(disease, index) in diseaseList"
              :key="index"
              class="checkbox-item"
            >
              <checkbox :value="index" class="checkbox">{{
                disease.name
              }}</checkbox>
            </view>
          </checkbox-group>
        </view>
      </view>
    </view>
  </scroll-view>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted } from 'vue';
import { useHealthStore, useDiseaseStore } from '@/stores';
// 获取健康信息存储
const healthStore = useHealthStore();
// 选择的疾病ID和疾病名称
const selectedDiseases = ref<number[]>();
const selectedDiseasesNames = ref<string[]>([]);

// 获取存储中的疾病数据
const diseaseStore = useDiseaseStore();
const diseaseList = ref(diseaseStore.disease);
// 当用户选择的疾病变化时，更新已选择的疾病名称
const onDiseaseChange = (event) => {
  console.log(event.detail.value)
  selectedDiseases.value = event.detail.value;
  // 获取所有选中的疾病ID对应的名称
  selectedDiseasesNames.value = selectedDiseases.value.map((index) => {
    return diseaseList.value[index]?.name || '未知疾病'; // 防止索引越界
  });
};
// 保存选择的疾病
const handleSave = () => {
  const selectedDiseasesNumbers = selectedDiseases.value.map((disease) =>
    Number(disease)
  );
  healthStore.setHealth({
    ...healthStore.health,
    diseaseId: selectedDiseasesNumbers,
  });
  uni.navigateBack(); // 返回上一页
  uni.$emit('refreshPage');
};
</script>

<style lang="scss">
.viewport {
  position: relative;
  height: 100%;
}
.disease {
  padding: 20rpx;
  background-color: #f7f7f7;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.content {
  flex: 1;
  background-color: #fff;
  border-radius: 8rpx;
  box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.1);
  padding: 20rpx;
  margin-bottom: 20rpx;
}

.checkbox-group {
  display: flex;
  flex-direction: column;
}

.checkbox-item {
  margin-bottom: 12rpx;
  display: flex;
  align-items: center;
}

.checkbox {
  margin-right: 8rpx;
  color: #007bff;
}

/* 保存按钮和已选择疾病粘性定位 */
.save-container {
  position: sticky;
  top: 0;
  z-index: 10;
  background-color: #fff;
  padding: 10rpx;
}

.selected-diseases {
  position: sticky;
  top: 60rpx; /* 适当调整与保存按钮的间距 */
  z-index: 5;
  padding: 10rpx 20rpx;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.selected-text {
  font-size: 30rpx;
  color: #333;
}

.selected-names {
  font-size: 28rpx;
  color: #888;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.save-button {
  width: 100%;
  padding: 14rpx;
  background-color: #007bff;
  color: #fff;
  font-size: 26rpx;
  border: none;
  border-radius: 6rpx;
  text-align: center;
  cursor: pointer;
}

.save-button:hover {
  background-color: #0056b3;
}

.save-button:active {
  background-color: #003f8e;
}
</style>
