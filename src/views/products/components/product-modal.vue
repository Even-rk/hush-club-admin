<template>
  <transition name="modal-fade">
    <div v-if="visible" class="product-modal-overlay" @click="emit('close')">
      <transition name="modal-scale">
        <div v-if="visible" class="product-modal" @click.stop>
          <!-- 装饰性背景 -->
          <div class="modal-decoration">
            <div class="decoration-circle decoration-circle-1"></div>
            <div class="decoration-circle decoration-circle-2"></div>
          </div>

          <!-- 弹窗头部 -->
          <div class="product-modal-header">
            <div class="header-content">
              <div class="header-icon">
                {{ mode === 'add' ? '➕' : '✏️' }}
              </div>
              <h3 class="modal-title">
                {{ mode === 'add' ? '添加商品' : '编辑商品' }}
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
          <div class="product-modal-body">
            <!-- 编辑/添加模式 -->
            <form class="product-form">
              <!-- 商品名称 -->
              <div class="form-group">
                <label class="form-label required">商品名称</label>
                <input
                  v-model="form.product_name"
                  type="text"
                  class="form-control"
                  placeholder="请输入商品名称"
                  maxlength="100"
                />
              </div>

              <!-- 商品分类 -->
              <div class="form-group">
                <label class="form-label required">商品分类</label>
                <cool-select
                  v-model="form.category_id"
                  :options="categoryOptions"
                  placeholder="请选择商品分类"
                />
              </div>

              <!-- 商品图片 -->
              <div class="form-group">
                <label class="form-label">商品图片</label>
                <div class="image-upload">
                  <div v-if="form.image_url" class="image-preview">
                    <img alt="商品图片" :src="form.image_url" />
                    <button
                      type="button"
                      class="remove-image"
                      :disabled="deleteLoading"
                      @click="deleteProductImg"
                    >
                      <span v-if="!deleteLoading">×</span>
                      <div v-if="deleteLoading" class="delete-loading-spinner"></div>
                    </button>
                  </div>
                  <div v-else class="upload-placeholder">
                    <input
                      ref="fileInputRef"
                      type="file"
                      accept="image/*"
                      class="file-input"
                      :disabled="uploadLoading"
                      @change="fileChange"
                    />
                    <div
                      class="upload-content"
                      :class="{ uploading: uploadLoading }"
                      @click="!uploadLoading && fileInputRef?.click()"
                    >
                      <div v-if="!uploadLoading" class="upload-icon">📷</div>
                      <div v-if="uploadLoading" class="upload-loading-spinner"></div>
                      <div class="upload-text">
                        {{ uploadLoading ? '上传中...' : '点击上传图片' }}
                      </div>
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
                        v-model="form.normal_member_price"
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
                <label class="form-label required">商品状态</label>
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
            <button class="btn btn-secondary" @click="cancel">
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
import { ref, onMounted, computed } from 'vue'
import { reqGetProductCategory } from '@/api/supabase'
import type { Product, ProductCategory } from '@/types/supabase'
import CoolSelect from '@/components/cool-select.vue'
import { delProductImg, uploadProductImg } from '@/api/upload-img/upload-img'
import { updateProduct, reqAddProduct } from '@/api/supabase'
import _ from 'lodash'

interface UploadImg {
  id: number
  image_url: string
  file_path: string
}

const props = defineProps<{
  visible: boolean
  mode?: 'view' | 'edit' | 'add'
  productData: Product
}>()

const emit = defineEmits<{
  close: []
  success: [data: Product & { id?: number }, mode: 'add' | 'edit']
}>()

// 表单数据
const form = ref({} as Product)
// 上传的图片
const uploadImgData = ref({} as UploadImg)
// 文件输入引用
const fileInputRef = ref<HTMLInputElement>()

const deleteLoading = ref(false)
const uploadLoading = ref(false)

// 加载状态
const loading = ref(false)

// 商品分类列表
const categories = ref<ProductCategory[]>([])

// 分类选项 - 将分类数据转换为选择器选项格式
const categoryOptions = computed(() => {
  return categories.value.map(category => ({
    label: category.category_name,
    value: category.id
  }))
})

// 获取商品分类列表
const loadCategories = async () => {
  try {
    categories.value = await reqGetProductCategory()
  } catch (error) {
    console.error('获取商品分类失败:', error)
  }
}

// 文件变化
const fileChange = async (e: Event) => {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    try {
      uploadLoading.value = true
      const imgData = await uploadProductImg(file)
      uploadImgData.value = imgData as UploadImg
      form.value.image_url = imgData.image_url
    } finally {
      uploadLoading.value = false
      // 清空文件输入，允许重复上传同一文件
      if (target) {
        target.value = ''
      }
    }
  }
}

