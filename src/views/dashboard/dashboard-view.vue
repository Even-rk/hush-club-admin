<template>
  <!-- 数据概览页面 -->
  <div class="dashboard-page">
    <!-- 全局 Loading -->
    <div v-if="loading" class="page-loading">
      <div class="loading-container">
        <div class="loading-wrapper">
          <div class="loading-spinner">
            <div class="spinner-circle"></div>
            <div class="spinner-circle"></div>
            <div class="spinner-circle"></div>
          </div>
          <div class="loading-icon">☕</div>
        </div>
        <div class="loading-text">正在加载数据...</div>
        <div class="loading-progress">
          <div class="progress-bar"></div>
        </div>
      </div>
    </div>
    <template v-else>
      <!-- 页面头部 -->
      <div class="page-header">
        <div class="header-content">
          <h1 class="page-title">
            <span class="title-icon">📊</span>
            数据概览
          </h1>
          <p class="page-subtitle">实时监控店铺运营数据和销售状况</p>
        </div>
        <!-- <div class="header-actions">
        <button class="btn btn-secondary btn-with-icon">
          <span class="btn-icon">📥</span>
          导出报表
        </button>
        <button class="btn btn-primary btn-with-icon">
          <span class="btn-icon">🔄</span>
          刷新数据
        </button>
      </div> -->
      </div>

      <!-- 统计卡片 -->
      <div class="stats-grid">
        <stat-card
          type="revenue"
          icon="💰"
          title="今日营业额"
          :value="dataOverview.today_order_amount || 0"
          :compare-value="dataOverview.yesterday_order_amount"
          prefix="¥"
        />

        <stat-card
          type="orders"
          icon="📋"
          title="今日订单"
          :value="dataOverview.today_order_count || 0"
          :compare-value="dataOverview.yesterday_order_count"
          suffix="单"
        />

        <stat-card
          type="members"
          icon="👥"
          title="新增会员"
          :value="dataOverview.today_member_count || 0"
          :compare-value="dataOverview.yesterday_member_count"
          suffix="人"
        />

        <stat-card
          type="price"
          icon="💳"
          title="客单价"
          :value="dataOverview.today_order_price || 0"
          :compare-value="dataOverview.yesterday_order_price"
          prefix="¥"
        />
      </div>

      <!-- 图表区域 -->
      <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 24px; margin-bottom: 24px">
        <div class="content-card">
          <div class="card-header">
            <div class="card-title">销售趋势</div>
            <div class="card-actions">
              <cool-select
                v-model="selectedPeriod"
                :options="periodOptions"
                style="min-width: 120px"
              />
            </div>
          </div>
          <div class="card-body">
            <div class="chart-placeholder">📈 销售趋势图表</div>
          </div>
        </div>

        <div class="content-card hot-products-card">
          <div class="card-header">
            <div class="card-title">热门商品</div>
            <div class="card-subtitle">热销TOP4</div>
          </div>
          <div class="card-body">
            <div class="hot-products-list">
              <div
                v-for="(product, index) in hotProducts"
                :key="product.id"
                class="hot-product-item"
              >
                <span class="rank-badge" :class="`rank-${index + 1}`">{{ index + 1 }}</span>
                <div class="product-info">
                  <div class="product-name">{{ product.category_name }}</div>
                  <div class="product-stats">
                    <span class="sales-count">销量: </span>
                    <span class="sales-count">{{ product.sales_count }}杯</span>
                  </div>
                </div>
                <div class="product-revenue">
                  ¥{{ product.normal_member_price * product.sales_count }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 最近订单 -->
      <div class="content-card">
        <div class="card-header">
          <div class="card-title">最近订单</div>
          <div class="btn btn-primary btn-sm" @click="$router.push('/orders')">查看全部</div>
        </div>
        <div class="card-body">
          <!-- 订单列表 -->
          <data-table
            :data="recentOrders"
            :columns="orderColumns"
            :show-actions="false"
            :loading="false"
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
    </template>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import CoolSelect from '@/components/cool-select.vue'
import DataTable from '@/components/data-table.vue'
import StatCard from './component/stat-card.vue'
import type { DataOverview, OrderDetail, Product, TableColumn } from '@/types/supabase'
import { reqGetAllOrder, reqGetDataOverview, reqGetHotProduct } from '@/api/supabase'
import { formatDate } from '@/utils/format'

// 时间段选择器选项
const periodOptions = [
  { label: '最近7天', value: '7days' },
  { label: '最近30天', value: '30days' },
  { label: '最近90天', value: '90days' }
]

const selectedPeriod = ref('7days')

// 最近订单数据
const recentOrders = ref<OrderDetail[]>([])
// 数据概览
const dataOverview = ref<DataOverview>({})
// 热门商品
const hotProducts = ref<Product[]>([])

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
  { key: 'created_at', title: '下单时间' },
  { key: 'remark', title: '订单备注' }
]

const loading = ref(false)

onMounted(async () => {
  // 最近订单
  loading.value = true
  try {
    const [orders, overview, hotProductsData] = await Promise.all([
      reqGetAllOrder(),
      reqGetDataOverview(),
      reqGetHotProduct()
    ])
    // 最近订单
    recentOrders.value = orders.map(order => {
      return {
        ...order,
        created_at: formatDate(order.created_at, 'YYYY-MM-DD HH:mm:ss')
      }
    })
    // 数据概览
    dataOverview.value = overview
    // 热门商品
    hotProducts.value = hotProductsData
  } finally {
    loading.value = false
  }
})
</script>

