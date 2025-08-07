<template>
  <div class="stats-container">
    <div class="stat-card-enhanced stat-total">
      <div class="stat-icon-wrapper">
        <span class="stat-icon">👤</span>
      </div>
      <div class="stat-content">
        <div class="stat-number-large">{{ userList.length }}</div>
        <div class="stat-label-enhanced">系统用户总数</div>
      </div>
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
      </div>
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
      </div>
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
      color: var(--text-subtitle);
      font-weight: 500;
    }

    .stat-warning {
      margin-top: 8px;
      padding: 4px 8px;
      background: var(--warning-bg);
      color: var(--warning-color);
      border-radius: 6px;
      font-size: 12px;
      font-weight: 500;
      display: inline-block;
    }
  }

  &.stat-total {
    background: linear-gradient(135deg, var(--info-color) 0%, var(--diamond-dark) 100%);
    color: white;

    .stat-icon-wrapper {
      background: rgba(255, 255, 255, 0.2);
    }

    .stat-label-enhanced {
      color: rgba(255, 255, 255, 0.9);
    }
  }

  &.stat-active {
    background: linear-gradient(135deg, var(--success-color) 0%, var(--success-color) 100%);
    color: white;

    .stat-icon-wrapper {
      background: rgba(255, 255, 255, 0.2);
    }

    .stat-label-enhanced {
      color: rgba(255, 255, 255, 0.9);
    }
  }

  &.stat-admin {
    background: linear-gradient(135deg, var(--warning-color) 0%, var(--warning-color) 100%);
    color: white;

    .stat-icon-wrapper {
      background: rgba(255, 255, 255, 0.2);
    }

    .stat-label-enhanced {
      color: rgba(255, 255, 255, 0.9);
    }
  }

  &.stat-disabled {
    background: linear-gradient(135deg, var(--error-color) 0%, var(--error-color) 100%);
    color: white;

    .stat-icon-wrapper {
      background: rgba(255, 255, 255, 0.2);
    }

    .stat-label-enhanced {
      color: rgba(255, 255, 255, 0.9);
    }

    .stat-warning {
      background: rgba(255, 255, 255, 0.2);
      color: white;
    }
  }
}
</style>
