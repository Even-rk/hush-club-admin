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
              @change="queryChange"
            />
            <button class="search-btn" @click="searchCategories()">搜索</button>
          </div>

          <div class="filter-group">
            <div class="filter-item-enhanced">
              <cool-select
                v-model="selectedStatus"
                :options="statusOptions"
                class="filter-select-enhanced"
                placeholder="全部状态"
                @change="searchCategories()"
              />
            </div>
            <button class="btn btn-secondary" @click="resetCategories">重置筛选</button>
          </div>
        </div>

        <!-- 分类列表 -->
        <data-table
          :data="sortedCategories"
          :columns="categoryColumns"
          :actions="categoryActions"
          :loading="loading"
          row-key="id"
          class="category-table"
        />
      </div>
    </div>

    <!-- 分类排序管理 -->
    <div v-if="!loading" class="content-card sort-section">
      <div class="card-header">
        <div class="header-info">
          <div class="card-title">
            <span class="title-icon">✨</span>
            分类排序
          </div>
          <div class="card-subtitle">拖拽调整分类的显示顺序，支持实时预览</div>
        </div>
        <div class="sort-tips">
          <span class="tip-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M10 9V6L5 11L10 16V13H14V9H10ZM14 15V18L19 13L14 8V11H10V15H14Z"
                fill="currentColor"
                opacity="0.5"
              />
            </svg>
            拖拽排序
          </span>
        </div>
      </div>
      <div v-if="!selectedStatus && !searchQuery" class="card-body">
        <div class="sort-list">
          <div
            v-for="(category, index) in sortedCategories"
            :key="category.id"
            class="sort-item"
            :draggable="true"
            :class="{
              dragging: draggedIndex === index,
              'drag-over': dragOverIndex === index
            }"
            @dragstart="onDragStart(index)"
            @dragover.prevent="onDragOver(index)"
            @dragleave="onDragLeave"
            @drop="onDrop(index)"
            @dragend="onDragEnd"
          >
            <div class="sort-card-inner">
              <div class="sort-icon" :style="{ background: getCategoryGradient(index) }">
                <span>{{ category.category_name.substring(0, 2) }}</span>
              </div>
              <div class="sort-content">
                <div class="sort-name">{{ category.category_name }}</div>
                <div class="sort-badge">
                  <span class="badge-number">{{ category.sort_order }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="card-body">
        <div class="empty-state">
          <div class="empty-icon">🎉</div>
          <div class="empty-text">全部分类展示排序功能</div>
        </div>
      </div>
    </div>
  </div>

  <!-- 分类弹窗 -->
  <template v-if="categoryModalVisible">
    <categories-modal
      :visible="categoryModalVisible"
      :mode="categoryModalMode"
      :category-data="currentCategory"
      @close="categoryModalVisible = false"
      @success="handleModalSuccess"
    />
  </template>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { reqGetAllCategory } from '@/api/supabase'
import { ProductCategory, TableColumn, TableAction } from '@/types/supabase'
import DataTable from '@/components/data-table.vue'
import CoolSelect from '@/components/cool-select.vue'
import CategoriesModal from './components/categories-modal.vue'
import { ElMessage } from 'element-plus'
import { confirmWarning } from '@/utils/confirm'
import { showLoading } from '@/utils/loading'
import { reqDeleteCategory } from '@/api/supabase/DELETE'

// 数据状态
const categoryList = ref<ProductCategory[]>([])
const loading = ref(false)
const draggedIndex = ref<number | null>(null)
const dragOverIndex = ref<number | null>(null)

// 筛选器状态
const selectedStatus = ref('')
const searchQuery = ref('')

// 模态框状态
const categoryModalVisible = ref(false)
const categoryModalMode = ref<'add' | 'edit'>('add')
const currentCategory = ref({} as ProductCategory)

// 状态选项
const statusOptions = [
  { label: '已启用', value: 'active' },
  { label: '已禁用', value: 'inactive' }
]

// 计算属性：排序后的分类列表
const sortedCategories = computed(() => {
  return [...categoryList.value].sort((a, b) => a.sort_order - b.sort_order)
})

// 搜索分类
const searchCategories = async (params?: { status?: string; search?: string }) => {
  loading.value = true
  try {
    categoryList.value = await reqGetAllCategory({
      status: params?.status || selectedStatus.value,
      search: params?.search || searchQuery.value
    })
  } finally {
    loading.value = false
  }
}

// 重置分类
const resetCategories = () => {
  if (searchQuery.value || selectedStatus.value) {
    searchCategories({
      status: '',
      search: ''
    })
  } else {
    ElMessage.warning('没有筛选条件')
  }
  selectedStatus.value = ''
  searchQuery.value = ''
}

// 查询变化
const queryChange = () => {
  if (!searchQuery.value) {
    // 内容为空，查询所有
    searchCategories()
  }
}

// 操作函数
const openCategoryModal = () => {
  categoryModalMode.value = 'add'
  currentCategory.value = {} as ProductCategory
  categoryModalVisible.value = true
}

const handleEdit = (category: ProductCategory) => {
  categoryModalMode.value = 'edit'
  currentCategory.value = category
  categoryModalVisible.value = true
}

const handleEnable = async (category: ProductCategory) => {
  try {
    // 这里应该调用启用分类的API
    ElMessage.success(`分类 "${category.category_name}" 已启用`)
    await searchCategories()
  } catch (error) {
    ElMessage.error('启用失败')
  }
}

const handleDisable = async (category: ProductCategory) => {
  try {
    // 这里应该调用禁用分类的API
    ElMessage.success(`分类 "${category.category_name}" 已禁用`)
    await searchCategories()
  } catch (error) {
    ElMessage.error('禁用失败')
  }
}

// 删除分类
const handleDelete = async (category: ProductCategory) => {
  const confirmed = await confirmWarning('确定删除该分类吗？')
  if (confirmed) {
    const delLoading = showLoading('正在删除分类...')
    try {
      // 执行删除操作
      await reqDeleteCategory(category.id)
      setTimeout(() => {
        categoryList.value = categoryList.value.filter(item => item.id !== category.id)
        delLoading.close()
        ElMessage.success('删除成功')
      }, 1000)
    } catch (error) {
      ElMessage.error('删除失败, 请联系系统管理员！！')
    }
  }
}

// 分类弹窗成功回调
const handleModalSuccess = async (data: ProductCategory, mode: 'add' | 'edit') => {
  console.log(data)
  try {
    if (mode === 'add') {
      // 这里应该调用添加分类的API
      ElMessage.success('分类添加成功')
    } else {
      // 这里应该调用更新分类的API
      ElMessage.success('分类更新成功')
    }

    // 重新加载分类列表
    await searchCategories()
    categoryModalVisible.value = false
  } catch (error) {
    ElMessage.error(mode === 'add' ? '添加失败' : '更新失败')
  }
}

// 表格列配置
const categoryColumns: TableColumn<ProductCategory>[] = [
  { key: 'category_name', title: '分类名称' },
  { key: 'product_count', title: '关联商品' },
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
    type: 'secondary',
    onClick: handleEdit
  },
  {
    text: '启用',
    type: 'success',
    visible: category => category.status === 'inactive',
    onClick: handleEnable
  },
  {
    text: '禁用',
    type: 'warning',
    visible: category => category.status === 'active',
    onClick: handleDisable
  },
  {
    text: '删除',
    type: 'error',
    onClick: handleDelete
  }
]

