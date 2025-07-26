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
            <tr>
              <td>
                <div class="products-name">美式</div>
              </td>
              <td>经典美式咖啡</td>
              <td>美式咖啡</td>
              <td>¥18.00</td>
              <td>¥15.30</td>
              <td>¥12.60</td>
              <td>
                <span class="status-badge status-success">上架中</span>
              </td>
              <td>1,256</td>
              <td>
                <button class="btn btn-secondary btn-sm" @click="editProduct()">编辑</button>
                <button class="btn btn-warning btn-sm">下架</button>
              </td>
            </tr>
            <tr>
              <td>
                <div class="products-name">拿铁</div>
              </td>
              <td>香草拿铁</td>
              <td>拿铁系列</td>
              <td>¥25.00</td>
              <td>¥21.25</td>
              <td>¥17.75</td>
              <td>
                <span class="status-badge status-success">上架中</span>
              </td>
              <td>892</td>
              <td>
                <button class="btn btn-secondary btn-sm" @click="editProduct()">编辑</button>
                <button class="btn btn-warning btn-sm">下架</button>
              </td>
            </tr>
            <tr>
              <td>
                <div class="products-name">卡布</div>
              </td>
              <td>经典卡布奇诺</td>
              <td>卡布奇诺</td>
              <td>¥22.00</td>
              <td>¥18.70</td>
              <td>¥15.20</td>
              <td>
                <span class="status-badge status-danger">已下架</span>
              </td>
              <td>734</td>
              <td>
                <button class="btn btn-secondary btn-sm" @click="editProduct()">编辑</button>
                <button class="btn btn-success btn-sm">上架</button>
              </td>
            </tr>
            <tr>
              <td>
                <div class="products-name">冰美</div>
              </td>
              <td>冰美式咖啡</td>
              <td>美式咖啡</td>
              <td>¥20.00</td>
              <td>¥17.00</td>
              <td>¥14.00</td>
              <td>
                <span class="status-badge status-danger">已下架</span>
              </td>
              <td>342</td>
              <td>
                <button class="btn btn-secondary btn-sm" @click="editProduct()">编辑</button>
                <button class="btn btn-success btn-sm">上架</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 打开商品弹窗
const openProductModal = () => {
  console.log('openProductModal')
}

// 编辑商品
const editProduct = () => {
  console.log('editProduct')
}
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
