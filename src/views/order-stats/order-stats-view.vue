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
      <!-- <div class="header-actions">
        <button class="btn btn-primary btn-with-icon">
          <span class="btn-icon">📥</span>
          导出报表
        </button>
      </div> -->
    </div>

    <div v-if="showRecharge" class="stats-grid">
      <!-- 储值金额 -->
      <div class="stat-card stat-card-deposit">
        <div class="stat-decoration"></div>
        <div class="stat-content">
          <div class="stat-header">
            <div class="stat-info">
              <div class="stat-title">总储值金额</div>
              <div class="stat-subtitle">Deposit Amount</div>
            </div>
            <div class="stat-icon-wrapper">
              <div class="stat-icon">
                <img src="@/assets/icons/wallet.svg" alt="储值图标" />
              </div>
            </div>
          </div>
          <div class="stat-value">
            <span class="stat-currency">¥</span>
            <span class="stat-number">
              {{ recharge.total_recharge || 0 }}
            </span>
          </div>
        </div>
      </div>

      <!-- 剩余储值金额 -->
      <div class="stat-card stat-card-remaining">
        <div class="stat-decoration"></div>
        <div class="stat-content">
          <div class="stat-header">
            <div class="stat-info">
              <div class="stat-title">剩余储值金额</div>
              <div class="stat-subtitle">Remaining Balance</div>
            </div>
            <div class="stat-icon-wrapper">
              <div class="stat-icon">
                <img src="@/assets/icons/wallet.svg" alt="余额图标" />
              </div>
            </div>
          </div>
          <div class="stat-value">
            <span class="stat-currency">¥</span>
            <span class="stat-number">
              {{ recharge.remaining_balance || 0 }}
            </span>
          </div>
        </div>
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

          <!-- 应用筛选 -->
          <button class="btn btn-primary" @click="updateData">应用筛选</button>
        </div>
      </div>
    </div>

    <!-- 全局 Loading -->
    <div v-if="loading" class="page-loading">
      <div class="loading-container">
        <div class="loading-wrapper">
          <div class="loading-spinner">
            <div class="spinner-circle"></div>
            <div class="spinner-circle"></div>
            <div class="spinner-circle"></div>
          </div>
          <div class="loading-icon">📈</div>
        </div>
        <div class="loading-text">正在加载数据...</div>
        <div class="loading-progress">
          <div class="progress-bar"></div>
        </div>
      </div>
    </div>

    <!-- 统计卡片数据对比 -->
    <template v-else>
      <RevenueStatsCards :order-stats="orderStats" />
    </template>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import DatePicker from '@/components/date-picker.vue'
import RevenueStatsCards from './component/revenue-stats-cards.vue'
import { formatDate } from '@/utils/format'
import { reqGetOrderStatistics, reqGetRecharge } from '@/api/supabase'
import { OrderStatistics, Recharge } from '@/types/supabase'

// Tab选项定义
const quickTabs = [
  { label: '今天', value: 'today' },
  { label: '昨天', value: 'yesterday' },
  { label: '近7天', value: 'last7days' },
  { label: '近30天', value: 'last30days' }
]

// 订单统计数据
const orderStats = ref<OrderStatistics>({})
// 储值数据
const recharge = ref<Recharge>({})
// 是否加载中
const loading = ref<boolean>(false)
//
// 是否显示储值数据
const showRecharge = ref<boolean>(false)
// 当前激活的tab
const activeTab = ref<string>('today')

// 时间区间
const startDate = ref<string>('')
const endDate = ref<string>('')

// 更新数据（TODO: 实现实际的数据获取逻辑）
const updateData = async () => {
  loading.value = true
  const data = await reqGetOrderStatistics({
    startTime: startDate.value,
    endTime: endDate.value
  })
  orderStats.value = data
  loading.value = false
}

// 选择tab
const selectTab = (tabValue: string) => {
  activeTab.value = tabValue
  // 清空时间区间选择
  startDate.value = ''
  endDate.value = ''

  switch (tabValue) {
    case 'today':
      // 今天到今天
      startDate.value = formatDate(new Date())
      endDate.value = formatDate(new Date())
      break
    case 'yesterday': {
      // 昨天到昨天
      const yesterday = new Date(new Date())
      yesterday.setDate(new Date().getDate() - 1)
      startDate.value = formatDate(yesterday)
      endDate.value = formatDate(yesterday)
      break
    }
    case 'last7days':
      // 近7天 - 6天前到今天（包含今天共7天）
      startDate.value = formatDate(new Date(new Date().setDate(new Date().getDate() - 6)))
      endDate.value = formatDate(new Date())
      break
    case 'last30days':
      // 近30天 - 29天前到今天（包含今天共30天）
      startDate.value = formatDate(new Date(new Date().setDate(new Date().getDate() - 29)))
      endDate.value = formatDate(new Date(new Date()))
      break
    default:
  }
}

