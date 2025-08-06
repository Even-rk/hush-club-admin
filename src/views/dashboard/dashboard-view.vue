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
        <div class="stat-decoration"></div>
        <div class="stat-icon-wrapper">
          <span class="stat-icon">💰</span>
        </div>
        <div class="stat-content">
          <div class="stat-title">今日营业额</div>
          <div class="stat-number">¥15,680</div>
          <div class="stat-trend">
            <span class="trend-badge trend-up">+12.5%</span>
            <span class="trend-text">较昨日</span>
          </div>
        </div>
      </div>

      <div class="stat-card stat-orders">
        <div class="stat-decoration"></div>
        <div class="stat-icon-wrapper">
          <span class="stat-icon">📋</span>
        </div>
        <div class="stat-content">
          <div class="stat-title">今日订单</div>
          <div class="stat-number">168</div>
          <div class="stat-trend">
            <span class="trend-badge trend-up">+8.3%</span>
            <span class="trend-text">较昨日</span>
          </div>
        </div>
      </div>

      <div class="stat-card stat-members">
        <div class="stat-decoration"></div>
        <div class="stat-icon-wrapper">
          <span class="stat-icon">👥</span>
        </div>
        <div class="stat-content">
          <div class="stat-title">新增会员</div>
          <div class="stat-number">28</div>
          <div class="stat-trend">
            <span class="trend-badge trend-down">-5.2%</span>
            <span class="trend-text">较昨日</span>
          </div>
        </div>
      </div>

      <div class="stat-card stat-price">
        <div class="stat-decoration"></div>
        <div class="stat-icon-wrapper">
          <span class="stat-icon">💳</span>
        </div>
        <div class="stat-content">
          <div class="stat-title">客单价</div>
          <div class="stat-number">¥93.33</div>
          <div class="stat-trend">
            <span class="trend-badge trend-up">+3.8%</span>
            <span class="trend-text">较昨日</span>
          </div>
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
  gap: 24px;
  margin-bottom: 32px;
}

.stat-card {
  background: var(--bg-white);
  border-radius: 20px;
  padding: 28px;
  position: relative;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid var(--border-light);

  &:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: var(--shadow-2xl);

    .stat-icon-wrapper {
      transform: rotate(10deg) scale(1.1);
    }

    .stat-decoration {
      transform: scale(1.2);
      opacity: 0.2;
    }
  }

  // 装饰元素
  .stat-decoration {
    position: absolute;
    top: -30px;
    right: -30px;
    width: 120px;
    height: 120px;
    border-radius: 50%;
    transition: all 0.4s;
    opacity: 0.15;
  }

  // 营业额卡片 - 绿色主题
  &.stat-revenue {
    background: linear-gradient(
      135deg,
      var(--bg-success-strong-start) 0%,
      var(--bg-success-strong-end) 100%
    );
    border: 1px solid var(--success-color);

    .stat-decoration {
      background: linear-gradient(135deg, var(--success-color) 0%, var(--success-dark-end) 100%);
    }

    .stat-icon-wrapper {
      background: linear-gradient(135deg, var(--success-color) 0%, var(--success-dark-end) 100%);
      box-shadow: var(--shadow-success);
    }

    .stat-number {
      color: var(--text-success-dark);
      font-weight: 800;
    }

    .stat-title {
      color: var(--success-color);
      font-weight: 600;
    }
  }

  // 订单卡片 - 蓝色主题
  &.stat-orders {
    background: linear-gradient(
      135deg,
      var(--bg-info-strong-start) 0%,
      var(--bg-info-strong-end) 100%
    );
    border: 1px solid var(--info-color);

    .stat-decoration {
      background: linear-gradient(135deg, var(--info-color) 0%, var(--info-dark-end) 100%);
    }

    .stat-icon-wrapper {
      background: linear-gradient(135deg, var(--info-color) 0%, var(--info-dark-end) 100%);
      box-shadow: var(--shadow-info);
    }

    .stat-number {
      color: var(--text-info-dark);
      font-weight: 800;
    }

    .stat-title {
      color: var(--info-color);
      font-weight: 600;
    }
  }

  // 会员卡片 - 黄色主题
  &.stat-members {
    background: linear-gradient(
      135deg,
      var(--bg-warning-strong-start) 0%,
      var(--bg-warning-strong-end) 100%
    );
    border: 1px solid var(--warning-color);

    .stat-decoration {
      background: linear-gradient(135deg, var(--warning-color) 0%, var(--warning-dark-end) 100%);
    }

    .stat-icon-wrapper {
      background: linear-gradient(135deg, var(--warning-color) 0%, var(--warning-dark-end) 100%);
      box-shadow: var(--shadow-warning);
    }

    .stat-number {
      color: var(--text-warning-dark);
      font-weight: 800;
    }

    .stat-title {
      color: var(--warning-color);
      font-weight: 600;
    }
  }

  // 客单价卡片 - 主题色
  &.stat-price {
    background: linear-gradient(
      135deg,
      var(--bg-primary-strong-start) 0%,
      var(--bg-primary-strong-end) 100%
    );
    border: 1px solid var(--primary-color);

    .stat-decoration {
      background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark-end) 100%);
    }

    .stat-icon-wrapper {
      background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark-end) 100%);
      box-shadow: var(--shadow-primary);
    }

    .stat-number {
      color: var(--text-primary-dark);
      font-weight: 800;
    }

    .stat-title {
      color: var(--primary-color);
      font-weight: 600;
    }
  }
}

// 图标容器
.stat-icon-wrapper {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  transition: all 0.4s;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 16px;
    background: var(--bg-white);
    opacity: 0.9;
    z-index: 0;
  }

  .stat-icon {
    font-size: 24px;
    filter: var(--shadow-drop);
    position: relative;
    z-index: 1;
  }
}

// 内容区域
.stat-content {
  position: relative;
  z-index: 1;

  .stat-title {
    font-size: 13px;
    color: var(--text-muted);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    margin-bottom: 12px;
  }

  .stat-number {
    font-size: 36px;
    font-weight: 800;
    line-height: 1;
    margin-bottom: 16px;
    transition: all 0.3s;
  }

  .stat-trend {
    display: flex;
    align-items: center;
    gap: 8px;

    .trend-badge {
      display: inline-flex;
      align-items: center;
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 700;

      &.trend-up {
        background: linear-gradient(135deg, var(--trend-up-start) 0%, var(--trend-up-end) 100%);
        color: var(--trend-up-text);
        border: 1px solid var(--trend-up-end);

        &::before {
          content: '↑';
          margin-right: 4px;
          font-weight: bold;
        }
      }

      &.trend-down {
        background: linear-gradient(135deg, var(--trend-down-start) 0%, var(--trend-down-end) 100%);
        color: var(--trend-down-text);
        border: 1px solid var(--trend-down-end);

        &::before {
          content: '↓';
          margin-right: 4px;
          font-weight: bold;
        }
      }
    }

    .trend-text {
      font-size: 12px;
      color: var(--text-muted);
      font-weight: 500;
    }
  }
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
