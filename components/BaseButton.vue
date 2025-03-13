<template>
  <button 
    class="base-button"
    :class="[
      `base-button--${type}`, 
      { 'base-button--block': block },
      { 'base-button--round': round },
      { 'base-button--disabled': disabled }
    ]"
    :disabled="disabled"
    @click="handleClick"
  >
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: 'BaseButton',
  props: {
    type: {
      type: String,
      default: 'primary',
      validator: (value) => ['primary', 'secondary', 'success', 'warning', 'danger', 'info', 'text'].includes(value)
    },
    block: {
      type: Boolean,
      default: false
    },
    round: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleClick(event) {
      if (this.disabled) return;
      this.$emit('click', event);
    }
  }
}
</script>

<style lang="scss">
@import '@/uni.scss';

.base-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: $spacing-2 $spacing-4;
  font-size: $text-base;
  font-weight: $font-medium;
  line-height: 1.5;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  cursor: pointer;
  user-select: none;
  border: 1px solid transparent;
  border-radius: $radius-md;
  transition: all $transition-fast ease-in-out;
  
  &:focus {
    outline: none;
  }
  
  &--primary {
    background-color: $primary-color;
    color: white;
    
    &:hover:not(.base-button--disabled) {
      background-color: darken($primary-color, 10%);
    }
    
    &:focus {
      box-shadow: 0 0 0 3px rgba($primary-color, 0.4);
    }
  }
  
  &--secondary {
    background-color: $secondary-color;
    color: white;
    
    &:hover:not(.base-button--disabled) {
      background-color: darken($secondary-color, 10%);
    }
    
    &:focus {
      box-shadow: 0 0 0 3px rgba($secondary-color, 0.4);
    }
  }
  
  &--success {
    background-color: $success-color;
    color: white;
    
    &:hover:not(.base-button--disabled) {
      background-color: darken($success-color, 10%);
    }
    
    &:focus {
      box-shadow: 0 0 0 3px rgba($success-color, 0.4);
    }
  }
  
  &--warning {
    background-color: $warning-color;
    color: white;
    
    &:hover:not(.base-button--disabled) {
      background-color: darken($warning-color, 10%);
    }
    
    &:focus {
      box-shadow: 0 0 0 3px rgba($warning-color, 0.4);
    }
  }
  
  &--danger {
    background-color: $danger-color;
    color: white;
    
    &:hover:not(.base-button--disabled) {
      background-color: darken($danger-color, 10%);
    }
    
    &:focus {
      box-shadow: 0 0 0 3px rgba($danger-color, 0.4);
    }
  }
  
  &--info {
    background-color: $info-color;
    color: white;
    
    &:hover:not(.base-button--disabled) {
      background-color: darken($info-color, 10%);
    }
    
    &:focus {
      box-shadow: 0 0 0 3px rgba($info-color, 0.4);
    }
  }
  
  &--text {
    background-color: transparent;
    color: $primary-color;
    border: none;
    padding: $spacing-1 $spacing-2;
    
    &:hover:not(.base-button--disabled) {
      color: darken($primary-color, 10%);
      background-color: rgba($primary-color, 0.05);
    }
  }
  
  &--block {
    display: flex;
    width: 100%;
  }
  
  &--round {
    border-radius: $radius-full;
  }
  
  &--disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}
</style> 