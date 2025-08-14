<template>
  <transition name="modal-fade">
    <div v-if="visible" class="coupon-modal-overlay" @click="emit('close')">
      <transition name="modal-scale">
        <div v-if="visible" class="coupon-modal" @click.stop>
          <!-- 装饰性背景 -->
          <div class="modal-decoration">
            <div class="decoration-circle decoration-circle-1"></div>
            <div class="decoration-circle decoration-circle-2"></div>
          </div>

          <!-- 弹窗头部 -->
          <div class="coupon-modal-header">
            <div class="header-content">
              <div class="header-icon">
                {{ mode === 'add' ? '🎫' : mode === 'edit' ? '✏️' : '👀' }}
              </div>
              <h3 class="modal-title">
                {{ mode === 'add' ? '添加优惠券' : mode === 'edit' ? '编辑优惠券' : '查看优惠券' }}
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
          <div class="coupon-modal-body">
            <!-- 查看模式 -->
            <div v-if="mode === 'view'" class="view-mode">
              <div class="view-grid">
                <div class="view-item">
                  <label class="view-label">优惠券名称</label>
                  <p class="view-value">{{ form.template_name }}</p>
                </div>
                <div class="view-item">
                  <label class="view-label">有效天数</label>
                  <p class="view-value">{{ form.valid_days }} 天</p>
                </div>
                <div class="view-item">
                  <label class="view-label">优惠类型</label>
                  <p class="view-value">{{ formatCouponType(form.coupon_type) }}</p>
                </div>
                <div v-if="form.coupon_type === 'discount'" class="view-item">
                  <label class="view-label">折扣率</label>
                  <p v-if="form.discount_value" class="view-value">
                    {{ form.discount_value * 10 }}折
                  </p>
                </div>
                <div v-if="form.coupon_type === 'reduce'" class="view-item">
                  <label class="view-label">减免金额</label>
                  <p class="view-value">{{ form.discount_value }} 元</p>
                </div>
                <div v-if="form.coupon_type === 'reduce'" class="view-item">
                  <label class="view-label">最低消费</label>
                  <p class="view-value">{{ form.threshold_amount }} 元</p>
                </div>
                <div v-if="form.coupon_type === 'free'" class="view-item">
                  <label class="view-label">适用商品</label>
                  <p class="view-value">{{ getProductName(form.product_id) }}</p>
                </div>
                <div class="view-item">
                  <label class="view-label">状态</label>
                  <p class="view-value">
                    <span :class="['status-badge', `status-${form.status}`]">
                      {{ formatStatus(form.status) }}
                    </span>
                  </p>
                </div>
                <div class="view-item full-width">
                  <label class="view-label">描述</label>
                  <p class="view-value description">{{ form.description || '暂无描述' }}</p>
                </div>
              </div>
            </div>

            <!-- 添加/编辑模式 -->
            <form v-else class="coupon-form">
              <!-- 优惠券名称 -->
              <div class="form-group">
                <label class="form-label required">优惠券名称</label>
                <input
                  v-model="form.template_name"
                  type="text"
                  class="form-control"
                  placeholder="请输入优惠券名称"
                  maxlength="100"
                />
              </div>

              <!-- 有效天数 -->
              <div class="form-group">
                <label class="form-label required">有效天数</label>
                <input
                  v-model="form.valid_days"
                  type="number"
                  class="form-control"
                  placeholder="请输入有效天数"
                  min="1"
                />
              </div>

              <!-- 优惠类型 -->
              <div class="form-group">
                <label class="form-label required">优惠类型</label>
                <div class="radio-group">
                  <label class="radio-item">
                    <input
                      v-model="form.coupon_type"
                      type="radio"
                      value="discount"
                      @change="couponTypeChange"
                    />
                    <span class="radio-label">折扣券</span>
                  </label>
                  <label class="radio-item">
                    <input
                      v-model="form.coupon_type"
                      type="radio"
                      value="reduce"
                      @change="couponTypeChange"
                    />
                    <span class="radio-label">满减券</span>
                  </label>
                  <label class="radio-item">
                    <input
                      v-model="form.coupon_type"
                      type="radio"
                      value="free"
                      @change="couponTypeChange"
                    />
                    <span class="radio-label">免费券</span>
                  </label>
                </div>
              </div>

              <!-- 免费券不存在 -->
              <template v-if="form.coupon_type !== 'free'">
                <!-- 优惠金额/百分比 -->
                <div class="form-group">
                  <label class="form-label required">
                    {{ form.coupon_type === 'discount' ? '折扣率' : '减免金额' }}
                  </label>
                  <div class="input-group">
                    <input
                      v-model="form.discount_value"
                      type="number"
                      class="form-control"
                      :placeholder="disconnectPlaceholder"
                      :min="form.coupon_type === 'discount' ? 0.01 : 0"
                      :max="form.coupon_type === 'discount' ? 1 : 99999"
                      step="0.01"
                    />
                    <span class="input-suffix">
                      {{ form.coupon_type === 'discount' ? '' : '元' }}
                    </span>
                  </div>
                </div>

                <!-- 最低消费金额 -->
                <template v-if="form.coupon_type == 'reduce'">
                  <div class="form-group">
                    <label class="form-label required">最低消费金额</label>
                    <div class="input-group">
                      <input
                        v-model="form.threshold_amount"
                        type="number"
                        class="form-control"
                        placeholder="请输入最低消费金额(0表示无门槛)"
                        min="0"
                        step="0.01"
                      />
                      <span class="input-suffix">元</span>
                    </div>
                  </div>
                </template>
              </template>

              <!-- 商品选择 -->
              <template v-else>
                <div class="form-group">
                  <label class="form-label required">适用商品</label>
                  <CoolSelect
                    v-model="form.product_id"
                    :options="productList"
                    empty-text="请先添加商品"
                  />
                </div>
              </template>

              <!-- 优惠券描述 -->
              <div class="form-group">
                <label class="form-label">优惠券描述</label>
                <textarea
                  v-model="form.description"
                  class="form-control"
                  placeholder="请输入优惠券描述信息"
                  rows="3"
                  maxlength="200"
                />
              </div>

              <!-- 优惠券状态 -->
              <div class="form-group">
                <label class="form-label">优惠券状态</label>
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
          <div class="coupon-modal-footer">
            <button v-if="mode === 'view'" class="btn btn-secondary" @click="emit('close')">
              关闭
            </button>
            <template v-else>
              <button class="btn btn-secondary" @click="emit('close')">
                <span class="btn-icon">❌</span>
                取消
              </button>
              <button class="btn btn-primary" :disabled="loading" @click="submit">
                <span v-if="!loading" class="btn-icon">✅</span>
                <span v-if="loading" class="loading-spinner"></span>
                {{ loading ? '提交中...' : '确定' }}
              </button>
            </template>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import type { Coupon } from '@/types/supabase'
