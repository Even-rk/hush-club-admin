<template>
  <!-- 优惠券管理页面 -->
  <div class="page">
    <div class="content-card">
      <div class="card-header">
        <div class="card-title">优惠券管理</div>
        <div class="card-actions">
          <button class="btn btn-primary">+ 创建优惠券</button>
        </div>
      </div>
      <div class="card-body">
        <!-- 优惠券统计 -->
        <div v-if="!loading" class="statsGrid">
          <div class="statCard statCardSuccess">
            <div class="statNumber statNumberSuccess">{{ coupon_count }}</div>
            <div class="statLabel">优惠券模板</div>
          </div>
          <div class="statCard statCardWarning">
            <div class="statNumber statNumberWarning">{{ active_count }}</div>
            <div class="statLabel">正常状态</div>
          </div>
          <div class="statCard statCardInfo">
            <div class="statNumber statNumberInfo">{{ inactive_count }}</div>
            <div class="statLabel">已禁用</div>
          </div>
          <div class="statCard statCardError">
            <div class="statNumber statNumberError">{{ send_count }}</div>
            <div class="statLabel">累计发送</div>
          </div>
        </div>

        <!-- 优惠券列表 -->
        <div class="filters">
          <div class="filter-item">
            <label class="filter-label">优惠券状态:</label>
            <select class="form-select filter-select">
              <option>全部状态</option>
              <option>正常</option>
              <option>已使用</option>
              <option>已过期</option>
              <option>已禁用</option>
            </select>
          </div>
          <div class="filter-item">
            <label class="filter-label">优惠类型:</label>
            <select class="form-select filter-select">
              <option>全部类型</option>
              <option>满减券</option>
              <option>折扣券</option>
              <option>免费券</option>
            </select>
          </div>
        </div>

        <!-- 数据表格 -->
        <DataTable
          :data="couponList"
          :columns="columns"
          :actions="actions"
          :loading="loading"
          empty-text="暂无优惠券数据"
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

// 优惠券列表
const couponList = ref<Coupon[]>([])
// 优惠券模版数量
const coupon_count = ref(0)
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
      const isZero = row.threshold_amount === '0' || !row.threshold_amount
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
        return formatDate(row.valid_day, 'YYYY/MM/DD')
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
</script>

<style scoped>
/* 统计网格容器 */
.statsGrid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

/* 统计卡片基础样式 */
.statCard {
  padding: 16px;
  border-radius: var(--radius);
  text-align: center;
}

/* 不同类型的统计卡片背景色 */
.statCardSuccess {
  background: rgba(76, 175, 80, 0.1);
}

.statCardWarning {
  background: rgba(255, 193, 7, 0.1);
}

.statCardInfo {
  background: rgba(33, 150, 243, 0.1);
}

.statCardError {
  background: rgba(244, 67, 54, 0.1);
}

/* 统计数字样式 */
.statNumber {
  font-size: 20px;
  font-weight: 600;
}

.statNumberSuccess {
  color: var(--success-color);
}

.statNumberWarning {
  color: var(--warning-color);
}

.statNumberInfo {
  color: var(--info-color);
}

.statNumberError {
  color: var(--error-color);
}

/* 统计标签样式 */
.statLabel {
  font-size: 12px;
  color: var(--text-secondary);
}
</style>
