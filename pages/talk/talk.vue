<template>
	<view class="container">
		<view class="mode">
			<button class="mode-toggle-button" @click="toggleMode">
				{{ isNarrationMode ? '解说模式' : '对话模式' }}
			</button>
		</view>
		<view class="conversation-container" v-for="(value,key) in conversation" :key="key">
			<view class="user-ask">
				<view class="user-ask-title">{{value.ask}}</view>
			</view>

			<view class="user-ask-content" :data-chat-log-id="value.chatLogId">
				<ua-markdown v-if="value.content" :source="value.content" />
			</view>
			<cover-view class="audio-button" v-if="value.content" @click="toggleAudio(value.chatLogId)">
				{{ isPlaying&&value.chatLogId===currentPlayId ? '停止' : '播放' }}
			</cover-view>
		</view>
		<view>
			<view style="display: none;">
				<video id="audioPlayer" :src="this.audioSrc" controls></video>
			</view>
		</view>

		<!-- 微信风格的输入框 -->
		<view class="input-container">
			<button @click="toggleInputMode" class="input-mode-button">
				{{ isVoiceMode ? '键盘' : '语音' }}
			</button>
			<view class="input-area">
				<input v-if="!isVoiceMode" type="text" v-model="userInput" placeholder="输入文字" @keyup.enter="handleTextInput" />
				<button v-else @touchstart="startVoiceInput" @touchend="endVoiceInput" class="voice-input-button">按住说话</button>
			</view>
			<button v-if="userInput.trim()" @click="sendTextMessage" class="send-button">发送</button>
			<button v-else @click="openMediaOptions" class="media-button">+</button>
		</view>

		<SidebarNav ref="sidebarNav" />
	</view>
</template>

