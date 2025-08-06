<template>
  <!-- 订单管理页面 -->
  <div class="order-management-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">
          <span class="title-icon">📋</span>
          订单管理
        </h1>
        <p class="page-subtitle">查看和管理所有订单信息，跟踪订单状态和处理进度</p>
      </div>
      <div class="header-actions">
        <button class="btn btn-secondary btn-with-icon">
          <span class="btn-icon">📥</span>
          导出订单
        </button>
      </div>
    </div>

    <!-- 订单列表卡片 -->
    <div class="content-card">
      <div class="card-header">
        <div class="card-title">订单列表</div>
      </div>
      <div class="card-body">
        <!-- 搜索和筛选区域 -->
        <div class="search-filter-container">
          <div class="search-box">
            <span class="search-icon">🔍</span>
            <input
              v-model="searchQuery"
              type="text"
              class="search-input-enhanced"
              placeholder="搜索订单号、客户姓名或手机号..."
              @change="queryChange()"
            />
            <button class="search-btn" @click="searchOrders()">搜索</button>
          </div>

          <div class="filter-group">
            <div class="filter-item-enhanced">
              <cool-select
                v-model="selectedStatus"
                :options="statusOptions"
                placeholder="全部状态"
                @change="searchOrders()"
              />
            </div>
            <div class="filter-item-enhanced">
              <cool-select
                v-model="selectedPayment"
                :options="paymentOptions"
                placeholder="全部方式"
                @change="searchOrders()"
              />
            </div>
            <div class="filter-item-enhanced">
              <date-picker v-model="selectedDate" placeholder="选择日期" />
            </div>
            <button class="btn btn-secondary" @click="resetFilter">重置筛选</button>
          </div>
        </div>

        <!-- 订单列表 -->
        <data-table
          :data="orderList"
          :columns="orderColumns"
          :actions="orderActions"
          :loading="loading"
          row-key="id"
          class="order-table"
        >
          <!-- 客户信息插槽 -->
          <template #customer="{ row }">
            <div>
              <div>{{ row.member?.real_name }}</div>
              <div class="customer-phone">{{ row.member?.phone }}</div>
            </div>
          </template>

          <!-- 商品明细插槽 -->
          <template #items="{ row }">
            <div>
              <div v-for="item in row.order_items" :key="item.id">
                {{ item.product_name }} x{{ item.quantity }}
              </div>
            </div>
          </template>

          <!-- 支付方式插槽 -->
          <template #payment="{ row }">
            <span v-if="row.payment_method === 'wechat'">微信支付</span>
            <span v-else-if="row.payment_method === 'balance'">余额支付</span>
          </template>
        </data-table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reqGetAllOrder } from '@/api/supabase'
import { OrderDetail } from '@/types/supabase'
import type { TableColumn, TableAction } from '@/types/supabase'
import { formatDate } from '@/utils/format'
import { onMounted, ref } from 'vue'
import { supabase } from '@/utils/supabase'
import DataTable from '@/components/data-table.vue'
import CoolSelect from '@/components/cool-select.vue'
import DatePicker from '@/components/date-picker.vue'
import { ElMessage } from 'element-plus'

// 数据状态
const orderList = ref<OrderDetail[]>([])
const loading = ref(false)

// 筛选器状态
const selectedStatus = ref('')
// 支付方式
const selectedPayment = ref('')
// 日期选择器
const selectedDate = ref('')
// 搜索框
const searchQuery = ref('')

// 订单状态选项
const statusOptions = [
  { label: '已完成', value: 'completed' },
  { label: '制作中', value: 'processing' },
  { label: '待支付', value: 'pending' },
  { label: '已取消', value: 'cancelled' }
]

// 支付方式选项
const paymentOptions = [
  { label: '微信支付', value: 'wechat' },
  { label: '余额支付', value: 'balance' }
]

// 表格列配置
const orderColumns: TableColumn<OrderDetail>[] = [
  { key: 'order_no', title: '订单号', width: '140px' },
  {
    key: 'customer',
    title: '客户信息',
    slot: 'customer'
  },
  {
    key: 'items',
    title: '商品明细',
    slot: 'items'
  },
  { key: 'final_amount', title: '订单金额', type: 'price' },
  {
    key: 'payment',
    title: '支付方式',
    slot: 'payment'
  },
  {
    key: 'status',
    title: '订单状态',
    type: 'status',
    statusMap: {
      completed: { text: '已完成', className: 'status-success' },
      processing: { text: '制作中', className: 'status-warning' },
      pending: { text: '待支付', className: 'status-info' },
      cancelled: { text: '已取消', className: 'status-error' }
    }
  },
  { key: 'created_at', title: '下单时间' },
  { key: 'remark', title: '订单备注' }
]

// 操作函数
const viewOrderDetail = (order: OrderDetail) => {
  console.log('查看订单详情:', order)
}

// 表格操作配置
const orderActions: TableAction<OrderDetail>[] = [
  {
    text: '查看详情',
    type: 'secondary',
    onClick: order => viewOrderDetail(order)
  }
]

