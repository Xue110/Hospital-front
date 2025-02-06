<template>
  <view class="addHealth">
    <view class="top" :style="{ paddingTop: safeAreaInsets?.top + 'px' }">
      <view class="title">{{ title }}</view>
    </view>
    <view class="content">
      <input
        v-model="newFamily.height"
        class="phoneInput height"
        type="number"
        placeholder="请输入身高(cm)"
        placeholder-class="input-placeholder"
      />
      <!-- 体重输入框 -->
      <input
        v-model="newFamily.weight"
        class="phoneInput weight"
        type="number"
        placeholder="请输入体重(kg)"
        placeholder-class="input-placeholder"
      />
      <!-- 血压输入框 -->
      <input
        v-model="newFamily.bloodPressure"
        class="phoneInput bloodPressure"
        type="number"
        placeholder="请输入血压(mmHg)"
        placeholder-class="input-placeholder"
      />
      <!-- 血糖输入框 -->
      <input
        v-model="newFamily.bloodSugar"
        class="phoneInput bloodSugar"
        type="number"
        placeholder="请输入血糖(mmol/L)"
        placeholder-class="input-placeholder"
      />
      <!-- 过敏信息输入框 -->
      <input
        v-model="newFamily.allergyInfo"
        class="phoneInput allergyInfo"
        type="text"
        placeholder="请输入过敏信息"
        placeholder-class="input-placeholder"
      />
      <!-- 疾病选择框 -->
      <navigator
        url="/pagesNumber/disease/disease"
        open-type="navigate"
        hover-class="navigator-hover"
      >
        <view class="diseaseId phoneInput">
          <view v-if="selectedDiseaseName.length === 0">
            <view class="placeholder">请选择疾病</view>
          </view>
          <view v-else>
            <view class="selectedDisease">
              {{ selectedDiseaseName.join('，') }}
            </view>
          </view>
          <text class="iconfont icon-right"></text>
        </view>
      </navigator>
      <!-- 药物选择框 -->
      <navigator
        url="/pagesNumber/medicine/medicine"
        open-type="navigate"
        hover-class="navigator-hover"
      >
        <view class="phoneInput medicationId">
          <view v-if="selectedMedicineName.length === 0">
            <view class="placeholder">请选择药物</view>
          </view>
          <view v-else>
            <view class="selectedDisease">
              {{ selectedMedicineName.join('，') }}
            </view>
          </view>
          <text class="iconfont icon-right"></text>
        </view>
      </navigator>
      <button @click="add" class="btn">{{ btnMessage }}</button>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { addHealthInfo, updateHealthInfo,getHealthInfo } from '@/services/my.ts';
import { useHealthStore, useDiseaseStore, useMedicineStore } from '@/stores';
const healthStore = useHealthStore();
const { safeAreaInsets } = uni.getSystemInfoSync();

// 获取页面参数
const query = defineProps<{ type: number }>();
const diseaseStore = useDiseaseStore();
const medicineStore = useMedicineStore();

// 疾病信息
const diseaseList = ref(diseaseStore.disease);

// 药物信息
const medicineList = ref(medicineStore.medicine);

const title = ref('');
const btnMessage = ref('');
const newFamily = ref({
  height: '',
  weight: '',
  bloodPressure: '',
  bloodSugar: '',
  allergyInfo: '',
  diseaseId: [] as number[], // 明确声明为数组
  medicationId: [] as number[], // 明确声明为数组
});

// 表单加载状态
const loading = ref(false);

// 选择的疾病索引
const selectedDiseaseIndex = ref<number[]>([]);
const selectedDiseaseName = ref<string[]>([]);

// 选择的药物索引
const selectedMedicineIndex = ref<number[]>([]);
const selectedMedicineName = ref<string[]>([]);


const getInfo = async () => {
  const res = await getHealthInfo(); // 健康信息 API
  healthStore.setHealth(res.data);
};

