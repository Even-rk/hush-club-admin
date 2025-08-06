<template>
  <div v-if="visible" class="product-modal-overlay" @click="onOverlayClick">
    <div class="product-modal" @click.stop>
      <!-- 弹窗头部 -->
      <div class="product-modal-header">
        <h3 class="modal-title">
          {{ mode === 'add' ? '添加商品' : '编辑商品' }}
        </h3>
        <button class="modal-close" @click="close">×</button>
      </div>

      <!-- 弹窗内容 -->
      <div class="product-modal-body">
        <!-- 编辑/添加模式 -->
        <form class="product-form">
          <!-- 商品名称 -->
          <div class="form-group">
            <label class="form-label required">商品名称</label>
            <input type="text" class="form-control" placeholder="请输入商品名称" maxlength="100" />
          </div>

          <!-- 商品分类 -->
          <div class="form-group">
            <label class="form-label required">商品分类</label>
            <cool-select
              v-model="selectedCategory"
              :options="categoryOptions"
              placeholder="请选择商品分类"
            />
          </div>

          <!-- 商品图片 -->
          <div class="form-group">
            <label class="form-label">商品图片</label>
            <div class="image-upload">
              <!-- <div class="image-preview">
                <img alt="商品图片" />
                <button type="button" class="remove-image">×</button>
              </div> -->
              <div class="upload-placeholder">
                <input ref="fileInputRef" type="file" accept="image/*" class="file-input" />
                <div class="upload-content">
                  <div class="upload-icon">📷</div>
                  <div class="upload-text">点击上传图片</div>
                </div>
              </div>
            </div>
          </div>

          <!-- 会员价格 -->
          <div class="form-group">
            <label class="form-label required">价格设置</label>
            <div class="price-form-grid">
              <div class="price-form-item">
                <div class="input-group">
                  <span class="input-prefix">¥</span>
                  <input
                    type="number"
                    class="form-control"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- 状态 -->
          <div class="form-group">
            <label class="form-label">商品状态</label>
            <div class="radio-group">
              <label class="radio-item">
                <input v-model="form.status" type="radio" value="active" />
                <span class="radio-label">上架</span>
              </label>
              <label class="radio-item">
                <input v-model="form.status" type="radio" value="inactive" />
                <span class="radio-label">下架</span>
              </label>
            </div>
          </div>
        </form>
      </div>

      <!-- 弹窗底部 -->
      <div class="product-modal-footer">
        <button class="btn btn-secondary" @click="close">取消</button>
        <button class="btn btn-primary" :disabled="loading" :class="{ 'btn-loading': loading }">
          <span v-if="loading" class="loading-spinner"></span>
          {{ loading ? '提交中...' : '确定' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { reqGetAllCategory } from '@/api/supabase'
import type { Product, ProductCategory } from '@/types/supabase'
import CoolSelect from './cool-select.vue'

interface ProductForm {
  id?: number
  product_name: string
  category_id: number | string
  image_url: string
  normal_member_price: number
  silver_member_price: number
  gold_member_price: number
  status: 'active' | 'inactive'
}

const props = defineProps<{
  visible: boolean
  mode?: 'view' | 'edit' | 'add'
  productData: Product
}>()

const emit = defineEmits<{
  close: []
  success: [data: ProductForm & { id?: number }, mode: string]
}>()

// 表单数据
const form = reactive({} as Product)
// 文件输入引用
const fileInputRef = ref<HTMLInputElement>()

// 加载状态
const loading = ref(false)

// 商品分类列表
const categories = ref<ProductCategory[]>([])

// 选择器状态
const selectedCategory = ref<string | number>('')

// 分类选项 - 将分类数据转换为选择器选项格式
const categoryOptions = computed(() => {
  return categories.value.map(category => ({
    label: category.category_name,
    value: category.id
  }))
})

// 当前模式
const currentMode = ref(props.mode)

// 获取商品分类列表
const loadCategories = async () => {
  try {
    categories.value = await reqGetAllCategory()
  } catch (error) {
    console.error('获取商品分类失败:', error)
  }
}

// 关闭弹窗
const close = () => {
  currentMode.value = props.mode
  emit('close')
}
// 点击遮罩层关闭
const onOverlayClick = () => {
  close()
}

// 组件挂载时加载分类数据
onMounted(() => {
  loadCategories()
})
</script>

<style scoped lang="scss">
.product-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.product-modal {
  background: var(--bg-white);
  border-radius: var(--radius);
  box-shadow: var(--shadow-lg);
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.product-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid var(--border-color);

  .modal-title {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: var(--text-primary);
  }

  .modal-close {
    background: none;
    border: none;
    font-size: 24px;
    color: var(--text-secondary);
    cursor: pointer;
    padding: 0;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: all 0.2s ease;

    &:hover {
      background: var(--bg-gray);
      color: var(--text-primary);
    }
  }
}

.product-modal-body {
  padding: 24px;
  overflow-y: auto;
  flex: 1;
}

.product-modal-footer {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding: 16px 24px;
  border-top: 1px solid var(--border-color);

  .btn {
    min-width: 80px;
    padding: 8px 16px;
    border-radius: var(--radius);
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s ease;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;

    &.btn-secondary {
      background: var(--bg-gray);
      color: var(--text-primary);

      &:hover {
        background: #e0e0e0;
      }
    }

    &.btn-primary {
      background: var(--primary-color);
      color: white;

      &:hover:not(:disabled) {
        background: var(--primary-dark);
      }

      &:disabled,
      &.btn-loading {
        opacity: 0.7;
        cursor: not-allowed;
      }
    }

    .loading-spinner {
      width: 14px;
      height: 14px;
      border: 2px solid transparent;
      border-top: 2px solid currentColor;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
  }
}

// 表单样式
.product-form {
  .form-group {
    margin-bottom: 20px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .form-label {
    display: block;
    margin-bottom: 6px;
    font-size: 14px;
    font-weight: 500;
    color: var(--text-primary);

    &.required::after {
      content: ' *';
      color: var(--error-color);
    }
  }

  .form-control {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid var(--border-color);
    border-radius: var(--radius);
    font-size: 14px;
    transition: border-color 0.3s ease;

    &:focus {
      outline: none;
      border-color: var(--primary-color);
    }

    &::placeholder {
      color: var(--text-light);
    }
  }

  .image-upload {
    border: 2px dashed var(--border-color);
    border-radius: var(--radius);
    overflow: hidden;
    margin-bottom: 8px;

    .image-preview {
      position: relative;

      img {
        width: 100%;
        height: 200px;
        object-fit: contain;
        display: block;
      }

      .remove-image {
        position: absolute;
        top: 8px;
        right: 8px;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: rgba(0, 0, 0, 0.6);
        color: white;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;

        &:hover {
          background: rgba(0, 0, 0, 0.8);
        }
      }
    }

    .upload-placeholder {
      .file-input {
        display: none;
      }

      .upload-content {
        padding: 40px 20px;
        text-align: center;
        cursor: pointer;
        transition: background-color 0.3s ease;

        &:hover {
          background-color: var(--bg-gray);
        }

        .upload-icon {
          font-size: 32px;
          margin-bottom: 8px;
        }

        .upload-text {
          font-size: 14px;
          color: var(--text-primary);
        }
      }
    }
  }

  .price-form-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 16px;

    .price-form-item {
      .price-label {
        display: block;
        margin-bottom: 6px;
        font-size: 12px;
        font-weight: 500;
        color: var(--text-secondary);
      }
    }
  }

  .input-group {
    position: relative;
    display: flex;
    align-items: center;

    .input-prefix {
      position: absolute;
      left: 12px;
      color: var(--text-secondary);
      font-size: 14px;
      z-index: 1;
    }

    .form-control {
      padding-left: 28px;
    }
  }

  .radio-group {
    display: flex;
    gap: 16px;

    .radio-item {
      display: flex;
      align-items: center;
      gap: 6px;
      cursor: pointer;

      input[type='radio'] {
        margin: 0;
      }

      .radio-label {
        font-size: 14px;
        color: var(--text-primary);
      }
    }
  }

  select.form-control {
    cursor: pointer;

    option {
      padding: 8px;
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .product-modal-overlay {
    padding: 10px;
  }

  .product-modal {
    max-width: none;
    max-height: calc(100vh - 20px);
  }

  .product-modal-header {
    padding: 16px 20px;

    .modal-title {
      font-size: 16px;
    }
  }
  .product-modal-body {
    padding: 20px;
  }
  .product-modal-footer {
    padding: 12px 20px;
    .btn {
      min-width: 70px;
      font-size: 14px;
    }
  }
  .product-detail {
    .product-info {
      flex-direction: column;
      .product-image {
        width: 100%;
        max-width: 300px;
        margin: 0 auto;
      }
    }
    .price-section .price-grid {
      grid-template-columns: 1fr;
    }
  }
  .product-form .price-form-grid {
    grid-template-columns: 1fr;
  }
}

// Loading spinner animation
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
