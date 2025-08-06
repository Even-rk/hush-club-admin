<template>
  <!-- 订单统计页面 -->
  <!-- 筛选器 -->
  <div class="content-card filter-card">
    <div class="card-header">
      <div class="card-title">数据筛选</div>
      <button class="btn btn-primary" onclick="applyDateFilter()">应用筛选</button>
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
        <div class="stat-icon stat-info">📋</div>
      </div>
      <div class="stat-number">3,420</div>
      <div class="stat-trend trend-up">↗️ +15.2% 较上月</div>
    </div>

    <div class="stat-card">
      <div class="stat-header">
        <div class="stat-title">本月营业额</div>
        <div class="stat-icon stat-success">💰</div>
      </div>
      <div class="stat-number">¥356,800</div>
      <div class="stat-trend trend-up">↗️ +22.5% 较上月</div>
    </div>

    <div class="stat-card">
      <div class="stat-header">
        <div class="stat-title">平均客单价</div>
        <div class="stat-icon stat-warning">💳</div>
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
</template>

<script setup lang="ts">
import { ref } from 'vue'
import CoolSelect from '@/components/cool-select.vue'

// 筛选器状态
const selectedYear = ref('2024')
const selectedMonth = ref('12')
const selectedQuickFilter = ref('')
const selectedCompareFilter = ref('lastMonth')

// 年份选项
const yearOptions = [
  { label: '2024年', value: '2024' },
  { label: '2023年', value: '2023' },
  { label: '2022年', value: '2022' },
  { label: '2021年', value: '2021' }
]

// 月份选项
const monthOptions = [
  { label: '全年', value: '' },
  { label: '1月', value: '1' },
  { label: '2月', value: '2' },
  { label: '3月', value: '3' },
  { label: '4月', value: '4' },
  { label: '5月', value: '5' },
  { label: '6月', value: '6' },
  { label: '7月', value: '7' },
  { label: '8月', value: '8' },
  { label: '9月', value: '9' },
  { label: '10月', value: '10' },
  { label: '11月', value: '11' },
  { label: '12月', value: '12' }
]

// 快速筛选选项
const quickFilterOptions = [
  { label: '自定义', value: '' },
  { label: '今天', value: 'today' },
  { label: '本周', value: 'week' },
  { label: '本月', value: 'month' },
  { label: '本季度', value: 'quarter' },
  { label: '本年', value: 'year' }
]

// 对比选项
const compareFilterOptions = [
  { label: '无对比', value: 'none' },
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

.filter-card {
  margin-bottom: 24px;
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

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 24px;

  .stat-card {
    background: white;
    padding: 20px;
    border-radius: var(--radius);
    border: 1px solid var(--border-color);
    box-shadow: var(--shadow);

    .stat-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;

      .stat-title {
        font-weight: 600;
        color: var(--text-primary);
      }

      .stat-icon {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;

        &.stat-info {
          background: var(--info-color);
        }

        &.stat-success {
          background: var(--success-color);
        }

        &.stat-warning {
          background: var(--warning-color);
        }
      }
    }

    .stat-number {
      font-size: 24px;
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: 8px;
    }

    .stat-trend {
      font-size: 12px;

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
  font-size: 12px;
  color: var(--text-secondary);
}

.status-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 24px;

  .status-card {
    text-align: center;
    padding: 20px;
    border-radius: var(--radius);

    &.status-completed {
      background: rgba(76, 175, 80, 0.1);
    }

    &.status-processing {
      background: rgba(255, 193, 7, 0.1);
    }

    &.status-cancelled {
      background: rgba(244, 67, 54, 0.1);
    }

    .status-number {
      font-size: 24px;
      font-weight: 600;
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
      color: var(--text-secondary);
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
  background: var(--bg-gray);
  border-radius: var(--radius);
  color: var(--text-secondary);
  font-size: 18px;
  margin-top: 20px;
}
</style>