// 提交数据函数
const add = async () => {
  // 表单验证
  if (
    !newFamily.value.height ||
    !newFamily.value.weight ||
    !newFamily.value.bloodPressure
  ) {
    uni.showToast({ title: '请完善健康信息', icon: 'none' });
    return;
  }

  loading.value = true;
  newFamily.value.diseaseId = selectedDiseaseIndex.value.map((index) => {
    return diseaseList.value[index]?.id || -1;
  });
  newFamily.value.medicationId = selectedMedicineIndex.value.map((index) => {
    return medicineList.value[index]?.id || -1;
  });
  console.log(newFamily.value);

  try {
    if (query.type == 1) {
      newFamily.value.id = healthStore.health.id;
      newFamily.value.userId = healthStore.health.userId;
      await updateHealthInfo(newFamily.value);
      await getInfo()
    } else {
      await addHealthInfo(newFamily.value);
      await getInfo()
    }
    uni.$emit('getAgain');
    uni.switchTab({ url: '/pages/my/my' });
  } catch (error) {
    console.error('提交失败', error);
    uni.showToast({ title: '提交失败，请重试', icon: 'none' });
  } finally {
    loading.value = false;
  }
};

// 初始化页面
onMounted(() => {
  btnMessage.value = query.type == 1 ? '保存' : '添加';
  title.value = query.type == 1 ? '编辑档案' : '新建档案';
  if (query.type == 1) {
    newFamily.value = healthStore.health;
  }
  selectedDiseaseIndex.value = healthStore.health.diseaseId;
  selectedMedicineIndex.value = healthStore.health.medicationId;

  // 使用映射将索引转为疾病名称
  selectedDiseaseName.value = selectedDiseaseIndex.value.map((index) => {
    return diseaseList.value.find((item) => item.id === index)?.name || '未知疾病';
  });

  // 使用映射将索引转为药物名称
  selectedMedicineName.value = selectedMedicineIndex.value.map((index) => {
    return medicineList.value.find((item) => item.id === index)?.name || '未知药物';
  });
});

// 监听事件以刷新页面
uni.$on('refreshPage', () => {
  selectedDiseaseIndex.value = healthStore.health.diseaseId;
  selectedMedicineIndex.value = healthStore.health.medicationId;
  selectedDiseaseName.value = selectedDiseaseIndex.value.map((index) => {
    return diseaseList.value[index]?.name || '未知疾病';
  });
  selectedMedicineName.value = selectedMedicineIndex.value.map((index) => {
    return medicineList.value[index]?.name || '未知药物';
  });
});

// 组件销毁时移除监听器
onBeforeUnmount(() => {
  uni.$off('getAgain');
});
</script>

<style lang="scss">
.addHealth {
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
      color: white;
      padding: 20rpx 0;
    }
  }
  .content {
    margin-top: -140rpx;
    border-radius: 20rpx;
    display: flex;
    flex-direction: column;
    background-color: #fff;
    width: 90%;
    height: 1000rpx;
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
      background-position: 12px 14px;
      background-size: 50rpx 50rpx;
    }
    .height {
      background: url(@/static/image/healthRecords/ceshengao.png) no-repeat 0 0;
      background-position: 10px 14px;
      background-size: 50rpx 50rpx;
    }
    .weight {
      background: url(@/static/image/healthRecords/cetizhong.png) no-repeat 0 0;
      background-position: 10px 14px;
      background-size: 50rpx 50rpx;
    }
    .bloodPressure {
      background: url(@/static/image/healthRecords/xieya.png) no-repeat 0 0;
      background-position: 14px 14px;
      background-size: 40rpx 40rpx;
    }
    .bloodSugar {
      background: url(@/static/image/healthRecords/xietang.png) no-repeat 0 0;
      background-position: 12px 14px;
      background-size: 45rpx 45rpx;
    }
    .allergyInfo {
      background: url(@/static/image/healthRecords/guomin.png) no-repeat 0 0;
      background-position: 12px 14px;
      background-size: 45rpx 45rpx;
    }
    .diseaseId {
      background: url(@/static/image/healthRecords/bingdu.png) no-repeat 0 0;
      background-position: 12px 16px;
      background-size: 45rpx 45rpx;
      line-height: 110rpx;
    }
    .medicationId {
      background: url(@/static/image/healthRecords/yaowu.png) no-repeat 0 0;
      background-position: 12px 14px;
      background-size: 45rpx 45rpx;
      line-height: 110rpx;
    }
    .icon-right {
      position: absolute;
      right: 100rpx;
      margin-top: -15%;
    }
    .btn {
      width: 80%;
      height: 100rpx;
      background-color: rgb(79, 198, 235);
      color: white;
      border-radius: 72rpx;
      font-size: 30rpx;
      margin-top: 20rpx;
      line-height: 80rpx;
      letter-spacing: 10rpx;
    }
  }
}
</style>
