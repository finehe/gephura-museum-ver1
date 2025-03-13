<template>
  <view class="settings-container">
    <view class="settings-header">
      <text class="title">个人设置</text>
      <button class="toggle-sidebar-button" @click="toggleSidebar">☰</button>
    </view>
    <text class="description">
      为了能够提供更加符合您个性化需求的解说，请提供基础调研信息
    </text>
    <view class="option-group">
      <text class="option-title">文化水平</text>
      <view class="options">
        <button
          v-for="level in educationLevels"
          :key="level"
          :class="['option-button', { selected: selectedEducation === level }]"
          @click="selectEducation(level)"
        >
          {{ level }}
        </button>
      </view>
    </view>
    <view class="option-group">
      <text class="option-title">每段解说默认时常</text>
      <view class="options">
        <button
          v-for="duration in durations"
          :key="duration"
          :class="['option-button', { selected: selectedDuration === duration }]"
          @click="selectDuration(duration)"
        >
          {{ duration }}
        </button>
      </view>
    </view>
    <view class="option-group">
      <text class="option-title">声音</text>
      <view class="options">
        <button
          v-for="voice in voices"
          :key="voice"
          :class="['option-button', { selected: selectedVoice === voice }]"
          @click="selectVoice(voice)"
        >
          {{ voice }}
        </button>
      </view>
    </view>
    <button class="confirm-button">确认</button>
    <SidebarNav ref="sidebarNav" />
  </view>
</template>

<script>
import SidebarNav from '@/components/SidebarNav.vue';

export default {
  name: 'Settings',
  components: {
    SidebarNav
  },
  data() {
    return {
      educationLevels: ['幼儿园', '小学', '初中', '高中及以上'],
      durations: ['2分钟', '5分钟', '10分钟'],
      voices: ['男声', '女生', '童声'],
      selectedEducation: '',
      selectedDuration: '',
      selectedVoice: ''
    };
  },
  methods: {
    toggleSidebar() {
      if (this.$refs.sidebarNav) {
        this.$refs.sidebarNav.toggleSidebar();
      } else {
        console.error('SidebarNav component not found');
      }
    },
    selectEducation(level) {
      this.selectedEducation = level;
    },
    selectDuration(duration) {
      this.selectedDuration = duration;
    },
    selectVoice(voice) {
      this.selectedVoice = voice;
    }
  }
};
</script>

<style>
.settings-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f5f5f5;
  padding: 20px;
}
.settings-header {
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
.description {
  font-size: 14px;
  text-align: center;
  margin-bottom: 20px;
  white-space: normal;
}
.option-group {
  margin-bottom: 20px;
  width: 100%;
}
.option-title {
  font-size: 16px;
  margin-bottom: 10px;
}
.options {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
}
.option-button {
  padding: 2px;
  border: 1px solid #ccc;
  border-radius: 5px;
  color: #666;
  background-color: #fff;
  cursor: pointer;
  height: 40px;
  width: 100%;
  white-space: nowrap;
  display: flex;
  align-items: center;
  justify-content: center;
}
.option-button.selected {
  border-color: #4a90e2;
  color: #4a90e2;
}
.confirm-button {
  width: 100%;
  padding: 5px;
  background-color: #4a90e2;
  color: #fff;
  text-align: center;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-size: 16px;
}
</style> 