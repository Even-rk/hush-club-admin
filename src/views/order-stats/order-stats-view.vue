<!-- eslint-disable max-len -->
<template>
  <!-- 订单统计页面 -->
  <div class="order-stats-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">
          <span class="title-icon">📈</span>
          订单统计分析
        </h1>
        <p class="page-subtitle">分析订单数据趋势，了解营业状况和高峰时段</p>
      </div>
      <div class="header-actions">
        <button class="btn btn-primary btn-with-icon">
          <span class="btn-icon">📥</span>
          导出报表
        </button>
      </div>
    </div>

    <!-- 筛选器 -->
    <div class="content-card filter-card">
      <div class="card-header">
        <div class="card-title">数据筛选</div>
        <button class="btn btn-primary">应用筛选</button>
      </div>
      <div class="card-body">
        <div class="filters">
          <div class="filter-item">
            <label class="filter-label">年份:</label>
            <cool-select
              v-model="selectedYear"
              :options="yearOptions"
              class="filter-select"
              @change="onYearChange"
            />
          </div>
          <div class="filter-item">
            <label class="filter-label">月份:</label>
            <cool-select
              v-model="selectedMonth"
              :options="monthOptions"
              class="filter-select"
              @change="onMonthChange"
            />
          </div>
          <div class="filter-item">
            <label class="filter-label">快速筛选:</label>
            <cool-select
              v-model="selectedQuickFilter"
              :options="quickFilterOptions"
              class="filter-select"
              @change="applyQuickFilter"
            />
          </div>
          <div class="filter-item">
            <label class="filter-label">对比:</label>
            <cool-select
              v-model="selectedCompareFilter"
              :options="compareFilterOptions"
              class="filter-select"
              @change="onCompareChange"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 统计卡片数据对比 -->
    <RevenueStatsCards :compare="selectedCompareFilter" />

    <!-- 订单状态统计 -->
    <div class="order-status-section">
      <div class="section-header">
        <h3 class="section-title">订单状态分布</h3>
        <span class="period-badge">2024年12月</span>
      </div>

      <div class="status-stats-grid">
        <div class="status-stat-card completed">
          <div class="stat-decoration"></div>
          <div class="stat-body">
            <div class="stat-icon-box">
              <img src="/src/assets/icons/check.svg" alt="完成图标" />
            </div>
            <div class="stat-info">
              <div class="stat-label">已完成</div>
              <div class="stat-value">142</div>
            </div>
            <div class="stat-badge">85%</div>
          </div>
        </div>

        <div class="status-stat-card processing">
          <div class="stat-decoration"></div>
          <div class="stat-body">
            <div class="stat-icon-box">
              <img src="/src/assets/icons/clock.svg" alt="制作中图标" />
            </div>
            <div class="stat-info">
              <div class="stat-label">制作中</div>
              <div class="stat-value">18</div>
            </div>
            <div class="stat-badge">11%</div>
          </div>
        </div>

        <div class="status-stat-card cancelled">
          <div class="stat-decoration"></div>
          <div class="stat-body">
            <div class="stat-icon-box">
              <img src="/src/assets/icons/close-x.svg" alt="取消图标" />
            </div>
            <div class="stat-info">
              <div class="stat-label">已取消</div>
              <div class="stat-value">3</div>
            </div>
            <div class="stat-badge">2%</div>
          </div>
        </div>

        <div class="status-stat-card total">
          <div class="stat-decoration"></div>
          <div class="stat-body">
            <div class="stat-icon-box">
              <img src="/src/assets/icons/grid.svg" alt="总订单图标" />
            </div>
            <div class="stat-info">
              <div class="stat-label">总订单</div>
              <div class="stat-value">163</div>
            </div>
            <div class="stat-badge">100%</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 高峰时段分析 -->
    <div class="content-card">
      <div class="card-header">
        <div class="card-title">高峰时段分析</div>
      </div>
      <div class="card-body">
        <div class="time-analysis">
          <div class="time-item">
            <div class="time-period">08:00 - 10:00</div>
            <div class="time-stats">
              <span class="order-count">28单</span>
              <span class="order-percentage">16.7%</span>
            </div>
          </div>
          <div class="time-item">
            <div class="time-period">10:00 - 12:00</div>
            <div class="time-stats">
              <span class="order-count">45单</span>
              <span class="order-percentage">26.8%</span>
            </div>
          </div>
          <div class="time-item">
            <div class="time-period">14:00 - 16:00</div>
            <div class="time-stats">
              <span class="order-count">52单</span>
              <span class="order-percentage">31.0%</span>
            </div>
          </div>
          <div class="time-item">
            <div class="time-period">19:00 - 21:00</div>
            <div class="time-stats">
              <span class="order-count">43单</span>
              <span class="order-percentage">25.6%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import CoolSelect from '@/components/cool-select.vue'
import RevenueStatsCards from './component/revenue-stats-cards.vue'

// 筛选器状态
const selectedYear = ref(new Date().getFullYear())
const selectedMonth = ref(new Date().getMonth() + 1)
const selectedQuickFilter = ref('month')
const selectedCompareFilter = ref('lastMonth')

