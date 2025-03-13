<template>
  <view>
    <view class="sidebar" :class="{ open: isOpen }">
      <image src="/static/sidebar-logo.png" class="sidebar-logo" alt="Logo" />
      <view v-if="isOpen" class="sidebar-content">
        <button class="sidebar-button" @click="goToHistory">历史对话</button>
        <button class="sidebar-button" @click="startNewChat">+新对话</button>
        <button class="sidebar-button" @click="goToSettings">个人设置</button>
        
        <!-- 用户登录状态区域 -->
        <view class="user-section">
          <view v-if="isLoggedIn" class="user-info">
            <image class="user-avatar" :src="userInfo.avatarUrl || '/static/default-avatar.png'"></image>
            <view class="user-details">
              <text class="username">{{userInfo.nickname || '用户'}}</text>
              <button class="logout-button" @click="logout">退出登录</button>
            </view>
          </view>
          <view v-else class="login-button-container" @click="showLoginModal">
            <view class="login-avatar-circle">
              <text class="login-avatar-icon">👤</text>
            </view>
            <text class="login-text">立即登录</text>
          </view>
        </view>
      </view>
    </view>
    <view v-if="isOpen" class="overlay" @click="toggleSidebar"></view>
    
    <!-- 登录弹窗 -->
    <view v-if="showLoginDialog" class="login-modal-overlay">
      <view class="login-modal">
        <!-- 微信扫码登录 -->
        <view v-if="!isPasswordLogin">
          <view class="login-modal-header">
            <text class="login-modal-title">请微信扫码注册/登录</text>
            <text class="login-modal-close" @click="closeLoginModal">×</text>
          </view>
          <view class="login-modal-body">
            <image class="qrcode-image" src="/static/qrcode.png" mode="aspectFit"></image>
            <text class="wx-login-text">微信授权登录</text>
          </view>
          <view class="login-modal-footer">
            <text class="agreement-text">扫码登录即同意《灵马AI服务协议》</text>
            <text class="switch-login-mode" @click="switchToPasswordLogin">账号密码登录</text>
          </view>
        </view>
        
        <!-- 账号密码登录 -->
        <view v-else>
          <view class="login-modal-header">
            <text class="login-modal-title">灵马AI咨询平台账号登录</text>
            <text class="login-modal-close" @click="closeLoginModal">×</text>
          </view>
          <view class="login-modal-body password-login-body">
            <view class="input-group">
              <text class="input-label required">账号</text>
              <input class="login-input" type="text" v-model="loginForm.username" placeholder="请输入账号" />
            </view>
            <view class="input-group">
              <text class="input-label required">密码</text>
              <input class="login-input" type="password" v-model="loginForm.password" placeholder="请输入密码" />
            </view>
            <view class="agreement-checkbox">
              <checkbox :checked="loginForm.agreement" @change="e => loginForm.agreement = e.detail.value" color="#007bff" />
              <text class="agreement-label">同意《灵马AI服务协议》</text>
            </view>
            <button class="submit-button" @click="submitLogin">立即登录</button>
          </view>
          <view class="login-modal-footer">
            <text class="switch-login-mode" @click="switchToWechatLogin">切换微信登录</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { getToken, initializeUser } from '@/utils/api.js';

export default {
  name: 'SidebarNav',
  data() {
    return {
      isOpen: false,
      isLoggedIn: false,
      userInfo: {},
      showLoginDialog: false,
      isPasswordLogin: false,
      loginForm: {
        username: '',
        password: '',
        agreement: false
      }
    };
  },
  created() {
    this.checkLoginStatus();
  },
  methods: {
    checkLoginStatus() {
      const token = getToken();
      this.isLoggedIn = !!token;
      if (this.isLoggedIn) {
        this.getUserInfo();
      }
    },
    getUserInfo() {
      const userInfo = uni.getStorageSync('userInfo');
      if (userInfo) {
        this.userInfo = userInfo;
      } else {
        initializeUser((userInfo) => {
          this.userInfo = userInfo;
        });
      }
    },
    toggleSidebar() {
      this.isOpen = !this.isOpen;
    },
    goToHistory() {
      uni.navigateTo({
        url: '/pages/history/history'
      });
    },
    startNewChat() {
      uni.navigateTo({
        url: '/pages/home/home'
      });
    },
    goToSettings() {
      uni.navigateTo({
        url: '/pages/settings/settings'
      });
    },
    showLoginModal() {
      this.isOpen = false;
      this.showLoginDialog = true;
      this.isPasswordLogin = false;
    },
    closeLoginModal() {
      this.showLoginDialog = false;
      this.loginForm = {
        username: '',
        password: '',
        agreement: false
      };
    },
    switchToPasswordLogin() {
      this.isPasswordLogin = true;
    },
    switchToWechatLogin() {
      this.isPasswordLogin = false;
    },
    submitLogin() {
      if (!this.loginForm.username) {
        uni.showToast({
          title: '请输入账号',
          icon: 'none'
        });
        return;
      }
      if (!this.loginForm.password) {
        uni.showToast({
          title: '请输入密码',
          icon: 'none'
        });
        return;
      }
      if (!this.loginForm.agreement) {
        uni.showToast({
          title: '请同意服务协议',
          icon: 'none'
        });
        return;
      }

      // 这里添加账号密码登录的逻辑
      uni.showLoading({
        title: '登录中...'
      });
      
      // 模拟登录请求，实际项目中应该调用真实的登录API
      setTimeout(() => {
        uni.hideLoading();
        // 登录成功后的处理
        const mockUserInfo = {
          uid: '123456',
          uuid: 'user-123456',
          nickname: '测试用户',
          avatarUrl: '',
          token: 'mock-token',
          tokenExpire: 7 * 24 * 60 * 60 * 1000 // 7天
        };
        
        uni.setStorageSync('userInfo', mockUserInfo);
        uni.setStorageSync('token', mockUserInfo.token);
        uni.setStorageSync('tokenExpire', Date.now() + mockUserInfo.tokenExpire);
        
        this.isLoggedIn = true;
        this.userInfo = mockUserInfo;
        this.closeLoginModal();
        
        uni.showToast({
          title: '登录成功',
          icon: 'success'
        });
      }, 1500);
    },
    login() {
      // 跳转到登录页面
      uni.navigateTo({
        url: '/pages/login/login'
      });
    },
    logout() {
      // 清除用户登录信息
      uni.removeStorageSync('token');
      uni.removeStorageSync('tokenExpire');
      uni.removeStorageSync('userInfo');
      this.isLoggedIn = false;
      this.userInfo = {};
      uni.showToast({
        title: '已退出登录',
        icon: 'none'
      });
    }
  }
}
</script>

