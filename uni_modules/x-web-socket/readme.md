# x-web-socket

### 用法说明

#### /uni_modules/x-web-socket/demo.js 文件内容 (该文件只是一个示例用法，实际使用请根据自己项目进行更改)
``` js
import { MyWebSocket, Message } from '@/uni_modules/x-web-socket/js_sdk/index.js'

// 创建 webSocket 实例, 调用初始化方法连接到服务器 webSocket.init(socketUrl + token)
export const webSocket = new MyWebSocket((message) => {
    console.log('收到消息 ------ ', message);
    uni.$emit(message.event, message.data)
}, false)


// 登录后初始化（初始化成功才能收发消息）
webSocket.init('ws://localhost:3000/api/socket?token=xxx').then(res => {
    uni.$on('newMessage', data => {
        console.log('收到 newMessage', data);
    })

    webSocket.send(new Message('newMessage'))
})

// 关闭连接
webSocket.close()
```


### 插件如果对你有帮助给个好评吧~
