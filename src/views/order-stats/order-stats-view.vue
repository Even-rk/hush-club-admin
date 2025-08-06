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
      <div class="card-body">
        <div class="filter-container">
          <!-- 时间区间选择 -->
          <div class="date-range-filter">
            <label class="filter-label">时间区间：</label>
            <date-picker
              v-model:start-value="startDate"
              v-model:end-value="endDate"
              :range="true"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="onDateRangeChange"
            />
          </div>
          <!-- 快速选择标签 -->
          <div class="quick-filter-tabs">
            <button
              v-for="tab in quickTabs"
              :key="tab.value"
              class="tab-button"
              :class="{ active: activeTab === tab.value }"
              @click="selectTab(tab.value)"
            >
              {{ tab.label }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 统计卡片数据对比 -->
    <RevenueStatsCards />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DatePicker from '@/components/date-picker.vue'
import RevenueStatsCards from './component/revenue-stats-cards.vue'
import { formatDate } from '@/utils/format'

// Tab选项定义
const quickTabs = [
  { label: '今天', value: 'today' },
  { label: '昨天', value: 'yesterday' },
  { label: '近7天', value: 'last7days' },
  { label: '近30天', value: 'last30days' }
]

// 当前激活的tab
const activeTab = ref<string>('today')

// 时间区间
const startDate = ref<string>('')
const endDate = ref<string>('')

// 更新数据（TODO: 实现实际的数据获取逻辑）
const updateData = (start: string, end: string) => {
  console.log(`更新数据，时间范围：${start} 至 ${end}`)
  // TODO: 调用API获取数据
}

// 应用筛选函数 - 打印日期区间并更新数据
const applyFilter = (start: string, end: string) => {
  // 更新数据
  updateData(start, end)
}

// 选择tab
const selectTab = (tabValue: string) => {
  activeTab.value = tabValue
  // 清空时间区间选择
  startDate.value = ''
  endDate.value = ''

  // 根据tab计算时间范围
  const today = new Date()

  switch (tabValue) {
    case 'today':
      // 今天到今天
      startDate.value = formatDate(today)
      endDate.value = formatDate(today)
      break
    case 'yesterday': {
      // 昨天到昨天
      const yesterday = new Date(today)
      yesterday.setDate(today.getDate() - 1)
      startDate.value = formatDate(yesterday)
      endDate.value = formatDate(yesterday)
      break
    }
    case 'last7days':
      // 近7天 - 6天前到今天（包含今天共7天）
      startDate.value = formatDate(new Date(today))
      endDate.value = formatDate(today)
      break
    case 'last30days':
      // 近30天 - 29天前到今天（包含今天共30天）
      startDate.value = formatDate(new Date(today))
      endDate.value = formatDate(today)
      break
    default:
      return
  }

  // 调用应用筛选函数
  applyFilter(startDate.value, endDate.value)
}

// 时间区间变化
const onDateRangeChange = (value: string | { start: string; end: string }) => {
  if (typeof value === 'object' && value.start && value.end) {
    // 清空tab选择
    activeTab.value = ''
    // 调用应用筛选函数
    applyFilter(value.start, value.end)
  }
}

// 初始化时选择今天
selectTab('today')
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

  .card-body {
    padding: 24px;
  }
}

.filter-container {
  display: flex;
  gap: 20px;
}

// 快速选择标签样式
.quick-filter-tabs {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;

  .tab-button {
    padding: 10px 24px;
    border: 2px solid var(--border-color);
    background: var(--bg-white);
    border-radius: var(--radius-lg);
    font-size: 14px;
    font-weight: 500;
    color: var(--text-secondary);
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      border-color: var(--primary-light);
      color: var(--primary-color);
      background: linear-gradient(
        135deg,
        rgba(255, 107, 53, 0.05) 0%,
        rgba(255, 107, 53, 0.02) 100%
      );
    }

    &.active {
      background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-light) 100%);
      border-color: transparent;
      color: var(--bg-white);
      box-shadow: var(--shadow-primary);

      &:hover {
        transform: translateY(-1px);
        box-shadow: 0 6px 20px rgba(255, 107, 53, 0.3);
      }
    }
  }
}

// 时间区间筛选样式
.date-range-filter {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;

  .filter-label {
    font-size: 14px;
    color: var(--text-dark);
    font-weight: 500;
    white-space: nowrap;
  }
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
