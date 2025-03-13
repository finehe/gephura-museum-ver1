<template>
  <view class="ios-card" :class="{ 'elevated': elevated }">
    <slot></slot>
  </view>
</template>

<script>
export default {
  name: 'IosCard',
  props: {
    elevated: {
      type: Boolean,
      default: true
    }
  }
}
</script>

<style lang="scss">
.ios-card {
  background-color: var(--card-background);
  border-radius: var(--border-radius-medium);
  padding: var(--spacing-medium);
  margin-bottom: var(--spacing-medium);
  
  &.elevated {
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
}
</style> 