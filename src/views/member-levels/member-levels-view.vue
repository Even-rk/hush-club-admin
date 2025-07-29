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
        <div class="card-header">
          <div class="card-title">最近等级升级记录</div>
        </div>
        <div class="card-body">
          <table class="data-table">
            <thead>
              <tr>
                <th>会员姓名</th>
                <th>手机号</th>
                <th>原等级</th>
                <th>新等级</th>
                <th>充值金额</th>
                <th>升级时间</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>李女士</td>
                <td>139****9999</td>
                <td><span class="status-badge">普通会员</span></td>
                <td>
                  <span class="status-badge status-badge--silver">银牌会员</span>
                </td>
                <td>¥120</td>
                <td>2024-12-01 10:30</td>
              </tr>
              <tr>
                <td>王先生</td>
                <td>137****7777</td>
                <td>
                  <span class="status-badge status-badge--gold">金牌会员</span>
                </td>
                <td>
                  <span class="status-badge status-badge--diamond">钻石会员</span>
                </td>
                <td>¥800</td>
                <td>2024-11-30 16:45</td>
              </tr>
              <tr>
                <td>刘女士</td>
                <td>135****5555</td>
                <td>
                  <span class="status-badge status-badge--silver">银牌会员</span>
                </td>
                <td>
                  <span class="status-badge status-badge--gold">金牌会员</span>
                </td>
                <td>¥600</td>
                <td>2024-11-29 14:20</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reqGetMemberLevelList } from '@/api/supabase'
import { MemberLevel } from '@/types/supabase'
import { onMounted, ref } from 'vue'

const memberLevelList = ref<MemberLevel[]>([])
onMounted(async () => {
  memberLevelList.value = await reqGetMemberLevelList()
})
</script>

<style lang="scss" scoped>
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
  background: var(--bg-gray);
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
