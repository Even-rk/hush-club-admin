<template>
  <div class="date-picker-container">
    <!-- 单个日期选择 -->
    <template v-if="!range">
      <div class="date-input-wrapper">
        <input
          :value="formatDisplayDate(modelValue)"
          type="text"
          class="date-picker-input"
          :placeholder="placeholder"
          :disabled="disabled"
          readonly
          title="点击选择日期"
          @click="!disabled && openDatePicker('single')"
        />
        <span
          class="calendar-icon"
          :class="{ disabled }"
          @click="!disabled && openDatePicker('single')"
          >📅</span
        >

        <!-- 隐藏的原生日期输入 -->
        <input
          ref="hiddenDateInput"
          :value="modelValue"
          type="date"
          class="hidden-date-input"
          :min="min"
          :max="max"
          @change="onSingleDateChange"
        />
      </div>
    </template>

    <!-- 日期范围选择 -->
    <template v-else>
      <div class="date-range-container">
        <div class="date-input-wrapper">
          <input
            :value="formatDisplayDate(startValue)"
            type="text"
            class="date-picker-input"
            :placeholder="startPlaceholder || '开始日期'"
            :disabled="disabled"
            readonly
            title="点击选择开始日期"
            @click="!disabled && openDatePicker('start')"
          />
          <span
            class="calendar-icon"
            :class="{ disabled }"
            @click="!disabled && openDatePicker('start')"
            >📅</span
          >

          <!-- 隐藏的原生日期输入 -->
          <input
            ref="hiddenStartInput"
            :value="startValue"
            type="date"
            class="hidden-date-input"
            :min="min"
            :max="endValue || max"
            @change="onStartDateChange"
          />
        </div>

        <span class="range-separator">{{ separator }}</span>

        <div class="date-input-wrapper">
          <input
            :value="formatDisplayDate(endValue)"
            type="text"
            class="date-picker-input"
            :placeholder="endPlaceholder || '结束日期'"
            :disabled="disabled"
            readonly
            title="点击选择结束日期"
            @click="!disabled && openDatePicker('end')"
          />
          <span
            class="calendar-icon"
            :class="{ disabled }"
            @click="!disabled && openDatePicker('end')"
            >📅</span
          >

          <!-- 隐藏的原生日期输入 -->
          <input
            ref="hiddenEndInput"
            :value="endValue"
            type="date"
            class="hidden-date-input"
            :min="startValue || min"
            :max="max"
            @change="onEndDateChange"
          />
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface DatePickerProps {
  // 单个日期模式的值
  modelValue?: string
  // 范围模式的开始日期
  startValue?: string
  // 范围模式的结束日期
  endValue?: string
  // 是否为日期范围选择器
  range?: boolean
  // 占位符
  placeholder?: string
  // 范围模式下开始日期的占位符
  startPlaceholder?: string
  // 范围模式下结束日期的占位符
  endPlaceholder?: string
  // 最小日期
  min?: string
  // 最大日期
  max?: string
  // 是否禁用
  disabled?: boolean
  // 范围分隔符
  separator?: string
}

