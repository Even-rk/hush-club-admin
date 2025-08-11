<template>
  <div
    ref="selectRef"
    class="cool-select"
    :class="{
      'cool-select--open': isOpen,
      'cool-select--disabled': disabled,
      'cool-select--multiple': multiple
    }"
    tabindex="0"
    @blur="handleBlur"
    @keydown="handleKeydown"
  >
    <div
      class="cool-select__trigger"
      :class="{
        'cool-select__trigger--focus': isOpen,
        'cool-select--multiple': multiple
      }"
      @click="toggleDropdown"
    >
      <div v-if="multiple && selectedOptions.length > 0" class="cool-select__tags">
        <span
          v-for="tag in selectedOptions.slice(0, maxDisplayTags)"
          :key="tag.value"
          class="cool-select__tag"
        >
          {{ tag.label }}
          <span class="cool-select__tag-remove" @click.stop="removeTag(tag)">×</span>
        </span>
        <span v-if="selectedOptions.length > maxDisplayTags" class="cool-select__tag">
          +{{ selectedOptions.length - maxDisplayTags }}
        </span>
      </div>
      <span
        v-else
        :class="
          selectedOptions.length || selectedOption?.label
            ? 'cool-select__value'
            : 'cool-select__value-placeholder'
        "
      >
        {{ displayText }}
      </span>
      <span class="cool-select__arrow" :class="{ 'cool-select__arrow--open': isOpen }"> ▼ </span>
    </div>

    <Teleport to="body">
      <transition name="dropdown">
        <div v-if="isOpen" ref="dropdownRef" class="cool-select__dropdown" :style="dropdownStyle">
          <div
            v-if="searchable && (filteredOptions.length > 0 || searchQuery)"
            class="cool-select__search"
          >
            <input
              v-model="searchQuery"
              type="text"
              class="cool-select__search-input"
              placeholder="搜索..."
              @click.stop
              @keydown.stop
            />
          </div>
          <div class="cool-select__options">
            <div
              v-if="multiple && filteredOptions.length > 0"
              class="cool-select__option"
              @click="toggleSelectAll"
            >
              <span class="cool-select__option-text">
                {{ isAllSelected ? '取消全选' : '全选' }}
              </span>
              <span v-if="isAllSelected" class="cool-select__check">✓</span>
            </div>
            <div
              v-for="(option, index) in filteredOptions"
              :key="option.value"
              class="cool-select__option"
              :class="{
                'cool-select__option--selected': isOptionSelected(option),
                'cool-select__option--disabled': option.disabled || isOptionDisabled(option),
                'cool-select__option--highlighted': index === selectedIndex
              }"
              @click="selectOption(option)"
              @mouseenter="selectedIndex = index"
            >
              <span class="cool-select__option-text">{{ option.label }}</span>
              <span v-if="isOptionSelected(option)" class="cool-select__check">✓</span>
            </div>
            <div v-if="filteredOptions.length === 0" class="cool-select__empty">
              <span class="cool-select__empty-text">
                {{ searchQuery ? '没有找到匹配的结果' : '暂无数据' }}
              </span>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'

interface SelectOption {
  label: string
  value: string | number
  disabled?: boolean
}

interface Props {
  modelValue: string | number | (string | number)[] | undefined
  options: SelectOption[]
  placeholder?: string
  disabled?: boolean
  multiple?: boolean
  maxSelect?: number
  maxDisplayTags?: number
  searchable?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: string | number | (string | number)[]): void
  (e: 'change', value: string | number | (string | number)[]): void
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '请选择',
  disabled: false,
  multiple: false,
  maxSelect: Infinity,
  maxDisplayTags: 3,
  searchable: false
})

const emit = defineEmits<Emits>()

const isOpen = ref(false)
const selectRef = ref<HTMLElement>()
const dropdownRef = ref<HTMLElement>()
const dropdownStyle = ref<Record<string, string>>({})
const selectedIndex = ref(-1)
const blurTimer = ref<number | null>(null)
const searchQuery = ref('')

const selectedOption = computed(() => {
  if (props.multiple) {
    return null
  }
  return props.options.find(option => option.value === props.modelValue)
})

const selectedOptions = computed(() => {
  if (!props.multiple) {
    return []
  }
  const selectedValues = Array.isArray(props.modelValue) ? props.modelValue : []
  return props.options.filter(option => selectedValues.includes(option.value))
})

const displayText = computed(() => {
  if (props.multiple) {
    const selected = selectedOptions.value
    if (selected.length === 0) {
      return props.placeholder
    }
    if (selected.length === 1) {
      return selected[0].label
    }
    return `已选择 ${selected.length} 项`
  }

  const singleOption = selectedOption.value
  return singleOption ? singleOption.label : props.placeholder
})

