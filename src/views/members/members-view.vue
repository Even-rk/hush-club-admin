<template>
  <!-- 会员管理页面 -->
  <div class="member-management-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">
          <span class="title-icon">👥</span>
          会员管理
        </h1>
        <p class="page-subtitle">管理店铺会员信息，查看会员消费记录和充值情况</p>
      </div>
      <button class="btn btn-primary btn-with-icon" @click="openAddMemberModal">
        <span class="btn-icon">✨</span>
        新增会员
      </button>
    </div>

    <!-- 会员列表卡片 -->
    <div class="content-card">
      <div class="card-header">
        <div class="card-title">会员列表</div>
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
        </template>

        <!-- 搜索和筛选区域 -->
        <div class="search-filter-container">
          <div class="search-box">
            <span class="search-icon">🔍</span>
            <input
              v-model="searchQuery"
              type="text"
              class="search-input-enhanced"
              placeholder="搜索会员姓名、手机号..."
              @change="queryChange"
            />
            <button class="search-btn" @click="searchMembers()">搜索</button>
          </div>

          <div class="filter-group">
            <div class="filter-item-enhanced">
              <cool-select
                v-model="selectedLevel"
                :options="levelOptions"
                placeholder="全部等级"
                @change="searchMembers()"
              />
            </div>
            <div class="filter-item-enhanced">
              <date-picker
                v-model="selectedDate"
                placeholder="选择日期"
                class="filter-date-range"
                @change="searchMembers()"
              />
            </div>
            <button class="btn btn-secondary" @click="resetFilter">重置筛选</button>
          </div>
        </div>

        <!-- 会员列表 -->
        <data-table
          :data="memberList"
          :columns="memberColumns"
          :actions="memberActions"
          :loading="loading"
          row-key="id"
          class="member-table"
        />
      </div>
    </div>
  </div>

  <!-- 会员弹窗 -->
  <MembersModal
    :visible="showMembersModal"
    :mode="modalMode"
    :member-data="currentMember || ({} as Member)"
    @close="showMembersModal = false"
    @success="refreshMemberList"
  />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { reqGetMemberLevels, reqGetMemberList } from '@/api/supabase'
import { Member, TableColumn, TableAction } from '@/types/supabase'
import DataTable from '@/components/data-table.vue'
import CoolSelect from '@/components/cool-select.vue'
import DatePicker from '@/components/date-picker.vue'
import message from '@/utils/message'
import MembersModal from './components/members-modal.vue'

// 数据状态
const memberList = ref<Member[]>([])
const memberTotal = ref(0)
const totalRecharge = ref(0)
const maxRecharge = ref(0)
const loading = ref(false)

// 筛选器状态
const selectedLevel = ref('')
const selectedDate = ref('')
const searchQuery = ref('')

// 会员等级选项
const levelOptions = ref<{ label: string; value: number }[]>([])

// modal相关状态
const showMembersModal = ref(false)
const modalMode = ref<'add' | 'edit'>('add')
const currentMember = ref<Member | null>(null)

// 表格列配置
const memberColumns: TableColumn<Member>[] = [
  { key: 'real_name', title: '姓名' },
  { key: 'phone', title: '手机号' },
  { key: 'level_name', title: '会员等级' },
  { key: 'balance', title: '当前余额', type: 'price' },
  { key: 'total_recharge', title: '单次最高充值', type: 'price' },
  { key: 'total_consumption', title: '累计消费', type: 'price' },
  { key: 'order_count', title: '订单数' },
  { key: 'created_at', title: '注册时间', type: 'date' }
]

// 打开编辑会员弹窗
const openEditMemberModal = (member: Member) => {
  modalMode.value = 'edit'
  currentMember.value = member
  showMembersModal.value = true
}

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
    onClick: member => openEditMemberModal(member)
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

    // 查会员等级
    const levelList = await reqGetMemberLevels()
    levelOptions.value = levelList?.map(item => ({
      label: item.level_name,
      value: item.id
    }))
  } finally {
    loading.value = false
  }
})

