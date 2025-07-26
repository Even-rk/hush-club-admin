<template>
  <!-- 订单列表页面 -->
  <div id="orders" class="page active">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="page-title">订单列表</div>
      <div class="page-actions">
        <button class="btn btn-outline">导出订单</button>
      </div>
    </div>

    <!-- 筛选条件 -->
    <div class="content-card">
      <div class="card-body">
        <div class="filter-row">
          <div class="filter-item">
            <label>订单状态</label>
            <select class="form-select">
              <option value="">全部状态</option>
              <option value="pending">待确认</option>
              <option value="processing">制作中</option>
              <option value="completed">已完成</option>
              <option value="cancelled">已取消</option>
            </select>
          </div>
          <div class="filter-item">
            <label>时间范围</label>
            <input type="date" class="form-input" />
          </div>
          <div class="filter-item">
            <label>订单号</label>
            <input type="text" class="form-input" placeholder="输入订单号" />
          </div>
          <div class="filter-item">
            <button class="btn btn-primary">搜索</button>
            <button class="btn btn-outline">重置</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 订单列表 -->
    <div class="content-card">
      <div class="card-header">
        <div class="card-title">订单列表</div>
        <div class="card-actions">
          <span class="text-muted">共 156 条订单</span>
        </div>
      </div>
      <div class="card-body">
        <table class="data-table">
          <thead>
            <tr>
              <th>订单号</th>
              <th>客户信息</th>
              <th>商品详情</th>
              <th>金额</th>
              <th>状态</th>
              <th>下单时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>HU20241201001</td>
              <td>
                <div>张先生</div>
                <div class="text-muted">138****8888</div>
              </td>
              <td>
                <div>美式咖啡 x2</div>
                <div class="text-muted">拿铁 x1</div>
              </td>
              <td>¥45.60</td>
              <td>
                <span class="status-badge status-success">已完成</span>
              </td>
              <td>2024-12-01 14:30</td>
              <td>
                <div class="action-buttons">
                  <button class="btn btn-sm btn-outline">查看</button>
                  <button class="btn btn-sm btn-primary">确认</button>
                </div>
              </td>
            </tr>
            <tr>
              <td>HU20241201002</td>
              <td>
                <div>李女士</div>
                <div class="text-muted">139****9999</div>
              </td>
              <td>
                <div>卡布奇诺 x1</div>
              </td>
              <td>¥18.70</td>
              <td>
                <span class="status-badge status-warning">制作中</span>
              </td>
              <td>2024-12-01 14:25</td>
              <td>
                <div class="action-buttons">
                  <button class="btn btn-sm btn-outline">查看</button>
                  <button class="btn btn-sm btn-success">完成</button>
                </div>
              </td>
            </tr>
            <tr>
              <td>HU20241201003</td>
              <td>
                <div>王先生</div>
                <div class="text-muted">137****7777</div>
              </td>
              <td>
                <div>焦糖玛奇朵 x1</div>
                <div class="text-muted">提拉米苏 x1</div>
              </td>
              <td>¥32.50</td>
              <td>
                <span class="status-badge status-info">待确认</span>
              </td>
              <td>2024-12-01 14:20</td>
              <td>
                <div class="action-buttons">
                  <button class="btn btn-sm btn-outline">查看</button>
                  <button class="btn btn-sm btn-primary">确认</button>
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
// 订单列表页面逻辑
</script>