// 获取分类渐变色
const getCategoryGradient = (index: number) => {
  const gradients = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
    'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
    'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    'linear-gradient(135deg, #ff6b35 0%, #f77b54 100%)'
  ]
  return gradients[index % gradients.length]
}

// 拖拽开始
const onDragStart = (index: number) => {
  draggedIndex.value = index
}

// 拖拽经过
const onDragOver = (index: number) => {
  dragOverIndex.value = index
}

// 拖拽离开
const onDragLeave = () => {
  dragOverIndex.value = null
}

// 拖拽结束
const onDragEnd = () => {
  draggedIndex.value = null
  dragOverIndex.value = null
}

// 更新排序值
const updateSortOrder = (categories: ProductCategory[]) => {
  // 更新每个分类的 sort_order
  categories.forEach((category, index) => {
    category.sort_order = index
  })

  // 更新原始列表
  categoryList.value = categories
}

// 拖拽放置
const onDrop = (dropIndex: number) => {
  dragOverIndex.value = null

  if (draggedIndex.value === null || draggedIndex.value === dropIndex) {
    return
  }

  const draggedItem = sortedCategories.value[draggedIndex.value]
  const categories = [...sortedCategories.value]

  // 移除拖拽的元素
  categories.splice(draggedIndex.value, 1)
  // 在新位置插入
  categories.splice(dropIndex, 0, draggedItem)

  // 更新 sort_order
  updateSortOrder(categories)
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
  height: fit-content;
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

/* 分类排序区域 */
.sort-section {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24px;
    background: linear-gradient(135deg, var(--bg-gradient-start) 0%, transparent 100%);

    .header-info {
      .card-title {
        display: flex;
        align-items: center;
        gap: 8px;

        .title-icon {
          font-size: 20px;
        }
      }
    }

    .sort-tips {
      display: flex;
      gap: 16px;

      .tip-item {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 6px 12px;
        background: white;
        border-radius: 8px;
        font-size: 13px;
        color: var(--text-subtitle);
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);

        svg {
          width: 16px;
          height: 16px;
        }
      }
    }
  }
}

