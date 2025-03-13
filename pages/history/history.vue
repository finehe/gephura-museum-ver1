<template>
  <view class="history-container">
    <view class="history-header">
      <text class="title">历史对话</text>
      <button class="toggle-sidebar-button" @click="toggleSidebar">☰</button>
    </view>
    <view class="conversation-list">
      <view class="conversation-item" v-for="(item, index) in conversations" :key="index" @click="openChat(item.chatGroupId)">
        <text class="conversation-title">{{ item.question }}</text>
        <text class="conversation-date">{{ formatDate(item.addedTime) }}</text>
      </view>
    </view>
    <SidebarNav ref="sidebarNav" />
  </view>
</template>

<script>
import { serverUrl } from '@/utils/api.js';
import SidebarNav from '@/components/SidebarNav.vue';

export default {
  name: 'History',
  components: {
    SidebarNav
  },
  data() {
    return {
      conversations: []
    };
  },
  onLoad() {
    this.fetchChatHistory();
  },
  methods: {
    toggleSidebar() {
      if (this.$refs.sidebarNav) {
        this.$refs.sidebarNav.toggleSidebar();
      } else {
        console.error('SidebarNav component not found');
      }
    },
    fetchChatHistory() {
      const userInfo = uni.getStorageSync('userInfo');
      
      if (!userInfo) {
        console.error('User info not found');
        return;
      }

      const { uid, uuid } = userInfo;
      const token = uni.getStorageSync('token');

      if (!token) {
        console.error('Token not found');
        return;
      }

      uni.request({
        url: `${serverUrl}/chat/chatHistory`,
        method: 'POST',
        header: {
          'Authorization': `Bearer ${token}`
        },
        data: {
          uid: uid,
          uuid: uuid,
          pageNumber: 1,
          pageSize: 20
        },
        success: (res) => {
          if (res.data.code === 200) {
            this.conversations = res.data.data;
          } else {
            console.error('Failed to fetch chat history:', res.data.message);
          }
        },
        fail: (error) => {
          console.error('Request failed:', error);
        }
      });
    },
    formatDate(dateString) {
      const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
      return new Date(dateString).toLocaleDateString('zh-CN', options);
    },
    openChat(chatGroupId) {
      uni.navigateTo({
        url: `/pages/talk/talk?chatGroupId=${chatGroupId}`
      });
    }
  }
}
</script>

<style>
html, body {
  background-color: #f5f5f5; /* 设置背景色 */
}

.history-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f5f5f5; /* 设置背景色 */
  padding: 20px;
  min-height: 100vh; /* 确保容器至少占满整个视口高度 */
}

.history-header {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  padding: 10px;
  position: relative;
  margin-bottom: 20px;
}

.title {
  font-size: 24px;
  font-weight: bold;
  margin-top: 10px;
  margin-bottom: 20px;
}

.toggle-sidebar-button {
  font-size: 24px;
  background: none;
  border: none;
  cursor: pointer;
  position: absolute;
  top: 10px;
  right: 10px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.conversation-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
}

.conversation-item {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  border-bottom: 1px solid #ccc;
}

.conversation-title {
  color: #4a90e2;
}

.conversation-date {
  color: #333;
}
</style> 