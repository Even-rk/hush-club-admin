<template>
  <div class="stats-container">
    <div class="stat-card-enhanced stat-total">
      <div class="stat-icon-wrapper">
        <span class="stat-icon">👤</span>
      </div>
      <div class="stat-content">
        <div class="stat-number-large">{{ userList.length }}</div>
        <div class="stat-label-enhanced">系统用户总数</div>
        <div class="stat-trend">
          <span class="trend-badge trend-up">↑ 12%</span>
          <span class="trend-text">较上月</span>
        </div>
      </div>
      <div class="stat-decoration"></div>
    </div>

    <div class="stat-card-enhanced stat-active">
      <div class="stat-icon-wrapper">
        <span class="stat-icon">✅</span>
      </div>
      <div class="stat-content">
        <div class="stat-number-large">
          {{ userList.filter(i => i.status == 'active').length }}
        </div>
        <div class="stat-label-enhanced">活跃用户</div>
        <div class="stat-percentage">
          占比
          {{
            Math.round((userList.filter(i => i.status == 'active').length / userList.length) * 100)
          }}%
        </div>
      </div>
      <div class="stat-decoration"></div>
    </div>

    <div class="stat-card-enhanced stat-admin">
      <div class="stat-icon-wrapper">
        <span class="stat-icon">👑</span>
      </div>
      <div class="stat-content">
        <div class="stat-number-large">
          {{ userList.filter(i => [1, 2].includes(i.role_id)).length }}
        </div>
        <div class="stat-label-enhanced">管理员</div>
        <div class="stat-subtitle">包含超管和普通管理员</div>
      </div>
      <div class="stat-decoration"></div>
    </div>

    <div class="stat-card-enhanced stat-disabled">
      <div class="stat-icon-wrapper">
        <span class="stat-icon">🚫</span>
      </div>
      <div class="stat-content">
        <div class="stat-number-large">
          {{ userList.filter(i => i.status == 'inactive').length }}
        </div>
        <div class="stat-label-enhanced">已禁用</div>
        <div v-if="userList.filter(i => i.status == 'inactive').length > 5" class="stat-warning">
          需要清理
        </div>
      </div>
      <div class="stat-decoration"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { User } from '@/types/supabase'

interface Props {
  userList: User[]
}

defineProps<Props>()
</script>

<style scoped lang="scss">
/* 统计卡片容器 */
.stats-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

/* 增强版统计卡片 */
.stat-card-enhanced {
  background: white;
  border-radius: 16px;
  padding: 24px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  }

  .stat-icon-wrapper {
    width: 56px;
    height: 56px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16px;

    .stat-icon {
      font-size: 28px;
    }
  }

  .stat-content {
    position: relative;
    z-index: 1;

    .stat-number-large {
      font-size: 36px;
      font-weight: 700;
      line-height: 1.2;
      margin-bottom: 8px;
    }

    .stat-label-enhanced {
      font-size: 14px;
      color: #6b7280;
      font-weight: 500;
    }

    .stat-trend {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-top: 12px;

      .trend-badge {
        display: inline-flex;
        align-items: center;
        padding: 2px 8px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: 600;

        &.trend-up {
          background: #10b981;
          color: white;
        }

        &.trend-down {
          background: #ef4444;
          color: white;
        }
      }

      .trend-text {
        font-size: 12px;
        color: #9ca3af;
      }
    }

    .stat-percentage {
      margin-top: 8px;
      font-size: 13px;
      color: #6b7280;
    }

    .stat-subtitle {
      margin-top: 4px;
      font-size: 12px;
      color: #9ca3af;
    }

    .stat-warning {
      margin-top: 8px;
      padding: 4px 8px;
      background: #fef3c7;
      color: #92400e;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 500;
      display: inline-block;
    }
  }

  .stat-decoration {
    position: absolute;
    top: -20px;
    right: -20px;
    width: 100px;
    height: 100px;
    border-radius: 50%;
    opacity: 0.1;
  }

  &.stat-total {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;

    .stat-icon-wrapper {
      background: rgba(255, 255, 255, 0.2);
    }

    .stat-label-enhanced,
    .stat-trend .trend-text {
      color: rgba(255, 255, 255, 0.9);
    }

    .stat-decoration {
      background: white;
    }
  }

  &.stat-active {
    background: linear-gradient(135deg, #10b981 0%, #065f46 100%);
    color: white;

    .stat-icon-wrapper {
      background: rgba(255, 255, 255, 0.2);
    }

    .stat-label-enhanced,
    .stat-percentage {
      color: rgba(255, 255, 255, 0.9);
    }

    .stat-decoration {
      background: white;
    }
  }

  &.stat-admin {
    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
    color: white;

    .stat-icon-wrapper {
      background: rgba(255, 255, 255, 0.2);
    }

    .stat-label-enhanced,
    .stat-subtitle {
      color: rgba(255, 255, 255, 0.9);
    }

    .stat-decoration {
      background: white;
    }
  }

  &.stat-disabled {
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
    color: white;

    .stat-icon-wrapper {
      background: rgba(255, 255, 255, 0.2);
    }

    .stat-label-enhanced {
      color: rgba(255, 255, 255, 0.9);
    }

    .stat-decoration {
      background: white;
    }

    .stat-warning {
      background: rgba(255, 255, 255, 0.2);
      color: white;
    }
  }
}
</style>