<script>
	import SidebarNav from '@/components/SidebarNav.vue';
	import {
		initializeUser,
		initializeWebSocket,
		closeWebSocket,
		talk,
		callAudio,
		uploadText,
		getChatDetail
	} from '@/utils/api.js';

	export default {
		components: {
			SidebarNav
		},
		data() {
			return {
				conversation: [],
				audioQueue: [],
				audioPlayer: null,
				sourceBuffer: null,
				mediaSource: null,
				audioSrc: '',
				uid: 0,
				uuid: '',
				title: '',
				chatGroupId: 0,
				currentPlayId: '', // 用于存储当前正在播放的信息id
				userInput: '', // 用于存储用户输入
				isVoiceMode: false, // 控制输入模式
				isPlaying: false, // 用于跟踪音频播放状态
				isNarrationMode: true, // 初始为解说模式
				innerAudioContext: null, // 新增 innerAudioContext
				audioBuffer: [], // 用于存储音频数据的缓冲区
				wxAudioCtx: null, // 小程序语音播放
				wxAudioSource: null, // 小程序语音播放缓冲区
				bufferTotalLen: 0, // 音频缓冲区个数
			};
		},

		mounted() {
			// 监听键盘事件
			if (process.env.VUE_APP_PLATFORM === 'h5') {
				window.addEventListener('resize', this.adjustInputPosition);
			} else if (process.env.VUE_APP_PLATFORM === 'mp-weixin') {
				wx.onKeyboardHeightChange(res => {
					this.adjustInputPosition(res.height);
				});
			} else {
				// App平台
				uni.onKeyboardHeightChange(res => {
					this.adjustInputPosition(res.height);
				});
			}
			// #ifdef MP-WEIXIN
			this.wxAudioCtx = wx.createWebAudioContext();
			// #endif

			// #ifndef MP-WEIXIN
			// 初始化 innerAudioContext
			this.innerAudioContext = uni.createInnerAudioContext();
			this.innerAudioContext.onPlay(() => {
				console.log('开始播放');
				uni.showToast({
					title: '音频开始播放',
					icon: 'none'
				});
			});
			this.innerAudioContext.onEnded(() => {
				console.log('音频片段播放结束');
				uni.showToast({
					title: '音频片段播放结束',
					icon: 'none'
				});
				this.bufferTotalLen = this.bufferTotalLen - 1;
				this.isPlaying = false;
				// 检查是否有更多的音频片段需要播放
				this.processAudioBuffer();
			});
			this.innerAudioContext.onError((res) => {
				console.error('音频播放错误:', res.errMsg, res.errCode);
				uni.showModal({
					title: '音频播放错误',
					content: `错误信息: ${res.errMsg}, 错误码: ${res.errCode}`,
					showCancel: false
				});
			});
			// #endif
		},

		beforeDestroy() {
			// 移除事件监听
			if (process.env.VUE_APP_PLATFORM === 'h5') {
				window.removeEventListener('resize', this.adjustInputPosition);
			}

			// 销毁 innerAudioContext
			if (this.innerAudioContext) {
				this.innerAudioContext.destroy();
			}

			// #ifdef MP-WEIXIN
			this.wxAudioCtx?.close?.();
			// #endif 
		},

		onLoad(options) {
			this.audioPlayer = uni.createVideoContext("player");
			this.chatGroupId = options.chatGroupId;
			initializeUser((userInfo) => {
				this.uid = userInfo.uid;
				this.uuid = userInfo.uuid;
			});

			this.fetchConversation();
			initializeWebSocket((message) => {
				this.handleWebSocketMessage(message);
			}).then(() => {
				console.log('WebSocket connection established');
				this.sendMessage();
			}).catch((error) => {
				console.error('WebSocket connection failed:', error);
			});
		},

		onUnload() {
			closeWebSocket();
			uni.removeStorageSync(`conversation_${this.chatGroupId}`);
			this.cleanupAudio();
			// #ifdef MP-WEIXIN
			this.stopWxVideo()
			// #endif 
		},

		methods: {
			toggleSidebar() {
				this.$refs.sidebarNav.toggleSidebar();
			},
			toggleInputMode() {
				this.isVoiceMode = !this.isVoiceMode;
			},
			adjustInputPosition(keyboardHeight = 0) {
				const inputContainer = this.$el.querySelector('.input-container');
				if (process.env.VUE_APP_PLATFORM === 'h5') {
					if (window.innerHeight < document.documentElement.clientHeight) {
						// 键盘弹出
						inputContainer.style.position = 'fixed';
						inputContainer.style.bottom = '0';
					} else {
						// 键盘收起
						inputContainer.style.position = 'static';
					}
				} else {
					// 微信小程序和App
					inputContainer.style.bottom = `${keyboardHeight}px`;
				}
			},

			fetchConversation() {
				const requestData = {
					uid: this.uid,
					uuid: this.uuid,
					chatGroupId: this.chatGroupId
				};

				getChatDetail(requestData).then(response => {
					if (response.code === 200) {
						const chatDetail = response.data;
						this.title = chatDetail.askTitle;
						this.conversation = chatDetail.chatLogList.map(log => ({
							ask: log.ask,
							content: log.content,
							chatLogId: log.chatLogId
						}));
					} else {
						console.error('Failed to fetch conversation:', response.message);
					}
				}).catch(error => {
					console.error('Error fetching conversation:', error);
				});
			},

			handleWebSocketMessage(message) {
				if (message instanceof ArrayBuffer) {
					// 将音频数据添加到缓冲区
					this.audioBuffer.push(message);

					// #ifdef MP-WEIXIN
					if (!this.isPlaying) {
						this.isPlaying = true;
						this.wxProcessAudioBuffer(this.currentPlayId);
					}
					// #endif

					// #ifndef MP-WEIXIN
					// 如果当前没有正在播放的音频，则开始处理缓冲区
					if (!this.isPlaying) {
						this.processAudioBuffer();
					}
					// #endif
				} else if (message.type === 'TITLE') {
					this.title = message.content;
				} else if (message.type === 'MESSAGE' && message.choices) {
					message.choices.forEach(choice => {
						if (choice.delta && choice.delta.content) {
							this.conversation[this.conversation.length - 1].content += choice.delta.content;
						}
					});
					this.conversation[this.conversation.length - 1].chatLogId = message.chatLogId;
				}
			},

			// 将缓冲区中的数据合并
			joinAudioBuffer() {
				if (!this.audioBuffer.length) return;
				const audioData = this.audioBuffer.reduce((acc, buffer) => {
					const tmp = new Uint8Array(acc.byteLength + buffer.byteLength);
					tmp.set(new Uint8Array(acc), 0);
					tmp.set(new Uint8Array(buffer), acc.byteLength);
					return tmp.buffer;
				}, new ArrayBuffer(0));
				this.audioBuffer = this.audioBuffer.splice(0, audioData.length);
				this.bufferTotalLen = this.bufferTotalLen + 1;
				return audioData;
			},
			// 微信小程序设置并播放音频
			wxProcessAudioBuffer(playId) {
				const audioData = this.joinAudioBuffer();
				if (!audioData) {
					this.currentPlayId = '';
					this.isPlaying = false;
					return false;
				}
				this.wxAudioCtx.decodeAudioData(audioData, (buffer) => {
					this.wxAudioSource = this.wxAudioCtx.createBufferSource();
					this.wxAudioSource.buffer = buffer;
					this.wxAudioSource.connect(this.wxAudioCtx.destination);
					this.wxAudioSource.onended = () => {
						this.bufferTotalLen = this.bufferTotalLen - 1;
						if (this.currentPlayId === playId) {
							this.wxProcessAudioBuffer(playId);
						}
					};
					// 开始播放
					this.wxAudioSource.start();
				}, (err) => {
					console.error('解码音频数据失败', err);
					reject(err);
				});
			},
			// 非微信小程序设置并播放音频
			processAudioBuffer() {
				const audioData = this.joinAudioBuffer()
				if (!audioData) return;
				// 假设服务端传输的是完整的音频文件
				const blob = new Blob([audioData], {
					type: 'audio/mpeg'
				});
				const url = URL.createObjectURL(blob);
				this.innerAudioContext.src = url;
				uni.showToast({
					title: '设置音频源成功',
					icon: 'none'
				});
				this.innerAudioContext.play();
				this.isPlaying = true;
			},
			wxToggleAudio(chatLogId) {
				if (this.isPlaying) {
					// this.wxAudioSource.stop();
					this.wxAudioCtx.suspend();
					this.isPlaying = false;
				} else {
					if (this.currentPlayId === chatLogId && this.bufferTotalLen > 0) {
						// this.wxAudioCtx.start();
						this.wxAudioCtx.resume();
						this.isPlaying = true;
					} else {
						this.wxAudioSource?.stop?.();
						this.wxAudioSource?.disconnect?.();
						this.wxAudioCtx?.resume?.();
						this.bufferTotalLen = 0;
						this.audioBuffer = [];
						this.currentPlayId = chatLogId;
						this.playAudio(chatLogId);
					}
				}
			},
			toggleAudio(chatLogId) {
				// #ifdef MP-WEIXIN
				this.wxToggleAudio(chatLogId)
				// #endif

				// #ifndef MP-WEIXIN
				if (this.isPlaying) {
					this.innerAudioContext.pause();
					this.isPlaying = false;
				} else {
					if (this.currentPlayId === chatLogId) {
						this.playAudio(chatLogId);
					} else {
						this.audioBuffer = [];
						this.playAudio(chatLogId);
						this.currentPlayId = chatLogId;
					}
				}
				// #endif 
			},

			playAudio(chatLogId) {
				callAudio(chatLogId, this.uuid, this.logGroupId, (response) => {});
			},

			handleAudioEnd() {
				console.log('Audio ended');
				this.isPlaying = false; // 音频结束后重置播放状态
				if (this.mediaSource && this.mediaSource.readyState === 'open') {
					try {
						this.mediaSource.endOfStream();
					} catch (e) {
						console.error('Error ending media stream:', e);
					}
				}
			},

			cleanupAudio() {
				// 清理音频相关资源
				if (this.player) {
					this.player.stop();
				}
				if (this.mediaSource && this.mediaSource.readyState === 'open') {
					try {
						this.mediaSource.endOfStream();
					} catch (e) {
						console.error('Error ending media stream:', e);
					}
				}
				this.mediaSource = null;
				this.sourceBuffer = null;
				this.audioQueue = [];
				this.audioSrc = '';
			},
			stopWxVideo() {
				this.wxAudioCtx?.close?.();
				this.wxAudioSource?.stop?.();
				this.wxAudioSource?.disconnect?.();
			},
			handleTextInput() {
				if (this.userInput.trim()) {
					this.sendTextMessage();
				}
			},

			sendTextMessage() {
				console.log('Sending message:', this.userInput);
				this.uploadTextMessage(this.userInput);
				this.userInput = '';
			},

			uploadTextMessage(message) {
				uploadText(this.chatGroupId, this.uuid, this.uid, message, (response) => {
					console.log('Upload text response:', response);
					let chat = {
						ask: message,
						content: ''
					};
					this.conversation.push(chat);
					// 成功上传文本后调用talk函数
					this.sendMessage();
				});
			},

			sendMessage(message) {
				talk(this.chatGroupId, this.uuid, message, (response) => {
					console.log('Talk response:', response);
					// 在这里处理对话的响应
				});
			},

			startVoiceInput() {
				console.log('开始录音...');
				// 在这里实现开始录音的逻辑
			},

			endVoiceInput() {
				console.log('结束录音...');
				// 在这里实现结束录音的逻辑
			},

			openMediaOptions() {
				console.log('打开多媒体选项...');
				// 在这里实现打开相册、拍照等多媒体功能
			},

			toggleMode() {
				this.isNarrationMode = !this.isNarrationMode;
			},
		}
	}
