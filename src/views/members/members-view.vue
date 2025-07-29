<template>
  <!-- 会员管理页面 -->
  <div class="page">
    <div class="content-card">
      <div class="card-header">
        <div class="card-title">会员管理</div>
        <div class="card-actions">
          <button class="btn btn-secondary">📊 导出会员</button>
          <button class="btn btn-primary" onclick="openMemberModal()">+ 添加会员</button>
        </div>
      </div>
      <div class="card-body">
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-number">{{ memberTotal }}</div>
            <div class="stat-label">总会员数</div>
          </div>
          <div class="stat-card">
            <div class="stat-number stat-success">¥{{ totalRecharge }}</div>
            <div class="stat-label">总充值金额</div>
          </div>
          <div class="stat-card">
            <div class="stat-number stat-primary">¥{{ maxRecharge }}</div>
            <div class="stat-label">单次最高充值</div>
          </div>
        </div>

        <div class="search-bar">
          <input type="text" class="search-input" placeholder="搜索会员姓名或手机号..." />
          <button class="btn btn-secondary">🔍 搜索</button>
        </div>

        <div class="filters">
          <div class="filter-item">
            <label class="filter-label">会员等级:</label>
            <select class="form-select filter-select">
              <option>全部等级</option>
              <option>普通会员</option>
              <option>银牌会员</option>
              <option>金牌会员</option>
              <option>钻石会员</option>
            </select>
          </div>
          <div class="filter-item">
            <label class="filter-label">注册时间:</label>
            <select class="form-select filter-select">
              <option>全部时间</option>
              <option>最近7天</option>
              <option>最近30天</option>
              <option>最近90天</option>
            </select>
          </div>
        </div>

        <table class="data-table">
          <thead>
            <tr>
              <th>姓名</th>
              <th>手机号</th>
              <th>会员等级</th>
              <th>当前余额</th>
              <th>单次最高充值</th>
              <th>累计消费</th>
              <th>订单数</th>
              <th>注册时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="member in memberList" :key="member.id">
              <td>{{ member.real_name }}</td>
              <td>{{ member.phone }}</td>
              <td>{{ member.level_name }}</td>
              <td>¥{{ member.balance }}</td>
              <td>¥{{ member.total_recharge }}</td>
              <td>¥{{ member.total_consumption }}</td>
              <td>{{ member.order_count }}</td>
              <td>{{ member.register_time }}</td>
              <td>
                <button class="btn btn-secondary btn-sm" onclick="viewMemberDetail(this)">
                  查看
                </button>
                <button class="btn btn-secondary btn-sm" onclick="editMember(this)">编辑</button>
                <button class="btn btn-primary btn-sm" onclick="openRechargeModal(this)">
                  充值
                </button>
                <button class="btn btn-warning btn-sm" onclick="openMemberCouponModal(this)">
                  优惠券
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reqGetMemberList } from '@/api/supabase'
import { Member } from '@/types/supabase'
import { formatDate } from '@/utils/format'
import { onMounted, ref } from 'vue'

// 会员列表
const memberList = ref<Member[]>([])
const memberTotal = ref(0)
const totalRecharge = ref(0)
const maxRecharge = ref(0)
onMounted(async () => {
  const data = await reqGetMemberList()
  const list = data.memberList || []
  memberList.value = list.map(item => ({
    ...item,
    register_time: formatDate(item.register_time, 'YYYY-MM-DD')
  }))
  // 会员数量
  memberTotal.value = data.memberTotal || 0
  // 总充值金额
  totalRecharge.value = data.totalRecharge || 0
  // 单次最高充值总额
  maxRecharge.value = data.maxRecharge || 0
})
</script>

<style scoped lang="scss">
.stats-grid {
  margin-bottom: 24px;

  .stat-card {
    background: white;
    padding: 16px;
    border-radius: var(--radius);
    text-align: center;
    border: 1px solid var(--border-color);

    .stat-number {
      font-size: 20px;
      font-weight: 600;
      color: var(--text-secondary);

      &.stat-success {
        color: var(--success-color);
      }

      &.stat-primary {
        color: var(--primary-color);
      }
    }

    .stat-label {
      font-size: 12px;
      color: var(--text-secondary);
    }
  }
}

.member-level-select {
  min-width: 120px;
}
</style>
