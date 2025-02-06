import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useDiseaseStore = defineStore(
  'disease',
  () => {
    // 疾病信息
    const disease = ref({});
    const setDisease = (data: any) => {
      disease.value = data;
    };
    const clearDisease = () => {
      disease.value = {};
    };
    return {
      disease,
      setDisease,
      clearDisease,
    };
  },
  {
    persist: {
      storage: {
        getItem(key) {
          return uni.getStorageSync(key);
        },
        setItem(key, val) {
          uni.setStorageSync(key, val);
        },
      },
    },
  }
);
