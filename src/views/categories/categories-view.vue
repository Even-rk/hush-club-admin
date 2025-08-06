<template>
  <!-- 分类管理页面 -->
  <div class="category-management-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">
          <span class="title-icon">🎨</span>
          分类管理
        </h1>
        <p class="page-subtitle">管理商品分类，设置分类排序和显示状态</p>
      </div>
      <button class="btn btn-primary btn-with-icon" @click="openCategoryModal">
        <span class="btn-icon">✨</span>
        新增分类
      </button>
    </div>

    <!-- 分类列表卡片 -->
    <div class="content-card">
      <div class="card-header">
        <div class="card-title">分类列表</div>
        <div class="card-tools">
          <button class="tool-btn" title="刷新">
            <span>🔄</span>
          </button>
        </div>
      </div>
      <div class="card-body">
        <!-- 搜索和筛选区域 -->
        <div class="search-filter-container">
          <div class="search-box">
            <span class="search-icon">🔍</span>
            <input
              v-model="searchQuery"
              type="text"
              class="search-input-enhanced"
              placeholder="搜索分类名称..."
            />
            <button class="search-btn" @click="searchCategories">搜索</button>
          </div>

          <div class="filter-group">
            <div class="filter-item-enhanced">
              <cool-select
                v-model="selectedStatus"
                :options="statusOptions"
                class="filter-select-enhanced"
                placeholder="全部状态"
              />
            </div>
            <button class="btn btn-secondary" @click="resetCategories">重置筛选</button>
          </div>
        </div>

        <!-- 分类列表 -->
        <data-table
          :data="categoryList"
          :columns="categoryColumns"
          :actions="categoryActions"
          :loading="loading"
          row-key="id"
          class="category-table"
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
  { label: '已启用', value: 'active' },
  { label: '已禁用', value: 'inactive' }
]

// 搜索分类
const searchCategories = async () => {
  loading.value = true
  try {
    categoryList.value = await reqGetAllCategory({
      status: selectedStatus.value,
      search: searchQuery.value
    })
  } finally {
    loading.value = false
  }
}

// 重置分类
const resetCategories = () => {
  selectedStatus.value = ''
  searchQuery.value = ''
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
/* 分类管理页面 */
.category-management-page {
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
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);

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
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 8px;

  &.btn-primary {
    background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-light) 100%);
    color: white;

    &:hover {
      background: linear-gradient(135deg, var(--primary-light) 0%, var(--primary-color) 100%);
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
    }
  }

  &.btn-secondary {
    background: white;
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

  &.btn-sm {
    padding: 6px 12px;
    font-size: 13px;
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

/* 内容卡片 */
.content-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  margin-bottom: 24px;
}

.card-header {
  padding: 20px 24px;
  border-bottom: 1px solid var(--border-light);
  display: flex;
  align-items: center;
  justify-content: space-between;

  .card-title {
    font-size: 18px;
    font-weight: 600;
    color: var(--text-heading);
  }

  .card-subtitle {
    color: var(--text-subtitle);
    font-size: 14px;
    margin-top: 4px;
  }

  .card-tools {
    display: flex;
    gap: 8px;

    .tool-btn {
      width: 32px;
      height: 32px;
      border: 1px solid var(--border-medium);
      border-radius: 8px;
      background: white;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        background: var(--bg-light);
        border-color: var(--border-hover);
      }

      span {
        font-size: 16px;
      }
    }
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
      border-radius: 10px;
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
      color: white;
      border: none;
      border-radius: 8px;
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

/* 分类排序 */
.sort-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.sort-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: white;
  border: 1px solid var(--border-medium);
  border-radius: 10px;
  cursor: move;
  transition: all 0.2s;

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    transform: translateY(-1px);
  }
}

.sort-handle {
  color: var(--text-muted);
  font-size: 18px;
  cursor: grab;

  &:active {
    cursor: grabbing;
  }
}

.sort-content {
  flex: 1;
}

.sort-name {
  font-weight: 600;
  color: var(--text-heading);
  font-size: 14px;
}

.sort-order {
  font-size: 12px;
  color: var(--text-subtitle);
  margin-top: 4px;
}

/* 分类表格样式 */
.category-table {
  :deep(.data-table) {
    border: 1px solid var(--border-medium);
    border-radius: 8px;
    overflow: hidden;
  }
}
</style>