<style>
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: 250px;
  height: 100%;
  background-color: #fff;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  transform: translateX(-100%);
  transition: transform 0.3s ease;
  z-index: 1000;
  display: flex;
  flex-direction: column;
}

.sidebar.open {
  transform: translateX(0);
}

.sidebar-logo {
  width: 70px;
  height: 40px;
  margin: 20px;
  box-sizing: border-box;
}

.sidebar-content {
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.sidebar-button {
  display: block;
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  text-align: left;
  background-color: #f5f5f5;
  border: none;
  cursor: pointer;
  font-size: 16px;
}

.sidebar-button:hover {
  background-color: #e0e0e0;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
}

/* 用户登录状态区域样式 */
.user-section {
  margin-top: auto;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.user-info {
  display: flex;
  align-items: center;
  padding: 10px 0;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
}

.user-details {
  flex: 1;
}

.username {
  font-size: 16px;
  font-weight: bold;
  display: block;
  margin-bottom: 5px;
}

/* 新样式的登录按钮 */
.login-button-container {
  display: flex;
  align-items: center;
  background-color: #e6f1fc;
  border-radius: 30px;
  padding: 8px 15px;
  cursor: pointer;
  margin: 10px 0;
}

.login-avatar-circle {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #007bff;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin-right: 10px;
}

.login-avatar-icon {
  font-size: 18px;
}

.login-text {
  color: #007bff;
  font-size: 14px;
}

.logout-button {
  width: 100%;
  padding: 8px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  margin-top: 5px;
  background-color: #f0f0f0;
  color: #333;
}

/* 登录弹窗样式 */
.login-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1100;
}

.login-modal {
  width: 80%;
  max-width: 360px;
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.login-modal-header {
  position: relative;
  padding: 15px;
  text-align: center;
  border-bottom: 1px solid #eee;
}

.login-modal-title {
  font-size: 18px;
  font-weight: bold;
}

.login-modal-close {
  position: absolute;
  right: 15px;
  top: 15px;
  font-size: 24px;
  color: #999;
  cursor: pointer;
}

.login-modal-body {
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.password-login-body {
  padding: 20px;
  align-items: stretch;
}

.qrcode-image {
  width: 200px;
  height: 200px;
  margin-bottom: 15px;
}

.wx-login-text {
  font-size: 16px;
  color: #666;
  margin-bottom: 10px;
}

.login-modal-footer {
  padding: 15px;
  text-align: center;
  border-top: 1px solid #eee;
}

.agreement-text {
  font-size: 12px;
  color: #999;
  display: block;
  margin-bottom: 10px;
}

.switch-login-mode {
  font-size: 14px;
  color: #007bff;
  cursor: pointer;
}

/* 账号密码登录样式 */
.input-group {
  margin-bottom: 15px;
  width: 100%;
}

.input-label {
  display: block;
  margin-bottom: 5px;
  font-size: 14px;
  color: #333;
}

.required:before {
  content: "*";
  color: #f00;
  margin-right: 2px;
}

.login-input {
  width: 100%;
  height: 40px;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 0 10px;
  font-size: 14px;
  box-sizing: border-box;
}

.agreement-checkbox {
  display: flex;
  align-items: center;
  margin: 15px 0;
  width: 100%;
}

.agreement-label {
  font-size: 14px;
  color: #333;
  margin-left: 5px;
}

.submit-button {
  width: 100%;
  height: 40px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  margin-top: 10px;
}
</style> 