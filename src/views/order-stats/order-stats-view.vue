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
            <label class="filter-label">快速筛选:</label>
            <cool-select
              v-model="selectedQuickFilter"
              :options="quickFilterOptions"
              class="filter-select"
              @change="applyQuickFilter"
            />
          </div>
          <div v-if="showYearFilter" class="filter-item">
            <label class="filter-label">年份:</label>
            <cool-select
              v-model="selectedYear"
              :options="yearOptions"
              class="filter-select"
              @change="onYearChange"
            />
          </div>
          <div v-if="showMonthFilter" class="filter-item">
            <label class="filter-label">月份:</label>
            <cool-select
              v-model="selectedMonth"
              :options="monthOptions"
              class="filter-select"
              @change="onMonthChange"
            />
          </div>
          <div v-if="showCompareFilter" class="filter-item">
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
    <RevenueStatsCards :compare="actualCompareValue" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import CoolSelect from '@/components/cool-select.vue'
import RevenueStatsCards from './component/revenue-stats-cards.vue'

// 筛选器状态
const selectedYear = ref(new Date().getFullYear())
const selectedMonth = ref(new Date().getMonth() + 1)
const selectedQuickFilter = ref('year') // 默认为本年
const selectedCompareFilter = ref('')

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

// 动态计算对比选项
const compareFilterOptions = computed(() => {
  switch (selectedQuickFilter.value) {
    case 'today':
      // 今天不显示对比选项，默认为较昨日
      return []
    case 'week':
      // 本周不显示对比选项，默认为较上周
      return []
    case 'month':
      // 本月只显示：较上月、去年同期
      return [
        { label: '较上月', value: 'lastMonth' },
        { label: '去年同期', value: 'lastYearSameMonth' }
      ]
    case 'quarter':
      // 本季度只显示：较上季度、去年同期
      return [
        { label: '较上季度', value: 'lastQuarter' },
        { label: '去年同期', value: 'lastYearSameQuarter' }
      ]
    case 'year':
      // 本年不显示对比选项
      return []
    default:
      return []
  }
})

// 控制年份选择器显示
const showYearFilter = computed(() => {
  return ['month', 'quarter', 'year'].includes(selectedQuickFilter.value)
})

// 控制月份选择器显示
const showMonthFilter = computed(() => {
  return ['month', 'quarter'].includes(selectedQuickFilter.value)
})

// 控制对比选择器显示
const showCompareFilter = computed(() => {
  return ['month', 'quarter'].includes(selectedQuickFilter.value)
})

// 计算实际的对比值
const actualCompareValue = computed(() => {
  switch (selectedQuickFilter.value) {
    case 'today':
      return 'lastDay' // 较昨日
    case 'week':
      return 'lastWeek' // 较上周
    case 'year':
      return '' // 本年不对比
    default:
      return selectedCompareFilter.value
  }
})

// 监听快速筛选变化，自动设置对比选项
watch(selectedQuickFilter, newValue => {
  switch (newValue) {
    case 'today':
    case 'week':
    case 'year':
      selectedCompareFilter.value = ''
      break
    case 'month':
      selectedCompareFilter.value = 'lastMonth'
      break
    case 'quarter':
      selectedCompareFilter.value = 'lastQuarter'
      break
  }
})

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
  height: fit-content;
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
</style>
