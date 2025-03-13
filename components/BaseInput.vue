<template>
  <div class="base-input" :class="{ 'base-input--disabled': disabled }">
    <label v-if="label" class="base-input__label" :for="id">{{ label }}</label>
    <div class="base-input__wrapper" :class="{ 'base-input__wrapper--focused': focused }">
      <div v-if="$slots.prefix" class="base-input__prefix">
        <slot name="prefix"></slot>
      </div>
      <input
        :id="id"
        :type="type"
        :value="value"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :maxlength="maxlength"
        class="base-input__inner"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
      />
      <div v-if="$slots.suffix || clearable" class="base-input__suffix">
        <i 
          v-if="clearable && value && !disabled && !readonly" 
          class="base-input__clear"
          @click="handleClear"
        >×</i>
        <slot name="suffix"></slot>
      </div>
    </div>
    <div v-if="error" class="base-input__error">{{ error }}</div>
  </div>
</template>

<script>
export default {
  name: 'BaseInput',
  props: {
    value: {
      type: [String, Number],
      default: ''
    },
    type: {
      type: String,
      default: 'text'
    },
    label: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: false
    },
    maxlength: {
      type: Number,
      default: -1
    },
    error: {
      type: String,
      default: ''
    },
    id: {
      type: String,
      default() {
        return `input-${Math.floor(Math.random() * 10000)}`;
      }
    }
  },
  data() {
    return {
      focused: false
    };
  },
  methods: {
    handleInput(event) {
      this.$emit('input', event.target.value);
    },
    handleFocus(event) {
      this.focused = true;
      this.$emit('focus', event);
    },
    handleBlur(event) {
      this.focused = false;
      this.$emit('blur', event);
    },
    handleClear() {
      this.$emit('input', '');
      this.$emit('clear');
    }
  }
}
</script>

<style lang="scss">
@import '@/uni.scss';

.base-input {
  display: flex;
  flex-direction: column;
  width: 100%;
  
  &__label {
    font-size: $text-sm;
    font-weight: $font-medium;
    color: $text-secondary;
    margin-bottom: $spacing-1;
  }
  
  &__wrapper {
    display: flex;
    align-items: center;
    width: 100%;
    padding: $spacing-2 $spacing-3;
    background-color: $bg-primary;
    border: 1px solid $border-medium;
    border-radius: $radius-md;
    transition: all $transition-fast ease-in-out;
    
    &--focused {
      border-color: $primary-color;
      box-shadow: 0 0 0 3px rgba($primary-color, 0.2);
    }
  }
  
  &__inner {
    flex: 1;
    width: 100%;
    border: none;
    outline: none;
    background: transparent;
    color: $text-primary;
    font-size: $text-base;
    
    &::placeholder {
      color: $text-tertiary;
    }
  }
  
  &__prefix {
    display: flex;
    align-items: center;
    margin-right: $spacing-2;
    color: $text-tertiary;
  }
  
  &__suffix {
    display: flex;
    align-items: center;
    margin-left: $spacing-2;
    color: $text-tertiary;
  }
  
  &__clear {
    cursor: pointer;
    font-size: $text-lg;
    color: $text-tertiary;
    
    &:hover {
      color: $text-secondary;
    }
  }
  
  &__error {
    font-size: $text-sm;
    color: $danger-color;
    margin-top: $spacing-1;
  }
  
  &--disabled {
    opacity: 0.6;
    
    .base-input__wrapper {
      background-color: $bg-tertiary;
      cursor: not-allowed;
    }
    
    .base-input__inner {
      cursor: not-allowed;
    }
  }
}
</style> 