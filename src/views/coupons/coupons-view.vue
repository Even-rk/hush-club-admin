<template>
  <!-- 优惠券管理页面 -->
  <div class="page">
    <div class="content-card">
      <div class="card-header">
        <div class="card-title">优惠券管理</div>
        <div class="card-actions">
          <button class="btn btn-primary">+ 创建优惠券</button>
        </div>
      </div>
      <div class="card-body">
        <!-- 优惠券统计 -->
        <div class="statsGrid">
          <div class="statCard statCardSuccess">
            <div class="statNumber statNumberSuccess">12</div>
            <div class="statLabel">优惠券模板</div>
          </div>
          <div class="statCard statCardWarning">
            <div class="statNumber statNumberWarning">8</div>
            <div class="statLabel">正常状态</div>
          </div>
          <div class="statCard statCardInfo">
            <div class="statNumber statNumberInfo">4</div>
            <div class="statLabel">已禁用</div>
          </div>
          <div class="statCard statCardError">
            <div class="statNumber statNumberError">1,456</div>
            <div class="statLabel">累计发送</div>
          </div>
        </div>

        <!-- 优惠券列表 -->
        <div class="filters">
          <div class="filter-item">
            <label class="filter-label">优惠券状态:</label>
            <select class="form-select filter-select">
              <option>全部状态</option>
              <option>正常</option>
              <option>已使用</option>
              <option>已过期</option>
              <option>已禁用</option>
            </select>
          </div>
          <div class="filter-item">
            <label class="filter-label">优惠类型:</label>
            <select class="form-select filter-select">
              <option>全部类型</option>
              <option>满减券</option>
              <option>折扣券</option>
              <option>免费券</option>
            </select>
          </div>
        </div>

        <table class="data-table">
          <thead>
            <tr>
              <th>优惠券名称</th>
              <th>优惠类型</th>
              <th>优惠内容</th>
              <th>使用门槛</th>
              <th>有效期</th>
              <th>状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>新用户专享券</td>
              <td>满减券</td>
              <td>满¥50减¥10</td>
              <td>¥50</td>
              <td>2024-12-31</td>
              <td>
                <span class="status-badge status-success">正常</span>
              </td>
              <td>
                <button class="btn btn-secondary btn-sm" onclick="editCoupon(this)">编辑</button>
                <button class="btn btn-warning btn-sm">禁用</button>
              </td>
            </tr>
            <tr>
              <td>会员专享券</td>
              <td>满减券</td>
              <td>满¥100减¥20</td>
              <td>¥100</td>
              <td>2024-12-31</td>
              <td>
                <span class="status-badge status-success">正常</span>
              </td>
              <td>
                <button class="btn btn-secondary btn-sm" onclick="editCoupon(this)">编辑</button>
                <button class="btn btn-warning btn-sm">禁用</button>
              </td>
            </tr>
            <tr>
              <td>周末特惠券</td>
              <td>折扣券</td>
              <td>8.8折</td>
              <td>¥30</td>
              <td>2024-12-31</td>
              <td>
                <span class="status-badge status-success">正常</span>
              </td>
              <td>
                <button class="btn btn-secondary btn-sm" onclick="editCoupon(this)">编辑</button>
                <button class="btn btn-warning btn-sm">禁用</button>
              </td>
            </tr>
            <tr>
              <td>冬日暖身券</td>
              <td>免费券</td>
              <td>免费获得热饮一杯</td>
              <td>无门槛</td>
              <td>2024-02-29</td>
              <td>
                <span class="status-badge status-danger">已过期</span>
              </td>
              <td>
                <button class="btn btn-secondary btn-sm">查看</button>
                <button class="btn btn-danger btn-sm">删除</button>
              </td>
            </tr>
            <tr>
              <td>生日特惠券</td>
              <td>满减券</td>
              <td>满¥30减¥15</td>
              <td>¥30</td>
              <td>2024-12-15</td>
              <td>
                <span class="status-badge status-info">已使用</span>
              </td>
              <td>
                <button class="btn btn-secondary btn-sm">查看</button>
                <button class="btn btn-danger btn-sm">删除</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 优惠券页面逻辑
</script>

<style scoped>
/* 统计网格容器 */
.statsGrid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

/* 统计卡片基础样式 */
.statCard {
  padding: 16px;
  border-radius: var(--radius);
  text-align: center;
}

/* 不同类型的统计卡片背景色 */
.statCardSuccess {
  background: rgba(76, 175, 80, 0.1);
}

.statCardWarning {
  background: rgba(255, 193, 7, 0.1);
}

.statCardInfo {
  background: rgba(33, 150, 243, 0.1);
}

.statCardError {
  background: rgba(244, 67, 54, 0.1);
}

/* 统计数字样式 */
.statNumber {
  font-size: 20px;
  font-weight: 600;
}

.statNumberSuccess {
  color: var(--success-color);
}

.statNumberWarning {
  color: var(--warning-color);
}

.statNumberInfo {
  color: var(--info-color);
}

.statNumberError {
  color: var(--error-color);
}

/* 统计标签样式 */
.statLabel {
  font-size: 12px;
  color: var(--text-secondary);
}
</style>
