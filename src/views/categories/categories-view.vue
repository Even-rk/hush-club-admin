<template>
  <!-- 商品分类页面 -->
  <div id="categories" class="page active">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="page-title">商品分类</div>
      <div class="page-actions">
        <button class="btn btn-primary">新增分类</button>
      </div>
    </div>

    <!-- 分类列表 -->
    <div class="content-card">
      <div class="card-header">
        <div class="card-title">分类列表</div>
        <div class="card-actions">
          <input type="text" class="form-input" placeholder="搜索分类..." />
        </div>
      </div>
      <div class="card-body">
        <table class="data-table">
          <thead>
            <tr>
              <th>分类名称</th>
              <th>商品数量</th>
              <th>排序</th>
              <th>状态</th>
              <th>创建时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>咖啡饮品</td>
              <td>12</td>
              <td>1</td>
              <td>
                <span class="status-badge status-success">启用</span>
              </td>
              <td>2024-01-15</td>
              <td>
                <div class="action-buttons">
                  <button class="btn btn-sm btn-outline">编辑</button>
                  <button class="btn btn-sm btn-danger">删除</button>
                </div>
              </td>
            </tr>
            <tr>
              <td>茶饮</td>
              <td>8</td>
              <td>2</td>
              <td>
                <span class="status-badge status-success">启用</span>
              </td>
              <td>2024-01-15</td>
              <td>
                <div class="action-buttons">
                  <button class="btn btn-sm btn-outline">编辑</button>
                  <button class="btn btn-sm btn-danger">删除</button>
                </div>
              </td>
            </tr>
            <tr>
              <td>甜点</td>
              <td>6</td>
              <td>3</td>
              <td>
                <span class="status-badge status-warning">禁用</span>
              </td>
              <td>2024-01-10</td>
              <td>
                <div class="action-buttons">
                  <button class="btn btn-sm btn-outline">编辑</button>
                  <button class="btn btn-sm btn-danger">删除</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 商品分类页面逻辑
</script>
