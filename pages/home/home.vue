<template>
  <view class="ios-home-container">
    <!-- 顶部导航栏 -->
    <view class="ios-header">
      <image src="/static/logo.png" class="ios-logo" mode="aspectFit"></image>
      <view class="ios-location">
        <text class="ios-location-icon">📍</text>
        <text class="ios-location-text">{{ city }}</text>
      </view>
      <view class="ios-header-button" @click="toggleSidebar">
        <text class="ios-header-button-icon">☰</text>
      </view>
    </view>
    
    <!-- 欢迎卡片 -->
    <ios-card class="ios-welcome-card">
      <view class="ios-welcome-content">
        <image src="/static/large-logo.png" class="ios-avatar" mode="aspectFit"></image>
        <text class="ios-welcome-title">Hi，我是你的导游助手</text>
        <text class="ios-welcome-description">
          我精通博物馆、植物馆、动物园、天体、物理、文化、体育、古今中外...
        </text>
      </view>
    </ios-card>
    
    <!-- 功能卡片 -->
    <view class="ios-features-grid">
      <ios-card class="ios-feature-card" @click="takePhoto">
        <view class="ios-feature-content">
          <image src="/static/photo-icon.png" class="ios-feature-icon" mode="aspectFit"></image>
          <text class="ios-feature-title">拍一下</text>
          <text class="ios-feature-description">拍照识别展品</text>
        </view>
      </ios-card>
      
      <ios-card class="ios-feature-card" @click="scanCode">
        <view class="ios-feature-content">
          <image src="/static/scan-icon.png" class="ios-feature-icon" mode="aspectFit"></image>
          <text class="ios-feature-title">扫一扫</text>
          <text class="ios-feature-description">扫码了解详情</text>
        </view>
      </ios-card>
    </view>
    
    <!-- 侧边栏组件 -->
    <SidebarNav ref="sidebarNav" />
    
    <!-- 底部输入框 -->
    <view class="ios-input-footer">
      <view class="ios-input-mode-button" @click="toggleInputMode">
        <text>{{ isVoiceMode ? '键盘' : '语音' }}</text>
      </view>
      
      <view class="ios-input-field">
        <input 
          v-if="!isVoiceMode" 
          type="text" 
          v-model="userInput" 
          placeholder="有什么想问的..." 
          @keyup.enter="handleTextInput"
          class="ios-text-input"
        />
        <view 
          v-else 
          class="ios-voice-button"
          @touchstart="startVoiceInput" 
          @touchend="endVoiceInput"
        >
          <text>按住说话</text>
        </view>
      </view>
      
      <view class="ios-input-action">
        <view v-if="userInput.trim()" class="ios-send-button" @click="sendTextMessage">
          <text>发送</text>
        </view>
        <view v-else class="ios-more-button" @click="openMediaOptions">
          <text>+</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import SidebarNav from '@/components/SidebarNav.vue';
import IosCard from '@/components/common/IosCard.vue';
import { initializeUser, uploadImage, sendDataToServer, startConversation } from '@/utils/api.js';

