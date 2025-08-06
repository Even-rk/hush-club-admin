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

    <!-- 统计卡片 -->
    <div class="stats-grid">
      <div class="stat-card stat-card-orders">
        <div class="stat-decoration"></div>
        <div class="stat-content">
          <div class="stat-header">
            <div class="stat-info">
              <div class="stat-title">本月订单总数</div>
              <div class="stat-subtitle">Monthly Orders</div>
            </div>
            <div class="stat-icon-wrapper">
              <div class="stat-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M9 11H7V13H9V11ZM13 11H11V13H13V11ZM17 11H15V13H17V11Z"
                    fill="currentColor"
                    opacity="0.5"
                  />
                  <path
                    d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
            </div>
          </div>
          <div class="stat-value">
            <span class="stat-number" data-value="3420">3,420</span>
            <span class="stat-unit">单</span>
          </div>
          <div class="stat-footer">
            <div class="stat-trend trend-up">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M7 14L12 9L17 14"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                />
              </svg>
              <span>15.2%</span>
            </div>
            <span class="stat-compare">较上月</span>
          </div>
        </div>
      </div>

      <div class="stat-card stat-card-revenue">
        <div class="stat-decoration"></div>
        <div class="stat-content">
          <div class="stat-header">
            <div class="stat-info">
              <div class="stat-title">本月营业额</div>
              <div class="stat-subtitle">Monthly Revenue</div>
            </div>
            <div class="stat-icon-wrapper">
              <div class="stat-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13.41 18.09V20H10.74V18.07C9.03 17.71 7.58 16.61 7.47 14.67H9.43C9.53 15.82 10.31 16.49 12.08 16.49C13.98 16.49 14.54 15.72 14.54 14.91C14.54 14.21 14.15 13.59 12.08 13.14C9.65 12.58 8.14 11.74 8.14 9.91C8.14 8.33 9.43 7.14 11.21 6.79V5H13.89V6.81C15.48 7.21 16.63 8.34 16.73 10.04H14.77C14.72 8.94 14.05 8.31 12.08 8.31C10.31 8.31 9.5 8.87 9.5 9.88C9.5 10.69 10.04 11.12 12.08 11.57C14.12 12.03 15.9 12.72 15.9 14.91C15.9 16.58 14.69 17.73 13.41 18.09Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
            </div>
          </div>
          <div class="stat-value">
            <span class="stat-currency">¥</span>
            <span class="stat-number" data-value="356800">356,800</span>
          </div>
          <div class="stat-footer">
            <div class="stat-trend trend-up">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M7 14L12 9L17 14"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                />
              </svg>
              <span>22.5%</span>
            </div>
            <span class="stat-compare">较上月</span>
          </div>
        </div>
      </div>

      <div class="stat-card stat-card-avg">
        <div class="stat-decoration"></div>
        <div class="stat-content">
          <div class="stat-header">
            <div class="stat-info">
              <div class="stat-title">平均客单价</div>
              <div class="stat-subtitle">Average Order Value</div>
            </div>
            <div class="stat-icon-wrapper">
              <div class="stat-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M21 18V19C21 20.1 20.1 21 19 21H5C3.9 21 3 20.1 3 19V18C3 18.55 3.45 19 4 19H20C20.55 19 21 18.55 21 18ZM20 14H4C3.45 14 3 14.45 3 15V16C3 16.55 3.45 17 4 17H20C20.55 17 21 16.55 21 16V15C21 14.45 20.55 14 20 14ZM20 10H4C3.45 10 3 10.45 3 11V12C3 12.55 3.45 13 4 13H20C20.55 13 21 12.55 21 12V11C21 10.45 20.55 10 20 10ZM7 7V4C7 3.45 7.45 3 8 3H16C16.55 3 17 3.45 17 4V7C17 7.55 16.55 8 16 8H8C7.45 8 7 7.55 7 7Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
            </div>
          </div>
          <div class="stat-value">
            <span class="stat-currency">¥</span>
            <span class="stat-number" data-value="104.33">104.33</span>
          </div>
          <div class="stat-footer">
            <div class="stat-trend trend-up">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M7 14L12 9L17 14"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                />
              </svg>
              <span>6.8%</span>
            </div>
            <span class="stat-compare">较上月</span>
          </div>
        </div>
      </div>
    </div>

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
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M9 16.2L4.8 12L3.4 13.4L9 19L21 7L19.6 5.6L9 16.2Z" fill="currentColor" />
              </svg>
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
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none" />
                <path
                  d="M12 6V12L16 16"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                />
              </svg>
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
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M18 6L6 18M6 6L18 18"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                />
              </svg>
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
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect
                  x="3"
                  y="3"
                  width="18"
                  height="18"
                  rx="2"
                  stroke="currentColor"
                  stroke-width="2"
                />
                <path d="M3 9H21M9 3V21" stroke="currentColor" stroke-width="2" />
              </svg>
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
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 24px;
  margin-bottom: 32px;

  .stat-card {
    background: white;
    border-radius: 20px;
    position: relative;
    overflow: hidden;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    border: 1px solid rgba(0, 0, 0, 0.06);

    &:hover {
      transform: translateY(-4px);
      box-shadow:
        0 20px 40px rgba(0, 0, 0, 0.08),
        0 0 0 1px rgba(0, 0, 0, 0.04);

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
      .stat-decoration {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      }
      .stat-icon {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
      }
      .stat-trend.trend-up {
        color: #667eea;
        background: rgba(102, 126, 234, 0.1);
      }
    }

    &.stat-card-revenue {
      .stat-decoration {
        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      }
      .stat-icon {
        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        color: white;
      }
      .stat-trend.trend-up {
        color: #f5576c;
        background: rgba(245, 87, 108, 0.1);
      }
    }

    &.stat-card-avg {
      .stat-decoration {
        background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
      }
      .stat-icon {
        background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        color: white;
      }
      .stat-trend.trend-up {
        color: #00a8cc;
        background: rgba(0, 168, 204, 0.1);
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
      padding: 28px;
      position: relative;
      z-index: 1;
    }

    .stat-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 24px;

      .stat-info {
        .stat-title {
          font-size: 15px;
          font-weight: 600;
          color: var(--text-heading);
          margin-bottom: 4px;
        }

        .stat-subtitle {
          font-size: 12px;
          color: var(--text-subtitle);
          opacity: 0.7;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
      }

      .stat-icon-wrapper {
        transition: transform 0.3s ease;

        .stat-icon {
          width: 52px;
          height: 52px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);

          svg {
            width: 28px;
            height: 28px;
          }
        }
      }
    }

    .stat-value {
      display: flex;
      align-items: baseline;
      gap: 4px;
      margin-bottom: 20px;

      .stat-currency {
        font-size: 24px;
        font-weight: 600;
        color: var(--text-subtitle);
        opacity: 0.5;
      }

      .stat-number {
        font-size: 36px;
        font-weight: 700;
        color: var(--text-heading);
        letter-spacing: -1px;
        transition: transform 0.3s ease;
      }

      .stat-unit {
        font-size: 18px;
        font-weight: 500;
        color: var(--text-subtitle);
        margin-left: 4px;
      }
    }

    .stat-footer {
      display: flex;
      align-items: center;
      gap: 12px;

      .stat-trend {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        padding: 6px 12px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 600;

        svg {
          width: 16px;
          height: 16px;
        }

        &.trend-up {
          svg {
            animation: float 2s ease-in-out infinite;
          }
        }

        &.trend-down {
          svg {
            transform: rotate(180deg);
          }
        }
      }

      .stat-compare {
        font-size: 13px;
        color: var(--text-subtitle);
      }
    }
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

      svg {
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

.chart-placeholder {
  height: 260px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 16px;
  border: 2px dashed #e2e8f0;
  margin-top: 24px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(
      45deg,
      transparent 30%,
      rgba(255, 255, 255, 0.5) 50%,
      transparent 70%
    );
    animation: shimmer 2s infinite;
  }

  svg {
    width: 48px;
    height: 48px;
    color: #94a3b8;
    z-index: 1;
  }

  span {
    font-size: 16px;
    font-weight: 500;
    color: #64748b;
    z-index: 1;
  }
}
@keyframes shimmer {
  0% {
    transform: translateX(-100%) translateY(-100%) rotate(45deg);
  }
  100% {
    transform: translateX(100%) translateY(100%) rotate(45deg);
  }
}
</style>