// 时间区间变化
const onDateRangeChange = (value: string | { start: string; end: string }) => {
  if (typeof value === 'object' && value.start && value.end) {
    // 清空tab选择
    activeTab.value = ''
  }
}

onMounted(async () => {
  // 初始化时选择今天
  selectTab('today')
  // 获取储值数据
  recharge.value = await reqGetRecharge()
  showRecharge.value = true
})
</script>

<style scoped lang="scss">
/* 全局 Loading */
.page-loading {
  background: var(--bg-white);
  border-radius: var(--radius-xl);
  display: flex;
  align-items: center;
  justify-content: center;
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

  // .header-actions {
  //   display: flex;
  //   gap: 12px;
  // }
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
  gap: 20px;
  margin-bottom: 24px;

  .stat-card {
    background: white;
    border-radius: 20px;
    position: relative;
    overflow: hidden;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    border: 1px solid rgba(0, 0, 0, 0.06);

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
      .stat-decoration {
        transform: scale(1.1) rotate(10deg);
      }
      .stat-icon-wrapper {
        transform: rotate(-5deg) scale(1.05);
      }
      .stat-number {
        transform: scale(1.02);
      }
    }

    &.stat-card-orders {
      .stat-decoration,
      .stat-icon {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      }
      .stat-icon {
        color: white;
      }
    }

    &.stat-card-revenue {
      .stat-decoration,
      .stat-icon {
        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      }
      .stat-icon {
        color: white;
      }
    }

    &.stat-card-avg {
      .stat-decoration,
      .stat-icon {
        background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
      }
      .stat-icon {
        color: white;
      }
    }

    &.stat-card-wechat {
      .stat-decoration,
      .stat-icon {
        background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
      }
      .stat-icon {
        color: white;
      }
    }

    &.stat-card-balance {
      .stat-decoration,
      .stat-icon {
        background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
      }
      .stat-icon {
        color: white;
      }
    }

    &.stat-card-deposit {
      .stat-decoration,
      .stat-icon {
        background: linear-gradient(135deg, #30cfd0 0%, #330867 100%);
      }
      .stat-icon {
        color: white;
      }
    }

    &.stat-card-spent {
      .stat-decoration,
      .stat-icon {
        background: linear-gradient(135deg, #ff6b6b 0%, #feca57 100%);
      }
      .stat-icon {
        color: white;
      }
    }

    &.stat-card-remaining {
      .stat-decoration,
      .stat-icon {
        background: linear-gradient(135deg, #5f72bd 0%, #9b23ea 100%);
      }
      .stat-icon {
        color: white;
      }
    }

    &.stat-card-members {
      .stat-decoration,
      .stat-icon {
        background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%);
      }
      .stat-icon {
        color: white;
      }
    }

    .stat-decoration {
      position: absolute;
      top: -50px;
      right: -50px;
      width: 150px;
      height: 150px;
      border-radius: 50%;
      opacity: 0.1;
      transition: transform 0.5s ease;
    }

    .stat-content {
      padding: 24px;
      position: relative;
      z-index: 1;
    }

    .stat-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 20px;

      .stat-info {
        .stat-title {
          font-size: 14px;
          font-weight: 600;
          color: var(--text-heading);
          margin-bottom: 4px;
        }
        .stat-subtitle {
          font-size: 11px;
          color: var(--text-subtitle);
          opacity: 0.7;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
      }

      .stat-icon-wrapper {
        transition: transform 0.3s ease;

        .stat-icon {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
          img {
            width: 24px;
            height: 24px;
            filter: brightness(0) invert(1);
          }
        }
      }
    }

    .stat-value {
      display: flex;
      align-items: baseline;
      gap: 4px;

      .stat-currency {
        font-size: 20px;
        font-weight: 600;
        color: var(--text-subtitle);
        opacity: 0.5;
      }

      .stat-number {
        font-size: 28px;
        font-weight: 700;
        color: var(--text-heading);
        letter-spacing: -0.5px;
        transition: transform 0.3s ease;
      }

      .stat-unit {
        font-size: 16px;
        font-weight: 500;
        color: var(--text-subtitle);
        margin-left: 4px;
      }
    }
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
