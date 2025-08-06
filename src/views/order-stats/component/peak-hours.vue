<template>
  <div class="content-card">
    <div class="card-header">
      <div class="card-title">高峰时段分析</div>
    </div>
    <div class="card-body">
      <div class="time-analysis">
        <div v-for="item in peakHoursData" :key="item.period" class="time-item">
          <div class="time-period">{{ item.period }}</div>
          <div class="time-stats">
            <span class="order-count">{{ item.count }}单</span>
            <span class="order-percentage">{{ item.percentage }}%</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface PeakHourItem {
  period: string
  count: number
  percentage: number
}

// 定义 props
withDefaults(
  defineProps<{
    peakHoursData?: PeakHourItem[]
  }>(),
  {
    peakHoursData: () => [
      { period: '08:00 - 10:00', count: 28, percentage: 16.7 },
      { period: '10:00 - 12:00', count: 45, percentage: 26.8 },
      { period: '14:00 - 16:00', count: 52, percentage: 31.0 },
      { period: '19:00 - 21:00', count: 43, percentage: 25.6 }
    ]
  }
)
</script>

<style scoped lang="scss">
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

.card-body {
  padding: 24px;
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
