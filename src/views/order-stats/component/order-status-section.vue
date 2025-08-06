<template>
  <!-- 订单状态统计 -->
  <div class="order-status-section">
    <div class="section-header">
      <h3 class="section-title">订单状态分布</h3>
      <span class="period-badge">2024年12月</span>
    </div>

    <div class="status-stats-grid">
      <div class="status-stat-card completed">
        <div class="stat-decoration"></div>
        <div class="stat-body">
          <div class="stat-icon-box">
            <img src="/src/assets/icons/check.svg" alt="完成图标" />
          </div>
          <div class="stat-info">
            <div class="stat-label">已完成</div>
            <div class="stat-value">142</div>
          </div>
          <div class="stat-badge">85%</div>
        </div>
      </div>

      <div class="status-stat-card processing">
        <div class="stat-decoration"></div>
        <div class="stat-body">
          <div class="stat-icon-box">
            <img src="/src/assets/icons/clock.svg" alt="制作中图标" />
          </div>
          <div class="stat-info">
            <div class="stat-label">制作中</div>
            <div class="stat-value">18</div>
          </div>
          <div class="stat-badge">11%</div>
        </div>
      </div>

      <div class="status-stat-card cancelled">
        <div class="stat-decoration"></div>
        <div class="stat-body">
          <div class="stat-icon-box">
            <img src="/src/assets/icons/close-x.svg" alt="取消图标" />
          </div>
          <div class="stat-info">
            <div class="stat-label">已取消</div>
            <div class="stat-value">3</div>
          </div>
          <div class="stat-badge">2%</div>
        </div>
      </div>

      <div class="status-stat-card total">
        <div class="stat-decoration"></div>
        <div class="stat-body">
          <div class="stat-icon-box">
            <img src="/src/assets/icons/grid.svg" alt="总订单图标" />
          </div>
          <div class="stat-info">
            <div class="stat-label">总订单</div>
            <div class="stat-value">163</div>
          </div>
          <div class="stat-badge">100%</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
/* 订单状态分布 */
.order-status-section {
  background: white;
  border-radius: 20px;
  padding: 24px;
  margin-bottom: 32px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;

    .section-title {
      font-size: 20px;
      font-weight: 600;
      color: var(--text-heading);
      margin: 0;
    }
  }
}
</style>
