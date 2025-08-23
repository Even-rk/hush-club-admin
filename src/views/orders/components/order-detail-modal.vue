<template>
  <div class="modal-overlay" @click="handleOverlayClick">
    <div class="modal-container" @click.stop>
      <div class="modal-header">
        <h2 class="modal-title">订单详情</h2>
        <button class="close-btn" @click="closeModal">
          <span>&times;</span>
        </button>
      </div>

      <div v-if="orderDetail" class="modal-body">
        <!-- 订单基本信息 -->
        <div class="info-section">
          <h3 class="section-title">订单信息</h3>
          <div class="info-grid">
            <div class="info-item">
              <label>订单号：</label>
              <span>{{ orderDetail.order_no }}</span>
            </div>
            <div class="info-item">
              <label>订单状态：</label>
              <span class="status-badge" :class="getStatusClass(orderDetail.status)">
                {{ getStatusText(orderDetail.status) }}
              </span>
            </div>
            <div class="info-item">
              <label>支付方式：</label>
              <span>{{ getPaymentText(orderDetail.payment_method) }}</span>
            </div>
            <div class="info-item">
              <label>订单金额：</label>
              <span class="amount">¥{{ orderDetail.final_amount }}</span>
            </div>
            <div class="info-item">
              <label>下单时间：</label>
              <span>{{ formatDate(orderDetail.created_at, 'YYYY-MM-DD HH:mm:ss') }}</span>
            </div>
            <div v-if="orderDetail.remark" class="info-item full-width">
              <label>订单备注：</label>
              <span>{{ orderDetail.remark }}</span>
            </div>
          </div>
        </div>

        <!-- 客户信息 -->
        <div v-if="orderDetail.member" class="info-section">
          <h3 class="section-title">客户信息</h3>
          <div class="info-grid">
            <div class="info-item">
              <label>客户姓名：</label>
              <span>{{ orderDetail.member.real_name }}</span>
            </div>
            <div class="info-item">
              <label>手机号码：</label>
              <span>{{ orderDetail.member.phone }}</span>
            </div>
            <div class="info-item">
              <label>会员等级：</label>
              <span>{{ orderDetail.member.level_name || '普通会员' }}</span>
            </div>
            <div class="info-item">
              <label>账户余额：</label>
              <span class="amount">¥{{ orderDetail.member.balance }}</span>
            </div>
          </div>
        </div>

        <!-- 商品明细 -->
        <div class="info-section">
          <h3 class="section-title">商品明细</h3>
          <div class="items-table">
            <div class="table-header">
              <div class="col-name">商品名称</div>
              <div class="col-price">单价</div>
              <div class="col-quantity">数量</div>
              <div class="col-total">小计</div>
            </div>
            <div class="table-body">
              <div v-for="item in orderDetail.order_items" :key="item.id" class="table-row">
                <div class="col-name">{{ item.product_name }}</div>
                <div class="col-price">¥{{ item.unit_price }}</div>
                <div class="col-quantity">{{ item.quantity }}</div>
                <div class="col-total">¥{{ (item.unit_price * item.quantity).toFixed(2) }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button class="btn btn-secondary" @click="closeModal">关闭</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { OrderDetail } from '@/types/supabase'
import { reqGetOrderDetail } from '@/api/supabase/SELECT'
import { formatDate } from '@/utils/format'
import message from '@/utils/message'

interface Props {
  orderId?: number
}

interface Emits {
  (e: 'close', value: boolean): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const orderDetail = ref<OrderDetail | null>(null)

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
.modal-overlay {
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
}

.modal-container {
  background: var(--bg-white);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl);
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid var(--border-light);
  background: var(--bg-light);

  .modal-title {
    font-size: 20px;
    font-weight: 600;
    color: var(--text-heading);
    margin: 0;
  }

  .close-btn {
    background: none;
    border: none;
    font-size: 24px;
    color: var(--text-subtitle);
    cursor: pointer;
    padding: 4px;
    border-radius: var(--radius);
    transition: all 0.2s;

    &:hover {
      background: var(--bg-hover);
      color: var(--text-heading);
    }
  }
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

.info-section {
  margin-bottom: 32px;

  &:last-child {
    margin-bottom: 0;
  }

  .section-title {
    font-size: 16px;
    font-weight: 600;
    color: var(--text-heading);
    margin: 0 0 16px 0;
    padding-bottom: 8px;
    border-bottom: 2px solid var(--primary-color);
  }
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  .info-item {
    display: flex;
    align-items: center;

    &.full-width {
      grid-column: 1 / -1;
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;
    }

    label {
      font-weight: 500;
      color: var(--text-subtitle);
      margin-right: 8px;
      min-width: 80px;
    }

    span {
      color: var(--text-heading);

      &.amount {
        font-weight: 600;
        color: var(--primary-color);
      }
    }
  }
}

.status-badge {
  padding: 4px 12px;
  border-radius: var(--radius);
  font-size: 12px;
  font-weight: 500;

  &.status-success {
    background: #f0f9ff;
    color: #0369a1;
  }

  &.status-warning {
    background: #fffbeb;
    color: #d97706;
  }

  &.status-info {
    background: #f0f9ff;
    color: #0284c7;
  }

  &.status-error {
    background: #fef2f2;
    color: #dc2626;
  }
}

.items-table {
  border: 1px solid var(--border-light);
  border-radius: var(--radius);
  overflow: hidden;

  .table-header {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr;
    background: var(--bg-light);
    font-weight: 600;
    color: var(--text-heading);

    > div {
      padding: 12px 16px;
      border-right: 1px solid var(--border-light);

      &:last-child {
        border-right: none;
      }
    }
  }

  .table-body {
    .table-row {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1fr;
      border-bottom: 1px solid var(--border-light);

      &:last-child {
        border-bottom: none;
      }

      > div {
        padding: 12px 16px;
        border-right: 1px solid var(--border-light);
        color: var(--text-body);

        &:last-child {
          border-right: none;
          font-weight: 500;
        }
      }
    }
  }
}

.status-change-area {
  padding: 16px;
  background: var(--bg-light);
  border-radius: var(--radius);
  border-left: 4px solid var(--primary-color);
}

.modal-footer {
  padding: 16px 24px;
  border-top: 1px solid var(--border-light);
  background: var(--bg-light);
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

@media (max-width: 768px) {
  .modal-container {
    width: 95%;
    max-height: 95vh;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .table-header,
  .table-row {
    grid-template-columns: 1fr;

    > div {
      border-right: none;
      border-bottom: 1px solid var(--border-light);

      &:last-child {
        border-bottom: none;
      }
    }
  }
}
</style>
