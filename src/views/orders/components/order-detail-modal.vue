<template>
  <transition name="modal-fade">
    <div v-if="orderDetail" class="order-modal-overlay" @click="handleOverlayClick">
      <transition name="modal-scale">
        <div v-if="orderDetail" class="order-modal" @click.stop>
          <!-- 装饰性背景 -->
          <div class="modal-decoration">
            <div class="decoration-circle decoration-circle-1"></div>
            <div class="decoration-circle decoration-circle-2"></div>
          </div>

          <!-- 弹窗头部 -->
          <div class="order-modal-header">
            <div class="header-content">
              <div class="header-icon">📋</div>
              <h3 class="modal-title">订单详情</h3>
            </div>
            <button class="modal-close" @click="closeModal">
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
          <div class="order-modal-body">
            <!-- 订单基本信息 -->
            <div class="info-section">
              <h3 class="section-title">订单信息</h3>
              <div class="info-grid">
                <div class="info-item">
                  <label class="info-label">订单号</label>
                  <span class="info-value">{{ orderDetail.order_no }}</span>
                </div>
                <div class="info-item">
                  <label class="info-label">订单状态</label>
                  <div class="status-badge">
                    <div class="status-text" :class="getStatusClass(orderDetail.status)">
                      {{ getStatusText(orderDetail.status) }}
                    </div>
                  </div>
                </div>
                <div class="info-item">
                  <label class="info-label">支付方式</label>
                  <span class="info-value">{{ getPaymentText(orderDetail.payment_method) }}</span>
                </div>
                <div class="info-item">
                  <label class="info-label">订单金额</label>
                  <span class="info-value amount">¥{{ orderDetail.final_amount }}</span>
                </div>
                <div class="info-item">
                  <label class="info-label">下单时间</label>
                  <span class="info-value">{{
                    formatDate(orderDetail.created_at, 'YYYY-MM-DD HH:mm:ss')
                  }}</span>
                </div>
                <div v-if="orderDetail.remark" class="info-item full-width">
                  <label class="info-label">订单备注</label>
                  <span class="info-value">{{ orderDetail.remark }}</span>
                </div>
              </div>
            </div>

            <!-- 客户信息 -->
            <div v-if="orderDetail.member" class="info-section">
              <h3 class="section-title">客户信息</h3>
              <div class="info-grid">
                <div class="info-item">
                  <label class="info-label">客户姓名</label>
                  <span class="info-value">{{ orderDetail.member.real_name }}</span>
                </div>
                <div class="info-item">
                  <label class="info-label">手机号码</label>
                  <span class="info-value">{{ orderDetail.member.phone }}</span>
                </div>
                <div class="info-item">
                  <label class="info-label">会员等级</label>
                  <span class="info-value">{{ orderDetail.member.level_name || '普通会员' }}</span>
                </div>
                <div class="info-item">
                  <label class="info-label">账户余额</label>
                  <span class="info-value amount">¥{{ orderDetail.member.balance }}</span>
                </div>
              </div>
            </div>

            <!-- 商品明细 -->
            <div class="info-section">
              <h3 class="section-title">商品明细</h3>
              <DataTable
                :data="orderDetail.order_items"
                :columns="itemColumns"
                :show-actions="false"
                :loading="false"
                empty-text="暂无商品"
                size="small"
              />
            </div>
          </div>

          <!-- 弹窗底部 -->
          <div class="order-modal-footer">
            <button class="btn btn-secondary" @click="closeModal">
              <span class="btn-icon">❌</span>
              关闭
            </button>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { OrderDetail } from '@/types/supabase'
import { reqGetOrderDetail } from '@/api/supabase/SELECT'
import { formatDate } from '@/utils/format'
import message from '@/utils/message'
import DataTable from '@/components/data-table.vue'
import type { OrderItem, TableColumn } from '@/types/supabase'

interface Props {
  orderId?: number
}

interface Emits {
  (e: 'close', value: boolean): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const orderDetail = ref<OrderDetail | null>(null)

// 商品明细表格列配置
const itemColumns = computed<TableColumn<OrderItem>[]>(() => [
  {
    key: 'product_name',
    title: '商品名称',
    width: '40%'
  },
  {
    key: 'unit_price',
    title: '单价',
    type: 'price',
    width: '20%'
  },
  {
    key: 'quantity',
    title: '数量',
    width: '20%'
  },
  {
    key: 'subtotal',
    title: '小计',
    type: 'price',
    width: '20%',
    formatter: (_, row: OrderItem) => `¥${(row.unit_price * row.quantity).toFixed(2)}`
  }
])

// 获取状态文本
const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    completed: '已完成',
    processing: '制作中',
    pending: '待支付',
    cancelled: '已取消'
  }
  return statusMap[status] || status
}

