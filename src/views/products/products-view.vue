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
          <select class="form-select filter-select">
            <option>全部分类</option>
            <option>咖啡</option>
            <option>茶饮</option>
            <option>甜品</option>
          </select>
        </div>
        <div class="filter-item">
          <label class="filter-label">商品状态:</label>
          <select class="form-select filter-select">
            <option>全部状态</option>
            <option>上架中</option>
            <option>已下架</option>
          </select>
        </div>
        <div class="filter-item">
          <input type="text" class="form-control filter-search" placeholder="搜索商品名称" />
          <button class="btn btn-secondary">搜索</button>
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
import { reqGetProductList } from '@/api/supabase'
import { Product, TableColumn, TableAction } from '@/types/supabase'
import DataTable from '@/components/data-table.vue'
import ProductModal from '@/components/product-modal.vue'

// 数据状态
const productList = ref<Product[]>([])
const loading = ref(false)

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
    productList.value = await reqGetProductList()
    console.log(productList.value)
  } finally {
    loading.value = false
  }
})
</script>

<style lang="scss" scoped>
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
    background: var(--bg-gray);
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
