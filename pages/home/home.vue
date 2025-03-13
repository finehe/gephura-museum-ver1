<template>
  <view class="home-container">
    <!-- 顶部导航栏 -->
    <view class="header">
      <image src="/static/logo.png" class="logo" mode="aspectFit"></image>
      <view class="location">
        <text class="location-icon">📍</text>
        <text class="location-text">{{ city }}</text>
      </view>
      <view class="header-button" @click="toggleSidebar">
        <text class="header-button-icon">☰</text>
      </view>
    </view>
    
    <!-- 欢迎卡片 -->
    <base-card class="welcome-card" shadow hover>
      <template #header>
        <view class="welcome-header">
          <text class="welcome-title">欢迎来到格普拉博物馆</text>
        </view>
      </template>
      <view class="welcome-content">
        <image src="/static/large-logo.png" class="avatar" mode="aspectFit"></image>
        <text class="welcome-subtitle">Hi，我是你的导游助手</text>
        <text class="welcome-description">
          我精通博物馆、植物馆、动物园、天体、物理、文化、体育、古今中外...
        </text>
        <base-button class="start-button" type="primary" @click="startExploring">开始探索</base-button>
      </view>
    </base-card>
    
    <!-- 功能卡片 -->
    <view class="features-grid">
      <base-card class="feature-card" shadow hover @click="takePhoto">
        <view class="feature-content">
          <image src="/static/photo-icon.png" class="feature-icon" mode="aspectFit"></image>
          <text class="feature-title">拍一下</text>
          <text class="feature-description">拍照识别展品</text>
        </view>
      </base-card>
      
      <base-card class="feature-card" shadow hover @click="scanCode">
        <view class="feature-content">
          <image src="/static/scan-icon.png" class="feature-icon" mode="aspectFit"></image>
          <text class="feature-title">扫一扫</text>
          <text class="feature-description">扫码了解详情</text>
        </view>
      </base-card>
    </view>
    
    <!-- 热门展览 -->
    <view class="exhibitions-section">
      <text class="section-title">热门展览</text>
      <scroll-view scroll-x class="exhibitions-scroll">
        <view class="exhibitions-container">
          <base-card v-for="(exhibition, index) in exhibitions" :key="index" class="exhibition-card" shadow hover>
            <view class="exhibition-content">
              <image :src="exhibition.image" class="exhibition-image" mode="aspectFill"></image>
              <view class="exhibition-info">
                <text class="exhibition-title">{{ exhibition.title }}</text>
                <text class="exhibition-date">{{ exhibition.date }}</text>
              </view>
            </view>
          </base-card>
        </view>
      </scroll-view>
    </view>
    
    <!-- 侧边栏组件 -->
    <SidebarNav ref="sidebarNav" />
    
    <!-- 底部输入框 -->
    <view class="input-footer">
      <view class="input-mode-button" @click="toggleInputMode">
        <text>{{ isVoiceMode ? '键盘' : '语音' }}</text>
      </view>
      
      <view class="input-field">
        <base-input 
          v-if="!isVoiceMode" 
          v-model="userInput" 
          placeholder="有什么想问的..." 
          clearable
          @keyup.enter="handleTextInput"
        />
        <view 
          v-else 
          class="voice-button"
          @touchstart="startVoiceInput" 
          @touchend="endVoiceInput"
        >
          <text>按住说话</text>
        </view>
      </view>
      
      <view class="input-action">
        <base-button v-if="userInput.trim()" type="primary" round @click="sendTextMessage">
          发送
        </base-button>
        <base-button v-else type="secondary" round @click="openMediaOptions">
          +
        </base-button>
      </view>
    </view>
  </view>
</template>

<script>
import SidebarNav from '@/components/SidebarNav.vue';
import BaseCard from '@/components/BaseCard.vue';
import BaseButton from '@/components/BaseButton.vue';
import BaseInput from '@/components/BaseInput.vue';
import { initializeUser, uploadImage, sendDataToServer, startConversation } from '@/utils/api.js';