// 获取状态样式类
const getStatusClass = (status: string) => {
  const classMap: Record<string, string> = {
    completed: 'status-success',
    processing: 'status-warning',
    pending: 'status-info',
    cancelled: 'status-error'
  }
  return classMap[status] || ''
}

// 获取支付方式文本
const getPaymentText = (method: string) => {
  const paymentMap: Record<string, string> = {
    wechat: '微信支付',
    balance: '余额支付'
  }
  return paymentMap[method] || method
}

// 关闭弹窗
const closeModal = () => {
  emit('close', false)
}

// 点击遮罩层关闭
const handleOverlayClick = () => {
  closeModal()
}

// 加载订单详情
onMounted(async () => {
  if (!props.orderId) {
    return
  }

  try {
    const detail = await reqGetOrderDetail(props.orderId)
    orderDetail.value = detail
  } catch (error) {
    console.error('加载订单详情失败:', error)
    message.error('加载订单详情失败')
  }
})
</script>

<style scoped lang="scss">
/* 模态框动画 */
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
    opacity: 0;
    transform: scale(0.9) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
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

/* 过渡效果 */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-scale-enter-active {
  animation: modalScaleIn 0.3s ease-out;
}

.modal-scale-leave-active {
  animation: modalScaleIn 0.2s ease-in reverse;
}

/* 模态框背景 */
.order-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  animation: modalFadeIn 0.2s ease;
}

/* 模态框容器 */
.order-modal {
  background: linear-gradient(135deg, var(--bg-white) 0%, #fafafa 100%);
  border-radius: 20px;
  box-shadow:
    0 25px 50px -12px rgba(0, 0, 0, 0.25),
    0 0 0 1px rgba(0, 0, 0, 0.05);
  width: 100%;
  max-width: 900px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
}

/* 装饰性背景 */
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

/* 模态框头部 */
.order-modal-header {
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

/* 模态框主体 */
.order-modal-body {
  padding: 28px;
  max-height: calc(90vh - 200px);
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

/* 信息区域 */
.info-section {
  margin-bottom: 28px;
  background: var(--bg-white);
  border-radius: 16px;
  padding: 24px;
  border: 1px solid var(--border-light);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.section-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 2px solid var(--primary-light);
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 50px;
    height: 2px;
    background: var(--primary-color);
  }
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-item.full-width {
  grid-column: 1 / -1;
}

.info-label {
  font-size: 13px;
  color: var(--text-secondary);
  font-weight: 600;
}

.info-value {
  font-size: 15px;
  color: var(--text-primary);
  font-weight: 500;
}

.info-value.amount {
  color: var(--primary-color);
  font-weight: 700;
}

.status-badge {
  font-weight: 600;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  .status-text {
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 12px;
    border: 1px solid;
    width: 150px;
  }
}

.status-success {
  background-color: rgba(46, 204, 113, 0.1);
  border-color: #2ecc71;
  color: #27ae60;
}

.status-warning {
  background-color: rgba(241, 196, 15, 0.1);
  border-color: #f1c40f;
  color: #f39c12;
}

.status-info {
  background-color: rgba(52, 152, 219, 0.1);
  border-color: #3498db;
  color: #2980b9;
}

.status-error {
  background-color: rgba(231, 76, 60, 0.1);
  border-color: #e74c3c;
  color: #c0392b;
}

/* 模态框底部 */
.order-modal-footer {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding: 20px 28px;
  background: linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.02) 100%);
  border-top: 1px solid var(--border-light);

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
      background: var(--bg-white);
      color: var(--text-primary);
      border: 1px solid var(--border-color);

      &:hover {
        background: #f5f5f5;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }

      &:active {
        transform: translateY(0);
      }
    }
  }
}

@media (max-width: 768px) {
  .order-modal {
    width: 95%;
    max-height: 95vh;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .order-modal-header {
    padding: 20px 24px;
  }

  .order-modal-body {
    padding: 24px;
  }

  .order-modal-footer {
    padding: 20px 24px;
  }
}
</style>
