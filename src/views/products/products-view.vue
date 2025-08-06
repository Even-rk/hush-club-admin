<template>
  <!-- 商品管理页面 -->
  <div class="content-card">
    <div class="card-header">
      <div class="card-title">商品管理</div>
      <button class="btn btn-primary" @click="openProductModal">+ 新增商品</button>
    </div>
    <div class="card-body">
      <!-- 筛选器 -->
      <div class="filters">
        <div class="filter-item">
          <label class="filter-label">商品分类:</label>
          <cool-select
            v-model="selectedCategory"
            :options="categoryOptions"
            class="filter-select"
            placeholder="全部分类"
          />
        </div>
        <div class="filter-item">
          <label class="filter-label">商品状态:</label>
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
            placeholder="搜索商品名称"
          />
          <button class="btn btn-secondary" @click="resetProducts">重置</button>
          <button class="btn btn-primary" @click="searchProducts">搜索</button>
        </div>
      </div>

      <!-- 商品列表 -->
      <data-table
        :data="productList"
        :columns="productColumns"
        :actions="productActions"
        :loading="loading"
        row-key="id"
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

  <product-modal
    :visible="productModalVisible"
    :mode="productModalMode"
    :product-data="productModalData"
    @close="closeProductModal"
  />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { reqGetAllCategory, reqGetProductList } from '@/api/supabase'
import { Product, TableColumn, TableAction } from '@/types/supabase'
import DataTable from '@/components/data-table.vue'
import ProductModal from '@/components/product-modal.vue'
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
const searchProducts = async () => {
  loading.value = true
  try {
    // 查商品
    productList.value = await reqGetProductList({
      category_id: selectedCategory.value,
      status: selectedStatus.value,
      search: searchQuery.value
    })
  } finally {
    loading.value = false
  }
}

// 重置商品
const resetProducts = () => {
  selectedCategory.value = 0
  selectedStatus.value = ''
  searchQuery.value = ''
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
  console.log('编辑商品:', product)
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

.product-image {
  img {
    width: 50px;
    height: 50px;
    object-fit: contain;
    border-radius: 6px;
  }

  .no-image {
    width: 50px;
    height: 50px;
    background: var(--bg-secondary);
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    color: var(--text-secondary);
  }
}

.product-info {
  .product-name {
    font-weight: 500;
    color: var(--text-primary);
  }

  .product-category {
    font-size: 12px;
    color: var(--text-secondary);
    margin-top: 2px;
  }
}
</style>
