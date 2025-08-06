<template>
  <!-- 数据概览页面 -->
  <div class="dashboard-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">
          <span class="title-icon">📊</span>
          数据概览
        </h1>
        <p class="page-subtitle">实时监控店铺运营数据和销售状况</p>
      </div>
      <div class="header-actions">
        <button class="btn btn-secondary btn-with-icon">
          <span class="btn-icon">📥</span>
          导出报表
        </button>
        <button class="btn btn-primary btn-with-icon">
          <span class="btn-icon">🔄</span>
          刷新数据
        </button>
      </div>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-grid">
      <div class="stat-card stat-revenue">
        <div class="stat-header">
          <div class="stat-title">今日营业额</div>
          <div class="stat-icon">💰</div>
        </div>
        <div class="stat-number">¥15,680</div>
        <div class="stat-footer">
          <div class="stat-trend trend-up">
            <span class="trend-icon">↗️</span>
            <span class="trend-value">+12.5%</span>
          </div>
          <span class="stat-compare">较昨日</span>
        </div>
      </div>

      <div class="stat-card stat-orders">
        <div class="stat-header">
          <div class="stat-title">今日订单</div>
          <div class="stat-icon">📋</div>
        </div>
        <div class="stat-number">168</div>
        <div class="stat-footer">
          <div class="stat-trend trend-up">
            <span class="trend-icon">↗️</span>
            <span class="trend-value">+8.3%</span>
          </div>
          <span class="stat-compare">较昨日</span>
        </div>
      </div>

      <div class="stat-card stat-members">
        <div class="stat-header">
          <div class="stat-title">新增会员</div>
          <div class="stat-icon">👥</div>
        </div>
        <div class="stat-number">28</div>
        <div class="stat-footer">
          <div class="stat-trend trend-down">
            <span class="trend-icon">↘️</span>
            <span class="trend-value">-5.2%</span>
          </div>
          <span class="stat-compare">较昨日</span>
        </div>
      </div>

      <div class="stat-card stat-price">
        <div class="stat-header">
          <div class="stat-title">客单价</div>
          <div class="stat-icon">💳</div>
        </div>
        <div class="stat-number">¥93.33</div>
        <div class="stat-footer">
          <div class="stat-trend trend-up">
            <span class="trend-icon">↗️</span>
            <span class="trend-value">+3.8%</span>
          </div>
          <span class="stat-compare">较昨日</span>
        </div>
      </div>
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
          <div class="card-subtitle">今日热销TOP4</div>
        </div>
        <div class="card-body">
          <div class="hot-products-list">
            <div class="hot-product-item">
              <span class="rank-badge rank-1">1</span>
              <div class="product-info">
                <div class="product-name">经典美式咖啡</div>
                <div class="product-stats">
                  <span class="sales-count">销量: 89杯</span>
                </div>
              </div>
              <div class="product-revenue">¥1,425</div>
            </div>
            <div class="hot-product-item">
              <span class="rank-badge rank-2">2</span>
              <div class="product-info">
                <div class="product-name">香草拿铁</div>
                <div class="product-stats">
                  <span class="sales-count">销量: 67杯</span>
                </div>
              </div>
              <div class="product-revenue">¥1,675</div>
            </div>
            <div class="hot-product-item">
              <span class="rank-badge rank-3">3</span>
              <div class="product-info">
                <div class="product-name">经典卡布奇诺</div>
                <div class="product-stats">
                  <span class="sales-count">销量: 45杯</span>
                </div>
              </div>
              <div class="product-revenue">¥990</div>
            </div>
            <div class="hot-product-item">
              <span class="rank-badge">4</span>
              <div class="product-info">
                <div class="product-name">焦糖玛奇朵</div>
                <div class="product-stats">
                  <span class="sales-count">销量: 38杯</span>
                </div>
              </div>
              <div class="product-revenue">¥1,064</div>
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
        <data-table
          :data="recentOrders"
          :columns="orderColumns"
          :show-actions="false"
          row-key="id"
          empty-text="暂无订单数据"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import CoolSelect from '@/components/cool-select.vue'
