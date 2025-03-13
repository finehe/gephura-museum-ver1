<template>
  <view class="ios-input-container">
    <label v-if="label" class="ios-input-label">{{ label }}</label>
    <input 
      class="ios-input" 
      :type="type" 
      :value="modelValue"
      :placeholder="placeholder"
      @input="$emit('update:modelValue', $event.target.value)"
      :disabled="disabled"
    />
  </view>
</template>

<script>
export default {
  name: 'IosInput',
  props: {
    modelValue: {
      type: [String, Number],
      default: ''
    },
    label: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'text'
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue']
}
</script>

<style lang="scss">
.ios-input-container {
  margin-bottom: var(--spacing-medium);
}

.ios-input-label {
  display: block;
  font-size: var(--font-size-small);
  color: var(--text-secondary);
  margin-bottom: var(--spacing-xs);
}

.ios-input {
  width: 100%;
  height: 44px;
  padding: 0 var(--spacing-medium);
  font-size: var(--font-size-normal);
  border: 1px solid #E5E5EA;
  border-radius: var(--border-radius-small);
  background-color: white;
  
  &:focus {
    border-color: var(--primary-color);
    outline: none;
  }
  
  &:disabled {
    background-color: #F2F2F7;
    color: var(--text-secondary);
  }
}
</style> 