// 搜索会员
const searchMembers = async (params?: { level?: string; date?: string; query?: string }) => {
  loading.value = true
  try {
    const data = await reqGetMemberList({
      level: params?.level || selectedLevel.value,
      date: params?.date || selectedDate.value,
      query: params?.query || searchQuery.value
    })
    memberList.value = data.memberList || []
    memberTotal.value = data.memberTotal || 0
    totalRecharge.value = data.totalRecharge || 0
    maxRecharge.value = data.maxRecharge || 0
  } finally {
    loading.value = false
  }
}

// 重置筛选
const resetFilter = () => {
  if (searchQuery.value || selectedLevel.value || selectedDate.value) {
    searchMembers({
      level: '',
      date: '',
      query: ''
    })
  } else {
    message.warning('没有筛选条件')
  }
  selectedLevel.value = ''
  selectedDate.value = ''
  searchQuery.value = ''
}

// 打开添加会员弹窗
const openAddMemberModal = () => {
  modalMode.value = 'add'
  currentMember.value = null
  showMembersModal.value = true
}

// 刷新会员列表
const refreshMemberList = async () => {
  await searchMembers()
}

// 查询变化
const queryChange = () => {
  if (!searchQuery.value) {
    searchMembers()
  }
}
</script>

<style lang="scss" scoped>
/* 会员管理页面 */
.member-management-page {
  height: fit-content;
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

/* 按钮样式 */
.btn {
  padding: 10px 20px;
  border: none;
  border-radius: var(--radius-md);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 8px;

  &.btn-primary {
    background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-light) 100%);
    color: var(--bg-white);

    &:hover {
      background: linear-gradient(135deg, var(--primary-light) 0%, var(--primary-color) 100%);
      transform: translateY(-1px);
      box-shadow: var(--shadow-primary);
    }
  }

  &.btn-secondary {
    background: var(--bg-white);
    color: var(--text-subtitle);
    border: 1px solid var(--border-medium);

    &:hover {
      background: var(--bg-light);
      border-color: var(--border-hover);
    }
  }

  &.btn-with-icon {
    .btn-icon {
      font-size: 16px;
    }
  }
}

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

  .card-title {
    font-size: 18px;
    font-weight: 600;
    color: var(--text-heading);
  }
}

.card-body {
  padding: 24px;
}

/* 统计卡片 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.stat-card {
  background: var(--bg-white);
  padding: 24px;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow);
  text-align: center;
  transition: all 0.3s;
  border: 1px solid var(--border-light);

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
  }
}

.stat-number {
  font-size: 28px;
  font-weight: 700;
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-light) 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  color: var(--text-subtitle);
  font-weight: 500;
}

/* 搜索和筛选容器 */
.search-filter-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  gap: 16px;
  flex-wrap: wrap;

  .search-box {
    position: relative;
    flex: 1;
    max-width: 400px;

    .search-icon {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 16px;
      opacity: 0.5;
    }

    .search-input-enhanced {
      width: 100%;
      padding: 10px 100px 10px 36px;
      border: 1px solid var(--border-medium);
      border-radius: var(--radius-md);
      font-size: 14px;
      transition: all 0.2s;

      &:focus {
        outline: none;
        border-color: var(--primary-color);
        box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
      }
    }

    .search-btn {
      position: absolute;
      right: 4px;
      top: 50%;
      transform: translateY(-50%);
      padding: 6px 16px;
      background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-light) 100%);
      color: var(--bg-white);
      border: none;
      border-radius: var(--radius);
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        background: linear-gradient(135deg, var(--primary-light) 0%, var(--primary-color) 100%);
      }
    }
  }

  .filter-group {
    display: flex;
    gap: 12px;
    align-items: center;

    .filter-item-enhanced {
      min-width: 120px;
    }
  }
}

.filter-date-range {
  display: flex;
  align-items: center;
}

/* 会员表格样式 */
.member-table {
  :deep(.data-table) {
    border: 1px solid var(--border-medium);
    border-radius: var(--radius);
    overflow: hidden;
  }
}
</style>
