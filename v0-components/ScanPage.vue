<template>
	<view class="scan-page">
		<!-- 顶部导航栏 -->
		<view class="header">
			<text class="app-title">灵马 AI</text>
			<view class="settings-btn" @tap="goToSettings">
				<text class="icon">⚙️</text>
			</view>
		</view>
		
		<!-- 扫描区域 -->
		<view class="scan-container">
			<view class="scan-frame">
				<!-- 这里将集成相机组件 -->
				<view class="camera-placeholder">
					<text class="camera-text">相机预览区域</text>
				</view>
				
				<!-- 扫描框 -->
				<view class="scan-box">
					<view class="corner top-left"></view>
					<view class="corner top-right"></view>
					<view class="corner bottom-left"></view>
					<view class="corner bottom-right"></view>
				</view>
				
				<!-- 扫描提示 -->
				<text class="scan-tip">将二维码/物品放入框内，自动识别</text>
			</view>
		</view>
		
		<!-- 底部控制区 -->
		<view class="controls">
			<!-- 模式切换 -->
			<view class="mode-switch">
				<view :class="['mode-btn', scanMode === 'qrcode' ? 'active' : '']" @tap="switchMode('qrcode')">
					<text>二维码</text>
				</view>
				<view :class="['mode-btn', scanMode === 'image' ? 'active' : '']" @tap="switchMode('image')">
					<text>图像识别</text>
				</view>
			</view>
			
			<!-- 功能按钮 -->
			<view class="function-btns">
				<view class="function-btn" @tap="toggleFlash">
					<text class="icon">💡</text>
					<text class="btn-text">闪光灯</text>
				</view>
				<view class="function-btn" @tap="goToHistory">
					<text class="icon">📜</text>
					<text class="btn-text">历史记录</text>
				</view>
				<view class="function-btn" @tap="goToAI">
					<text class="icon">🤖</text>
					<text class="btn-text">AI 助手</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				scanMode: 'qrcode', // 'qrcode' 或 'image'
				flashOn: false
			}
		},
		onLoad() {
			// 页面加载时的逻辑
			uni.setNavigationBarTitle({
				title: '灵马 AI'
			});
		},
		methods: {
			switchMode(mode) {
				this.scanMode = mode;
			},
			toggleFlash() {
				this.flashOn = !this.flashOn;
				// 这里添加控制闪光灯的代码
			},
			goToHistory() {
				uni.navigateTo({
					url: '/pages/history/history'
				});
			},
			goToSettings() {
				uni.navigateTo({
					url: '/pages/settings/settings'
				});
			},
			goToAI() {
				uni.navigateTo({
					url: '/pages/talk/talk'
				});
			}
		}
	}
</script>

<style>
	.scan-page {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
		background-color: #1a1a1a;
		color: #e0e0e0;
	}

	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20rpx 30rpx;
		height: 80rpx;
	}

	.app-title {
		font-size: 36rpx;
		color: #d4af37;
		font-weight: bold;
	}

	.settings-btn {
		width: 60rpx;
		height: 60rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.scan-container {
		flex: 1;
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 30rpx;
	}

	.scan-frame {
		position: relative;
		width: 600rpx;
		height: 600rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.camera-placeholder {
		width: 100%;
		height: 100%;
		background-color: #2a2a2a;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 20rpx;
	}

	.camera-text {
		color: #888;
		font-size: 28rpx;
	}

	.scan-box {
		position: absolute;
		width: 70%;
		height: 70%;
		border: 2px dashed #4CAF50;
	}

	.corner {
		position: absolute;
		width: 30rpx;
		height: 30rpx;
		border-color: #4CAF50;
		border-style: solid;
	}

	.top-left {
		top: 0;
		left: 0;
		border-width: 4rpx 0 0 4rpx;
	}

	.top-right {
		top: 0;
		right: 0;
		border-width: 4rpx 4rpx 0 0;
	}

	.bottom-left {
		bottom: 0;
		left: 0;
		border-width: 0 0 4rpx 4rpx;
	}

	.bottom-right {
		bottom: 0;
		right: 0;
		border-width: 0 4rpx 4rpx 0;
	}

	.scan-tip {
		position: absolute;
		bottom: -60rpx;
		font-size: 24rpx;
		color: #e0e0e0;
		text-align: center;
		width: 100%;
	}

	.controls {
		padding: 30rpx;
		margin-top: 80rpx;
	}

	.mode-switch {
		display: flex;
		justify-content: center;
		background-color: #2a2a2a;
		border-radius: 100rpx;
		padding: 10rpx;
		margin-bottom: 40rpx;
	}

	.mode-btn {
		padding: 15rpx 40rpx;
		border-radius: 100rpx;
		margin: 0 10rpx;
	}

	.mode-btn.active {
		background-color: #d4af37;
		color: #1a1a1a;
	}

	.function-btns {
		display: flex;
		justify-content: space-around;
		margin-top: 30rpx;
	}

	.function-btn {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.icon {
		font-size: 48rpx;
		margin-bottom: 10rpx;
	}

	.btn-text {
		font-size: 24rpx;
		color: #d4af37;
	}
</style> 