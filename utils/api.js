import { MyWebSocket } from '@/uni_modules/x-web-socket/js_sdk/index.js'

let websocket = null;

export const serverUrl = 'https://api.functionpoint.cn/museum';
export const wssUrl = 'wss://api.functionpoint.cn/museum';
// export const serverUrl = 'http://localhost:8089/museum';


export function generateUUID() {
  return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export function initializeWebSocket(callback) {
  if (!websocket || !websocket.connected) {
    websocket = new MyWebSocket(callback, false);
    let token = getToken();
    return websocket.init(`${wssUrl}/websocket?token=${token}`);
  }
}

export function closeWebSocket() {
	if (websocket) {
		websocket.close();
		console.log('WebSocket connection closed');
	}
}

export function uploadImage(filePath, uid, uuid, callback) {
  const token = getToken();
  if (!token) {
    console.error('Token not found');
    uni.showToast({
      title: '未找到授权信息',
      icon: 'none'
    });
    return;
  }

  // 添加平台判断日志
  console.log('当前平台:', uni.getSystemInfoSync().platform);
  console.log('要上传的文件路径:', filePath);

  uni.showLoading({
    title: '上传中...'
  });

  // #ifdef MP-WEIXIN
  // 微信小程序环境下先检查文件是否存在
  wx.getFileInfo({
    filePath: filePath,
    success: (res) => {
      console.log('文件信息:', res.size, '字节');
      proceedWithUpload();
    },
    fail: (error) => {
      console.error('文件不存在或无法访问:', error);
      uni.hideLoading();
      uni.showToast({
        title: '文件无法访问',
        icon: 'none'
      });
    }
  });
  // #endif

  // #ifndef MP-WEIXIN
  proceedWithUpload();
  // #endif

  function proceedWithUpload() {
    uni.uploadFile({
      url: `${serverUrl}/chat/uploadImage`,
      filePath: filePath,
      name: 'file',
      header: {
        'Authorization': `Bearer ${token}`
      },
      formData: {
        uid: uid,
        uuid: uuid
      },
      success: (uploadFileRes) => {
        console.log('上传成功，状态码:', uploadFileRes.statusCode);
        console.log('返回数据:', uploadFileRes.data);
        
        try {
          let data = JSON.parse(uploadFileRes.data);
          let dataString = JSON.stringify(data.data);
          callback(dataString);
        } catch (e) {
          console.error('解析返回数据失败:', e);
          uni.showToast({
            title: '解析返回数据失败',
            icon: 'none'
          });
        }
      },
      fail: (error) => {
        console.error('上传失败:', error);
        uni.showToast({
          title: '上传图片失败: ' + (error.errMsg || '未知错误'),
          icon: 'none',
          duration: 3000
        });
      },
      complete: () => {
        uni.hideLoading();
      }
    });
  }
}

export function sendDataToServer(data, uid, uuid, callback) {
  uni.request({
    url: `${serverUrl}/scan`,
    method: 'POST',
    data: {
      result: data,
      uid: uid,
      uuid: uuid
    },
    success: (res) => {
      callback(res.data);
    }
  });
}

export function getUserInfo(callback) {
  const token = getToken();
  const headers = {};

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  uni.request({
    url: `${serverUrl}/user/info`,
    method: 'GET',
    header: headers,
    data: {
      auto: 1
    },
    success: (res) => {
      callback(res.data);
    },
    fail: (error) => {
      console.error('Failed to fetch user info:', error);
    }
  });
}

export function setToken(userInfo) {
  const { token, tokenExpire } = userInfo;
  const now = Date.now();
  const expiry = now + tokenExpire;
  uni.setStorageSync('token', token);
  uni.setStorageSync('tokenExpire', expiry);
}

export function getToken() {
  const token = uni.getStorageSync('token');
  const tokenExpire = uni.getStorageSync('tokenExpire');
  const now = Date.now();

  if (now > tokenExpire) {
    uni.removeStorageSync('token');
    uni.removeStorageSync('tokenExpire');
    uni.removeStorageSync('userInfo');
    return null;
  }

  return token;
}

export function initializeUser(callback) {
  let userInfo = uni.getStorageSync('userInfo');

  if (userInfo) {
    callback(userInfo);
  } else {
    getUserInfo((data) => {
      userInfo = data.data;
      if (userInfo && userInfo.token) {
        uni.setStorageSync('userInfo', userInfo);
        setToken(userInfo);
      }
      callback(userInfo);
    });
  }
}

export function talk(chatGroupId, uuid, message, callback) {
  const token = getToken();
  if (!token) {
    console.error('Token not found');
    return;
  }

  uni.request({
    url: `${serverUrl}/chat/talk`,
    method: 'POST',
    header: {
      'Authorization': `Bearer ${token}`
    },
    data: {
      chatGroupId: chatGroupId,
      uuid: uuid,
      message: message
    },
    success: (res) => {
      console.log('Response from server:', res.data);
      if (callback) callback(res.data);
    },
    fail: (error) => {
      console.error('Failed to send message:', error);
    }
  });
}

export function callAudio(chatLogId, uuid, logGroupId, callback) {
  const token = getToken();
  if (!token) {
    console.error('Token not found');
    return;
  }

  uni.request({
    url: `${serverUrl}/chat/audio`,
    method: 'POST',
    header: {
      'Authorization': `Bearer ${token}`
    },
    data: {
      chatLogId: chatLogId,
      uuid: uuid,
      logGroupId: logGroupId
    },
    success: (res) => {
      console.log('Audio response:', res.data);
      if (callback) callback(res.data);
    },
    fail: (error) => {
      console.error('Failed to play audio:', error);
    }
  });
}

export function uploadText(chatGroupId, uuid, uid, message, callback) {
  const token = getToken();
  if (!token) {
    console.error('Token not found');
    return;
  }

  uni.request({
    url: `${serverUrl}/chat/uploadText`,
    method: 'POST',
    header: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    data: {
      chatGroupId: chatGroupId,
      uuid: uuid,
      uid: uid,
      message: message,
      type: 'TEXT'
    },
    success: (res) => {
      console.log('Upload text response:', res.data);
      if (callback) callback(res.data);
    },
    fail: (error) => {
      console.error('Failed to upload text:', error);
    }
  });
}

export function getChatDetail(data) {
  const token = getToken();
  if (!token) {
    console.error('Token not found');
    return Promise.reject('Token not found');
  }

  return new Promise((resolve, reject) => {
    uni.request({
      url: `${serverUrl}/chat/chatDetail`,
      method: 'POST',
      header: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      data: data,
      success: (res) => {
        resolve(res.data);
      },
      fail: (error) => {
        console.error('Failed to fetch chat detail:', error);
        reject(error);
      }
    });
  });
}

export function startConversation(uid, uuid, message) {
  const token = getToken(); // 获取存储的 token
  if (!token) {
    console.error('Token not found');
    return Promise.reject('Token not found');
  }

  return new Promise((resolve, reject) => {
    uni.request({
      url: `${serverUrl}/chat/startConversation`,
      method: 'POST',
      header: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      data: {
        uid,
        uuid,
        message
      },
      success: (res) => {
        console.log('Response from server:', res); // 输出完整的响应对象
        if (res.statusCode === 200) {
          resolve(res.data);
        } else {
          console.error('Failed to start conversation:', res.data.message || 'No message');
          reject(res.data.message || 'No message');
        }
      },
      fail: (error) => {
        console.error('Error starting conversation:', error);
        reject(error);
      }
    });
  });
} 