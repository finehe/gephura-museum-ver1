<template>
	<view class="result-page">
		<!-- 顶部导航栏 -->
		<view class="header">
			<view class="back-btn" @tap="goBack">
				<text class="icon">←</text>
			</view>
			<text class="page-title">识别结果</text>
			<view class="share-btn" @tap="shareResult">
				<text class="icon">↗️</text>
			</view>
		</view>
		
		<!-- 识别图片区域 -->
		<view class="image-container">
			<image class="result-image" :src="resultData.imageUrl" mode="aspectFill"></image>
		</view>
		
		<!-- 结果信息区域 -->
		<view class="result-container">
			<!-- 主要信息 -->
			<view class="result-header">
				<view class="result-title-container">
					<text class="result-title">{{ resultData.title }}</text>
					<view class="favorite-btn" @tap="toggleFavorite">
						<text class="icon" :class="{ 'active': isFavorite }">{{ isFavorite ? '★' : '☆' }}</text>
					</view>
				</view>
				<text class="result-category">{{ resultData.category }}</text>
			</view>
			
			<!-- 详细信息 -->
			<view class="result-details">
				<text class="section-title">详细信息</text>
				<text class="result-description">{{ resultData.description }}</text>
			</view>
			
			<!-- AI 分析 -->
			<view class="ai-analysis">
				<view class="section-header">
					<text class="section-title">AI 分析</text>
					<view class="ai-badge">
						<text class="ai-badge-text">灵马 AI</text>
					</view>
				</view>
				<text class="ai-text">{{ resultData.aiAnalysis }}</text>
			</view>
			
			<!-- 相关推荐 -->
			<view class="recommendations">
				<text class="section-title">相关推荐</text>
				<scroll-view class="recommendation-scroll" scroll-x="true">
					<view class="recommendation-list">
						<view class="recommendation-item" v-for="(item, index) in resultData.recommendations" :key="index" @tap="viewRecommendation(item)">
							<image class="recommendation-image" :src="item.imageUrl" mode="aspectFill"></image>
							<text class="recommendation-title">{{ item.title }}</text>
						</view>
					</view>
				</scroll-view>
			</view>
		</view>
		
		<!-- 底部操作栏 -->
		<view class="action-bar">
			<view class="action-btn primary" @tap="askAI">
				<text class="icon">🤖</text>
				<text class="btn-text">询问 AI</text>
			</view>
			<view class="action-btn" @tap="viewMore">
				<text class="icon">🔍</text>
				<text class="btn-text">查看更多</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				resultId: null,
				isFavorite: false,
				resultData: {
					imageUrl: '/static/result-placeholder.jpg',
					title: '示例识别结果',
					category: '艺术品 / 雕塑',
					description: '这是一个详细的描述，介绍识别对象的背景、历史、特点等信息。这里可以包含多段文字，提供丰富的信息内容。',
					aiAnalysis: '根据图像分析，这件作品创作于20世纪初期，属于现代主义风格。作品展现了艺术家对形式和空间的独特理解，通过简化的几何形态表达深层次的情感。材质可能是青铜或类似金属，表面处理显示出精湛的工艺。',
					recommendations: [
						{
							id: 1,
							title: '相关作品1',
							imageUrl: '/static/recommendation1.jpg'
						},
						{
							id: 2,
							title: '相关作品2',
							imageUrl: '/static/recommendation2.jpg'
						},
						{
							id: 3,
							title: '相关作品3',
							imageUrl: '/static/recommendation3.jpg'
						},
						{
							id: 4,
							title: '相关作品4',
							imageUrl: '/static/recommendation4.jpg'
						}
					]
				}
			}
		},
		onLoad(options) {
			// 获取传递的参数
			if (options.id) {
				this.resultId = options.id;
				// 这里应该根据ID加载实际数据
				this.loadResultData(this.resultId);
			}
		},
		methods: {
			loadResultData(id) {
				// 这里应该是从API获取数据的逻辑
				// 示例中使用的是假数据
				console.log('加载ID为', id, '的结果数据');
			},
			goBack() {
				uni.navigateBack();
			},
			shareResult() {
				uni.showShareMenu({
					withShareTicket: true,
					success() {
						console.log('打开分享菜单成功');
					},
					fail() {
						console.log('打开分享菜单失败');
						// 降级处理
						uni.showToast({
							title: '分享功能暂不可用',
							icon: 'none'
						});
					}
				});
			},
			toggleFavorite() {
				this.isFavorite = !this.isFavorite;
				// 这里应该有保存收藏状态的逻辑
				if (this.isFavorite) {
					uni.showToast({
						title: '已添加到收藏',
						icon: 'success'
					});
				} else {
					uni.showToast({
						title: '已取消收藏',
						icon: 'none'
					});
				}
			},
			viewRecommendation(item) {
				// 跳转到推荐项目的详情页
				uni.navigateTo({
					url: `/pages/result/result?id=${item.id}`
				});
			},
			askAI() {
				// 跳转到AI对话页面
				uni.navigateTo({
					url: `/pages/talk/talk?subject=${encodeURIComponent(this.resultData.title)}`
				});
			},
			viewMore() {
				// 查看更多相关信息
				uni.showToast({
					title: '加载更多信息...',
					icon: 'loading'
				});
				// 这里应该有加载更多信息的逻辑
			}
		}
	}
