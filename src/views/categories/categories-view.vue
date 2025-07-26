<template>
  <div class="page">
    <div class="content-card">
      <div class="card-header">
        <div class="card-title">分类管理</div>
        <div class="card-actions">
          <button class="btn btn-primary" onclick="openCategoryModal()">+ 添加分类</button>
        </div>
      </div>
      <div class="card-body">
        <!-- 分类统计 -->
        <div class="stats-container">
          <div class="stat-card stat-info">
            <div class="stat-number">
              {{ categoryList.length }}
            </div>
            <div class="stat-label">分类总数</div>
          </div>
          <div class="stat-card stat-success">
            <div class="stat-number">
              {{ categoryList.filter(item => item.status === 'active').length }}
            </div>
            <div class="stat-label">启用分类</div>
          </div>
          <div class="stat-card stat-error">
            <div class="stat-number">2</div>
            <div class="stat-label">禁用分类</div>
          </div>
        </div>

        <!-- 搜索和筛选 -->
        <div class="search-bar">
          <input type="text" class="search-input" placeholder="搜索分类名称..." />
          <button class="btn btn-secondary">🔍 搜索</button>
        </div>

        <div class="filters">
          <div class="filter-item">
            <label class="filter-label">状态:</label>
            <select class="form-select filter-select">
              <option>全部状态</option>
              <option>已启用</option>
              <option>已禁用</option>
            </select>
          </div>
          <div class="filter-item">
            <label class="filter-label">排序:</label>
            <select class="form-select filter-select">
              <option>按创建时间</option>
              <option>按名称排序</option>
              <option>按商品数量</option>
            </select>
          </div>
        </div>

        <!-- 分类列表 -->
        <table class="data-table">
          <thead>
            <tr>
              <th>分类名称</th>
              <th>关联商品</th>
              <th>排序</th>
              <th>状态</th>
              <th>创建时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in categoryList" :key="item.id">
              <td>{{ item.category_name }}</td>
              <td>{{ item.product_count }}</td>
              <td>{{ item.sort_order }}</td>
              <td>
                <span
                  class="status-badge"
                  :class="{
                    'status-success': item.status === 'active',
                    'status-error': item.status === 'inactive'
                  }"
                >
                  {{ item.status === 'active' ? '已启用' : '已禁用' }}
                </span>
              </td>
              <td>{{ formatDate(item.created_at) }}</td>
              <td>
                <button class="btn btn-secondary btn-sm" @click="editCategory(item)">编辑</button>
                <button class="btn btn-warning btn-sm">禁用</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 分类排序管理 -->
    <div class="content-card">
      <div class="card-header">
        <div class="card-title">分类排序管理</div>
        <div class="card-subtitle">调整分类在小程序中的显示顺序</div>
      </div>
      <div class="card-body">
        <div class="sort-container">
          <div
            v-for="(item, index) in categoryList"
            :key="item.id"
            class="sort-card sort-info"
            :class="{
              'sort-warning': index % 1 === 0,
              'sort-success': index % 2 === 0,
              'sort-primary': index % 3 === 0,
              'sort-default': index % 4 === 0
            }"
          >
            <div class="sort-content">
              <div>
                <div class="sort-name">{{ item.category_name }}</div>
                <div class="sort-order">排序: {{ item.sort_order }}</div>
              </div>
            </div>
            <div class="sort-actions">
              <button class="btn btn-secondary btn-sm">↑ 上移</button>
              <button class="btn btn-secondary btn-sm">↓ 下移</button>
            </div>
          </div>
        </div>

        <div class="save-container">
          <button class="btn btn-primary save-button">保存排序</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ProductCategory } from '@/types/supabase'
import { onMounted, ref } from 'vue'
import { reqGetAllCategory } from '@/api/supabase'
import { formatDate } from '@/utils/format'

// 商品分类页面逻辑
const categoryList = ref<ProductCategory[]>([])

onMounted(async () => {
  // 获取分类列表
  categoryList.value = await reqGetAllCategory()
})

// 编辑分类
const editCategory = (item: ProductCategory) => {
  console.log(item)
}
</script>

<style scoped lang="scss">
.stats-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;

  .stat-card {
    padding: 16px;
    border-radius: var(--radius);
    text-align: center;

    &.stat-info {
      background: rgba(33, 150, 243, 0.1);
    }

    &.stat-success {
      background: rgba(76, 175, 80, 0.1);
    }

    &.stat-error {
      background: rgba(244, 67, 54, 0.1);
    }

    .stat-number {
      font-size: 20px;
      font-weight: 600;
      color: var(--info-color);
    }

    &.stat-success .stat-number {
      color: var(--success-color);
    }

    &.stat-error .stat-number {
      color: var(--error-color);
    }

    .stat-label {
      font-size: 12px;
      color: var(--text-secondary);
    }
  }
}

.card-subtitle {
  color: var(--text-secondary);
  font-size: 14px;
}

.sort-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;

  .sort-card {
    border: 2px solid var(--info-color);
    border-radius: var(--radius);
    padding: 16px;
    background: rgba(33, 150, 243, 0.05);
    cursor: move;

    &.sort-warning {
      border: 2px solid var(--warning-color);
      background: rgba(255, 193, 7, 0.05);
    }

    &.sort-success {
      border: 2px solid var(--success-color);
      background: rgba(76, 175, 80, 0.05);
    }

    &.sort-primary {
      border: 2px solid var(--primary-color);
      background: var(--secondary-color);
    }

    &.sort-default {
      border: 2px solid var(--border-color);
      background: var(--bg-gray);
    }

    .sort-content {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 8px;

      > div {
        .sort-name {
          font-weight: 600;
        }

        .sort-order {
          font-size: 12px;
          color: var(--text-secondary);
        }
      }
    }

    .sort-actions {
      display: flex;
      gap: 8px;
    }
  }
}

.save-container {
  text-align: center;
  margin-top: 20px;

  .save-button {
    padding: 12px 32px;
    font-size: 16px;
  }
}
</style>
