# 灵马 AI v0 组件集成指南

本目录包含由 v0.dev 生成的 UI 组件，这些组件遵循灵马 AI 的设计规范。以下是如何将这些组件集成到现有项目中的指南。

## 组件列表

1. **ScanPage.vue** - 扫描页面，包含二维码扫描和图像识别功能
2. **ResultPage.vue** - 识别结果页面，展示识别结果和 AI 分析

## 集成方法

### 方法一：直接替换现有页面

如果您想完全替换现有页面，可以按照以下步骤操作：

1. 备份原始文件：
   ```bash
   cp pages/index/index.vue pages/index/index.vue.bak
   ```

2. 复制新组件到目标位置：
   ```bash
   cp v0-components/ScanPage.vue pages/index/index.vue
   ```

3. 如果需要创建新页面，先创建目录：
   ```bash
   mkdir -p pages/result
   cp v0-components/ResultPage.vue pages/result/result.vue
   ```

4. 更新 pages.json 添加新页面（如果需要）：
   ```json
   {
     "pages": [
       // 其他页面...
       {
         "path": "pages/result/result",
         "style": {
           "navigationBarTitleText": "识别结果",
           "navigationStyle": "custom"
         }
       }
     ]
   }
   ```

### 方法二：部分集成组件

如果您只想集成部分设计元素，可以：

1. 从 v0 组件中提取样式：
   - 复制所需的 CSS 样式到您的项目样式文件中
   - 调整颜色变量和主题设置

2. 复制特定的组件部分：
   - 提取特定的视图结构和布局
   - 保留原有的业务逻辑和数据处理

3. 集成特定功能：
   - 复制特定的功能组件（如扫描框、结果卡片等）
   - 将其作为子组件集成到现有页面中

## 注意事项

1. **保持业务逻辑**：确保在替换 UI 时保留原有的业务逻辑和数据处理
2. **测试兼容性**：确保新组件与现有项目的其他部分兼容
3. **渐进式集成**：建议逐步集成和测试，而不是一次性替换所有页面
4. **资源路径**：注意调整组件中的资源路径（如图片）以匹配您的项目结构

## 示例：集成扫描框组件

如果您只想集成扫描页面中的扫描框组件，可以：

```vue
<!-- 在您的现有页面中 -->
<template>
  <view>
    <!-- 您的现有内容 -->
    
    <!-- 集成扫描框 -->
    <view class="scan-frame">
      <view class="scan-box">
        <view class="corner top-left"></view>
        <view class="corner top-right"></view>
        <view class="corner bottom-left"></view>
        <view class="corner bottom-right"></view>
      </view>
      <text class="scan-tip">将二维码/物品放入框内，自动识别</text>
    </view>
    
    <!-- 更多现有内容 -->
  </view>
</template>

<style>
  /* 复制相关样式 */
  .scan-frame {
    position: relative;
    width: 600rpx;
    height: 600rpx;
    display: flex;
    justify-content: center;
    align-items: center;
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
</style>
``` 