export default {
  components: {
    SidebarNav,
    BaseCard,
    BaseButton,
    BaseInput
  },
  data() {
    return {
      city: '定位中...',
      uid: 0,
      uuid: '',
      userInput: '',
      isVoiceMode: false,
      exhibitions: [
        {
          title: '古代文明展',
          date: '2025.03.15 - 2025.06.15',
          image: '/static/exhibition1.jpg'
        },
        {
          title: '现代艺术展',
          date: '2025.03.20 - 2025.07.10',
          image: '/static/exhibition2.jpg'
        },
        {
          title: '科技创新展',
          date: '2025.04.01 - 2025.08.01',
          image: '/static/exhibition3.jpg'
        }
      ]
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
      // 简化版本，使用统一的API
      uni.request({
        url: `https://restapi.amap.com/v3/geocode/regeo?key=aa167e521fc7617f0c0aba2a75fdba72&location=${longitude},${latitude}`,
        success: (res) => {
          if (res.data.status === '1' && res.data.regeocode) {
            this.city = res.data.regeocode.addressComponent.city || res.data.regeocode.addressComponent.province;
          }
        },
        fail: () => {
          this.city = '无法获取城市信息';
        }
      });
    },
    
    startExploring() {
      uni.navigateTo({
        url: '/pages/talk/talk'
      });
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
          console.log('扫码结果:', res);
          if (res.result) {
            this.handleScanResult(res.result);
          }
        }
      });
    },
    
    handleScanResult(result) {
      // 处理扫码结果
      startConversation(result, this.uid, this.uuid, this.openTalkPage);
    },
    
    openTalkPage(conversationId) {
      uni.navigateTo({
        url: `/pages/talk/talk?id=${conversationId}`
      });
    },
    
    toggleSidebar() {
      this.$refs.sidebarNav.toggle();
    },
    
    toggleInputMode() {
      this.isVoiceMode = !this.isVoiceMode;
    },
    
    handleTextInput(e) {
      if (this.userInput.trim()) {
        this.sendTextMessage();
      }
    },
    
    sendTextMessage() {
      if (this.userInput.trim()) {
        startConversation(this.userInput, this.uid, this.uuid, this.openTalkPage);
        this.userInput = '';
      }
    },
    
    startVoiceInput() {
      console.log('开始语音输入');
      // 实现语音输入逻辑
    },
    
    endVoiceInput() {
      console.log('结束语音输入');
      // 实现语音输入结束逻辑
    },
    
    openMediaOptions() {
      uni.showActionSheet({
        itemList: ['拍照', '从相册选择', '扫一扫'],
        success: (res) => {
          switch (res.tapIndex) {
            case 0:
              this.takePhoto();
              break;
            case 1:
              this.chooseFromAlbum();
              break;
            case 2:
              this.scanCode();
              break;
          }
        }
      });
    },
    
    chooseFromAlbum() {
      uni.chooseImage({
        count: 1,
        sourceType: ['album'],
        success: (res) => {
          const filePath = res.tempFilePaths[0];
          uploadImage(filePath, this.uid, this.uuid, this.openTalkPage);
        }
      });
    }
  }
}
</script>

<style lang="scss">
@import '@/uni.scss';

.home-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: $bg-secondary;
  padding-bottom: 80px; // 为底部输入框留出空间
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: $spacing-4;
  background-color: $bg-primary;
  box-shadow: $shadow-sm;
  position: sticky;
  top: 0;
  z-index: $z-30;
}

.logo {
  width: 120px;
  height: 40px;
}

.location {
  display: flex;
  align-items: center;
  background-color: $bg-tertiary;
  padding: $spacing-1 $spacing-2;
  border-radius: $radius-full;
}

.location-icon {
  margin-right: $spacing-1;
}

.location-text {
  font-size: $text-sm;
  color: $text-secondary;
}

.header-button {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: $radius-full;
  background-color: $bg-tertiary;
  
  &:active {
    background-color: darken($bg-tertiary, 5%);
  }
}

.welcome-card {
  margin: $spacing-4;
}

.welcome-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.welcome-title {
  font-size: $text-xl;
  font-weight: $font-bold;
  color: $text-primary;
}

.welcome-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: $radius-full;
  margin-bottom: $spacing-4;
}

.welcome-subtitle {
  font-size: $text-lg;
  font-weight: $font-semibold;
  color: $text-primary;
  margin-bottom: $spacing-2;
}

.welcome-description {
  font-size: $text-base;
  color: $text-secondary;
  margin-bottom: $spacing-4;
  line-height: $leading-relaxed;
}

.start-button {
  width: 80%;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: $spacing-4;
  padding: 0 $spacing-4;
  margin-bottom: $spacing-6;
}

.feature-card {
  height: 100%;
}

.feature-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: $spacing-2;
}

.feature-icon {
  width: 60px;
  height: 60px;
  margin-bottom: $spacing-2;
}

.feature-title {
  font-size: $text-lg;
  font-weight: $font-semibold;
  color: $text-primary;
  margin-bottom: $spacing-1;
}

.feature-description {
  font-size: $text-sm;
  color: $text-secondary;
}

.exhibitions-section {
  padding: 0 $spacing-4;
  margin-bottom: $spacing-6;
}

.section-title {
  font-size: $text-xl;
  font-weight: $font-bold;
  color: $text-primary;
  margin-bottom: $spacing-4;
}

.exhibitions-scroll {
  width: 100%;
}

.exhibitions-container {
  display: flex;
  padding: $spacing-2 0;
}

.exhibition-card {
  width: 250px;
  margin-right: $spacing-4;
  flex-shrink: 0;
}

.exhibition-content {
  display: flex;
  flex-direction: column;
}

.exhibition-image {
  width: 100%;
  height: 150px;
  border-radius: $radius-md;
  margin-bottom: $spacing-2;
}

.exhibition-info {
  padding: $spacing-2;
}

.exhibition-title {
  font-size: $text-base;
  font-weight: $font-semibold;
  color: $text-primary;
  margin-bottom: $spacing-1;
}

.exhibition-date {
  font-size: $text-sm;
  color: $text-tertiary;
}

.input-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  padding: $spacing-3;
  background-color: $bg-primary;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
  z-index: $z-40;
}

.input-mode-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: $radius-full;
  background-color: $bg-tertiary;
  margin-right: $spacing-2;
  
  &:active {
    background-color: darken($bg-tertiary, 5%);
  }
}

.input-field {
  flex: 1;
  margin-right: $spacing-2;
}

.voice-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 40px;
  border-radius: $radius-md;
  background-color: $bg-tertiary;
  color: $text-secondary;
  
  &:active {
    background-color: darken($bg-tertiary, 5%);
  }
}

.input-action {
  width: 40px;
}
</style> 