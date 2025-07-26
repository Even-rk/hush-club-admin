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
        <div
          style="
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 16px;
            margin-bottom: 24px;
          "
        >
          <div
            style="
              background: rgba(33, 150, 243, 0.1);
              padding: 16px;
              border-radius: var(--radius);
              text-align: center;
            "
          >
            <div style="font-size: 20px; font-weight: 600; color: var(--info-color)">8</div>
            <div style="font-size: 12px; color: var(--text-secondary)">分类总数</div>
          </div>
          <div
            style="
              background: rgba(76, 175, 80, 0.1);
              padding: 16px;
              border-radius: var(--radius);
              text-align: center;
            "
          >
            <div style="font-size: 20px; font-weight: 600; color: var(--success-color)">6</div>
            <div style="font-size: 12px; color: var(--text-secondary)">启用分类</div>
          </div>
          <div
            style="
              background: rgba(255, 193, 7, 0.1);
              padding: 16px;
              border-radius: var(--radius);
              text-align: center;
            "
          >
            <div style="font-size: 20px; font-weight: 600; color: var(--warning-color)">45</div>
            <div style="font-size: 12px; color: var(--text-secondary)">关联商品</div>
          </div>
          <div
            style="
              background: rgba(244, 67, 54, 0.1);
              padding: 16px;
              border-radius: var(--radius);
              text-align: center;
            "
          >
            <div style="font-size: 20px; font-weight: 600; color: var(--error-color)">2</div>
            <div style="font-size: 12px; color: var(--text-secondary)">禁用分类</div>
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
            <tr>
              <td>美式咖啡</td>
              <td>12</td>
              <td>1</td>
              <td>
                <span class="status-badge status-success">已启用</span>
              </td>
              <td>2023-05-20</td>
              <td>
                <button class="btn btn-secondary btn-sm" onclick="editCategory(this)">编辑</button>
                <button class="btn btn-warning btn-sm">禁用</button>
              </td>
            </tr>
            <tr>
              <td>拿铁系列</td>
              <td>8</td>
              <td>2</td>
              <td>
                <span class="status-badge status-success">已启用</span>
              </td>
              <td>2023-05-20</td>
              <td>
                <button class="btn btn-secondary btn-sm" onclick="editCategory(this)">编辑</button>
                <button class="btn btn-warning btn-sm">禁用</button>
              </td>
            </tr>
            <tr>
              <td>卡布奇诺</td>
              <td>6</td>
              <td>3</td>
              <td>
                <span class="status-badge status-success">已启用</span>
              </td>
              <td>2023-05-20</td>
              <td>
                <button class="btn btn-secondary btn-sm" onclick="editCategory(this)">编辑</button>
                <button class="btn btn-warning btn-sm">禁用</button>
              </td>
            </tr>
            <tr>
              <td>意式咖啡</td>
              <td>5</td>
              <td>4</td>
              <td>
                <span class="status-badge status-success">已启用</span>
              </td>
              <td>2023-05-20</td>
              <td>
                <button class="btn btn-secondary btn-sm" onclick="editCategory(this)">编辑</button>
                <button class="btn btn-warning btn-sm">禁用</button>
              </td>
            </tr>
            <tr>
              <td>冷萄咖啡</td>
              <td>7</td>
              <td>5</td>
              <td>
                <span class="status-badge status-success">已启用</span>
              </td>
              <td>2023-06-15</td>
              <td>
                <button class="btn btn-secondary btn-sm" onclick="editCategory(this)">编辑</button>
                <button class="btn btn-warning btn-sm">禁用</button>
              </td>
            </tr>
            <tr>
              <td>特调饮品</td>
              <td>4</td>
              <td>6</td>
              <td>
                <span class="status-badge status-success">已启用</span>
              </td>
              <td>2023-07-01</td>
              <td>
                <button class="btn btn-secondary btn-sm" onclick="editCategory(this)">编辑</button>
                <button class="btn btn-warning btn-sm">禁用</button>
              </td>
            </tr>
            <tr>
              <td>甜品配对</td>
              <td>3</td>
              <td>7</td>
              <td>
                <span class="status-badge status-danger">已禁用</span>
              </td>
              <td>2023-04-10</td>
              <td>
                <button class="btn btn-secondary btn-sm" onclick="editCategory(this)">编辑</button>
                <button class="btn btn-success btn-sm">启用</button>
              </td>
            </tr>
            <tr>
              <td>酒精饮品</td>
              <td>0</td>
              <td>8</td>
              <td>
                <span class="status-badge status-danger">已禁用</span>
              </td>
              <td>2023-03-15</td>
              <td>
                <button class="btn btn-secondary btn-sm" onclick="editCategory(this)">编辑</button>
                <button class="btn btn-success btn-sm">启用</button>
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
        <div style="color: var(--text-secondary); font-size: 14px">
          调整分类在小程序中的显示顺序
        </div>
      </div>
      <div class="card-body">
        <div
          style="
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 16px;
          "
        >
          <div
            style="
              border: 2px solid var(--info-color);
              border-radius: var(--radius);
              padding: 16px;
              background: rgba(33, 150, 243, 0.05);
              cursor: move;
            "
          >
            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px">
              <div>
                <div style="font-weight: 600">美式咖啡</div>
                <div style="font-size: 12px; color: var(--text-secondary)">排序: 1</div>
              </div>
            </div>
            <div style="display: flex; gap: 8px">
              <button class="btn btn-secondary btn-sm">↑ 上移</button>
              <button class="btn btn-secondary btn-sm">↓ 下移</button>
            </div>
          </div>

          <div
            style="
              border: 2px solid var(--warning-color);
              border-radius: var(--radius);
              padding: 16px;
              background: rgba(255, 193, 7, 0.05);
              cursor: move;
            "
          >
            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px">
              <div>
                <div style="font-weight: 600">拿铁系列</div>
                <div style="font-size: 12px; color: var(--text-secondary)">排序: 2</div>
              </div>
            </div>
            <div style="display: flex; gap: 8px">
              <button class="btn btn-secondary btn-sm">↑ 上移</button>
              <button class="btn btn-secondary btn-sm">↓ 下移</button>
            </div>
          </div>

          <div
            style="
              border: 2px solid var(--success-color);
              border-radius: var(--radius);
              padding: 16px;
              background: rgba(76, 175, 80, 0.05);
              cursor: move;
            "
          >
            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px">
              <div>
                <div style="font-weight: 600">卡布奇诺</div>
                <div style="font-size: 12px; color: var(--text-secondary)">排序: 3</div>
              </div>
            </div>
            <div style="display: flex; gap: 8px">
              <button class="btn btn-secondary btn-sm">↑ 上移</button>
              <button class="btn btn-secondary btn-sm">↓ 下移</button>
            </div>
          </div>

          <div
            style="
              border: 2px solid var(--primary-color);
              border-radius: var(--radius);
              padding: 16px;
              background: var(--secondary-color);
              cursor: move;
            "
          >
            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px">
              <div>
                <div style="font-weight: 600">意式咖啡</div>
                <div style="font-size: 12px; color: var(--text-secondary)">排序: 4</div>
              </div>
            </div>
            <div style="display: flex; gap: 8px">
              <button class="btn btn-secondary btn-sm">↑ 上移</button>
              <button class="btn btn-secondary btn-sm">↓ 下移</button>
            </div>
          </div>

          <div
            style="
              border: 2px solid var(--border-color);
              border-radius: var(--radius);
              padding: 16px;
              background: var(--bg-gray);
              cursor: move;
            "
          >
            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px">
              <div>
                <div style="font-weight: 600">冷萄咖啡</div>
                <div style="font-size: 12px; color: var(--text-secondary)">排序: 5</div>
              </div>
            </div>
            <div style="display: flex; gap: 8px">
              <button class="btn btn-secondary btn-sm">↑ 上移</button>
              <button class="btn btn-secondary btn-sm">↓ 下移</button>
            </div>
          </div>

          <div
            style="
              border: 2px solid var(--border-color);
              border-radius: var(--radius);
              padding: 16px;
              background: var(--bg-gray);
              cursor: move;
            "
          >
            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px">
              <div>
                <div style="font-weight: 600">特调饮品</div>
                <div style="font-size: 12px; color: var(--text-secondary)">排序: 6</div>
              </div>
            </div>
            <div style="display: flex; gap: 8px">
              <button class="btn btn-secondary btn-sm">↑ 上移</button>
              <button class="btn btn-secondary btn-sm">↓ 下移</button>
            </div>
          </div>
        </div>

        <div style="text-align: center; margin-top: 20px">
          <button class="btn btn-primary" style="padding: 12px 32px; font-size: 16px">
            保存排序
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 商品分类页面逻辑
</script>
