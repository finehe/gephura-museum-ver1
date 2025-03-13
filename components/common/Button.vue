<template>
  <button class="custom-button" :class="[type, size]">
    <slot></slot>
  </button>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: 'primary'
    },
    size: {
      type: String,
      default: 'medium'
    }
  }
}
</script>

<style lang="scss">
.custom-button {
    // 从 Figma 复制的按钮样式
}
</style> 