const filteredOptions = computed(() => {
  if (!props.searchable || !searchQuery.value.trim()) {
    return props.options
  }

  const query = searchQuery.value.toLowerCase()
  return props.options.filter(
    option =>
      option.label.toLowerCase().includes(query) ||
      String(option.value).toLowerCase().includes(query)
  )
})

// 计算下拉框位置
const calculateDropdownPosition = async () => {
  if (!selectRef.value || !isOpen.value) {
    return
  }

  await nextTick()

  const rect = selectRef.value.getBoundingClientRect()
  const windowHeight = window.innerHeight
  const dropdownHeight = dropdownRef.value?.offsetHeight || 240

  // 判断下拉框应该向上还是向下展开
  const shouldOpenUpward = rect.bottom + dropdownHeight > windowHeight && rect.top > dropdownHeight

  dropdownStyle.value = {
    position: 'fixed',
    left: `${rect.left}px`,
    width: `${rect.width}px`,
    ...(shouldOpenUpward
      ? { bottom: `${windowHeight - rect.top + 4}px` }
      : { top: `${rect.bottom + 4}px` })
  }
}

const toggleDropdown = () => {
  if (props.disabled) {
    return
  }
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    calculateDropdownPosition()
    // 重置键盘导航索引
    selectedIndex.value = filteredOptions.value.findIndex(opt => opt.value === props.modelValue)
    if (selectedIndex.value === -1) {
      selectedIndex.value = 0
    }
  } else {
    selectedIndex.value = -1
    searchQuery.value = ''
  }
}

const isOptionSelected = (option: SelectOption) => {
  if (props.multiple) {
    const selectedValues = Array.isArray(props.modelValue) ? props.modelValue : []
    return selectedValues.includes(option.value)
  }
  return option.value === props.modelValue
}

const isOptionDisabled = (option: SelectOption) => {
  if (!props.multiple || option.disabled) {
    return option.disabled || false
  }

  const selectedValues = Array.isArray(props.modelValue) ? props.modelValue : []
  return (
    props.maxSelect !== Infinity &&
    selectedValues.length >= props.maxSelect &&
    !selectedValues.includes(option.value)
  )
}

const isAllSelected = computed(() => {
  if (!props.multiple) {
    return false
  }
  const selectedValues = Array.isArray(props.modelValue) ? props.modelValue : []
  const enabledOptions = filteredOptions.value.filter(opt => !opt.disabled)
  return (
    enabledOptions.length > 0 && enabledOptions.every(opt => selectedValues.includes(opt.value))
  )
})

const selectOption = (option: SelectOption) => {
  if (option.disabled || isOptionDisabled(option)) {
    return
  }

  if (props.multiple) {
    const currentValues = Array.isArray(props.modelValue) ? [...props.modelValue] : []
    const newValues = isOptionSelected(option)
      ? currentValues.filter(v => v !== option.value)
      : [...currentValues, option.value]

    emit('update:modelValue', newValues)
    emit('change', newValues)
    // 多选模式下不自动关闭下拉框
  } else {
    emit('update:modelValue', option.value)
    emit('change', option.value)
    isOpen.value = false
  }
}

const removeTag = (tag: SelectOption) => {
  if (props.disabled || !props.multiple) {
    return
  }

  const currentValues = Array.isArray(props.modelValue) ? [...props.modelValue] : []
  const newValues = currentValues.filter(v => v !== tag.value)

  emit('update:modelValue', newValues)
  emit('change', newValues)
}

const toggleSelectAll = () => {
  if (!props.multiple) {
    return
  }

  const enabledOptions = props.options.filter(opt => !opt.disabled)
  if (enabledOptions.length === 0) {
    return
  }

  if (isAllSelected.value) {
    // 取消全选
    const selectedValues = Array.isArray(props.modelValue) ? props.modelValue : []
    const newValues = selectedValues.filter(v => !enabledOptions.some(opt => opt.value === v))
    emit('update:modelValue', newValues)
    emit('change', newValues)
  } else {
    // 全选
    const selectedValues = Array.isArray(props.modelValue) ? props.modelValue : []
    const enabledValues = enabledOptions.map(opt => opt.value)
    const newValues = [...new Set([...selectedValues, ...enabledValues])].slice(0, props.maxSelect)
    emit('update:modelValue', newValues)
    emit('change', newValues)
  }
}

const closeDropdown = () => {
  isOpen.value = false
  selectedIndex.value = -1
}

// 处理失焦事件
const handleBlur = (event: FocusEvent) => {
  // 延迟关闭，以允许点击下拉选项
  blurTimer.value = window.setTimeout(() => {
    const relatedTarget = event.relatedTarget as HTMLElement

    // 如果焦点移到了下拉框内部，不关闭
    if (dropdownRef.value?.contains(relatedTarget)) {
      return
    }

    closeDropdown()
  }, 200)
}