const props = withDefaults(defineProps<DatePickerProps>(), {
  modelValue: '',
  startValue: '',
  endValue: '',
  range: false,
  placeholder: '选择日期',
  startPlaceholder: '',
  endPlaceholder: '',
  min: '',
  max: '',
  disabled: false,
  separator: '至'
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'update:startValue': [value: string]
  'update:endValue': [value: string]
  change: [value: string | { start: string; end: string }]
}>()

// 模板引用
const hiddenDateInput = ref<HTMLInputElement>()
const hiddenStartInput = ref<HTMLInputElement>()
const hiddenEndInput = ref<HTMLInputElement>()

// 格式化显示日期
const formatDisplayDate = (dateStr: string) => {
  if (!dateStr) {
    return ''
  }

  // 将 YYYY-MM-DD 格式转换为更友好的显示格式
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) {
    return dateStr
  }

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}年${month}月${day}日`
}

// 打开日期选择器
const openDatePicker = (type: 'single' | 'start' | 'end') => {
  // 触发隐藏的原生日期输入框
  // 使用 click() 方法来触发日期选择器
  if (type === 'single' && hiddenDateInput.value) {
    hiddenDateInput.value.click()
  } else if (type === 'start' && hiddenStartInput.value) {
    hiddenStartInput.value.click()
  } else if (type === 'end' && hiddenEndInput.value) {
    hiddenEndInput.value.click()
  }
}

// 单个日期变化
const onSingleDateChange = (event: Event) => {
  const value = (event.target as HTMLInputElement).value
  emit('update:modelValue', value)
  emit('change', value)
}

// 开始日期变化
const onStartDateChange = (event: Event) => {
  const value = (event.target as HTMLInputElement).value
  emit('update:startValue', value)
  emit('change', { start: value, end: props.endValue || '' })
}

// 结束日期变化
const onEndDateChange = (event: Event) => {
  const value = (event.target as HTMLInputElement).value
  emit('update:endValue', value)
  emit('change', { start: props.startValue || '', end: value })
}
</script>

<style scoped lang="scss">
.date-picker-container {
  position: relative;
  display: inline-flex;
  align-items: center;
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

// 输入框容器
.date-input-wrapper {
  position: relative;
  display: inline-flex;
  align-items: center;
}

// 隐藏的原生日期输入
.hidden-date-input {
  position: absolute;
  opacity: 0.01; // 几乎透明但不完全透明
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  cursor: pointer;
  border: none;
  background: transparent;
  appearance: none;
  -webkit-appearance: none;

  &::-webkit-calendar-picker-indicator {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    opacity: 0;
    cursor: pointer;
  }
}

// 日历图标
.calendar-icon {
  position: absolute;
  right: 12px;
  cursor: pointer;
  font-size: 18px;
  opacity: 0.6;
  transition: all 0.2s ease;
  user-select: none;

  .date-input-wrapper:hover & {
    opacity: 0.8;
  }

  &.disabled {
    opacity: 0.3;
    cursor: not-allowed;
    pointer-events: none;
  }
}

.date-picker-input {
  padding: 8px 40px 8px 12px; // 调整右边距为图标留出空间
  border: 1px solid var(--border-color, #e5e7eb);
  border-radius: 8px;
  font-size: 14px;
  line-height: 22px;
  color: var(--text-primary, #1f2937);
  background-color: var(--bg-white, #ffffff);
  transition: all 0.2s ease;
  outline: none;
  min-width: 140px;
  font-weight: 400;
  cursor: pointer;

  &::placeholder {
    color: var(--text-placeholder, #9ca3af);
    font-weight: 400;
    opacity: 1; // 确保 placeholder 显示
  }

  &:hover:not(:disabled) {
    border-color: var(--primary-color, #ff6b35);
    background-color: var(--bg-hover, #fffbf8);
  }

  &:focus {
    border-color: var(--primary-color, #ff6b35);
    box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
    background-color: var(--bg-white, #ffffff);
  }

  &:disabled {
    background-color: var(--bg-disabled, #f9fafb);
    color: var(--text-disabled, #9ca3af);
    cursor: not-allowed;
    opacity: 0.6;
    user-select: none;
  }

  // 有值时的样式
  &[value]:not([value='']) {
    font-weight: 500;
    color: var(--text-primary, #1f2937);
  }
}

.date-range-container {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  position: relative;
  padding: 4px;
  background: linear-gradient(135deg, rgba(255, 107, 53, 0.03) 0%, rgba(255, 107, 53, 0.01) 100%);
  border-radius: 12px;

  .date-input-wrapper {
    flex: 1;
  }

  .date-picker-input {
    min-width: 130px;
    width: 100%;
  }
}

.range-separator {
  color: var(--text-secondary, #6b7280);
  font-size: 14px;
  font-weight: 500;
  padding: 0 2px;
  user-select: none;
  display: flex;
  align-items: center;
  height: 38px;
  position: relative;

  // 添加装饰性连接线
  &::before {
    content: '';
    position: absolute;
    left: -8px;
    right: -8px;
    height: 1px;
    background: linear-gradient(
      90deg,
      var(--primary-color, #ff6b35) 0%,
      transparent 50%,
      var(--primary-color, #ff6b35) 100%
    );
    opacity: 0.3;
    top: 50%;
    transform: translateY(-50%);
  }
}

// 添加动画效果
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.date-picker-container {
  animation: fadeIn 0.3s ease;
}

// 响应式样式
@media (max-width: 768px) {
  .date-range-container {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
    padding: 12px;
    background: var(--bg-white, #ffffff);
    border: 1px solid var(--border-color, #e5e7eb);
    border-radius: 12px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

    .date-picker-input {
      width: 100%;
      min-width: unset;
    }

    .range-separator {
      display: none;
    }
  }
}

// 小屏幕优化
@media (max-width: 480px) {
  .date-picker-input {
    font-size: 16px; // 防止iOS缩放
    padding: 10px 36px 10px 14px;
  }

  .date-range-container {
    padding: 16px;
    gap: 16px;
  }
}

// 暗色模式支持（如果项目使用）
@media (prefers-color-scheme: dark) {
  .date-picker-input {
    background-color: var(--bg-dark, #1f2937);
    border-color: var(--border-dark, #374151);
    color: var(--text-dark, #f3f4f6);

    &:hover:not(:disabled) {
      background-color: var(--bg-dark-hover, #374151);
      border-color: var(--primary-dark, #ff8c61);
    }

    &:focus {
      box-shadow: 0 0 0 3px rgba(255, 140, 97, 0.2);
    }
  }

  .date-range-container {
    background: linear-gradient(135deg, rgba(255, 107, 53, 0.1) 0%, rgba(255, 107, 53, 0.05) 100%);
  }
}
</style>
