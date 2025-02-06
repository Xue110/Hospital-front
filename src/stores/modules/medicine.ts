import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useMedicineStore = defineStore(
  'medicine',
  () => {
    //健康档案
    const medicine = ref({});
    const setMedicine = (data: any) => {
      medicine.value = data;
    };
    const clearMedicine = () => {
      medicine.value = {};
    };
    return {
      medicine,
      setMedicine,
      clearMedicine,
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
