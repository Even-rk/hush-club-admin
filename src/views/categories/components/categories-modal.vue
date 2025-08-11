<template>
  <transition name="modal-fade">
    <div v-if="visible" class="category-modal-overlay" @click="emit('close')">
      <transition name="modal-scale">
        <div v-if="visible" class="category-modal" @click.stop>
          <!-- 装饰性背景 -->
          <div class="modal-decoration">
            <div class="decoration-circle decoration-circle-1"></div>
            <div class="decoration-circle decoration-circle-2"></div>
          </div>

          <!-- 弹窗头部 -->
          <div class="category-modal-header">
            <div class="header-content">
              <div class="header-icon">
                {{ mode === 'add' ? '🎯' : '✏️' }}
              </div>
              <h3 class="modal-title">
                {{ mode === 'add' ? '添加分类' : '编辑分类' }}
              </h3>
            </div>
            <button class="modal-close" @click="emit('close')">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <!-- 弹窗内容 -->
          <div class="category-modal-body">
            <form class="category-form">
              <!-- 分类名称 -->
              <div class="form-group">
                <label class="form-label required">分类名称</label>
                <input
                  v-model="form.category_name"
                  type="text"
                  class="form-control"
                  placeholder="请输入分类名称"
                  maxlength="50"
                />
              </div>

              <!-- 关联商品 -->
              <div class="form-group">
                <label class="form-label">关联商品</label>
                <CoolSelect
                  v-model="selectedProductIds"
                  :options="productList"
                  :multiple="true"
                  :searchable="true"
                  placeholder="请选择关联商品"
                />
              </div>

              <!-- 分类别名 -->
              <div class="form-group">
                <label class="form-label required">分类别名</label>
                <input
                  v-model="form.category_code"
                  type="text"
                  class="form-control"
                  placeholder="请输入分类名称"
                  maxlength="50"
                />
              </div>

              <!-- 排序权重 -->
              <div class="form-group">
                <label class="form-label required">排序权重</label>
                <input
                  v-model="form.sort_order"
                  type="number"
                  class="form-control"
                  placeholder="请输入排序权重"
                  min="0"
                  max="999"
                />
                <small class="form-help">数值越小，排序越靠前</small>
              </div>

              <!-- 状态 -->
              <div class="form-group">
                <label class="form-label required">分类状态</label>
                <div class="radio-group">
                  <label class="radio-item">
                    <input v-model="form.status" type="radio" value="active" />
                    <span class="radio-label">启用</span>
                  </label>
                  <label class="radio-item">
                    <input v-model="form.status" type="radio" value="inactive" />
                    <span class="radio-label">禁用</span>
                  </label>
                </div>
              </div>
            </form>
          </div>

          <!-- 弹窗底部 -->
          <div class="category-modal-footer">
            <button class="btn btn-secondary" @click="emit('close')">
              <span class="btn-icon">❌</span>
              取消
            </button>
            <button class="btn btn-primary" :disabled="loading" @click="submit">
              <span v-if="!loading" class="btn-icon">✅</span>
              <span v-if="loading" class="loading-spinner"></span>
              {{ loading ? '提交中...' : '确定' }}
            </button>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { ProductCategory } from '@/types/supabase'
import { reqAddCategory } from '@/api/supabase/INSERT'
import { updateProductCategory } from '@/api/supabase/UPDATE'
import { reqGetProductList } from '@/api/supabase'
// 引入 CoolSelect 组件
import CoolSelect from '@/components/cool-select.vue'

interface Emits {
  (e: 'close'): void
  (e: 'success', data: ProductCategory, mode: 'add' | 'edit'): void
}

const props = defineProps<{
  visible: boolean
  mode: 'add' | 'edit'
  categoryData: ProductCategory
}>()

const emit = defineEmits<Emits>()

// 表单数据
const form = ref({} as ProductCategory)
// 关联商品
const selectedProductIds = ref<number[]>([])
// 商品列表
const productList = ref<{ label: string; value: number }[]>([])

// 加载状态
const loading = ref(false)

// 提交表单
const submit = async () => {
  loading.value = true
  if (props.mode == 'add') {
    await reqAddCategory(form.value)
    emit('success', form.value, 'add')
  } else {
    await updateProductCategory({
      id: form.value.id,
      data: form.value
    })
    emit('success', form.value, 'edit')
  }
}

// 初始化表单数据
onMounted(async () => {
  form.value = props.categoryData
  // 商品列表
  const productListData = await reqGetProductList()
  productList.value = productListData.map(item => ({
    label: item.product_name,
    value: item.id
  }))
})
</script>

<style scoped lang="scss">
// 动画效果
@keyframes modalFadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes modalScaleIn {
  from {
    transform: scale(0.9);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

// 过渡动画
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-scale-enter-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-scale-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 1, 1);
}

.modal-scale-enter-from {
  transform: scale(0.9);
  opacity: 0;
}

.modal-scale-leave-to {
  transform: scale(0.9);
  opacity: 0;
}

.category-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  animation: modalFadeIn 0.2s ease;
}

