<template>
  <!-- 优惠券管理页面 -->
  <div class="coupon-management-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">
          <span class="title-icon">🎟️</span>
          优惠券管理
        </h1>
        <p class="page-subtitle">创建和管理优惠券模板，查看优惠券使用情况</p>
      </div>
      <button class="btn btn-primary btn-with-icon">
        <span class="btn-icon">✨</span>
        创建优惠券
      </button>
    </div>

    <!-- 优惠券列表卡片 -->
    <div class="content-card">
      <div class="card-header">
        <div class="card-title">优惠券列表</div>
      </div>
      <div class="card-body">
        <!-- 优惠券统计 -->
        <div v-if="!loading" class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon stat-success">🎫</div>
            <div class="stat-content">
              <div class="stat-number">{{ coupon_count }}</div>
              <div class="stat-label">优惠券模板</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon stat-warning">✅</div>
            <div class="stat-content">
              <div class="stat-number">{{ active_count }}</div>
              <div class="stat-label">正常状态</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon stat-info">🚫</div>
            <div class="stat-content">
              <div class="stat-number">{{ inactive_count }}</div>
              <div class="stat-label">已禁用</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon stat-error">📤</div>
            <div class="stat-content">
              <div class="stat-number">{{ send_count }}</div>
              <div class="stat-label">累计发送</div>
            </div>
          </div>
        </div>

        <!-- 搜索和筛选区域 -->
        <div class="search-filter-container">
          <div class="search-box">
            <span class="search-icon">🔍</span>
            <input
              v-model="searchQuery"
              type="text"
              class="search-input-enhanced"
              placeholder="搜索优惠券名称..."
              @change="queryChange()"
            />
            <button class="search-btn" @click="searchCoupons()">搜索</button>
          </div>

          <div class="filter-group">
            <div class="filter-item-enhanced">
              <cool-select
                v-model="selectedStatus"
                :options="statusOptions"
                placeholder="全部状态"
                @change="searchCoupons()"
              />
            </div>
            <div class="filter-item-enhanced">
              <cool-select
                v-model="selectedType"
                :options="typeOptions"
                placeholder="全部类型"
                @change="searchCoupons()"
              />
            </div>
            <button class="btn btn-secondary" @click="resetFilter">重置筛选</button>
          </div>
        </div>

        <!-- 数据表格 -->
        <DataTable
          :data="couponList"
          :columns="columns"
          :actions="actions"
          :loading="loading"
          empty-text="暂无优惠券数据"
          class="coupon-table"
        >
          <!-- 优惠内容插槽 -->
          <template #discount_content="{ row }">
            <span v-if="row.coupon_type === 'reduce'">
              满¥{{ row.threshold_amount }}减¥{{ row.discount_value }}
            </span>
            <span v-else-if="row.coupon_type === 'discount'">
              {{ (row.discount_value * 10).toFixed(1) }}折
            </span>
            <span v-else-if="row.coupon_type === 'free'">
              {{ row.description || '免费获得' }}
            </span>
            <span v-else> ¥{{ row.discount_value }} </span>
          </template>
        </DataTable>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Coupon, TableColumn, TableAction } from '@/types/supabase'
import { reqGetCouponList } from '@/api/supabase/SELECT'
import { onMounted, ref } from 'vue'
import DataTable from '@/components/data-table.vue'
import { formatDate } from '@/utils/format'
import CoolSelect from '@/components/cool-select.vue'
import { ElMessage } from 'element-plus'

// 优惠券列表
const couponList = ref<Coupon[]>([])
// 优惠券模版数量
const coupon_count = ref(0)

// 优惠券状态
const selectedStatus = ref('')
// 优惠券类型
const selectedType = ref('')
// 搜索内容
const searchQuery = ref('')

// 状态选项
const statusOptions = [
  { label: '正常', value: 'active' },
  { label: '已禁用', value: 'inactive' }
]

// 类型选项
const typeOptions = [
  { label: '满减券', value: 'discount' },
  { label: '折扣券', value: 'percentage' },
  { label: '免费券', value: 'free' }
]
// 正常状态数量
const active_count = ref(0)
// 已禁用数量
const inactive_count = ref(0)
// 累计发送数量
const send_count = ref(0)
const loading = ref(false)