// 删除商品图
const deleteProductImg = async () => {
  if (uploadImgData.value.id) {
    try {
      deleteLoading.value = true
      await delProductImg({ id: uploadImgData.value.id, file_path: uploadImgData.value.file_path })
      // 清除上传的图片数据
      uploadImgData.value = {} as UploadImg
      form.value.image_url = ''
    } finally {
      deleteLoading.value = false
    }
  } else {
    // 清除表单中的图片数据
    form.value.image_url = ''
    form.value.image_id = 0
    form.value.image_path = ''
  }
}

// 取消
const cancel = async () => {
  await deleteProductImg()
  emit('close')
}

// 提交表单
const submit = async () => {
  loading.value = true
  if (uploadImgData.value.id) {
    form.value.image_url = uploadImgData.value.image_url
    form.value.image_id = uploadImgData.value.id
    form.value.image_path = uploadImgData.value.file_path
  }

  if (props.mode === 'add') {
    await reqAddProduct(_.omit(form.value, ['image_path', 'image_url']))
    emit('success', form.value, 'add')
  } else {
    await updateProduct({
      id: props.productData.id,
      data: _.omit(form.value, ['image_path', 'image_url'])
    })
    emit('success', form.value, 'edit')
  }
  loading.value = false
}

// 组件挂载时加载分类数据
onMounted(() => {
  if (props.mode === 'add') {
    form.value = {} as Product
  } else {
    // 删除字段 并 克隆
    form.value = _.omit(_.cloneDeep(props.productData), [
      'category_name',
      'silver_member_price',
      'gold_member_price'
    ])
  }
  loadCategories()
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

.product-modal-overlay {
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

.product-modal {
  background: linear-gradient(135deg, var(--bg-white) 0%, #fafafa 100%);
  border-radius: 20px;
  box-shadow:
    0 25px 50px -12px rgba(0, 0, 0, 0.25),
    0 0 0 1px rgba(0, 0, 0, 0.05);
  width: 100%;
  max-width: 800px;
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

.product-modal-header {
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

.product-modal-body {
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

.product-modal-footer {
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
.product-form {
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

  .image-upload {
    border: 2px dashed var(--border-color);
    border-radius: 12px;
    overflow: hidden;
    margin-bottom: 8px;
    background: linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%);
    transition: all 0.3s ease;

    &:hover {
      border-color: #3b82f6;
      background: linear-gradient(135deg, #f0f8ff 0%, #e6f3ff 100%);
    }

    .image-preview {
      position: relative;

      img {
        width: 100%;
        height: 200px;
        object-fit: contain;
        display: block;
        background: var(--bg-white);
      }

      .remove-image {
        position: absolute;
        top: 12px;
        right: 12px;
        width: 32px;
        height: 32px;
        border-radius: 10px;
        background: rgba(255, 255, 255, 0.9);
        backdrop-filter: blur(10px);
        color: var(--error-color);
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        transition: all 0.3s ease;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

        &:hover:not(:disabled) {
          background: var(--error-color);
          color: white;
          transform: rotate(90deg);
        }

        &:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .delete-loading-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(239, 68, 68, 0.3);
          border-top: 2px solid var(--error-color);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
      }
    }

    .upload-placeholder {
      .file-input {
        display: none;
      }

      .upload-content {
        padding: 48px 20px;
        text-align: center;
        cursor: pointer;
        transition: all 0.3s ease;
        position: relative;

        &::before {
          content: '';
          position: absolute;
          inset: 20px;
          border: 2px dashed #3b82f6;
          border-radius: 8px;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        &:hover:not(.uploading) {
          background-color: rgba(59, 130, 246, 0.05);

          &::before {
            opacity: 1;
            border-color: #3b82f6;
          }

          .upload-icon {
            transform: scale(1.1);
          }
        }

        &.uploading {
          cursor: not-allowed;
          background: linear-gradient(
            135deg,
            rgba(59, 130, 246, 0.1) 0%,
            rgba(147, 197, 253, 0.05) 100%
          );

          &::before {
            opacity: 1;
            border-color: #3b82f6;
          }

          .upload-text {
            color: #3b82f6;
            font-weight: 600;
          }
        }

        .upload-icon {
          font-size: 40px;
          margin-bottom: 12px;
          transition: transform 0.3s ease;
        }

        .upload-loading-spinner {
          width: 40px;
          height: 40px;
          margin: 0 auto 12px;
          border: 3px solid rgba(59, 130, 246, 0.3);
          border-top: 3px solid #3b82f6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .upload-text {
          font-size: 14px;
          color: var(--text-secondary);
          font-weight: 500;
          transition: all 0.3s ease;
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
      left: 14px;
      color: var(--primary-color);
      font-size: 16px;
      font-weight: 600;
      z-index: 1;
      transition: all 0.3s ease;
    }

    .form-control {
      padding-left: 32px;
      font-weight: 500;
    }

    &:has(.form-control:focus) .input-prefix {
      color: var(--primary-dark);
      transform: scale(1.1);
    }
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

// Slide in up animation
@keyframes slideInUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
