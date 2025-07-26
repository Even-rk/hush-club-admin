<template>
  <!-- 优惠券页面 -->
  <div id="coupons" class="page active">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="page-title">优惠券管理</div>
      <div class="page-actions">
        <button class="btn btn-primary">新增优惠券</button>
      </div>
    </div>

    <!-- 筛选条件 -->
    <div class="content-card">
      <div class="card-body">
        <div class="filter-row">
          <div class="filter-item">
            <label>优惠券类型</label>
            <select class="form-select">
              <option value="">全部类型</option>
              <option value="discount">折扣券</option>
              <option value="cash">现金券</option>
              <option value="free">免费券</option>
            </select>
          </div>
          <div class="filter-item">
            <label>状态</label>
            <select class="form-select">
              <option value="">全部状态</option>
              <option value="active">生效中</option>
              <option value="expired">已过期</option>
              <option value="draft">草稿</option>
            </select>
          </div>
          <div class="filter-item">
            <label>创建时间</label>
            <input type="date" class="form-input" />
          </div>
          <div class="filter-item">
            <button class="btn btn-primary">搜索</button>
            <button class="btn btn-outline">重置</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 优惠券列表 -->
    <div class="content-card">
      <div class="card-header">
        <div class="card-title">优惠券列表</div>
        <div class="card-actions">
          <span class="text-muted">共 23 张优惠券</span>
        </div>
      </div>
      <div class="card-body">
        <table class="data-table">
          <thead>
            <tr>
              <th>优惠券名称</th>
              <th>类型</th>
              <th>优惠内容</th>
              <th>使用条件</th>
              <th>发放数量</th>
              <th>已使用</th>
              <th>有效期</th>
              <th>状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>新用户专享券</td>
              <td>
                <span class="status-badge status-primary">折扣券</span>
              </td>
              <td>8折优惠</td>
              <td>满30元可用</td>
              <td>1000</td>
              <td>156</td>
              <td>2024-12-31</td>
              <td>
                <span class="status-badge status-success">生效中</span>
              </td>
              <td>
                <div class="action-buttons">
                  <button class="btn btn-sm btn-outline">编辑</button>
                  <button class="btn btn-sm btn-danger">删除</button>
                </div>
              </td>
            </tr>
            <tr>
              <td>生日特惠券</td>
              <td>
                <span class="status-badge status-warning">现金券</span>
              </td>
              <td>减10元</td>
              <td>满50元可用</td>
              <td>500</td>
              <td>89</td>
              <td>2024-12-31</td>
              <td>
                <span class="status-badge status-success">生效中</span>
              </td>
              <td>
                <div class="action-buttons">
                  <button class="btn btn-sm btn-outline">编辑</button>
                  <button class="btn btn-sm btn-danger">删除</button>
                </div>
              </td>
            </tr>
            <tr>
              <td>会员专享券</td>
              <td>
                <span class="status-badge status-info">免费券</span>
              </td>
              <td>免费升级大杯</td>
              <td>购买任意饮品</td>
              <td>200</td>
              <td>45</td>
              <td>2024-11-30</td>
              <td>
                <span class="status-badge status-warning">已过期</span>
              </td>
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

    <!-- 优惠券统计 -->
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 24px; margin-top: 24px">
      <div class="content-card">
        <div class="card-header">
          <div class="card-title">优惠券使用统计</div>
        </div>
        <div class="card-body">
          <div class="chart-placeholder">📊 优惠券使用统计图表</div>
        </div>
      </div>
      <div class="content-card">
        <div class="card-header">
          <div class="card-title">优惠券类型分布</div>
        </div>
        <div class="card-body">
          <div class="chart-placeholder">📈 优惠券类型分布图表</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 优惠券页面逻辑
</script>