/* 分类排序 */
.sort-list {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 20px;
  padding: 8px;
}

.sort-item {
  background: white;
  border: 2px solid #f0f2f5;
  border-radius: 16px;
  cursor: move;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  min-width: 180px;
  flex: 0 0 auto;
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.06),
    0 0 0 1px rgba(0, 0, 0, 0.02);

  &:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    transform: translateY(-4px) scale(1.02);
    border-color: var(--primary-light);

    .sort-icon {
      transform: rotate(5deg) scale(1.1);
    }
  }

  &.dragging {
    opacity: 0.3;
    transform: scale(0.95);
    box-shadow: none;

    .sort-card-inner {
      filter: blur(1px);
    }
  }

  &.drag-over {
    &::before {
      content: '';
      position: absolute;
      right: -12px;
      top: 20%;
      bottom: 20%;
      width: 5px;
      background: linear-gradient(
        180deg,
        transparent 0%,
        var(--primary-color) 20%,
        var(--primary-light) 50%,
        var(--primary-color) 80%,
        transparent 100%
      );
      border-radius: 10px;
      box-shadow:
        0 0 20px rgba(255, 107, 53, 0.5),
        0 0 40px rgba(255, 107, 53, 0.3);
      animation: glow 1s ease-in-out infinite;
    }

    .sort-card-inner {
      transform: scale(1.02);
    }
  }
}

@keyframes glow {
  0%,
  100% {
    opacity: 1;
    box-shadow:
      0 0 20px rgba(255, 107, 53, 0.5),
      0 0 40px rgba(255, 107, 53, 0.3);
  }
  50% {
    opacity: 0.8;
    box-shadow:
      0 0 30px rgba(255, 107, 53, 0.7),
      0 0 60px rgba(255, 107, 53, 0.4);
  }
}

.sort-card-inner {
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  position: relative;
}

.sort-icon {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;
  box-shadow:
    0 4px 12px rgba(0, 0, 0, 0.1),
    inset 0 -2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    transition: left 0.5s;
  }

  span {
    color: white;
    font-size: 20px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    position: relative;
    z-index: 1;
  }
}

.sort-item:hover .sort-icon::before {
  left: 100%;
}

.sort-content {
  text-align: center;
  flex: 1;
}

.sort-name {
  font-weight: 600;
  color: var(--text-heading);
  font-size: 15px;
  margin-bottom: 10px;
  line-height: 1.4;
  min-height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sort-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;

  .badge-number {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    background: linear-gradient(135deg, #f0f2f5 0%, #e8ebef 100%);
    border-radius: 50%;
    font-size: 14px;
    font-weight: 600;
    color: var(--text-subtitle);
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.06);
  }
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
