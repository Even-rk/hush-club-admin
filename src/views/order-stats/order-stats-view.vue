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

    <!-- 统计卡片 -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-header">
          <div class="stat-title">本月订单总数</div>
          <div class="stat-icon">📋</div>
        </div>
        <div class="stat-number">3,420</div>
        <div class="stat-trend trend-up">↗️ +15.2% 较上月</div>
      </div>

      <div class="stat-card">
        <div class="stat-header">
          <div class="stat-title">本月营业额</div>
          <div class="stat-icon">💰</div>
        </div>
        <div class="stat-number">¥356,800</div>
        <div class="stat-trend trend-up">↗️ +22.5% 较上月</div>
      </div>

      <div class="stat-card">
        <div class="stat-header">
          <div class="stat-title">平均客单价</div>
          <div class="stat-icon">💳</div>
        </div>
        <div class="stat-number">¥104.33</div>
        <div class="stat-trend trend-up">↗️ +6.8% 较上月</div>
      </div>
    </div>

    <!-- 订单状态统计 -->
    <div class="content-card">
      <div class="card-header">
        <div class="card-title">订单状态分布</div>
        <div class="card-actions">
          <span class="current-period">2024年12月</span>
        </div>
      </div>
      <div class="card-body">
        <div class="status-grid">
          <div class="status-card status-completed">
            <div class="status-number">142</div>
            <div class="status-label">已完成</div>
          </div>
          <div class="status-card status-processing">
            <div class="status-number">18</div>
            <div class="status-label">制作中</div>
          </div>
          <div class="status-card status-cancelled">
            <div class="status-number">3</div>
            <div class="status-label">已取消</div>
          </div>
        </div>
        <div class="chart-placeholder">📈 订单状态趋势图</div>
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

/* 统计卡片 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 24px;

  .stat-card {
    background: var(--bg-white);
    padding: 24px;
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow);
    position: relative;
    overflow: hidden;
    transition: all 0.3s;

    &:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-lg);
    }

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-light) 100%);
    }

    .stat-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;

      .stat-title {
        font-size: 14px;
        font-weight: 500;
        color: var(--text-subtitle);
      }

      .stat-icon {
        width: 48px;
        height: 48px;
        border-radius: var(--radius-lg);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-light) 100%);
      }
    }

    .stat-number {
      font-size: 32px;
      font-weight: 700;
      color: var(--text-heading);
      margin-bottom: 8px;
    }

    .stat-trend {
      font-size: 13px;
      font-weight: 500;

      &.trend-up {
        color: var(--success-color);
      }

      &.trend-down {
        color: var(--error-color);
      }
    }
  }
}

.current-period {
  font-size: 13px;
  color: var(--text-subtitle);
  font-weight: 500;
}

/* 状态统计 */
.status-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 24px;

  .status-card {
    text-align: center;
    padding: 24px;
    border-radius: var(--radius-lg);
    transition: all 0.3s;

    &:hover {
      transform: scale(1.02);
    }

    &.status-completed {
      background: var(--success-bg);
    }

    &.status-processing {
      background: var(--warning-bg);
    }

    &.status-cancelled {
      background: var(--error-bg);
    }

    .status-number {
      font-size: 28px;
      font-weight: 700;
      margin-bottom: 8px;
    }

    &.status-completed .status-number {
      color: var(--success-color);
    }

    &.status-processing .status-number {
      color: var(--warning-color);
    }

    &.status-cancelled .status-number {
      color: var(--error-color);
    }

    .status-label {
      color: var(--text-subtitle);
      font-size: 14px;
      font-weight: 500;
    }
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

.chart-placeholder {
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--bg-gradient-start) 0%, var(--border-medium) 100%);
  border-radius: var(--radius-lg);
  color: var(--text-subtitle);
  font-size: 18px;
  font-weight: 500;
  margin-top: 20px;
  border: 2px dashed var(--border-medium);
}
</style>
