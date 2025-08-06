<template>
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
              <img src="/src/assets/icons/order-message.svg" alt="订单图标" />
            </div>
          </div>
        </div>
        <div class="stat-value">
          <span class="stat-number" data-value="3420">3,420</span>
          <span class="stat-unit">单</span>
        </div>
        <div class="stat-footer">
          <div class="stat-trend trend-up">
            <span class="trend-icon">
              <img src="/src/assets/icons/trend-up.svg" alt="趋势图标" />
            </span>
            <span>15.2%</span>
          </div>
          <span v-if="props.compare" class="stat-compare">
            {{ compareData[props.compare as keyof typeof compareData] || '较上月' }}
          </span>
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
              <img src="/src/assets/icons/money-circle.svg" alt="营业额图标" />
            </div>
          </div>
        </div>
        <div class="stat-value">
          <span class="stat-currency">¥</span>
          <span class="stat-number" data-value="356800">356,800</span>
        </div>
        <div class="stat-footer">
          <div class="stat-trend trend-up">
            <span class="trend-icon">
              <img src="/src/assets/icons/trend-up.svg" alt="趋势图标" />
            </span>
            <span>22.5%</span>
          </div>
          <span v-if="props.compare" class="stat-compare">
            {{ compareData[props.compare as keyof typeof compareData] || '较上月' }}
          </span>
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
              <img src="/src/assets/icons/stack.svg" alt="客单价图标" />
            </div>
          </div>
        </div>
        <div class="stat-value">
          <span class="stat-currency">¥</span>
          <span class="stat-number" data-value="104.33">104.33</span>
        </div>
        <div class="stat-footer">
          <div class="stat-trend trend-up">
            <span class="trend-icon">
              <img src="/src/assets/icons/trend-up.svg" alt="趋势图标" />
            </span>
            <span>6.8%</span>
          </div>
          <span v-if="props.compare" class="stat-compare">
            {{ compareData[props.compare as keyof typeof compareData] || '较上月' }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface StatsData {
  // 订单总数
  orders?: {
    value: number
    trend: number
  }
  // 营业额
  revenue?: {
    value: number
    trend: number
  }
  // 平均客单价
  averageValue?: {
    value: number
    trend: number
  }
}

// 比较的文本枚举
const compareData = {
  lastDay: '较昨日',
  lastWeek: '较上周',
  lastMonth: '较上月',
  lastQuarter: '较上季度',
  lastYearSameMonth: '去年同期',
  lastYearSameQuarter: '去年同期',
  '': '' // 不显示对比
}

// 定义 props
const props = defineProps<{
  statsData?: StatsData
  compare?: string
}>()
</script>

<style scoped lang="scss">
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
      .stat-trend.trend-up {
        color: #667eea;
        background: rgba(102, 126, 234, 0.1);
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
      .stat-trend.trend-up {
        color: #f5576c;
        background: rgba(245, 87, 108, 0.1);
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
          img {
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
        .trend-icon {
          display: inline-flex;
          align-items: center;
          img {
            width: 16px;
            height: 16px;
          }
        }
        &.trend-up .trend-icon img {
          animation: float 2s ease-in-out infinite;
        }
        &.trend-down .trend-icon img {
          transform: rotate(180deg);
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
</style>