// 表格列配置
const columns: TableColumn<Coupon>[] = [
  {
    key: 'template_name',
    title: '优惠券名称',
    type: 'text'
  },
  {
    key: 'coupon_type',
    title: '优惠类型',
    type: 'text',
    formatter: (_, row: Coupon) => {
      const typeMap = {
        reduce: '满减券',
        discount: '折扣券',
        free: '免费券'
      }
      return typeMap[row.coupon_type as keyof typeof typeMap] || row.coupon_type
    }
  },
  {
    key: 'discount_value',
    title: '优惠内容',
    type: 'custom',
    slot: 'discount_content'
  },
  {
    key: 'threshold_amount',
    title: '使用门槛',
    type: 'text',
    formatter: (_, row: Coupon) => {
      const isZero = row.threshold_amount == 0 || !row.threshold_amount
      return isZero ? '无门槛' : `¥${row.threshold_amount}`
    }
  },
  {
    key: 'valid_day',
    title: '有效截止时间',
    type: 'text',
    formatter: (_, row: Coupon) => {
      if (row.valid_day == '长期有效') {
        return row.valid_day
      } else {
        return formatDate(row.valid_day, 'YYYY-MM-DD')
      }
    }
  },
  {
    key: 'status',
    title: '状态',
    type: 'status',
    statusMap: {
      active: { text: '正常', className: 'status-success' },
      inactive: { text: '已禁用', className: 'status-info' }
    }
  }
]

// 表格操作配置
const actions: TableAction<Coupon>[] = [
  {
    text: '编辑',
    type: 'secondary',
    onClick: (row: Coupon) => {
      console.log('编辑优惠券', row)
    },
    visible: (row: Coupon) => row.status === 'active'
  },
  {
    text: '禁用',
    type: 'warning',
    onClick: (row: Coupon) => {
      console.log('禁用优惠券', row)
    },
    visible: (row: Coupon) => row.status === 'active'
  },
  {
    text: '启用',
    type: 'success',
    onClick: (row: Coupon) => {
      console.log('启用优惠券', row)
    },
    visible: (row: Coupon) => row.status === 'inactive'
  },
  {
    text: '查看',
    type: 'secondary',
    onClick: (row: Coupon) => {
      console.log('查看优惠券', row)
    }
  },
  {
    text: '删除',
    type: 'error',
    onClick: (row: Coupon) => {
      console.log('删除优惠券', row)
    }
  }
]

onMounted(async () => {
  loading.value = true
  try {
    const data = await reqGetCouponList()
    if (data) {
      couponList.value = data.couponList || []
      coupon_count.value = data.coupon_count || 0
      active_count.value = data.active_count || 0
      inactive_count.value = data.inactive_count || 0
      send_count.value = data.send_count || 0
    }
  } finally {
    loading.value = false
  }
})

// 搜索优惠券
const searchCoupons = async (params?: { status?: string; type?: string }) => {
  loading.value = true
  try {
    const data = await reqGetCouponList({
      status: params?.status || selectedStatus.value,
      type: params?.type || selectedType.value
    })
    couponList.value = data.couponList || []
    coupon_count.value = data.coupon_count || 0
    active_count.value = data.active_count || 0
    inactive_count.value = data.inactive_count || 0
    send_count.value = data.send_count || 0
  } finally {
    loading.value = false
  }
}
// 重置筛选
const resetFilter = () => {
  if (selectedStatus.value || selectedType.value) {
    searchCoupons({
      status: '',
      type: ''
    })
  } else {
    ElMessage.warning('没有筛选条件')
  }
  selectedStatus.value = ''
  selectedType.value = ''
  searchQuery.value = ''
}

// 查询变化
const queryChange = () => {
  if (!searchQuery.value) {
    searchCoupons()
  }
}
</script>

<style scoped lang="scss">
/* 优惠券管理页面 */
.coupon-management-page {
  padding: 24px;
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

/* 统计卡片 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: var(--bg-white);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow);
  transition: all 0.3s;
  border: 1px solid var(--border-light);

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
  }

  .stat-icon {
    width: 48px;
    height: 48px;
    border-radius: var(--radius-md);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;

    &.stat-success {
      background: var(--success-bg);
    }

    &.stat-warning {
      background: var(--warning-bg);
    }

    &.stat-info {
      background: var(--info-bg);
    }

    &.stat-error {
      background: var(--error-bg);
    }
  }

  .stat-content {
    flex: 1;

    .stat-number {
      font-size: 24px;
      font-weight: 700;
      background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-light) 100%);
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      -webkit-text-stroke: 1px var(--bg-white);
      margin-bottom: 4px;
    }

    .stat-label {
      font-size: 13px;
      color: var(--text-subtitle);
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

  .card-title {
    font-size: 18px;
    font-weight: 600;
    color: var(--text-heading);
  }
}

.card-body {
  padding: 24px;
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

/* 优惠券表格样式 */
.coupon-table {
  :deep(.data-table) {
    border: 1px solid var(--border-medium);
    border-radius: var(--radius);
    overflow: hidden;
  }
}
</style>
