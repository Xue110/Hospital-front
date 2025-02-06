<template>
  <scroll-view scroll-y class="disease">
    <view class="disease-list">
      <view class="disease-item" v-for="item in diseaseData" :key="item.id">
        <view class="disease-name"
          >{{ item.name }}
          <text class="disease-department">{{
            item.departmentName
          }}</text></view
        >
        <view class="disease-description">{{ item.description }}</view>
      </view>
    </view>
  </scroll-view>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { getDiseaseInfo } from '@/services/my.ts';
const diseaseData = ref([
  {
    id: 1,
    name: '术后恢复',
    description:
      '术后恢复是指手术后患者身体逐渐恢复的过程。在术后恢复期间，患者需要遵循医生的建议，按时服药、定期复查，保持良好的生活习惯，以促进身体的康复。',
    departmentId: 1,
    departmentName: '康复科',
  },
  {
    id: 2,
    name: '糖尿病',
    description:
      '糖尿病是一种慢性代谢性疾病，主要表现为血糖升高。糖尿病的治疗主要包括药物治疗、饮食控制、运动治疗和生活方式调整等。',
    departmentId: 2,
    departmentName: '内分泌科',
  },
  {
    id: 3,
    name: '高血压',
    description:
      '高血压是一种常见的慢性疾病，主要表现为血压持续升高。高血压的治疗主要包括药物治疗、饮食控制、运动治疗和生活方式调整等。',
    departmentId: 3,
    departmentName: '心血管内科',
  },
  {
    id: 4,
    name: '心脏病',
    description:
      '心脏病是一种常见的慢性疾病，主要表现为心脏功能不全。心脏病的治疗主要包括药物治疗、手术治疗和生活方式调整等。',
    departmentId: 4,
    departmentName: '心血管内科',
  },
]);

//获取疾病列表
const getDiseaseList = async () => {
  const res = await getDiseaseInfo();
  diseaseData.value = res.data;
};

onMounted(() => {
  getDiseaseList();
});
</script>

<style lang="scss" scoped>
.disease {
  .disease-list {
    margin-top: 4px;
    .disease-item {
      padding: 10px;
      border-bottom: 1px solid #f6f7f8;
      .disease-name {
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 10px;
      }
      .disease-description {
        font-size: 14px;
        color: #959fa0;
        margin-bottom: 10px;
      }
      .disease-department {
        font-size: 14px;
        color: #959fa0;
      }
    }
  }
}
</style>
