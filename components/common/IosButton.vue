<template>
  <button 
    class="ios-button" 
    :class="[type, size, { 'rounded': rounded }]"
    :disabled="disabled"
    @click="$emit('click', $event)">
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: 'IosButton',
  props: {
    type: {
      type: String,
      default: 'primary',
      validator: value => ['primary', 'secondary', 'success', 'warning', 'danger', 'text'].includes(value)
    },
    size: {
      type: String,
      default: 'medium',
      validator: value => ['small', 'medium', 'large'].includes(value)
    },
    rounded: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  emits: ['click']
}
</script>

<style lang="scss">
.ios-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1);
  
  &.primary {
    background-color: var(--primary-color);
    color: white;
  }
  
  &.secondary {
    background-color: var(--secondary-color);
    color: white;
  }
  
  &.success {
    background-color: var(--success-color);
    color: white;
  }
  
  &.warning {
    background-color: var(--warning-color);
    color: white;
  }
  
  &.danger {
    background-color: var(--danger-color);
    color: white;
  }
  
  &.text {
    background-color: transparent;
    color: var(--primary-color);
    padding: 0;
  }
  
  &.small {
    font-size: var(--font-size-small);
    padding: 6px 12px;
    border-radius: var(--border-radius-small);
  }
  
  &.medium {
    font-size: var(--font-size-normal);
    padding: 10px 16px;
    border-radius: var(--border-radius-medium);
  }
  
  &.large {
    font-size: var(--font-size-large);
    padding: 12px 20px;
    border-radius: var(--border-radius-medium);
  }
  
  &.rounded {
    border-radius: var(--border-radius-full);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  &:active:not(:disabled) {
    transform: scale(0.98);
    opacity: 0.9;
  }
}
</style> 