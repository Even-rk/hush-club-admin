<template>
  <!-- 商品管理页面 -->
  <div class="product-management-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">
          <span class="title-icon">☕</span>
          商品管理
        </h1>
        <p class="page-subtitle">管理店铺所有商品信息，包括价格、库存和上下架状态</p>
      </div>
      <button class="btn btn-primary btn-with-icon" @click="openProductModal">
        <span class="btn-icon">✨</span>
        新增商品
      </button>
    </div>

    <!-- 商品列表卡片 -->
    <div class="content-card">
      <div class="card-header">
        <div class="card-title">商品列表</div>
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
              placeholder="搜索商品名称、编号或分类..."
              @change="queryChange"
            />
            <button class="search-btn" @click="searchProducts()">搜索</button>
          </div>

          <div class="filter-group">
            <div class="filter-item-enhanced">
              <cool-select
                v-model="selectedCategory"
                :options="categoryOptions"
                placeholder="全部分类"
                @change="searchProducts()"
              />
            </div>
            <div class="filter-item-enhanced">
              <cool-select
                v-model="selectedStatus"
                :options="statusOptions"
                placeholder="全部状态"
                @change="searchProducts()"
              />
            </div>
            <button class="btn btn-secondary" @click="resetProducts">重置筛选</button>
          </div>
        </div>

        <!-- 商品列表 -->
        <data-table
          :data="productList"
          :columns="productColumns"
          :actions="productActions"
          :loading="loading"
          row-key="id"
          class="product-table"
        >
          <!-- 商品图片插槽 -->
          <template #image="{ value, row }">
            <div class="product-image">
              <img v-if="value" :src="String(value)" :alt="row.product_name" />
              <div v-else class="no-image">无图片</div>
            </div>
          </template>

          <!-- 商品名称插槽 -->
          <template #name="{ row }">
            <div class="product-info">
              <div class="product-name">{{ row.product_name }}</div>
              <div class="product-category">{{ row.category_name }}</div>
            </div>
          </template>
        </data-table>
      </div>
    </div>
  </div>

  <template v-if="productModalVisible">
    <product-modal
      :visible="productModalVisible"
      :mode="productModalMode"
      :product-data="productModalData"
      @close="closeProductModal"
    />
  </template>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { ref, onMounted } from 'vue'
import { reqGetAllCategory, reqGetProductList } from '@/api/supabase'
import { Product, TableColumn, TableAction } from '@/types/supabase'
import DataTable from '@/components/data-table.vue'
import ProductModal from './components/product-modal.vue'
import CoolSelect from '@/components/cool-select.vue'

// 数据状态
const productList = ref<Product[]>([])
const loading = ref(false)

// 筛选器状态
const selectedCategory = ref(0)
const selectedStatus = ref('')
const searchQuery = ref('')

// 分类选项
const categoryOptions = ref([] as { label: string; value: number }[])

// 状态选项
const statusOptions = [
  { label: '上架中', value: 'active' },
  { label: '已下架', value: 'inactive' }
]

// 搜索商品
const searchProducts = async (params?: {
  category_id?: number
  status?: string
  search?: string
}) => {
  loading.value = true
  try {
    // 查商品
    productList.value = await reqGetProductList({
      category_id: params?.category_id || selectedCategory.value,
      status: params?.status || selectedStatus.value,
      search: params?.search || searchQuery.value
    })
  } finally {
    loading.value = false
  }
}

// 重置商品
const resetProducts = () => {
  if (searchQuery.value || selectedCategory.value || selectedStatus.value) {
    // 重置后查询
    searchProducts({
      category_id: 0,
      status: '',
      search: ''
    })
  } else {
    ElMessage.warning('没有筛选条件')
  }
  selectedCategory.value = 0
  selectedStatus.value = ''
  searchQuery.value = ''
}

// 查询变化
const queryChange = () => {
  if (!searchQuery.value) {
    // 内容为空，查询所有
    searchProducts()
  }
}

// 商品弹窗
const productModalVisible = ref(false)
// 商品弹窗模式
const productModalMode = ref<'view' | 'edit' | 'add'>('view')
// 商品弹窗数据
const productModalData = ref({} as Product)
// 关闭商品弹窗
const closeProductModal = () => {
  productModalVisible.value = false
}

// 打开商品弹窗
const openProductModal = () => {
  productModalVisible.value = true
  productModalMode.value = 'add'
}

// 表格列配置
const productColumns: TableColumn<Product>[] = [
  { key: 'image_url', title: '商品图片', slot: 'image' },
  { key: 'product_name', title: '商品名称', slot: 'name' },
  { key: 'normal_member_price', title: '普通会员价格', type: 'price' },
  { key: 'silver_member_price', title: '银牌会员价格', type: 'price' },
  { key: 'gold_member_price', title: '金牌会员价格', type: 'price' },
  {
    key: 'status',
    title: '状态',
    type: 'status',
    statusMap: {
      active: { text: '上架中', className: 'status-success' },
      inactive: { text: '已下架', className: 'status-error' }
    }
  },
  { key: 'sales_count', title: '销量' }
]

// 操作函数
const editProduct = (product: Product) => {
  productModalData.value = product
  productModalMode.value = 'edit'
  productModalVisible.value = true
}

const toggleProductStatus = (product: Product) => {
  console.log('切换商品状态:', product)
  // 这里实际应该调用API来切换状态
}

// 表格操作配置
const productActions: TableAction<Product>[] = [
  {
    text: '编辑',
    type: 'secondary',
    onClick: product => editProduct(product)
  },
  {
    text: '上架',
    type: 'success',
    visible: product => product.status === 'inactive',
    onClick: product => toggleProductStatus(product)
  },
  {
    text: '下架',
    type: 'warning',
    visible: product => product.status === 'active',
    onClick: product => toggleProductStatus(product)
  }
]

// 加载数据
onMounted(async () => {
  loading.value = true
  try {
    // 查商品
    productList.value = await reqGetProductList()
    // 查分类
    const categoryList = await reqGetAllCategory()
    categoryOptions.value = categoryList.map(item => ({
      label: item.category_name,
      value: item.id
    }))
  } finally {
    loading.value = false
  }
})
</script>

<style lang="scss" scoped>
/* 商品管理页面 */
.product-management-page {
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

/* 商品图片和信息 */
.product-image {
  img {
    width: 60px;
    height: 60px;
    object-fit: contain;
    border-radius: var(--radius);
    border: 1px solid var(--border-medium);
  }

  .no-image {
    width: 60px;
    height: 60px;
    background: var(--bg-light);
    border-radius: var(--radius);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    color: var(--text-muted);
    border: 1px dashed var(--border-medium);
  }
}

.product-info {
  .product-name {
    font-weight: 600;
    color: var(--text-heading);
    font-size: 14px;
  }

  .product-category {
    font-size: 12px;
    color: var(--text-subtitle);
    margin-top: 4px;
  }
}

/* 商品表格样式 */
.product-table {
  :deep(.data-table) {
    border: 1px solid var(--border-medium);
    border-radius: var(--radius);
    overflow: hidden;
  }
}
</style>
