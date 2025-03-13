<template>
  <div class="base-card" :class="{ 'base-card--shadow': shadow, 'base-card--hover': hover }">
    <div v-if="$slots.header || title" class="base-card__header">
      <slot name="header">
        <div class="base-card__title">{{ title }}</div>
      </slot>
    </div>
    <div class="base-card__body" :style="bodyStyle">
      <slot></slot>
    </div>
    <div v-if="$slots.footer" class="base-card__footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BaseCard',
  props: {
    title: {
      type: String,
      default: ''
    },
    shadow: {
      type: Boolean,
      default: true
    },
    hover: {
      type: Boolean,
      default: false
    },
    bodyStyle: {
      type: Object,
      default: () => ({})
    }
  }
}
</script>

<style lang="scss">
@import '@/uni.scss';

.base-card {
  background-color: $bg-primary;
  border-radius: $radius-lg;
  border: 1px solid $border-light;
  overflow: hidden;
  transition: all $transition-fast ease-in-out;
  
  &--shadow {
    box-shadow: $shadow-md;
  }
  
  &--hover:hover {
    transform: translateY(-4px);
    box-shadow: $shadow-lg;
  }
  
  &__header {
    padding: $spacing-4;
    border-bottom: 1px solid $border-light;
  }
  
  &__title {
    font-size: $text-lg;
    font-weight: $font-semibold;
    color: $text-primary;
    margin: 0;
  }
  
  &__body {
    padding: $spacing-4;
  }
  
  &__footer {
    padding: $spacing-4;
    border-top: 1px solid $border-light;
  }
}
</style> 