// 搜索订单
const searchOrders = async (params?: {
  status?: string
  search?: string
  date?: string
  payment?: string
}) => {
  loading.value = true
  try {
    const orders = await reqGetAllOrder({
      payment: params?.payment || selectedPayment.value,
      status: params?.status || selectedStatus.value,
      query: params?.search || searchQuery.value,
      date: params?.date || selectedDate.value
    })
    orderList.value = orders.map(order => {
      return {
        ...order,
        created_at: formatDate(order.created_at, 'YYYY-MM-DD HH:mm:ss')
      }
    })
  } finally {
    loading.value = false
  }
}
// 查询变化
const queryChange = () => {
  if (!searchQuery.value) {
    searchOrders()
  }
}

// 重置筛选
const resetFilter = () => {
  if (selectedStatus.value || selectedPayment.value || selectedDate.value || searchQuery.value) {
    searchOrders({
      status: '',
      search: '',
      date: '',
      payment: ''
    })
  } else {
    ElMessage.warning('没有筛选条件')
  }
  selectedStatus.value = ''
  selectedPayment.value = ''
  selectedDate.value = ''
  searchQuery.value = ''
}

// 加载数据
onMounted(async () => {
  loading.value = true
  try {
    const orders = await reqGetAllOrder()
    orderList.value = orders.map(order => {
      return {
        ...order,
        created_at: formatDate(order.created_at, 'YYYY-MM-DD HH:mm:ss')
      }
    })
  } finally {
    loading.value = false
  }
})

// 订阅实时更新
onMounted(() => {
  supabase.channel('orders-channel').on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'orders'
    },
    payload => {
      // 添加订单
      orderList.value.push({
        ...payload.new,
        created_at: formatDate(payload.new.created_at, 'YYYY-MM-DD HH:mm:ss')
      } as OrderDetail)
    }
  )
})
</script>

<style scoped lang="scss">
/* 订单管理页面 */
.order-management-page {
  padding: 24px;
  background: linear-gradient(135deg, var(--bg-gradient-start) 0%, var(--bg-white) 100%);
  min-height: 100vh;
}

/* 页面头部 */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  padding: 24px 32px;
  background: var(--bg-white);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);

  .header-content {
    .page-title {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 28px;
      font-weight: 700;
      color: var(--text-heading);
      margin: 0 0 8px 0;

      .title-icon {
        font-size: 32px;
      }
    }

    .page-subtitle {
      color: var(--text-subtitle);
      font-size: 14px;
      margin: 0;
    }
  }

  .header-actions {
    display: flex;
    gap: 12px;
  }
}

/* 按钮样式 */
.btn {
  padding: 10px 20px;
  border: none;
  border-radius: var(--radius-md);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 8px;

  &.btn-primary {
    background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-light) 100%);
    color: var(--bg-white);

    &:hover {
      background: linear-gradient(135deg, var(--primary-light) 0%, var(--primary-color) 100%);
      transform: translateY(-1px);
      box-shadow: var(--shadow-primary);
    }
  }

  &.btn-secondary {
    background: var(--bg-white);
    color: var(--text-subtitle);
    border: 1px solid var(--border-medium);

    &:hover {
      background: var(--bg-light);
      border-color: var(--border-hover);
    }
  }

  &.btn-with-icon {
    .btn-icon {
      font-size: 16px;
    }
  }
}

/* 表单控件 */
.form-control,
.form-select,
.form-textarea,
.form-input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
  font-family: inherit;
  font-size: 14px;
  transition: border-color 0.3s ease;
}

.form-select {
  padding-right: 32px;
  appearance: none;
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 16px;
}

.form-control:focus,
.form-select:focus,
.form-textarea:focus,
.form-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

/* 内容卡片样式 */
.content-card {
  background: var(--bg-white);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
  margin-bottom: 24px;
  overflow: hidden;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid var(--border-light);

  .card-title {
    font-size: 18px;
    font-weight: 600;
    color: var(--text-heading);
  }
}

.card-body {
  padding: 24px;
}

.customer-phone {
  font-size: 12px;
  color: var(--text-subtitle);
}

/* 搜索和筛选容器 */
.search-filter-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  gap: 16px;
  flex-wrap: wrap;

  .search-box {
    position: relative;
    flex: 1;
    max-width: 400px;

    .search-icon {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 16px;
      opacity: 0.5;
    }

    .search-input-enhanced {
      width: 100%;
      padding: 10px 100px 10px 36px;
      border: 1px solid var(--border-medium);
      border-radius: var(--radius-md);
      font-size: 14px;
      transition: all 0.2s;

      &:focus {
        outline: none;
        border-color: var(--primary-color);
        box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
      }
    }

    .search-btn {
      position: absolute;
      right: 4px;
      top: 50%;
      transform: translateY(-50%);
      padding: 6px 16px;
      background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-light) 100%);
      color: var(--bg-white);
      border: none;
      border-radius: var(--radius);
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        background: linear-gradient(135deg, var(--primary-light) 0%, var(--primary-color) 100%);
      }
    }
  }

  .filter-group {
    display: flex;
    gap: 12px;
    align-items: center;

    .filter-item-enhanced {
      min-width: 120px;
    }
  }
}

/* 订单表格样式 */
.order-table {
  :deep(.data-table) {
    border: 1px solid var(--border-medium);
    border-radius: var(--radius);
    overflow: hidden;
  }
}
</style>
