<template>
  <view class="container">
    <!-- 显示聊天记录 -->
    <view class="messages">
      <view
        v-for="(message, index) in messages"
        :key="index"
        :class="['message', message.type]"
      >
        <text>{{ message.content }}</text>
      </view>
    </view>

    <!-- 输入框和发送按钮在最底部 -->
    <view class="input-container">
      <input
        v-model="userMessage"
        class="input-box"
        placeholder="请输入您的问题"
        @input="handleInputChange"
        @keydown="handleInput"
      />
      <button class="send-button" @click="sendMessage" :disabled="isSending">
        <image src="/src/static/image/send.png" mode="widthFix" />
      </button>
    </view>

    <!-- 加载中提示 -->
    <view v-if="isSending" class="loading-indicator">
      <text>AI正在思考中...</text>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref, nextTick } from 'vue';
import { aiInquiry } from "@/services/ai.ts";

// 定义响应式变量
const userMessage = ref(''); // 用户输入的消息
const messages = ref<{ type: string; content: string }[]>([{ type: 'ai', content: "你好，我是AI诊疗助手，有什么问题我可以帮你解答吗" }]); // 消息记录（包括用户和AI的消息）
const isSending = ref(false); // 是否正在发送请求
const thinkingTime = ref(0); // 思考时间
let thinkingTimer: ReturnType<typeof setInterval>; // 定时器

// 防抖处理
let debounceTimer: ReturnType<typeof setTimeout>;

const handleInputChange = () => {
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    // 在防抖时间结束后执行的代码
  }, 500); // 设置500ms的防抖
};

const handleInput = (e: KeyboardEvent) => {
  if (e.key === 13) {
    sendMessage();
  }
};

// 发送消息
const sendMessage = async () => {
  if (userMessage.value.trim() === '' || isSending.value) return; // 如果输入框为空或正在发送请求，不发送

  // 用户消息添加到消息记录
  messages.value.push({ type: 'user', content: userMessage.value });

  // 清空输入框
  const messageToSend = userMessage.value;
  userMessage.value = '';

  // 设置发送状态
  isSending.value = true;

  // 添加"AI正在思考中"的消息
  const thinkingMessage = { type: 'ai', content: 'AI正在思考中... 0秒' };
  messages.value.push(thinkingMessage);

  // 启动计时器，每秒增加思考时间
  thinkingTime.value = 0;
  thinkingTimer = setInterval(() => {
    thinkingTime.value++;
    messages.value[messages.value.length - 1] = { 
      type: 'ai', 
      content: `AI正在思考中... ${thinkingTime.value}秒`
    };
  }, 1000);

  try {
    // 发送请求到后端获取AI的回答
    const res = await aiInquiry(messageToSend);

    // 模拟 AI 思考完成，停止计时器
    clearInterval(thinkingTimer);

    // 更新消息为AI的实际回答
    if (res) {
      messages.value[messages.value.length - 1] = { type: 'ai', content: res };
    } else {
      messages.value[messages.value.length - 1] = { type: 'ai', content: '抱歉，未能获取到回答。' };
    }

    // 结束发送状态
    isSending.value = false;
  } catch (error) {
    console.error('请求失败', error);
    clearInterval(thinkingTimer);
    messages.value[messages.value.length - 1] = { type: 'ai', content: '请求失败，请稍后再试。' };
    isSending.value = false;
  }
};
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding: 20rpx;
  box-sizing: border-box;
}

.messages {
  flex: 1; /* 使聊天记录占据所有剩余空间 */
  overflow-y: auto; /* 使聊天记录部分可滚动 */
  margin-bottom: 20rpx;
  padding-bottom: 20rpx;
  min-height: 90%;
}

.message {
  max-width: 70%;
  margin: 5rpx;
  padding: 10rpx;
  border-radius: 10rpx;
}

.message.user {
  text-align: right;
  background-color: #e0f7fa;
  margin-left: auto;
}

.message.ai {
  text-align: left;
  background-color: #f1f1f1;
}

.input-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  bottom: 0;
  background-color: white;
  padding-top: 10rpx;
  font-size: 26rpx;
  padding-bottom: 10rpx;
  border-top: 1rpx solid #ccc;
  z-index: 10;
}

.input-box {
  flex: 1;
  height: 80rpx;
  padding: 10rpx;
  border-radius: 20rpx;
  border: 1rpx solid #ccc;
}

.send-button {
  background-color: #007bff;
  color: white;
  border: none;
  height: 70rpx;
  width: 100rpx;
  line-height: 65rpx;
  margin-left: 10rpx;
  border-radius: 100rpx;
  cursor: pointer;
}

.send-button:disabled {
  background-color: #d6d6d6;
  cursor: not-allowed;
}

.loading-indicator {
  text-align: center;
  padding: 10rpx;
  color: #888;
  font-size: 14rpx;
  position: absolute;
  bottom: 60rpx;
  width: 100%;
}
</style>