<style lang="scss" scoped>
/* 数据概览页面 */
.dashboard-page {
  background: linear-gradient(135deg, var(--bg-gradient-start) 0%, var(--bg-white) 100%);
  min-height: calc(100vh - 165px);
  position: relative;
}

/* 全局 Loading */
.page-loading {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 248, 243, 0.98) 100%);
  backdrop-filter: blur(20px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: fadeIn 0.3s ease;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
  padding: 40px;
}

.loading-wrapper {
  position: relative;
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-spinner {
  position: absolute;
  width: 100%;
  height: 100%;
  animation: spin 2s linear infinite;
}

.spinner-circle {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 3px solid transparent;
  border-top-color: var(--primary-color);
  border-radius: 50%;
  animation: spin 1.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite;

  &:nth-child(1) {
    animation-delay: 0s;
    border-top-color: var(--primary-color);
  }

  &:nth-child(2) {
    animation-delay: 0.15s;
    width: 80%;
    height: 80%;
    top: 10%;
    left: 10%;
    border-top-color: var(--primary-light);
  }

  &:nth-child(3) {
    animation-delay: 0.3s;
    width: 60%;
    height: 60%;
    top: 20%;
    left: 20%;
    border-top-color: var(--primary-dark);
  }
}

.loading-icon {
  font-size: 36px;
  animation: pulse 2s ease-in-out infinite;
}

.loading-text {
  font-size: 18px;
  font-weight: 600;
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-light) 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: 1px;
  animation: pulse 2s ease-in-out infinite;
}

.loading-progress {
  width: 200px;
  height: 4px;
  background: var(--border-light);
  border-radius: 100px;
  overflow: hidden;
  position: relative;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(
    90deg,
    var(--primary-color) 0%,
    var(--primary-light) 50%,
    var(--primary-color) 100%
  );
  border-radius: 100px;
  animation: progress 1.5s ease-in-out infinite;
  width: 40%;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.8;
  }
}

@keyframes progress {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(350%);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
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

  // .header-actions {
  //   display: flex;
  //   gap: 12px;
  // }
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

  &.btn-sm {
    padding: 6px 12px;
    font-size: 13px;
  }
}

/* 统计卡片网格布局 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

/* 内容卡片 */
.content-card {
  background: var(--bg-white);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
  margin-bottom: 24px;
  transition: all 0.3s;

  &:hover {
    box-shadow: var(--shadow-hover);
  }
}

.card-header {
  padding: 20px 24px;
  border-bottom: 1px solid var(--border-light);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-heading);
}

.card-actions {
  display: flex;
  gap: 12px;
}

.card-body {
  padding: 24px;
}

.customer-phone {
  font-size: 12px;
  color: var(--text-subtitle);
}

/* 订单表格样式 */
.order-table {
  :deep(.data-table) {
    border: 1px solid var(--border-medium);
    border-radius: var(--radius);
    overflow: hidden;
  }
}

/* 图表占位符 */
.chart-placeholder {
  height: 300px;
  background: linear-gradient(135deg, var(--bg-gradient-start) 0%, var(--border-medium) 100%);
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-subtitle);
  font-size: 16px;
  font-weight: 500;
  border: 2px dashed var(--border-medium);
}

/* 状态标签 */
.status-badge {
  padding: 4px 12px;
  border-radius: var(--radius);
  font-size: 12px;
  font-weight: 600;
  text-align: center;
  display: inline-block;
}

.status-success {
  background: var(--success-bg);
  color: var(--success-color);
}

.status-warning {
  background: var(--warning-bg);
  color: var(--warning-color);
}

.status-danger {
  background: var(--error-bg);
  color: var(--error-color);
}

.status-info {
  background: var(--info-bg);
  color: var(--info-color);
}

/* 热门商品卡片 */
.hot-products-card {
  .card-subtitle {
    font-size: 12px;
    color: var(--text-muted);
    margin-top: 4px;
  }
}

.hot-products-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.hot-product-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: var(--bg-light);
  border-radius: var(--radius-md);
  transition: all 0.3s;

  &:hover {
    transform: translateX(4px);
    box-shadow: var(--shadow);
  }
}

.rank-badge {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius);
  background: var(--bg-white);
  color: var(--text-muted);
  font-weight: 600;
  font-size: 14px;

  &.rank-1 {
    background: linear-gradient(135deg, var(--gold-color) 0%, var(--gold-dark) 100%);
    color: var(--gold-text);
  }

  &.rank-2 {
    background: linear-gradient(135deg, var(--silver-color) 0%, var(--silver-dark) 100%);
    color: var(--silver-text);
  }

  &.rank-3 {
    background: linear-gradient(135deg, var(--bronze-color) 0%, var(--bronze-dark) 100%);
    color: var(--bronze-text);
  }
}

.product-info {
  flex: 1;

  .product-name {
    font-weight: 600;
    color: var(--text-heading);
    font-size: 14px;
    margin-bottom: 4px;
  }

  .product-stats {
    display: flex;
    flex-direction: column;
    gap: 4px;

    .sales-count {
      font-size: 12px;
      color: var(--text-muted);
    }
  }
}

.product-revenue {
  font-size: 16px;
  font-weight: 700;
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-light) 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