</script>

<style>
	.result-page {
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

	.back-btn, .share-btn {
		width: 60rpx;
		height: 60rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.page-title {
		font-size: 32rpx;
		color: #d4af37;
		font-weight: bold;
	}

	.image-container {
		width: 100%;
		height: 500rpx;
		overflow: hidden;
	}

	.result-image {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.result-container {
		flex: 1;
		padding: 30rpx;
	}

	.result-header {
		margin-bottom: 30rpx;
	}

	.result-title-container {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 10rpx;
	}

	.result-title {
		font-size: 36rpx;
		color: #d4af37;
		font-weight: bold;
	}

	.favorite-btn {
		padding: 10rpx;
	}

	.favorite-btn .icon {
		font-size: 40rpx;
		color: #888;
	}

	.favorite-btn .icon.active {
		color: #d4af37;
	}

	.result-category {
		font-size: 24rpx;
		color: #888;
	}

	.result-details, .ai-analysis, .recommendations {
		margin-bottom: 40rpx;
	}

	.section-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 15rpx;
	}

	.section-title {
		font-size: 28rpx;
		color: #d4af37;
		margin-bottom: 15rpx;
		font-weight: bold;
	}

	.result-description, .ai-text {
		font-size: 26rpx;
		line-height: 1.6;
		color: #e0e0e0;
	}

	.ai-badge {
		background-color: #2a2a2a;
		padding: 6rpx 16rpx;
		border-radius: 20rpx;
	}

	.ai-badge-text {
		font-size: 20rpx;
		color: #d4af37;
	}

	.recommendation-scroll {
		width: 100%;
	}

	.recommendation-list {
		display: flex;
		padding: 10rpx 0;
	}

	.recommendation-item {
		margin-right: 20rpx;
		width: 200rpx;
	}

	.recommendation-image {
		width: 200rpx;
		height: 150rpx;
		border-radius: 10rpx;
		margin-bottom: 10rpx;
	}

	.recommendation-title {
		font-size: 22rpx;
		color: #e0e0e0;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.action-bar {
		display: flex;
		padding: 20rpx 30rpx;
		border-top: 1px solid #2a2a2a;
	}

	.action-btn {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 15rpx 0;
	}

	.action-btn.primary {
		background-color: #2a2a2a;
		border-radius: 10rpx;
		margin-right: 20rpx;
	}

	.action-btn .icon {
		font-size: 40rpx;
		margin-bottom: 10rpx;
	}

	.action-btn .btn-text {
		font-size: 24rpx;
		color: #d4af37;
	}
</style> 