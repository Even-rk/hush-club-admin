<template>
  <!-- 商品管理页面 -->
  <div class="page">
    <div class="content-card">
      <div class="card-header">
        <div class="card-title">商品管理</div>
        <div class="card-actions">
          <button class="btn btn-primary" @click="openProductModal()">+ 添加商品</button>
        </div>
      </div>
      <div class="card-body">
        <!-- 搜索和筛选 -->
        <div class="search-bar">
          <input type="text" class="search-input" placeholder="搜索商品名称..." />
          <button class="btn btn-secondary">🔍 搜索</button>
        </div>

        <div class="filters">
          <div class="filter-item">
            <label class="filter-label">分类:</label>
            <select class="form-select filter-select">
              <option>全部分类</option>
              <option>意式咖啡</option>
              <option>美式咖啡</option>
              <option>拿铁系列</option>
              <option>卡布奇诺</option>
            </select>
          </div>
          <div class="filter-item">
            <label class="filter-label">状态:</label>
            <select class="form-select filter-select">
              <option>全部状态</option>
              <option>上架中</option>
              <option>已下架</option>
            </select>
          </div>
        </div>

        <table class="data-table">
          <thead>
            <tr>
              <th>商品图片</th>
              <th>商品名称</th>
              <th>分类</th>
              <th>普通会员价格</th>
              <th>银牌会员价格</th>
              <th>金牌会员价格</th>
              <th>状态</th>
              <th>销量</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in productList" :key="product.id">
              <td>
                <div class="products-name">美式</div>
                <img v-if="product.image_url" :src="product.image_url" alt="商品图片" />
              </td>
              <td>{{ product.product_name }}</td>
              <td>{{ product.category_name }}</td>
              <td>¥{{ product.normal_member_price }}</td>
              <td>¥{{ product.silver_member_price }}</td>
              <td>¥{{ product.gold_member_price }}</td>
              <td>
                <span
                  class="status-badge"
                  :class="{
                    'status-success': product.status === 'active',
                    'status-danger': product.status === 'inactive'
                  }"
                >
                  {{ product.status === 'active' ? '上架中' : '已下架' }}
                </span>
              </td>
              <td>{{ product.sales_count }}</td>
              <td>
                <button class="btn btn-secondary btn-sm" @click="editProduct(product)">编辑</button>
                <button
                  class="btn btn-sm"
                  :class="{
                    'btn-warning': product.status === 'active',
                    'btn-success': product.status === 'inactive'
                  }"
                  @click="productStatus(product.id)"
                >
                  {{ product.status === 'active' ? '下架' : '上架' }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reqGetProductList } from '@/api/supabase'
import { Product } from '@/types/supabase'
import { onMounted, ref } from 'vue'

// 打开商品弹窗
const openProductModal = () => {
  console.log('openProductModal')
}

// 编辑商品
const editProduct = (product: Product) => {
  console.log('editProduct', product)
}

const productStatus = (id: number) => {
  console.log('productStatus', id)
}

const productList = ref<Product[]>([])
onMounted(async () => {
  productList.value = await reqGetProductList()
})
</script>

<style lang="scss">
.products-name {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #ff6b35, #e55a2b);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 12px;
}
</style>
