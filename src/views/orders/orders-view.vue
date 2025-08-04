<template>
  <!-- 订单管理页面 -->
  <div class="content-card">
    <div class="card-header">
      <div class="card-title">订单管理</div>
    </div>
    <div class="card-body">
      <!-- 筛选器 -->
      <div class="filters">
        <div class="filter-item">
          <label class="filter-label">订单状态:</label>
          <select class="form-select filter-select">
            <option>全部状态</option>
            <option>已完成</option>
            <option>制作中</option>
            <option>待支付</option>
            <option>已取消</option>
          </select>
        </div>
        <div class="filter-item">
          <label class="filter-label">支付方式:</label>
          <select class="form-select filter-select">
            <option>全部方式</option>
            <option>微信支付</option>
            <option>余额支付</option>
          </select>
        </div>
        <div class="filter-item">
          <label class="filter-label">日期:</label>
          <input type="date" class="form-input date-input" />
        </div>
        <div class="filter-item">
          <button class="btn btn-primary">筛选</button>
        </div>
      </div>

      <!-- 订单列表 -->
      <data-table
        :data="orderList"
        :columns="orderColumns"
        :actions="orderActions"
        :loading="loading"
        row-key="id"
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
</template>

<script setup lang="ts">
import { reqGetAllOrder } from '@/api/supabase'
import { OrderDetail } from '@/types/supabase'
import type { TableColumn, TableAction } from '@/types/supabase'
import { formatDate } from '@/utils/format'
import { onMounted, ref } from 'vue'
import { supabase } from '@/utils/supabase'
import DataTable from '@/components/data-table.vue'

// 数据状态
const orderList = ref<OrderDetail[]>([])
const loading = ref(false)

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

// const editOrder = (order: OrderDetail) => {
//   console.log('编辑订单:', order)
// }

// const cancelOrder = (order: OrderDetail) => {
//   console.log('取消订单:', order)
// }

// 表格操作配置
const orderActions: TableAction<OrderDetail>[] = [
  {
    text: '查看详情',
    type: 'secondary',
    onClick: order => viewOrderDetail(order)
  }
  // {
  //   text: '编辑',
  //   type: 'primary',
  //   visible: order => order.status !== 'completed' && order.status !== 'cancelled',
  //   onClick: order => editOrder(order)
  // },
  // {
  //   text: '取消订单',
  //   type: 'error',
  //   visible: order => order.status === 'pending',
  //   onClick: order => cancelOrder(order)
  // }
]

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
/* 内容卡片样式 */
.content-card {
  background: var(--bg-white);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  margin-bottom: 24px;
  overflow: hidden;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-color);
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

.card-subtitle {
  font-size: 14px;
  color: var(--text-secondary);
  margin-top: 4px;
}

.card-actions {
  display: flex;
  gap: 12px;
}

.card-body {
  padding: 20px;
}

.date-input {
  max-width: 150px;
}

.customer-phone {
  font-size: 12px;
  color: var(--text-secondary);
}

.filters {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.filter-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-label {
  font-size: 14px;
  color: var(--text-primary);
  white-space: nowrap;
}

.filter-select {
  min-width: 120px;
}
</style>
