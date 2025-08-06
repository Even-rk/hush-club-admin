<template>
  <div class="stat-card" :class="`stat-${type}`">
    <div class="stat-decoration"></div>
    <div class="stat-icon-wrapper">
      <span class="stat-icon">{{ icon }}</span>
    </div>
    <div class="stat-content">
      <div class="stat-title">{{ title }}</div>
      <div class="stat-number">
        <span v-if="prefix">{{ prefix }}</span>
        <span>{{ formatValue(value) }}</span>
        <span v-if="suffix" class="stat-suffix">{{ suffix }}</span>
      </div>
      <div v-if="showTrend" class="stat-trend">
        <span v-if="trendValue !== null" class="trend-badge" :class="trendClass">
          {{ formattedTrendValue }}
        </span>
        <span v-else class="trend-divider">0%</span>
        <span class="trend-text">{{ compareText }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface StatCardProps {
  // 卡片类型：revenue(营业额) | orders(订单) | members(会员) | price(客单价)
  type?: 'revenue' | 'orders' | 'members' | 'price'
  // 图标
  icon?: string
  // 标题
  title: string
  // 当前数值
  value: number | string
  // 对比数值（用于计算趋势）
  compareValue: number | string | undefined
  // 对比文字
  compareText?: string
  // 数值前缀（如货币符号）
  prefix?: string
  // 数值后缀（如单位）
  suffix?: string
  // 是否显示趋势
  showTrend?: boolean
}

const props = withDefaults(defineProps<StatCardProps>(), {
  type: 'revenue',
  icon: '💰',
  compareText: '较昨日',
  prefix: '',
  suffix: '',
  showTrend: true
})

// 计算趋势百分比
const trendValue = computed(() => {
  if (!props.compareValue || !props.showTrend) {
    return null
  }

  const currentVal = typeof props.value === 'string' ? parseFloat(props.value) : props.value
  const compareVal =
    typeof props.compareValue === 'string' ? parseFloat(props.compareValue) : props.compareValue

  if (!currentVal || !compareVal || compareVal === 0) {
    return null
  }

  return ((currentVal - compareVal) / compareVal) * 100
})

// 计算趋势类名
const trendClass = computed(() => {
  if (trendValue.value === null || trendValue.value === 0) {
    return ''
  }
  return trendValue.value > 0 ? 'trend-up' : 'trend-down'
})

// 格式化趋势值
const formattedTrendValue = computed(() => {
  if (trendValue.value === null) {
    return ''
  }
  const absValue = Math.abs(trendValue.value)
  const prefix = trendValue.value > 0 ? '+' : '-'
  return `${prefix}${absValue.toFixed(1)}%`
})

// 格式化数值（添加千分位）
const formatValue = (value: number | string) => {
  if (typeof value === 'string') {
    return value
  }
  return value.toLocaleString('zh-CN')
}
</script>

<style lang="scss" scoped>
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
    display: flex;
    align-items: baseline;
    gap: 4px;

    .stat-suffix {
      font-size: 20px;
      font-weight: 600;
      opacity: 0.8;
    }
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

    .trend-divider {
      font-size: 12px;
      color: var(--text-muted);
      font-weight: 500;
    }

    .trend-text {
      font-size: 12px;
      color: var(--text-muted);
      font-weight: 500;
    }
  }
}
</style>
