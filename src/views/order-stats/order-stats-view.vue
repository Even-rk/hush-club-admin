<template>
  <!-- 订单统计页面 -->
  <div class="page">
    <!-- 筛选器 -->
    <div class="content-card" style="margin-bottom: 24px">
      <div class="card-header">
        <div class="card-title">数据筛选</div>
        <button class="btn btn-primary" onclick="applyDateFilter()">应用筛选</button>
      </div>
      <div class="card-body">
        <div class="filters">
          <div class="filter-item">
            <label class="filter-label">年份:</label>
            <select id="yearFilter" class="form-select filter-select">
              <option value="2024" selected>2024年</option>
              <option value="2023">2023年</option>
              <option value="2022">2022年</option>
              <option value="2021">2021年</option>
            </select>
          </div>
          <div class="filter-item">
            <label class="filter-label">月份:</label>
            <select id="monthFilter" class="form-select filter-select">
              <option value="">全年</option>
              <option value="1">1月</option>
              <option value="2">2月</option>
              <option value="3">3月</option>
              <option value="4">4月</option>
              <option value="5">5月</option>
              <option value="6">6月</option>
              <option value="7">7月</option>
              <option value="8">8月</option>
              <option value="9">9月</option>
              <option value="10">10月</option>
              <option value="11">11月</option>
              <option value="12" selected>12月</option>
            </select>
          </div>
          <div class="filter-item">
            <label class="filter-label">快速筛选:</label>
            <select
              id="quickFilter"
              class="form-select filter-select"
              onchange="applyQuickFilter()"
            >
              <option value="">自定义</option>
              <option value="today">今天</option>
              <option value="week">本周</option>
              <option value="month">本月</option>
              <option value="quarter">本季度</option>
              <option value="year">本年</option>
            </select>
          </div>
          <div class="filter-item">
            <label class="filter-label">对比:</label>
            <select id="compareFilter" class="form-select filter-select">
              <option value="none">无对比</option>
              <option value="lastMonth" selected>较上月</option>
              <option value="lastYear">较去年同期</option>
              <option value="lastQuarter">较上季度</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-header">
          <div class="stat-title">本月订单总数</div>
          <div class="stat-icon" style="background: var(--info-color)">📋</div>
        </div>
        <div class="stat-number">3,420</div>
        <div class="stat-trend trend-up">↗️ +15.2% 较上月</div>
      </div>

      <div class="stat-card">
        <div class="stat-header">
          <div class="stat-title">本月营业额</div>
          <div class="stat-icon" style="background: var(--success-color)">💰</div>
        </div>
        <div class="stat-number">¥356,800</div>
        <div class="stat-trend trend-up">↗️ +22.5% 较上月</div>
      </div>

      <div class="stat-card">
        <div class="stat-header">
          <div class="stat-title">平均客单价</div>
          <div class="stat-icon" style="background: var(--warning-color)">💳</div>
        </div>
        <div class="stat-number">¥104.33</div>
        <div class="stat-trend trend-up">↗️ +6.8% 较上月</div>
      </div>
    </div>

    <!-- 订单状态统计 -->
    <div class="content-card">
      <div class="card-header">
        <div class="card-title">订单状态分布</div>
        <div class="card-actions">
          <span id="currentPeriod" style="font-size: 12px; color: var(--text-secondary)"
            >2024年12月</span
          >
        </div>
      </div>
      <div class="card-body">
        <div
          style="
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 24px;
          "
        >
          <div
            style="
              text-align: center;
              padding: 20px;
              background: rgba(76, 175, 80, 0.1);
              border-radius: var(--radius);
            "
          >
            <div
              style="
                font-size: 24px;
                font-weight: 600;
                color: var(--success-color);
                margin-bottom: 8px;
              "
            >
              142
            </div>
            <div style="color: var(--text-secondary)">已完成</div>
          </div>
          <div
            style="
              text-align: center;
              padding: 20px;
              background: rgba(255, 193, 7, 0.1);
              border-radius: var(--radius);
            "
          >
            <div
              style="
                font-size: 24px;
                font-weight: 600;
                color: var(--warning-color);
                margin-bottom: 8px;
              "
            >
              18
            </div>
            <div style="color: var(--text-secondary)">制作中</div>
          </div>
          <div
            style="
              text-align: center;
              padding: 20px;
              background: rgba(244, 67, 54, 0.1);
              border-radius: var(--radius);
            "
          >
            <div
              style="
                font-size: 24px;
                font-weight: 600;
                color: var(--error-color);
                margin-bottom: 8px;
              "
            >
              3
            </div>
            <div style="color: var(--text-secondary)">已取消</div>
          </div>
        </div>
        <div class="chart-placeholder">📈 订单状态趋势图</div>
      </div>
    </div>

    <!-- 高峰时段分析 -->
    <div class="content-card">
      <div class="card-header">
        <div class="card-title">高峰时段分析</div>
      </div>
      <div class="card-body">
        <div style="display: flex; flex-direction: column; gap: 12px">
          <div
            style="
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 12px 0;
              border-bottom: 1px solid var(--border-color);
            "
          >
            <div>08:00 - 10:00</div>
            <div>
              <span style="font-weight: 600; color: var(--primary-color)">28单</span>
              <span style="margin-left: 8px; font-size: 12px; color: var(--text-secondary)"
                >16.7%</span
              >
            </div>
          </div>
          <div
            style="
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 12px 0;
              border-bottom: 1px solid var(--border-color);
            "
          >
            <div>10:00 - 12:00</div>
            <div>
              <span style="font-weight: 600; color: var(--primary-color)">45单</span>
              <span style="margin-left: 8px; font-size: 12px; color: var(--text-secondary)"
                >26.8%</span
              >
            </div>
          </div>
          <div
            style="
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 12px 0;
              border-bottom: 1px solid var(--border-color);
            "
          >
            <div>14:00 - 16:00</div>
            <div>
              <span style="font-weight: 600; color: var(--primary-color)">52单</span>
              <span style="margin-left: 8px; color: var(--text-secondary)">31.0%</span>
            </div>
          </div>
          <div
            style="
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 12px 0;
            "
          >
            <div>19:00 - 21:00</div>
            <div>
              <span style="font-weight: 600; color: var(--primary-color)">43单</span>
              <span style="margin-left: 8px; font-size: 12px; color: var(--text-secondary)"
                >25.6%</span
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 订单统计页面逻辑
</script>