.category-modal {
  background: linear-gradient(135deg, var(--bg-white) 0%, #fafafa 100%);
  border-radius: 20px;
  box-shadow:
    0 25px 50px -12px rgba(0, 0, 0, 0.25),
    0 0 0 1px rgba(0, 0, 0, 0.05);
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
}

// 装饰性背景
.modal-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;

  .decoration-circle {
    position: absolute;
    border-radius: 50%;

    &.decoration-circle-1 {
      width: 300px;
      height: 300px;
      background: radial-gradient(circle, rgba(255, 107, 53, 0.1) 0%, transparent 70%);
      top: -150px;
      right: -150px;
      animation: float 20s infinite ease-in-out;
    }

    &.decoration-circle-2 {
      width: 200px;
      height: 200px;
      background: radial-gradient(circle, rgba(255, 140, 97, 0.08) 0%, transparent 70%);
      bottom: -100px;
      left: -100px;
      animation: float 15s infinite ease-in-out reverse;
    }
  }
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
  }
}

.category-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 28px;
  background: linear-gradient(135deg, var(--primary-light) 0%, var(--primary-color) 100%);
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  }

  .header-content {
    display: flex;
    align-items: center;
    gap: 12px;

    .header-icon {
      width: 36px;
      height: 36px;
      background: rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(10px);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
    }
  }

  .modal-title {
    margin: 0;
    font-size: 20px;
    font-weight: 700;
    color: var(--bg-white);
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .modal-close {
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    color: var(--bg-white);
    cursor: pointer;
    padding: 0;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    transition: all 0.3s ease;

    &:hover {
      background: rgba(255, 255, 255, 0.3);
      transform: rotate(90deg);
    }

    svg {
      width: 20px;
      height: 20px;
    }
  }
}

.category-modal-body {
  padding: 28px;
  overflow-y: auto;
  flex: 1;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: var(--border-color);
    border-radius: 3px;

    &:hover {
      background: var(--text-light);
    }
  }
}

.category-modal-footer {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding: 20px 28px;
  background: linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.02) 100%);
  border-top: 1px solid rgba(0, 0, 0, 0.06);

  .btn {
    min-width: 100px;
    padding: 10px 20px;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    position: relative;
    overflow: hidden;

    .btn-icon {
      font-size: 16px;
      transition: transform 0.3s ease;
    }

    &:hover .btn-icon {
      transform: scale(1.2);
    }

    &.btn-secondary {
      background: linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%);
      color: var(--text-primary);
      border: 1px solid var(--border-color);

      &:hover {
        background: linear-gradient(135deg, #e0e0e0 0%, #d0d0d0 100%);
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }

      &:active {
        transform: translateY(0);
      }
    }

    &.btn-primary {
      background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
      color: white;
      box-shadow: 0 4px 15px rgba(255, 107, 53, 0.3);

      &::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 0;
        height: 0;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: translate(-50%, -50%);
        transition:
          width 0.6s,
          height 0.6s;
      }

      &:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(255, 107, 53, 0.4);

        &::before {
          width: 300px;
          height: 300px;
        }
      }

      &:active:not(:disabled) {
        transform: translateY(0);
      }

      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        box-shadow: none;
      }
    }

    .loading-spinner {
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top: 2px solid white;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
  }
}

// 表单样式
.category-form {
  .form-group {
    margin-bottom: 24px;
    animation: slideInUp 0.4s ease-out;
    animation-fill-mode: both;

    @for $i from 1 through 10 {
      &:nth-child(#{$i}) {
        animation-delay: #{$i * 0.05}s;
      }
    }

    &:last-child {
      margin-bottom: 0;
    }
  }

  .form-label {
    display: block;
    margin-bottom: 8px;
    font-size: 13px;
    font-weight: 600;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.5px;

    &.required::after {
      content: ' *';
      color: var(--primary-color);
      font-size: 14px;
    }
  }

  .form-control {
    width: 100%;
    padding: 10px 14px;
    border: 2px solid var(--border-light);
    border-radius: 10px;
    font-size: 14px;
    background: var(--bg-white);
    transition: all 0.3s ease;

    &:focus {
      outline: none;
      border-color: var(--primary-color);
      box-shadow: 0 0 0 4px rgba(255, 107, 53, 0.1);
      transform: translateY(-2px);
    }

    &::placeholder {
      color: var(--text-light);
      font-size: 13px;
    }

    &:hover:not(:focus) {
      border-color: var(--border-hover);
    }
  }

  .form-textarea {
    resize: vertical;
    min-height: 80px;
    font-family: inherit;
  }

  .form-help {
    display: block;
    margin-top: 4px;
    font-size: 12px;
    color: var(--text-light);
  }

  .radio-group {
    display: flex;
    gap: 16px;

    .radio-item {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      padding: 8px 16px;
      border: 2px solid var(--border-light);
      border-radius: 10px;
      transition: all 0.3s ease;

      &:hover {
        border-color: var(--primary-light);
        background: rgba(255, 107, 53, 0.05);
      }

      &:has(input:checked) {
        border-color: var(--primary-color);
        background: linear-gradient(
          135deg,
          rgba(255, 107, 53, 0.1) 0%,
          rgba(255, 107, 53, 0.05) 100%
        );
      }

      input[type='radio'] {
        margin: 0;
        accent-color: var(--primary-color);
        width: 16px;
        height: 16px;
      }

      .radio-label {
        font-size: 14px;
        color: var(--text-primary);
        font-weight: 500;
      }
    }
  }
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