// 键盘导航选项
const navigateOptions = (direction: number) => {
  const enabledOptions = filteredOptions.value.filter(opt => !opt.disabled)
  if (enabledOptions.length === 0) {
    return
  }

  let currentIndex = selectedIndex.value

  if (currentIndex === -1) {
    // 如果没有选中项，从第一个或最后一个开始
    selectedIndex.value = direction > 0 ? 0 : filteredOptions.value.length - 1
  } else {
    // 移动到下一个/上一个非禁用选项
    do {
      currentIndex = currentIndex + direction

      if (currentIndex < 0) {
        currentIndex = filteredOptions.value.length - 1
      } else if (currentIndex >= filteredOptions.value.length) {
        currentIndex = 0
      }

      selectedIndex.value = currentIndex
    } while (filteredOptions.value[currentIndex]?.disabled)
  }

  // 滚动到可见区域
  nextTick(() => {
    const optionElements = dropdownRef.value?.querySelectorAll('.cool-select__option')
    if (optionElements && optionElements[selectedIndex.value]) {
      optionElements[selectedIndex.value].scrollIntoView({ block: 'nearest' })
    }
  })
}

// 处理键盘事件
const handleKeydown = (event: KeyboardEvent) => {
  if (props.disabled) {
    return
  }

  switch (event.key) {
    case 'Enter':
    case ' ':
      event.preventDefault()
      if (isOpen.value && selectedIndex.value >= 0) {
        const option = filteredOptions.value[selectedIndex.value]
        if (option && !option.disabled) {
          selectOption(option)
        }
      } else {
        toggleDropdown()
      }
      break

    case 'Escape':
      event.preventDefault()
      closeDropdown()
      break

    case 'ArrowDown':
      event.preventDefault()
      if (!isOpen.value) {
        isOpen.value = true
        calculateDropdownPosition()
      } else {
        navigateOptions(1)
      }
      break

    case 'ArrowUp':
      event.preventDefault()
      if (isOpen.value) {
        navigateOptions(-1)
      }
      break

    case 'Tab':
      // 让 Tab 键正常工作，自然失焦
      closeDropdown()
      break
  }
}

// 点击外部关闭下拉框
const handleClickOutside = (event: Event) => {
  // 清除失焦定时器
  if (blurTimer.value) {
    clearTimeout(blurTimer.value)
    blurTimer.value = null
  }

  const target = event.target as HTMLElement

  // 检查点击是否在当前组件内或下拉框内
  const isInsideSelect = selectRef.value && selectRef.value.contains(target)
  const isInsideDropdown = dropdownRef.value && dropdownRef.value.contains(target)
  const isTagRemove =
    target.classList.contains('cool-select__tag-remove') ||
    target.closest('.cool-select__tag-remove') !== null

  // 如果点击不在组件内且不在下拉框内，且不是标签删除按钮，则关闭
  if (!isInsideSelect && !isInsideDropdown && !isTagRemove) {
    closeDropdown()
  }
}

// 监听窗口大小变化，重新计算位置
const handleResize = () => {
  if (isOpen.value) {
    calculateDropdownPosition()
  }
}

// 监听滚动事件，更新下拉框位置
const handleScroll = () => {
  if (isOpen.value) {
    calculateDropdownPosition()
  }
}

watch(isOpen, newVal => {
  if (newVal) {
    calculateDropdownPosition()
    // 打开时聚焦到组件，以便键盘导航
    nextTick(() => {
      selectRef.value?.focus()
    })
  }
})

watch(searchQuery, () => {
  // 搜索词改变时重置选中索引
  selectedIndex.value = 0
})

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  window.addEventListener('resize', handleResize)
  window.addEventListener('scroll', handleScroll, true)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  window.removeEventListener('resize', handleResize)
  window.removeEventListener('scroll', handleScroll, true)

  // 清理失焦定时器
  if (blurTimer.value) {
    clearTimeout(blurTimer.value)
    blurTimer.value = null
  }
})
</script>