// 年份选项 前10年 + 后10年
const yearOptions = Array.from({ length: 20 }, (_, i) => ({
  label: `${new Date().getFullYear() - 10 + i}年`,
  value: new Date().getFullYear() - 10 + i
}))

// 月份选项
const monthOptions = Array.from({ length: 12 }, (_, i) => ({
  label: `${i + 1}月`,
  value: i + 1
}))

// 快速筛选选项
const quickFilterOptions = [
  { label: '今天', value: 'today' },
  { label: '本周', value: 'week' },
  { label: '本月', value: 'month' },
  { label: '本季度', value: 'quarter' },
  { label: '本年', value: 'year' }
]

// 对比选项
const compareFilterOptions = [
  { label: '较上月', value: 'lastMonth' },
  { label: '较去年同期', value: 'lastYear' },
  { label: '较上季度', value: 'lastQuarter' }
]

// 事件处理函数
const onYearChange = (value: string | number) => {
  console.log('年份变更:', value)
  // TODO: 实现年份变更逻辑
}

const onMonthChange = (value: string | number) => {
  console.log('月份变更:', value)
  // TODO: 实现月份变更逻辑
}

const applyQuickFilter = (value: string | number) => {
  console.log('快速筛选:', value)
  // TODO: 实现快速筛选逻辑
}

const onCompareChange = (value: string | number) => {
  console.log('对比变更:', value)
  // TODO: 实现对比逻辑
}
</script>

<style scoped lang="scss">
/* 订单统计页面 */
.order-stats-page {
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

  &.btn-with-icon {
    .btn-icon {
      font-size: 16px;
    }
  }
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
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-heading);
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
  padding: 24px;
}

.filter-card {
  margin-bottom: 24px;
}

.filters {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.filter-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-label {
  font-size: 14px;
  color: var(--text-dark);
  white-space: nowrap;
  font-weight: 500;
}

.filter-select {
  min-width: 140px;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-3px);
  }
}

.current-period {
  font-size: 13px;
  color: var(--text-subtitle);
  font-weight: 500;
}

/* 订单状态分布 */
.order-status-section {
  background: white;
  border-radius: 20px;
  padding: 24px;
  margin-bottom: 32px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;

    .section-title {
      font-size: 20px;
      font-weight: 600;
      color: var(--text-heading);
      margin: 0;
    }
  }
}

.period-badge {
  display: inline-flex;
  align-items: center;
  padding: 6px 14px;
  background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%);
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  color: #6366f1;
}

.status-stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;

  .status-stat-card {
    background: white;
    border-radius: 16px;
    position: relative;
    overflow: hidden;
    border: 1px solid rgba(0, 0, 0, 0.06);
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);

      .stat-decoration {
        transform: scale(1.1) rotate(10deg);
      }

      .stat-icon-box {
        transform: scale(1.1);
      }
    }

    .stat-decoration {
      position: absolute;
      top: -30px;
      right: -30px;
      width: 100px;
      height: 100px;
      border-radius: 50%;
      opacity: 0.1;
      transition: transform 0.5s ease;
    }

    .stat-body {
      padding: 20px;
      display: flex;
      align-items: center;
      gap: 16px;
      position: relative;
      z-index: 1;
    }

    .stat-icon-box {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.3s ease;
      flex-shrink: 0;
      img {
        width: 24px;
        height: 24px;
      }
    }

    .stat-info {
      flex: 1;
      .stat-label {
        font-size: 13px;
        color: var(--text-subtitle);
        margin-bottom: 4px;
      }
      .stat-value {
        font-size: 24px;
        font-weight: 700;
        color: var(--text-heading);
      }
    }

    .stat-badge {
      position: absolute;
      top: 12px;
      right: 12px;
      padding: 4px 10px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
    }

    &.completed {
      .stat-decoration {
        background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
      }
      .stat-icon-box {
        background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
        color: #16a34a;
      }
      .stat-badge {
        background: #dcfce7;
        color: #16a34a;
      }
    }

    &.processing {
      .stat-decoration {
        background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
      }
      .stat-icon-box {
        background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
        color: #d97706;
        animation: pulse 2s infinite;
      }
      .stat-badge {
        background: #fef3c7;
        color: #d97706;
      }
    }

    &.cancelled {
      .stat-decoration {
        background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
      }
      .stat-icon-box {
        background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
        color: #dc2626;
      }
      .stat-badge {
        background: #fee2e2;
        color: #dc2626;
      }
    }

    &.total {
      .stat-decoration {
        background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
      }
      .stat-icon-box {
        background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%);
        color: #4f46e5;
      }
      .stat-badge {
        background: #e0e7ff;
        color: #4f46e5;
      }
    }
  }
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.time-analysis {
  display: flex;
  flex-direction: column;
  gap: 12px;
  .time-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 0;
    border-bottom: 1px solid var(--border-color);
    &:last-child {
      border-bottom: none;
    }
    .time-period {
      color: var(--text-primary);
    }
    .time-stats {
      .order-count {
        font-weight: 600;
        color: var(--primary-color);
      }
      .order-percentage {
        margin-left: 8px;
        font-size: 12px;
        color: var(--text-secondary);
      }
    }
  }
}
</style>
