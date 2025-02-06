<template>
  <scroll-view scroll-y class="bed">
    <!-- 房间列表 -->
    <view class="room-list">
      <view
        v-for="(room, index) in bedList"
        :key="room.id"
        @click="selectRoom(room, index)"
        :class="['room-item', selectedRoomIndex === index ? 'selected' : '']"
      >
        {{ room.number }} - {{ room.departmentName }} ({{ room.availableBeds }}
        空闲床位)
      </view>
    </view>

    <!-- 床位列表 -->
    <view v-if="selectedRoom" class="bed-list">
      <view v-for="(bed, index) in selectedRoom.beds" :key="bed.id">
        <view
          :class="['bed-item', bed.status === 1 ? 'free' : 'occupied']"
          @click="chooseBed(bed)"
        >
          床位 {{ bed.bedNumber }}
          <span v-if="bed.status === 1">空闲</span>
          <span v-else>已占用</span>
        </view>
      </view>

      <!-- 加载床位信息的状态 -->
      <view v-if="loadingBeds" class="loading">加载床位信息...</view>
      <view v-if="errorLoadingBeds" class="error"
        >床位信息加载失败，请重试</view
      >
    </view>
  </scroll-view>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { chooseBed as chooseBedAPI, chooseBedInfo } from '@/services/index.ts';
import { useMemberStore } from '@/stores';
const query = defineProps<{
  hospitalId: string;
  departmentId: string;
  departmentName: string;
}>();

const bedList = ref([]);
const selectedRoom = ref(null); // 当前选中的房间
const selectedRoomIndex = ref<number | null>(null); // 当前选中的房间索引
const loadingRooms = ref(true); // 房间信息加载中
const errorLoadingRooms = ref(false); // 房间信息加载失败
const loadingBeds = ref(false); // 床位信息加载中
const errorLoadingBeds = ref(false); // 床位信息加载失败

// 获取床位信息
const getBed = async () => {
  loadingRooms.value = true;
  errorLoadingRooms.value = false;
  try {
    const res = await chooseBedAPI(query.departmentId);
    bedList.value = res.data;
  } catch (error) {
    errorLoadingRooms.value = true;
  } finally {
    loadingRooms.value = false;
  }
};

// 选择房间
const selectRoom = (room: any, index: number) => {
  selectedRoom.value = room; // 设置选中的房间
  selectedRoomIndex.value = index; // 设置选中的房间索引
  getBedsForRoom(room.id); // 获取该房间的床位
};

// 获取床位信息
const getBedsForRoom = async (roomId: string) => {
  loadingBeds.value = true;
  errorLoadingBeds.value = false;
  try {
    const room = bedList.value.find((r: any) => r.id === roomId);
    if (room) {
      selectedRoom.value = room;
    }
  } catch (error) {
    errorLoadingBeds.value = true;
  } finally {
    loadingBeds.value = false;
  }
};

// 选择床位
const chooseBed = async (bed: any) => {
  if (bed.status !== 1) {
    uni.showToast({
      title: '该床位已占用',
      icon: 'error',
      duration: 2000,
    });
    return;
  }
  const memberStore = useMemberStore();
  const data = {
    id: memberStore.profile.id,
    bedId: bed.id,
    roomsId: bed.roomsId,
    departmentId: query.departmentId,
    hospitalId: query.hospitalId,
  };

  // 存储数据到本地存储
  uni.setStorageSync('bedId', data.bedId);
  uni.setStorageSync('roomsId', data.roomsId);

  // 存储当前时间(YYYY-MM-DD HH:mm:ss)
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const currentTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  uni.setStorageSync('currentTime', currentTime);

  const res = await chooseBedInfo(data);
  if (res.code === 200) {
    uni.showToast({
      title: '选择成功',
      icon: 'success',
      duration: 2000,
      success: () => {
        // 跳转到订单详情页
        uni.navigateTo({
          url:
            '/pages/orderDetail/orderDetail?orderId=' +
            res.data.orderId +
            '&type=1',
        });
      },
    });
  } else {
    uni.showToast({
      title: '选择失败',
      icon: 'error',
      duration: 2000,
    });
  }
};

onMounted(() => {
  getBed();
});
</script>

<style lang="scss" scoped>
.bed {
  padding: 20px;
}

.room-list {
  margin-bottom: 20px;
}

.room-item {
  padding: 10px;
  background-color: #f0f0f0;
  margin: 10px 0;
  cursor: pointer;
  border-radius: 5px;
}

.room-item.selected {
  background-color: #e0e0ff;
}

.bed-list {
  margin-top: 20px;
}

.bed-item {
  padding: 10px;
  margin: 5px 0;
  border: 1px solid #ccc;
  border-radius: 5px;
  cursor: pointer;
}

.bed-item.free {
  background-color: #a8f1a8; /* 空闲床位 */
}

.bed-item.occupied {
  background-color: #f1a8a8; /* 已占用床位 */
}

.loading {
  text-align: center;
  font-size: 16px;
  color: #888;
}

.error {
  text-align: center;
  font-size: 16px;
  color: red;
}
</style>
