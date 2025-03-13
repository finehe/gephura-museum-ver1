<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	@import './static/styles/global.scss';

	/* 全局样式重置 */
	page {
		font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Helvetica, 
					 Segoe UI, Arial, Roboto, 'PingFang SC', 'miui', 'Hiragino Sans GB', 
					 'Microsoft Yahei', sans-serif;
		color: var(--text-primary);
		font-size: var(--font-size-normal);
		line-height: 1.5;
		background-color: var(--background-color);
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}

	/* 移除按钮默认样式 */
	button {
		margin: 0;
		padding: 0;
		border: none;
		background: none;
		font-size: inherit;
		color: inherit;
		line-height: inherit;
	}

	/* 移除输入框默认样式 */
	input {
		outline: none;
	}
</style>
