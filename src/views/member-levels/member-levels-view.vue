<template>
  <!-- 等级管理页面 -->
  <div class="member-level-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">
          <span class="title-icon">🏆</span>
          会员等级管理
        </h1>
        <p class="page-subtitle">查看和管理不同会员等级的权益和升级记录</p>
      </div>
    </div>

    <!-- 等级卡片 -->
    <div class="content-card">
      <div class="card-header">
        <div class="card-title">会员等级概览</div>
      </div>
      <div class="card-body">
        <div class="levels-grid">
          <!-- 普通会员 -->
          <div
            v-for="level in memberLevelList"
            :key="level.id"
            class="level-card"
            :class="`level-card--${level.level_code}`"
          >
            <div class="level-title" :class="`level-title--${level.level_code}`">
              {{ level.level_name }}
            </div>
            <div class="level-description">{{ level.description }}</div>
            <div class="level-stats">
              <div class="level-count" :class="`level-count--${level.level_code}`">
                {{ level.member_count }}
              </div>
              <div class="level-count-label">当前人数</div>
            </div>
            <div class="level-perks" :class="`level-perks--${level.level_code}`">
              <div class="perks-title">会员权益</div>
              <div v-if="level.discount_rate === 1" class="perks-list">• 原价购买商品<br /></div>
              <div v-else class="perks-list">• {{ level.discount_rate * 10 }}折优惠价格<br /></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 等级升级日志 -->
    <div class="content-card upgrade-log-card">
      <div v-if="!upgradeLoading" class="card-header">
        <div class="card-title">最近等级升级记录</div>
      </div>
      <div class="card-body">
        <data-table
          :data="upgradeRecords"
          :columns="upgradeColumns"
          :show-actions="false"
          :loading="upgradeLoading"
          row-key="id"
          empty-text="暂无升级记录"
        >
          <!-- 原等级插槽 -->
          <template #oldLevel="{ value }">
            <span class="status-badge" :class="getLevelClass(value as string)">
              {{ value }}
            </span>
          </template>

          <!-- 新等级插槽 -->
          <template #newLevel="{ value }">
            <span class="status-badge" :class="getLevelClass(value as string)">
              {{ value }}
            </span>
          </template>
        </data-table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reqGetMemberLevelList } from '@/api/supabase'
import { MemberLevel, TableColumn, UpdateMember } from '@/types/supabase'
import { onMounted, ref } from 'vue'
import DataTable from '@/components/data-table.vue'

const memberLevelList = ref<MemberLevel[]>([])
const upgradeRecords = ref<UpdateMember[]>([])
const upgradeLoading = ref(false)

// 升级记录表格列配置
const upgradeColumns: TableColumn<UpdateMember>[] = [
  { key: 'real_name', title: '会员姓名' },
  { key: 'phone', title: '手机号' },
  {
    key: 'original_level_name',
    title: '原等级',
    slot: 'oldLevel'
  },
  {
    key: 'new_level_name',
    title: '新等级',
    slot: 'newLevel'
  },
  { key: 'recharge_amount', title: '充值金额', type: 'price' },
  { key: 'upgrade_time', title: '升级时间' }
]

// 获取等级对应的样式类
const getLevelClass = (levelName: string) => {
  switch (levelName) {
    case '普通会员':
      return ''
    case '银牌会员':
      return 'status-silver'
    case '金牌会员':
      return 'status-gold'
    case '钻石会员':
      return 'status-diamond'
    default:
      return ''
  }
}

onMounted(async () => {
  upgradeLoading.value = true
  try {
    const result = await reqGetMemberLevelList()
    memberLevelList.value = result.memberLevels || []
    upgradeRecords.value = result.updateMembers || []
  } finally {
    upgradeLoading.value = false
  }
})
</script>

<style lang="scss" scoped>
/* 会员等级页面 */
.member-level-page {
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

/* 等级卡片 */
.levels-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.level-card {
  border: 2px solid var(--border-medium);
  border-radius: var(--radius-lg);
  padding: 24px;
  text-align: center;
  transition: all 0.3s;
  background: var(--bg-white);

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
  }

  &--silver {
    border-color: var(--silver-color);
    background: linear-gradient(
      135deg,
      rgba(192, 192, 192, 0.05) 0%,
      rgba(192, 192, 192, 0.02) 100%
    );
  }

  &--gold {
    border-color: var(--gold-color);
    background: linear-gradient(135deg, rgba(255, 215, 0, 0.05) 0%, rgba(255, 215, 0, 0.02) 100%);
  }
}

.level-title {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 12px;
  color: var(--text-heading);

  &--silver {
    background: linear-gradient(135deg, var(--silver-color) 0%, var(--silver-dark) 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  &--gold {
    background: linear-gradient(135deg, var(--gold-color) 0%, var(--gold-dark) 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
}

.level-description {
  font-size: 14px;
  color: var(--text-subtitle);
  margin-bottom: 20px;
}

.level-stats {
  margin-bottom: 16px;
}

.level-count {
  font-size: 32px;
  font-weight: 700;
  color: var(--text-dark);

  &--silver {
    color: var(--silver-color);
  }
  &--gold {
    color: var(--gold-color);
  }
}

.level-count-label {
  font-size: 13px;
  color: var(--text-subtitle);
  font-weight: 500;
}

.level-perks {
  background: var(--bg-light);
  padding: 16px;
  border-radius: var(--radius-md);
  margin-top: 16px;

  &--silver {
    background: rgba(192, 192, 192, 0.08);
  }
  &--gold {
    background: rgba(255, 215, 0, 0.08);
  }
}

.perks-title {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
  color: var(--text-dark);
}

.perks-list {
  font-size: 13px;
  color: var(--text-subtitle);
  line-height: 1.6;
}

.upgrade-log-card {
  margin-top: 24px;
}

/* 状态标签 */
.status-badge {
  padding: 4px 12px;
  border-radius: var(--radius);
  font-size: 12px;
  font-weight: 600;

  &.status-silver {
    background: rgba(192, 192, 192, 0.15);
    color: var(--silver-text);
  }
  &.status-gold {
    background: rgba(255, 215, 0, 0.15);
    color: var(--gold-text);
  }
}
</style>