import DataTable from '@/components/data-table.vue'
import type { TableColumn } from '@/types/supabase'

// 时间段选择器选项
const periodOptions = [
  { label: '最近7天', value: '7days' },
  { label: '最近30天', value: '30days' },
  { label: '最近90天', value: '90days' }
]

const selectedPeriod = ref('7days')

// 最近订单数据
const recentOrders = ref([
  {
    id: 1,
    order_no: 'HU20241201001',
    customer: '张先生',
    items: '美式咖啡 x2, 拿铁 x1',
    amount: 45.6,
    status: 'completed',
    time: '14:30'
  },
  {
    id: 2,
    order_no: 'HU20241201002',
    customer: '李女士',
    items: '卡布奇诺 x1',
    amount: 18.7,
    status: 'processing',
    time: '14:25'
  },
  {
    id: 3,
    order_no: 'HU20241201003',
    customer: '王先生',
    items: '焦糖玛奇朵 x2',
    amount: 56.0,
    status: 'completed',
    time: '14:20'
  },
  {
    id: 4,
    order_no: 'HU20241201004',
    customer: '赵女士',
    items: '香草拿铁 x1, 提拉米苏 x1',
    amount: 68.0,
    status: 'pending',
    time: '14:15'
  }
])

// 表格列配置
const orderColumns: TableColumn[] = [
  { key: 'order_no', title: '订单号' },
  { key: 'customer', title: '客户' },
  { key: 'items', title: '商品' },
  { key: 'amount', title: '金额', type: 'price' },
  {
    key: 'status',
    title: '状态',
    type: 'status',
    statusMap: {
      completed: { text: '已完成', className: 'status-success' },
      processing: { text: '制作中', className: 'status-warning' },
      pending: { text: '待支付', className: 'status-info' }
    }
  },
  { key: 'time', title: '时间' }
]
</script>

<style lang="scss" scoped>
/* 数据概览页面 */
.dashboard-page {
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

  &.btn-sm {
    padding: 6px 12px;
    font-size: 13px;
  }
}

/* 统计卡片 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.stat-card {
  background: var(--bg-white);
  border-radius: var(--radius-xl);
  padding: 24px;
  box-shadow: var(--shadow-md);
  position: relative;
  overflow: hidden;
  transition: all 0.3s;
  border: 1px solid var(--border-light);

  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);

    .stat-icon {
      transform: scale(1.1);
    }
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
  }

  &.stat-revenue::before {
    background: linear-gradient(135deg, var(--success-color) 0%, var(--success-color) 100%);
  }

  &.stat-orders::before {
    background: linear-gradient(135deg, var(--info-color) 0%, var(--info-color) 100%);
  }

  &.stat-members::before {
    background: linear-gradient(135deg, var(--warning-color) 0%, var(--warning-color) 100%);
  }

  &.stat-price::before {
    background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-light) 100%);
  }
}

.stat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.stat-title {
  font-size: 13px;
  color: var(--text-muted);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-icon {
  width: 42px;
  height: 42px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  background: var(--bg-light);
  transition: transform 0.3s;
}

.stat-revenue .stat-icon {
  background: var(--success-bg);
}

.stat-orders .stat-icon {
  background: var(--info-bg);
}

.stat-members .stat-icon {
  background: var(--warning-bg);
}

.stat-price .stat-icon {
  background: rgba(255, 107, 53, 0.1);
}

.stat-number {
  font-size: 32px;
  font-weight: 700;
  color: var(--text-heading);
  margin-bottom: 12px;
  line-height: 1;
}

.stat-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 12px;
  border-top: 1px solid var(--border-light);
}

.stat-trend {
  display: flex;
  align-items: center;
  gap: 4px;

  .trend-icon {
    font-size: 14px;
  }

  .trend-value {
    font-size: 13px;
    font-weight: 600;
  }
}

.trend-up {
  color: var(--success-color);
}

.trend-down {
  color: var(--error-color);
}

.stat-compare {
  font-size: 12px;
  color: var(--text-muted);
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
    align-items: center;
    gap: 12px;

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