export default {
  components: {
    SidebarNav,
    IosCard
  },
  data() {
    return {
      city: '定位中...',
      uid: 0,
      uuid: '',
      userInput: '',
      isVoiceMode: false,
    };
  },
  mounted() {
    this.getLocation();
    initializeUser((userInfo) => {
      this.uid = userInfo.uid;
      this.uuid = userInfo.uuid;
      console.log('User Info:', userInfo);
    });
  },
  methods: {
    getLocation() {
      // #ifdef H5
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            this.reverseGeocoding(position.coords.latitude, position.coords.longitude);
          },
          (error) => {
            console.error('H5定位错误:', error);
            this.city = '无法获取定位';
          }
        );
      } else {
        console.error('浏览器不支持定位');
        this.city = '无法获取定位';
      }
      // #endif

      // #ifdef APP-PLUS
      plus.geolocation.getCurrentPosition(
        (position) => {
          this.reverseGeocoding(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.error('APP定位错误:', error);
          this.city = '无法获取定位';
        },
        { geocode: true }
      );
      // #endif

      // #ifdef MP-WEIXIN
      wx.getLocation({
        type: 'gcj02',
        success: (res) => {
          this.reverseGeocoding(res.latitude, res.longitude);
        },
        fail: (error) => {
          console.error('微信小程序定位错误:', error);
          // 检查是否是权限问题
          if (error.errMsg.indexOf('auth deny') !== -1) {
            this.checkWxLocationAuth();
          } else {
            this.city = '无法获取定位';
          }
        }
      });
      // #endif
    },

    // 检查微信小程序定位权限
    checkWxLocationAuth() {
      // #ifdef MP-WEIXIN
      wx.getSetting({
        success: (res) => {
          if (!res.authSetting['scope.userLocation']) {
            wx.showModal({
              title: '需要开启定位权限',
              content: '请在设置中开启定位权限以获取您的位置信息',
              confirmText: '去设置',
              success: (modalRes) => {
                if (modalRes.confirm) {
                  wx.openSetting({
                    success: (settingRes) => {
                      if (settingRes.authSetting['scope.userLocation']) {
                        this.getLocation();
                      }
                    }
                  });
                }
              }
            });
          }
        }
      });
      // #endif
    },

    // 逆地理编码
    reverseGeocoding(latitude, longitude) {
      // #ifdef H5
      // 使用高德地图 Web API 进行逆地理编码
      const url = `https://restapi.amap.com/v3/geocode/regeo?key=aa167e521fc7617f0c0aba2a75fdba72&location=${longitude},${latitude}`;
      uni.request({
        url: url,
        success: (res) => {
          if (res.data.status === '1' && res.data.regeocode) {
            this.city = res.data.regeocode.addressComponent.city || res.data.regeocode.addressComponent.province;
          }
        },
        fail: () => {
          this.city = '无法获取城市信息';
        }
      });
      // #endif

      // #ifdef APP-PLUS
      plus.geolocation.getCurrentPosition(
        (position) => {
          if (position.address) {
            this.city = position.address.city || position.address.province;
          }
        },
        (error) => {
          console.error('APP逆地理编码错误:', error);
          this.city = '无法获取城市信息';
        },
        { geocode: true }
      );
      // #endif

      // #ifdef MP-WEIXIN
      wx.reverseGeocoder({
        location: {
          latitude: latitude,
          longitude: longitude
        },
        success: (res) => {
          if (res.result && res.result.address_component) {
            this.city = res.result.address_component.city || res.result.address_component.province;
          }
        },
        fail: (error) => {
          console.error('微信小程序逆地理编码错误:', error);
          this.city = '无法获取城市信息';
        }
      });
      // #endif
    },
    takePhoto() {
      uni.chooseImage({
        count: 1,
        sourceType: ['camera', 'album'],
        success: (res) => {
          const filePath = res.tempFilePaths[0];
          uploadImage(filePath, this.uid, this.uuid, this.openTalkPage);
        }
      });
    },
    scanCode() {
      uni.scanCode({
        success: (res) => {
          sendDataToServer(res.result, this.uid, this.uuid, this.openTalkPage);
        }
      });
    },
    openTalkPage(data) {
      if (!data) {
        console.error('Data is null or undefined');
        return;
      }
      try {
        const parsedData = JSON.parse(data);
        const chatGroupId = parsedData.chatGroupId;
        uni.setStorageSync(`conversation_${chatGroupId}`, data);
        uni.navigateTo({
          url: `/pages/talk/talk?chatGroupId=${chatGroupId}`
        });
      } catch (error) {
        console.error('Failed to parse data:', error);
      }
    },
    toggleSidebar() {
      this.$refs.sidebarNav.toggleSidebar();
    },
    toggleInputMode() {
      this.isVoiceMode = !this.isVoiceMode;
    },
    handleTextInput() {
      if (this.userInput.trim()) {
        this.sendTextMessage();
      }
    },
    sendTextMessage() {
      console.log('Sending message:', this.userInput);
      startConversation(this.uid, this.uuid, this.userInput)
        .then(data => {
          if (data.code === 200) {
            console.log('Conversation started:', data);
            this.openTalkPage(JSON.stringify(data.data));
          } else {
            console.error('Failed to start conversation:', data.data);
          }
        })
        .catch(error => {
          console.error('Error starting conversation:', error);
        });
      this.userInput = '';
    },
    startVoiceInput() {
      console.log('开始录音...');
    },
    endVoiceInput() {
      console.log('结束录音...');
    },
    openMediaOptions() {
      console.log('打开多媒体选项...');
    },
  }
}
</script>

<style lang="scss">
.ios-home-container {
  display: flex;
  flex-direction: column;
  background-color: var(--background-color);
  min-height: 100vh;
  padding-bottom: 80px;
}

.ios-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background-color: white;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.ios-logo {
  width: 70px;
  height: 40px;
}

.ios-location {
  display: flex;
  align-items: center;
  background-color: var(--background-color);
  padding: 4px 10px;
  border-radius: var(--border-radius-full);
}

.ios-location-icon {
  font-size: 16px;
  margin-right: 4px;
}

.ios-location-text {
  font-size: var(--font-size-small);
  color: var(--text-secondary);
}

.ios-header-button {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--border-radius-full);
}

.ios-header-button-icon {
  font-size: 20px;
  color: var(--text-primary);
}

.ios-welcome-card {
  margin: var(--spacing-medium);
}

.ios-welcome-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.ios-avatar {
  width: 80px;
  height: 80px;
  border-radius: var(--border-radius-full);
  margin-bottom: var(--spacing-medium);
}

.ios-welcome-title {
  font-size: var(--font-size-large);
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-small);
}

.ios-welcome-description {
  font-size: var(--font-size-normal);
  color: var(--text-secondary);
  line-height: 1.4;
}

.ios-features-grid {
  display: flex;
  flex-wrap: wrap;
  padding: 0 var(--spacing-medium);
  gap: var(--spacing-medium);
}

.ios-feature-card {
  flex: 1;
  min-width: calc(50% - var(--spacing-medium));
}

.ios-feature-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.ios-feature-icon {
  width: 60px;
  height: 60px;
  margin-bottom: var(--spacing-small);
}

.ios-feature-title {
  font-size: var(--font-size-normal);
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.ios-feature-description {
  font-size: var(--font-size-small);
  color: var(--text-secondary);
}

.ios-input-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  padding: 10px var(--spacing-medium);
  background-color: white;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  z-index: 100;
}

.ios-input-mode-button {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: var(--spacing-small);
  color: var(--text-secondary);
}

.ios-input-field {
  flex: 1;
  background-color: var(--background-color);
  border-radius: var(--border-radius-full);
  overflow: hidden;
}

.ios-text-input {
  width: 100%;
  height: 36px;
  padding: 0 var(--spacing-medium);
  font-size: var(--font-size-normal);
  border: none;
  background-color: transparent;
}

.ios-voice-button {
  width: 100%;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-normal);
  color: var(--text-secondary);
}

.ios-input-action {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: var(--spacing-small);
}

.ios-send-button {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--primary-color);
  color: white;
  border-radius: var(--border-radius-full);
}

.ios-more-button {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--background-color);
  color: var(--text-secondary);
  border-radius: var(--border-radius-full);
  font-size: 24px;
}
</style> 