import { reqAddCoupon } from '@/api/supabase/INSERT'
import { updateCoupon } from '@/api/supabase/UPDATE'
import _ from 'lodash'
import { reqGetProductList } from '@/api/supabase'
import CoolSelect from '@/components/cool-select.vue'

interface Props {
  visible: boolean
  mode: 'add' | 'edit' | 'view'
  couponData: Coupon
}

interface Emits {
  (e: 'close'): void
  (e: 'success', data: Coupon, mode: 'add' | 'edit'): void
}

const props = defineProps<Props>()

const emit = defineEmits<Emits>()

// 表单数据
const form = ref({} as Coupon)

// 商品列表
const productList = ref<{ label: string; value: number }[]>([])

// 优惠类型对应的占位符
const disconnectPlaceholder = computed(() => {
  if (form.value.coupon_type === 'discount') {
    return '请输入折扣率(如0.8表示8折)'
  } else if (form.value.coupon_type === 'reduce') {
    return '请输入减免金额'
  } else {
    return '请输入优惠金额'
  }
})

// 加载状态
const loading = ref(false)

// 格式化优惠券类型
const formatCouponType = (type: string) => {
  const typeMap: { [key: string]: string } = {
    discount: '折扣券',
    reduce: '满减券',
    free: '免费券'
  }
  return typeMap[type] || '未知'
}

// 格式化状态
const formatStatus = (status: string) => {
  const statusMap: { [key: string]: string } = {
    active: '启用',
    inactive: '禁用'
  }
  return statusMap[status] || '未知'
}

// 获取商品名称
const getProductName = (productId: number) => {
  const product = productList.value.find(p => p.value === productId)
  return product ? product.label : '未知商品'
}

// 提交表单
const submit = async () => {
  loading.value = true
  try {
    const submitData = _.omit(form.value, ['id', 'valid_day', 'created_at', 'updated_at'])
    if (props.mode === 'add') {
      await reqAddCoupon(submitData)
      emit('success', form.value, 'add')
    } else {
      await updateCoupon({ id: form.value.id, data: submitData })
      emit('success', form.value, 'edit')
    }
  } finally {
    loading.value = false
  }
}

// 优惠券类型改变时
const couponTypeChange = () => {
  form.value.discount_value = undefined
  form.value.threshold_amount = undefined
}

// 初始化表单数据
onMounted(async () => {
  // 商品列表
  const products = await reqGetProductList()
  productList.value = products.map(item => ({
    label: item.product_name,
    value: item.id
  }))

  form.value = _.cloneDeep(props.couponData)
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

.coupon-modal-overlay {
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

.coupon-modal {
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

.coupon-modal-header {
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

.coupon-modal-body {
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

.coupon-modal-footer {
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
.coupon-form {
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
    font-family: inherit;

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

    &.textarea {
      resize: vertical;
      min-height: 80px;
    }
  }

  .input-group {
    position: relative;
    display: flex;
    align-items: center;

    .input-suffix {
      position: absolute;
      right: 14px;
      color: var(--text-light);
      font-size: 14px;
      pointer-events: none;
    }

    .form-control {
      padding-right: 40px;
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
}

// 查看模式样式
.view-mode {
  padding: 16px;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 12px;

  .view-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
  }

  .view-item {
    background: var(--bg-white);
    padding: 16px;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    &.full-width {
      grid-column: 1 / -1;
    }
  }

  .view-label {
    display: block;
    margin-bottom: 8px;
    font-size: 12px;
    font-weight: 600;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .view-value {
    margin: 0;
    font-size: 16px;
    font-weight: 500;
    color: var(--text-primary);

    &.description {
      font-size: 14px;
      white-space: pre-wrap;
      line-height: 1.6;
      color: var(--text-secondary);
    }
  }

  .status-badge {
    display: inline-block;
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;

    &.status-active {
      color: #28a745;
      background: rgba(40, 167, 69, 0.1);
    }

    &.status-inactive {
      color: #6c757d;
      background: rgba(108, 117, 125, 0.1);
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