<style lang="scss" scoped>
.cool-select {
  position: relative;
  width: 100%;
  font-size: 14px;
  outline: none;

  &:focus-visible {
    .cool-select__trigger {
      border-color: var(--primary-color);
      box-shadow: 0 0 0 3px var(--primary-glow);
    }
  }

  &--multiple {
    .cool-select__trigger {
      min-height: 44px;
      height: auto;
      padding: 8px 16px;
    }

    .cool-select__value {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
      align-items: center;
    }
  }

  &--disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

.cool-select__trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: var(--bg-glass);
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
  cursor: pointer;
  transition: all var(--transition-normal);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(0, 217, 255, 0.1), transparent);
    transition: left 0.5s;
  }

  &:hover::before {
    left: 100%;
  }

  &:hover {
    border-color: var(--primary-color);
    background: var(--bg-secondary);
    box-shadow: 0 0 15px var(--primary-glow);
  }

  &--focus {
    border-color: var(--primary-color);
    box-shadow:
      0 0 0 3px var(--primary-glow),
      0 0 20px var(--primary-glow);
    background: var(--bg-secondary);
  }

  .cool-select--disabled & {
    cursor: not-allowed;

    &:hover {
      border-color: var(--border-color);
      box-shadow: none;
    }
  }
}

.cool-select__value {
  flex: 1;
  color: var(--text-primary);
  font-weight: 500;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.cool-select__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  align-items: center;
}

.cool-select__tag {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  background: var(--primary-color);
  color: white;
  border-radius: 12px;
  font-size: 12px;
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.cool-select__tag-remove {
  margin-left: 4px;
  cursor: pointer;
  font-size: 14px;
  opacity: 0.8;
  transition: opacity 0.2s;

  &:hover {
    opacity: 1;
  }
}

.cool-select__value-placeholder {
  color: var(--text-secondary);
}

.cool-select__arrow {
  font-size: 12px;
  color: var(--text-secondary);
  transition: transform var(--transition-normal);
  margin-left: 8px;
  filter: drop-shadow(0 0 5px currentColor);

  &--open {
    transform: rotate(180deg);
    color: var(--primary-color);
  }
}

.cool-select__dropdown {
  background: var(--bg-card);
  backdrop-filter: blur(20px);
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
  box-shadow: var(--shadow-dark), var(--shadow-glow);
  z-index: 9999;
  overflow: hidden;
  max-height: 240px;
  overflow-y: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
}

.cool-select__options {
  padding: 8px 0;
}

.cool-select__option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  cursor: pointer;
  transition: all var(--transition-fast);
  position: relative;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 0;
    height: 100%;
    background: var(--gradient-neon);
    opacity: 0.1;
    transition: width var(--transition-fast);
  }

  &:hover::before {
    width: 100%;
  }

  &:hover {
    background: var(--bg-glass);
    color: var(--primary-color);
    transform: translateX(4px);
  }

  &--selected {
    background: var(--bg-tertiary);
    color: var(--primary-color);
    font-weight: 600;

    &::before {
      width: 100%;
    }
  }

  &--highlighted {
    background: var(--bg-glass);
    color: var(--primary-color);

    &::before {
      width: 100%;
      opacity: 0.05;
    }
  }

  &--disabled {
    opacity: 0.5;
    cursor: not-allowed;

    &:hover {
      background: transparent;
      color: var(--text-secondary);
      transform: none;

      &::before {
        width: 0;
      }
    }
  }
}

.cool-select__option-text {
  flex: 1;
  color: inherit;
}

.cool-select__check {
  font-size: 16px;
  color: var(--primary-color);
  font-weight: bold;
  animation: checkBounce 0.3s ease;
  filter: drop-shadow(0 0 5px var(--primary-color));
}

.cool-select__empty {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 16px;
  color: var(--text-secondary);
  font-size: 14px;
  text-align: center;
  pointer-events: none;
}

.cool-select__empty-text {
  opacity: 0.7;
}

.cool-select__search {
  padding: 8px 16px;
  border-bottom: 1px solid var(--border-color);
}

.cool-select__search-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
  background: var(--bg-glass);
  color: var(--text-primary);
  font-size: 14px;
  outline: none;
  transition: all var(--transition-fast);

  &:focus {
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px var(--primary-glow);
  }

  &::placeholder {
    color: var(--text-secondary);
  }
}

@keyframes checkBounce {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

/* 下拉动画 */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.3s ease;
  transform-origin: top;
}

.dropdown-enter-from {
  opacity: 0;
  transform: scaleY(0.8) translateY(-10px);
}

.dropdown-leave-to {
  opacity: 0;
  transform: scaleY(0.8) translateY(-10px);
}

/* 滚动条样式 */
.cool-select__dropdown::-webkit-scrollbar {
  width: 6px;
}

.cool-select__dropdown::-webkit-scrollbar-track {
  background: var(--bg-secondary);
}

.cool-select__dropdown::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: 3px;
  transition: background var(--transition-fast);
}

.cool-select__dropdown::-webkit-scrollbar-thumb:hover {
  background: var(--primary-color);
  box-shadow: 0 0 5px var(--primary-glow);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .cool-select__trigger {
    padding: 10px 14px;
  }

  .cool-select__option {
    padding: 10px 14px;
  }

  .cool-select__dropdown {
    max-height: 200px;
  }
}
</style>
