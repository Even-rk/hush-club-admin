<template>
  <!-- 数据概览页面 -->
  <div id="dashboard" class="page active">
    <!-- 统计卡片 -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-header">
          <div class="stat-title">今日营业额</div>
          <div class="stat-icon" style="background: var(--success-color)">💰</div>
        </div>
        <div class="stat-number">¥15,680</div>
        <div class="stat-trend trend-up">↗️ +12.5% 较昨日</div>
      </div>

      <div class="stat-card">
        <div class="stat-header">
          <div class="stat-title">今日订单</div>
          <div class="stat-icon" style="background: var(--info-color)">📋</div>
        </div>
        <div class="stat-number">168</div>
        <div class="stat-trend trend-up">↗️ +8.3% 较昨日</div>
      </div>

      <div class="stat-card">
        <div class="stat-header">
          <div class="stat-title">新增会员</div>
          <div class="stat-icon" style="background: var(--warning-color)">👥</div>
        </div>
        <div class="stat-number">28</div>
        <div class="stat-trend trend-down">↘️ -5.2% 较昨日</div>
      </div>

      <div class="stat-card">
        <div class="stat-header">
          <div class="stat-title">客单价</div>
          <div class="stat-icon" style="background: var(--primary-color)">💳</div>
        </div>
        <div class="stat-number">¥93.33</div>
        <div class="stat-trend trend-up">↗️ +3.8% 较昨日</div>
      </div>
    </div>

    <!-- 图表区域 -->
    <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 24px; margin-bottom: 24px">
      <div class="content-card">
        <div class="card-header">
          <div class="card-title">销售趋势</div>
          <div class="card-actions">
            <select class="form-select" style="min-width: 120px">
              <option>最近7天</option>
              <option>最近30天</option>
              <option>最近90天</option>
            </select>
          </div>
        </div>
        <div class="card-body">
          <div class="chart-placeholder">📈 销售趋势图表</div>
        </div>
      </div>

      <div class="content-card">
        <div class="card-header">
          <div class="card-title">热门商品</div>
        </div>
        <div class="card-body">
          <div style="display: flex; flex-direction: column; gap: 12px">
            <div
              style="
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 8px 0;
                border-bottom: 1px solid var(--border-color);
              "
            >
              <div>
                <div style="font-weight: 500">经典美式咖啡</div>
                <div style="font-size: 12px; color: var(--text-secondary)">销量: 89杯</div>
              </div>
              <div style="color: var(--primary-color); font-weight: 600">¥1,425</div>
            </div>
            <div
              style="
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 8px 0;
                border-bottom: 1px solid var(--border-color);
              "
            >
              <div>
                <div style="font-weight: 500">香草拿铁</div>
                <div style="font-size: 12px; color: var(--text-secondary)">销量: 67杯</div>
              </div>
              <div style="color: var(--primary-color); font-weight: 600">¥1,675</div>
            </div>
            <div
              style="
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 8px 0;
                border-bottom: 1px solid var(--border-color);
              "
            >
              <div>
                <div style="font-weight: 500">经典卡布奇诺</div>
                <div style="font-size: 12px; color: var(--text-secondary)">销量: 45杯</div>
              </div>
              <div style="color: var(--primary-color); font-weight: 600">¥990</div>
            </div>
            <div
              style="
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 8px 0;
              "
            >
              <div>
                <div style="font-weight: 500">焦糖玛奇朵</div>
                <div style="font-size: 12px; color: var(--text-secondary)">销量: 38杯</div>
              </div>
              <div style="color: var(--primary-color); font-weight: 600">¥1,064</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 最近订单 -->
    <div class="content-card">
      <div class="card-header">
        <div class="card-title">最近订单</div>
        <a href="#" class="btn btn-primary btn-sm">查看全部</a>
      </div>
      <div class="card-body">
        <table class="data-table">
          <thead>
            <tr>
              <th>订单号</th>
              <th>客户</th>
              <th>商品</th>
              <th>金额</th>
              <th>状态</th>
              <th>时间</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>HU20241201001</td>
              <td>张先生</td>
              <td>美式咖啡 x2, 拿铁 x1</td>
              <td>¥45.60</td>
              <td>
                <span class="status-badge status-success">已完成</span>
              </td>
              <td>14:30</td>
            </tr>
            <tr>
              <td>HU20241201002</td>
              <td>李女士</td>
              <td>卡布奇诺 x1</td>
              <td>¥18.70</td>
              <td>
                <span class="status-badge status-warning">制作中</span>
              </td>
              <td>14:25</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
