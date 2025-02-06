import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useHealthStore = defineStore(
  'health',
  () => {
    //健康档案
    const health = ref({});
    const setHealth = (data: any) => {
      health.value = data;
    };
    const clearHealth = () => {
      health.value = {};
    };
    return {
      health,
      setHealth,
      clearHealth,
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
