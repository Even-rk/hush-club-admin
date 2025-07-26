<template>
  <!-- 订单管理页面 -->
  <div class="page">
    <div class="content-card">
      <div class="card-header">
        <div class="card-title">订单管理</div>
        <div class="card-actions">
          <button class="btn btn-secondary">📊 导出数据</button>
        </div>
      </div>
      <div class="card-body">
        <div class="filters">
          <div class="filter-item">
            <label class="filter-label">订单状态:</label>
            <select class="form-select filter-select">
              <option>全部状态</option>
              <option>待制作</option>
              <option>已完成</option>
            </select>
          </div>
          <div class="filter-item">
            <label class="filter-label">日期范围:</label>
            <input type="date" class="form-input date-input" />
            <span>至</span>
            <input type="date" class="form-input date-input" />
          </div>
          <div class="filter-item">
            <button class="btn btn-primary">筛选</button>
          </div>
        </div>

        <table class="data-table">
          <thead>
            <tr>
              <th>订单号</th>
              <th>客户信息</th>
              <th>商品明细</th>
              <th>订单金额</th>
              <th>支付方式</th>
              <th>订单状态</th>
              <th>下单时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in orderList" :key="order.id">
              <td>{{ order.order_no }}</td>
              <td>
                <div>{{ order.member?.real_name }}</div>
                <div class="customer-phone">
                  {{ order.member?.phone }}
                </div>
              </td>
              <td>
                <div v-for="item in order.order_items" :key="item.id">
                  {{ item.product_name }} x{{ item.quantity }}
                </div>
              </td>
              <td>¥{{ order.final_amount }}</td>
              <td>{{ order.payment_method }}</td>
              <td>
                <span
                  class="status-badge"
                  :class="{
                    // 待支付
                    'status-info': order.status === 'pending',
                    // 已完成
                    'status-success': order.status === 'completed',
                    // 待制作
                    'status-warning': order.status === 'processing',
                    // 已取消
                    'status-error': order.status === 'cancelled'
                  }"
                >
                  <template v-if="order.status === 'pending'"> 待支付 </template>
                  <template v-else-if="order.status === 'completed'"> 已完成 </template>
                  <template v-else-if="order.status === 'processing'"> 待制作 </template>
                  <template v-else-if="order.status === 'cancelled'"> 已取消 </template>
                </span>
              </td>
              <td>{{ order.created_at }}</td>
              <td>
                <button class="btn btn-secondary btn-sm" @click="viewOrderDetail(order)">
                  查看
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { OrderDetail } from '@/types/supabase'
import { reqGetAllOrder } from '@/api/supabase'
import { onMounted, ref } from 'vue'

// 订单列表页面逻辑
const orderList = ref<OrderDetail[]>([])

onMounted(async () => {
  orderList.value = await reqGetAllOrder()
  console.log(orderList.value)
})

// 查看详情
const viewOrderDetail = (order: OrderDetail) => {
  console.log(order)
}
</script>

<style scoped lang="scss">
.date-input {
  max-width: 150px;
}

.customer-phone {
  font-size: 12px;
  color: var(--text-secondary);
}
</style>
