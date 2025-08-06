<template>
  <!-- 等级管理页面 -->
  <div class="content-card">
    <div class="card-header">
      <div class="card-title">会员等级管理</div>
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
/* 内容卡片样式 */
.content-card {
  background: var(--bg-white);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  margin-bottom: 24px;
  overflow: hidden;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-color);
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
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
  padding: 20px;
}

.levels-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.level-card {
  border: 2px solid var(--border-color);
  border-radius: var(--radius);
  padding: 20px;
  text-align: center;

  &--silver {
    border-color: var(--silver-color);
    background: rgba(192, 192, 192, 0.05);
  }

  &--gold {
    border-color: var(--gold-color);
    background: rgba(255, 215, 0, 0.05);
  }
}

.level-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 12px;

  &--silver {
    color: var(--silver-color);
  }
  &--gold {
    color: var(--gold-color);
  }
}

.level-description {
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 16px;
}

.level-stats {
  margin-bottom: 16px;
}

.level-count {
  font-size: 24px;
  font-weight: 700;
  color: var(--text-secondary);

  &--silver {
    color: var(--silver-color);
  }
  &--gold {
    color: var(--gold-color);
  }
}

.level-count-label {
  font-size: 12px;
  color: var(--text-secondary);
}

.level-perks {
  background: var(--bg-secondary);
  padding: 12px;
  border-radius: var(--radius);

  &--silver {
    background: rgba(192, 192, 192, 0.1);
  }
  &--gold {
    background: rgba(255, 215, 0, 0.1);
  }
}

.perks-title {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 4px;
}

.perks-list {
  font-size: 12px;
  color: var(--text-secondary);
  line-height: 1.4;
}

.upgrade-log-card {
  margin-top: 20px;
}

.status-badge {
  &--silver {
    background: rgba(192, 192, 192, 0.1);
    color: var(--silver-color);
  }
  &--gold {
    background: rgba(255, 215, 0, 0.1);
    color: var(--gold-color);
  }
}
</style>
