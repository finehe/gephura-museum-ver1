# v0 组件集成指南

## 步骤 1: 使用 v0.dev 生成组件

访问 [v0.dev](https://v0.dev/) 并使用以下提示生成组件：

```
为博物馆网站创建一个现代化的展品卡片组件，包含图片展示区、标题、简短描述和"了解更多"按钮。
风格应该简约优雅，配色方案使用深色背景和金色点缀，响应式设计适应不同屏幕尺寸。
```

## 步骤 2: 下载生成的组件代码

v0 会生成类似以下的代码（示例）：

```vue
<template>
  <div class="exhibit-card">
    <div class="exhibit-image">
      <img :src="exhibit.imageUrl" :alt="exhibit.title" />
    </div>
    <div class="exhibit-content">
      <h3 class="exhibit-title">{{ exhibit.title }}</h3>
      <p class="exhibit-description">{{ exhibit.description }}</p>
      <button class="learn-more-btn" @click="navigateToDetail">了解更多</button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  exhibit: {
    type: Object,
    required: true
  }
});

const navigateToDetail = () => {
  // 导航到展品详情页
  uni.navigateTo({
    url: `/pages/exhibit/detail?id=${props.exhibit.id}`
  });
};
</script>

<style scoped>
.exhibit-card {
  background-color: #1a1a1a;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  margin-bottom: 20px;
}

.exhibit-card:hover {
  transform: translateY(-5px);
}

.exhibit-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.exhibit-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.exhibit-card:hover .exhibit-image img {
  transform: scale(1.05);
}

.exhibit-content {
  padding: 16px;
}

.exhibit-title {
  color: #d4af37; /* 金色 */
  font-size: 18px;
  margin-bottom: 8px;
}

.exhibit-description {
  color: #e0e0e0;
  font-size: 14px;
  margin-bottom: 16px;
  line-height: 1.4;
}

.learn-more-btn {
  background-color: transparent;
  color: #d4af37;
  border: 1px solid #d4af37;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.learn-more-btn:hover {
  background-color: #d4af37;
  color: #1a1a1a;
}

@media (max-width: 768px) {
  .exhibit-image {
    height: 150px;
  }
  
  .exhibit-title {
    font-size: 16px;
  }
  
  .exhibit-description {
    font-size: 12px;
  }
}
</style>
```

## 步骤 3: 在项目中创建组件文件

1. 在您的项目源代码中创建新的组件文件，例如 `components/ExhibitCard.vue`
2. 将 v0 生成的代码粘贴到该文件中
3. 根据需要调整组件代码，确保与您的项目风格和需求一致

## 步骤 4: 在页面中使用组件

```vue
<template>
  <view class="container">
    <exhibit-card 
      v-for="item in exhibits" 
      :key="item.id" 
      :exhibit="item"
    />
  </view>
</template>

<script setup>
import ExhibitCard from '@/components/ExhibitCard.vue';
import { ref } from 'vue';

const exhibits = ref([
  {
    id: 1,
    title: '古代陶器展',
    description: '展示了公元前3000年至公元前1000年的精美陶器，反映了古代文明的艺术成就。',
    imageUrl: '/static/exhibits/pottery.jpg'
  },
  {
    id: 2,
    title: '丝绸之路文物',
    description: '来自丝绸之路沿线的珍贵文物，展示了东西方文化交流的历史。',
    imageUrl: '/static/exhibits/silkroad.jpg'
  },
  // 更多展品...
]);
</script>
```

## 步骤 5: 构建和部署

1. 运行构建命令：`npm run build:h5`
2. 将构建后的文件部署到 Vercel

## 注意事项

- 确保组件的样式与您的整体设计系统一致
- 测试组件在不同设备上的响应式表现
- 优化图片资源，确保加载性能良好 