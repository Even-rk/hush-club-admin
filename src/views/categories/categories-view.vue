<template>
  <!-- 分类管理页面 -->
  <div class="content-card">
    <div class="card-header">
      <div class="card-title">分类管理</div>
      <button class="btn btn-primary" @click="openCategoryModal">+ 新增分类</button>
    </div>
    <div class="card-body">
      <!-- 筛选器 -->
      <div class="filters">
        <div class="filter-item">
          <label class="filter-label">状态:</label>
          <cool-select
            v-model="selectedStatus"
            :options="statusOptions"
            class="filter-select"
            placeholder="全部状态"
          />
        </div>
        <div class="filter-item">
          <input
            v-model="searchQuery"
            type="text"
            class="form-control filter-search"
            placeholder="搜索分类名称"
          />
          <button class="btn btn-secondary" @click="searchCategories">搜索</button>
        </div>
      </div>

      <!-- 分类列表 -->
      <data-table
        :data="categoryList"
        :columns="categoryColumns"
        :actions="categoryActions"
        :loading="loading"
        row-key="id"
      />
    </div>
  </div>

  <!-- 分类排序管理 -->
  <div v-if="!loading" class="content-card">
    <div class="card-header">
      <div class="card-title">分类排序</div>
      <div class="card-subtitle">拖拽调整分类的显示顺序</div>
    </div>
    <div class="card-body">
      <div class="sort-list">
        <div v-for="category in categoryList" :key="category.id" class="sort-item">
          <div class="sort-handle">⋮⋮</div>
          <div class="sort-content">
            <div class="sort-name">{{ category.category_name }}</div>
            <div class="sort-order">排序: {{ category.sort_order }}</div>
          </div>
          <button class="btn btn-secondary btn-sm">调整</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { reqGetAllCategory } from '@/api/supabase'
import { ProductCategory, TableColumn, TableAction } from '@/types/supabase'
import DataTable from '@/components/data-table.vue'
import CoolSelect from '@/components/cool-select.vue'

// 数据状态
const categoryList = ref<ProductCategory[]>([])
const loading = ref(false)

// 筛选器状态
const selectedStatus = ref('')
const searchQuery = ref('')

// 状态选项
const statusOptions = [
  { label: '全部状态', value: '' },
  { label: '已启用', value: 'active' },
  { label: '已禁用', value: 'inactive' }
]

// 搜索分类
const searchCategories = () => {
  console.log('搜索参数:', {
    status: selectedStatus.value,
    query: searchQuery.value
  })
  // TODO: 实现搜索逻辑
}

// 表格列配置
const categoryColumns: TableColumn<ProductCategory>[] = [
  { key: 'category_name', title: '分类名称' },
  { key: 'product_count', title: '关联商品' },
  { key: 'sort_order', title: '排序' },
  {
    key: 'status',
    title: '状态',
    type: 'status',
    statusMap: {
      active: { text: '已启用', className: 'status-success' },
      inactive: { text: '已禁用', className: 'status-error' }
    }
  },
  { key: 'created_at', title: '创建时间', type: 'date' }
]

// 表格操作配置
const categoryActions: TableAction<ProductCategory>[] = [
  {
    text: '编辑',
    type: 'secondary'
  },
  {
    text: '启用',
    type: 'success',
    visible: category => category.status === 'inactive'
  },
  {
    text: '禁用',
    type: 'warning',
    visible: category => category.status === 'active'
  }
]

// 操作函数
const openCategoryModal = () => {
  console.log('打开分类弹窗')
}

// 加载数据
onMounted(async () => {
  loading.value = true
  try {
    categoryList.value = await reqGetAllCategory()
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

/* 内容卡片 */
.content-card {
  background: var(--bg-white);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  margin-bottom: 24px;
}

.card-header {
  padding: 20px 24px;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
}

.card-subtitle {
  color: var(--text-secondary);
  font-size: 14px;
}

.card-actions {
  display: flex;
  gap: 12px;
}

.card-body {
  padding: 24px;
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

.filter-select {
  min-width: 120px;
}

.filter-search {
  min-width: 200px;
}

.sort-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.sort-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: var(--bg-white);
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
  cursor: move;

  &:hover {
    box-shadow: var(--shadow);
  }
}

.sort-handle {
  color: var(--text-secondary);
  font-size: 16px;
  cursor: grab;

  &:active {
    cursor: grabbing;
  }
}

.sort-content {
  flex: 1;
}

.sort-name {
  font-weight: 500;
  color: var(--text-primary);
}

.sort-order {
  font-size: 12px;
  color: var(--text-secondary);
  margin-top: 2px;
}
</style>
