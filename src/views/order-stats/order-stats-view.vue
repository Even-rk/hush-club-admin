<template>
  <!-- 订单统计页面 -->
  <div id="order-stats" class="page active">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="page-title">订单统计</div>
      <div class="page-actions">
        <select class="form-select">
          <option>最近7天</option>
          <option>最近30天</option>
          <option>最近90天</option>
        </select>
      </div>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-header">
          <div class="stat-title">总订单数</div>
          <div class="stat-icon" style="background: var(--primary-color)">📋</div>
        </div>
        <div class="stat-number">1,234</div>
        <div class="stat-trend trend-up">↗️ +15.2% 较上期</div>
      </div>

      <div class="stat-card">
        <div class="stat-header">
          <div class="stat-title">完成订单</div>
          <div class="stat-icon" style="background: var(--success-color)">✅</div>
        </div>
        <div class="stat-number">1,156</div>
        <div class="stat-trend trend-up">↗️ +12.8% 较上期</div>
      </div>

      <div class="stat-card">
        <div class="stat-header">
          <div class="stat-title">取消订单</div>
          <div class="stat-icon" style="background: var(--danger-color)">❌</div>
        </div>
        <div class="stat-number">78</div>
        <div class="stat-trend trend-down">↘️ -8.5% 较上期</div>
      </div>

      <div class="stat-card">
        <div class="stat-header">
          <div class="stat-title">平均客单价</div>
          <div class="stat-icon" style="background: var(--warning-color)">💳</div>
        </div>
        <div class="stat-number">¥45.60</div>
        <div class="stat-trend trend-up">↗️ +5.3% 较上期</div>
      </div>
    </div>

    <!-- 图表区域 -->
    <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 24px; margin-bottom: 24px">
      <div class="content-card">
        <div class="card-header">
          <div class="card-title">订单趋势</div>
        </div>
        <div class="card-body">
          <div class="chart-placeholder">📈 订单趋势图表</div>
        </div>
      </div>

      <div class="content-card">
        <div class="card-header">
          <div class="card-title">订单状态分布</div>
        </div>
        <div class="card-body">
          <div style="display: flex; flex-direction: column; gap: 12px">
            <div style="display: flex; justify-content: space-between; align-items: center">
              <div style="display: flex; align-items: center; gap: 8px">
                <div style="width: 12px; height: 12px; background: var(--success-color); border-radius: 50%"></div>
                <span>已完成</span>
              </div>
              <span>93.7%</span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center">
              <div style="display: flex; align-items: center; gap: 8px">
                <div style="width: 12px; height: 12px; background: var(--warning-color); border-radius: 50%"></div>
                <span>制作中</span>
              </div>
              <span>4.2%</span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center">
              <div style="display: flex; align-items: center; gap: 8px">
                <div style="width: 12px; height: 12px; background: var(--danger-color); border-radius: 50%"></div>
                <span>已取消</span>
              </div>
              <span>2.1%</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 时段分析 -->
    <div class="content-card">
      <div class="card-header">
        <div class="card-title">时段订单分析</div>
      </div>
      <div class="card-body">
        <div class="chart-placeholder">📊 时段订单分析图表</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 订单统计页面逻辑
</script>