</script>


<style>
	.container {
		padding: 20px;
		background-color: #fff;
		padding-bottom: 60px;
		/* 添加底部内边距，确保内容不被遮挡 */
	}

	.mode {
		display: flex;
		align-items: center;
		justify-content: flex-start;
		margin-bottom: 10px;
	}

	.mode-title {
		font-size: 18px;
		font-weight: bold;
	}

	.audio-button {
		font-size: 18px;
		margin-bottom: 20px;
		width: 100%;
		display: inline-block;
		padding: 10px;
		background-color: #f5f5f5;
		border-radius: 5px;
		text-align: center;
	}

	.input-container {
		display: flex;
		align-items: center;
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		background-color: #fff;
		padding: 10px;
		box-shadow: 0 -1px 5px rgba(0, 0, 0, 0.1);
		flex-direction: row;
	}

	.input-mode-button,
	.media-button,
	.send-button {
		font-size: 16px;
		background: none;
		border: none;
		cursor: pointer;
		margin-right: 10px;
	}

	.input-area {
		flex: 1;
		display: flex;
		align-items: center;
	}

	.input-area input {
		flex: 1;
		padding: 5px;
		font-size: 16px;
	}

	.voice-input-button {
		flex: 1;
		padding: 10px;
		font-size: 16px;
		text-align: center;
		background-color: #f5f5f5;
		border: none;
		cursor: pointer;
	}

	.content {
		max-height: 400px;
		/* Adjust based on your layout */
		overflow-y: auto;
	}

	.description {
		font-size: 16px;
		line-height: 1.5;
		margin-bottom: 10px;
	}

	.user-ask {
		text-align: right;
	}

	.user-ask-title {
		display: inline-block;
		padding: 10px 20px;
		border-radius: 5px;
		background: #fafafa;
		margin-bottom: 10px;
		font-weight: bold;
		font-size: 14px;
		text-align: right;
	}

	.user-ask-content {
		margin-bottom: 5px;
	}

	.mode-toggle-button {
		font-size: 16px;
		background: none;
		border: none;
		cursor: pointer;
		margin-left: 10px;
	}
</style>