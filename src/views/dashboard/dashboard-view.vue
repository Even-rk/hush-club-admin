<template>
  <!-- 数据概览页面 -->
  <div class="dashboard-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">
          <span class="title-icon">📊</span>
          数据概览
        </h1>
        <p class="page-subtitle">实时监控店铺运营数据和销售状况</p>
      </div>
      <div class="header-actions">
        <button class="btn btn-secondary btn-with-icon">
          <span class="btn-icon">📥</span>
          导出报表
        </button>
        <button class="btn btn-primary btn-with-icon">
          <span class="btn-icon">🔄</span>
          刷新数据
        </button>
      </div>
    </div>

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
            <cool-select
              v-model="selectedPeriod"
              :options="periodOptions"
              style="min-width: 120px"
            />
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

<script lang="ts" setup>
import { ref } from 'vue'
import CoolSelect from '@/components/cool-select.vue'

// 时间段选择器选项
const periodOptions = [
  { label: '最近7天', value: '7days' },
  { label: '最近30天', value: '30days' },
  { label: '最近90天', value: '90days' }
]

const selectedPeriod = ref('7days')
</script>

<style lang="scss" scoped>
/* 数据概览页面 */
.dashboard-page {
  padding: 24px;
  background: linear-gradient(135deg, var(--bg-gradient-start) 0%, var(--bg-white) 100%);
  min-height: 100vh;
}

/* 页面头部 */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  padding: 24px 32px;
  background: var(--bg-white);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);

  .header-content {
    .page-title {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 28px;
      font-weight: 700;
      color: var(--text-heading);
      margin: 0 0 8px 0;

      .title-icon {
        font-size: 32px;
      }
    }

    .page-subtitle {
      color: var(--text-subtitle);
      font-size: 14px;
      margin: 0;
    }
  }

  .header-actions {
    display: flex;
    gap: 12px;
  }
}

/* 按钮样式 */
.btn {
  padding: 10px 20px;
  border: none;
  border-radius: var(--radius-md);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 8px;

  &.btn-primary {
    background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-light) 100%);
    color: var(--bg-white);

    &:hover {
      background: linear-gradient(135deg, var(--primary-light) 0%, var(--primary-color) 100%);
      transform: translateY(-1px);
      box-shadow: var(--shadow-primary);
    }
  }

  &.btn-secondary {
    background: var(--bg-white);
    color: var(--text-subtitle);
    border: 1px solid var(--border-medium);

    &:hover {
      background: var(--bg-light);
      border-color: var(--border-hover);
    }
  }

  &.btn-with-icon {
    .btn-icon {
      font-size: 16px;
    }
  }

  &.btn-sm {
    padding: 6px 12px;
    font-size: 13px;
  }
}

/* 统计卡片 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.stat-card {
  background: var(--bg-white);
  border-radius: var(--radius-xl);
  padding: 24px;
  box-shadow: var(--shadow-md);
  position: relative;
  overflow: hidden;
  transition: all 0.3s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-hover);
  }
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-light) 100%);
}

.stat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.stat-title {
  font-size: 14px;
  color: var(--text-secondary);
  font-weight: 500;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-light) 100%);
}

.stat-number {
  font-size: 28px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.stat-trend {
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.trend-up {
  color: var(--success-color);
}

.trend-down {
  color: var(--error-color);
}

/* 内容卡片 */
.content-card {
  background: var(--bg-white);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
  margin-bottom: 24px;
  transition: all 0.3s;

  &:hover {
    box-shadow: var(--shadow-hover);
  }
}

.card-header {
  padding: 20px 24px;
  border-bottom: 1px solid var(--border-light);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-heading);
}

.card-actions {
  display: flex;
  gap: 12px;
}

.card-body {
  padding: 24px;
}

/* 图表占位符 */
.chart-placeholder {
  height: 300px;
  background: linear-gradient(135deg, var(--bg-gradient-start) 0%, var(--border-medium) 100%);
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-subtitle);
  font-size: 16px;
  font-weight: 500;
  border: 2px dashed var(--border-medium);
}

/* 状态标签 */
.status-badge {
  padding: 4px 12px;
  border-radius: var(--radius);
  font-size: 12px;
  font-weight: 600;
  text-align: center;
  display: inline-block;
}

.status-success {
  background: var(--success-bg);
  color: var(--success-color);
}

.status-warning {
  background: var(--warning-bg);
  color: var(--warning-color);
}

.status-danger {
  background: var(--error-bg);
  color: var(--error-color);
}

.status-info {
  background: var(--info-bg);
  color: var(--info-color);
}

/* 数据表格样式增强 */
.data-table {
  width: 100%;
  border-collapse: collapse;

  thead {
    tr {
      th {
        padding: 12px 16px;
        text-align: left;
        font-weight: 600;
        color: var(--text-subtitle);
        font-size: 13px;
        text-transform: uppercase;
        background: var(--bg-light);
        border-bottom: 1px solid var(--border-medium);
      }
    }
  }

  tbody {
    tr {
      transition: all 0.2s;

      &:hover {
        background: var(--bg-light);
      }

      td {
        padding: 14px 16px;
        color: var(--text-heading);
        font-size: 14px;
        border-bottom: 1px solid var(--border-light);
      }
    }
  }
}
</style>
