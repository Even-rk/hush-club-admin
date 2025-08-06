<template>
  <!-- 会员管理页面 -->
  <div class="content-card">
    <div class="card-header">
      <div class="card-title">会员管理</div>
      <button class="btn btn-primary">+ 新增会员</button>
    </div>
    <div class="card-body">
      <template v-if="!loading">
        <!-- 统计卡片 -->
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-number">{{ memberTotal }}</div>
            <div class="stat-label">会员总数</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">¥{{ totalRecharge }}</div>
            <div class="stat-label">总充值金额</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">¥{{ maxRecharge }}</div>
            <div class="stat-label">单次最高充值</div>
          </div>
        </div>

        <!-- 筛选器 -->
        <div class="filters">
          <div class="filter-item">
            <label class="filter-label">会员等级:</label>
            <cool-select
              v-model="selectedLevel"
              :options="levelOptions"
              class="filter-select"
              placeholder="全部等级"
            />
          </div>
          <div class="filter-item">
            <label class="filter-label">注册时间:</label>
            <input type="date" class="form-control filter-date" />
            <span class="filter-separator">至</span>
            <input type="date" class="form-control filter-date" />
          </div>
          <div class="filter-item">
            <input
              type="text"
              class="form-control filter-search"
              placeholder="搜索会员姓名或手机号"
            />
            <button class="btn btn-secondary">搜索</button>
          </div>
        </div>
      </template>

      <!-- 会员列表 -->
      <data-table
        :data="memberList"
        :columns="memberColumns"
        :actions="memberActions"
        :loading="loading"
        row-key="id"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { reqGetMemberList } from '@/api/supabase'
import { Member, TableColumn, TableAction } from '@/types/supabase'
import DataTable from '@/components/data-table.vue'
import CoolSelect from '@/components/cool-select.vue'

// 数据状态
const memberList = ref<Member[]>([])
const memberTotal = ref(0)
const totalRecharge = ref(0)
const maxRecharge = ref(0)
const loading = ref(false)

// 筛选器状态
const selectedLevel = ref('')

// 会员等级选项
const levelOptions = [
  { label: '全部等级', value: '' },
  { label: '普通会员', value: 'normal' },
  { label: '银牌会员', value: 'silver' },
  { label: '金牌会员', value: 'gold' }
]

// 表格列配置
const memberColumns: TableColumn<Member>[] = [
  { key: 'real_name', title: '姓名' },
  { key: 'phone', title: '手机号' },
  { key: 'level_name', title: '会员等级' },
  { key: 'balance', title: '当前余额', type: 'price' },
  { key: 'total_recharge', title: '单次最高充值', type: 'price' },
  { key: 'total_consumption', title: '累计消费', type: 'price' },
  { key: 'order_count', title: '订单数' },
  { key: 'register_time', title: '注册时间', type: 'date' }
]

// 表格操作配置
const memberActions: TableAction<Member>[] = [
  {
    text: '查看',
    type: 'secondary',
    onClick: member => console.log(member)
  },
  {
    text: '编辑',
    type: 'secondary',
    onClick: member => console.log(member)
  },
  {
    text: '充值',
    type: 'primary',
    onClick: member => console.log(member)
  },
  {
    text: '优惠券',
    type: 'warning',
    onClick: member => console.log(member)
  }
]

// 加载数据
onMounted(async () => {
  loading.value = true
  try {
    const data = await reqGetMemberList()
    memberList.value = data.memberList || []
    memberTotal.value = data.memberTotal || 0
    totalRecharge.value = data.totalRecharge || 0
    maxRecharge.value = data.maxRecharge || 0
  } finally {
    loading.value = false
  }
})
</script>

<style lang="scss" scoped>
/* 表单控件 */
.form-control,
.form-select,
.form-textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
  font-family: inherit;
  font-size: 14px;
  transition: border-color 0.3s ease;
}

.form-select {
  padding-right: 32px;
  appearance: none;
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 16px;
}

.form-control:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

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

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.stat-card {
  background: var(--bg-white);
  padding: 20px;
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  text-align: center;
}

.stat-number {
  font-size: 24px;
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  color: var(--text-secondary);
}

.filters {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.filter-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-label {
  font-size: 14px;
  color: var(--text-primary);
  white-space: nowrap;
}

.filter-select,
.filter-date {
  min-width: 120px;
}

.filter-search {
  min-width: 200px;
}

.filter-separator {
  font-size: 14px;
  color: var(--text-secondary);
}
</style>
