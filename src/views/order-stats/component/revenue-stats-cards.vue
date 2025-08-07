<template>
  <div class="stats-grid">
    <!-- 本月订单总数 -->
    <div class="stat-card stat-card-orders">
      <div class="stat-decoration"></div>
      <div class="stat-content">
        <div class="stat-header">
          <div class="stat-info">
            <div class="stat-title">订单总数</div>
            <div class="stat-subtitle">Orders</div>
          </div>
          <div class="stat-icon-wrapper">
            <div class="stat-icon">
              <img src="@/assets/icons/order-message.svg" alt="订单图标" />
            </div>
          </div>
        </div>
        <div class="stat-value">
          <span class="stat-number">
            {{ props.orderStats?.total_count || 0 }}
          </span>
          <span class="stat-unit">单</span>
        </div>
      </div>
    </div>

    <!-- 本月营业额 -->
    <div class="stat-card stat-card-revenue">
      <div class="stat-decoration"></div>
      <div class="stat-content">
        <div class="stat-header">
          <div class="stat-info">
            <div class="stat-title">营业额</div>
            <div class="stat-subtitle">Revenue</div>
          </div>
          <div class="stat-icon-wrapper">
            <div class="stat-icon">
              <img src="@/assets/icons/money-circle.svg" alt="营业额图标" />
            </div>
          </div>
        </div>
        <div class="stat-value">
          <span class="stat-currency">¥</span>
          <span class="stat-number">
            {{ props.orderStats?.total_amount || 0 }}
          </span>
        </div>
      </div>
    </div>

    <!-- 平均客单价 -->
    <!-- <div class="stat-card stat-card-avg">
      <div class="stat-decoration"></div>
      <div class="stat-content">
        <div class="stat-header">
          <div class="stat-info">
            <div class="stat-title">客单价</div>
            <div class="stat-subtitle">Average Order Value</div>
          </div>
          <div class="stat-icon-wrapper">
            <div class="stat-icon">
              <img src="@/assets/icons/stack.svg" alt="客单价图标" />
            </div>
          </div>
        </div>
        <div class="stat-value">
          <span class="stat-currency">¥</span>
          <span class="stat-number">
            {{ props.orderStats?.order_price || 0 }}
          </span>
        </div>
      </div>
    </div> -->

    <!-- 微信支付订单数量 -->
    <div class="stat-card stat-card-wechat">
      <div class="stat-decoration"></div>
      <div class="stat-content">
        <div class="stat-header">
          <div class="stat-info">
            <div class="stat-title">微信支付订单数量</div>
            <div class="stat-subtitle">WeChat Payment Orders</div>
          </div>
          <div class="stat-icon-wrapper">
            <div class="stat-icon">
              <img src="@/assets/icons/wechat-simple.svg" alt="微信支付图标" />
            </div>
          </div>
        </div>
        <div class="stat-value">
          <span class="stat-number">
            {{ props.orderStats?.wechat_count || 0 }}
          </span>
          <span class="stat-unit">单</span>
        </div>
      </div>
    </div>

    <!-- 余额支付订单数量 -->
    <div class="stat-card stat-card-balance">
      <div class="stat-decoration"></div>
      <div class="stat-content">
        <div class="stat-header">
          <div class="stat-info">
            <div class="stat-title">余额支付订单数量</div>
            <div class="stat-subtitle">Balance Payment Orders</div>
          </div>
          <div class="stat-icon-wrapper">
            <div class="stat-icon">
              <img src="@/assets/icons/stack.svg" alt="余额支付图标" />
            </div>
          </div>
        </div>
        <div class="stat-value">
          <span class="stat-number">
            {{ props.orderStats?.balance_count || 0 }}
          </span>
          <span class="stat-unit">单</span>
        </div>
      </div>
    </div>

    <!-- 余额总花费 -->
    <div class="stat-card stat-card-spent">
      <div class="stat-decoration"></div>
      <div class="stat-content">
        <div class="stat-header">
          <div class="stat-info">
            <div class="stat-title">余额总花费</div>
            <div class="stat-subtitle">Total Balance Spent</div>
          </div>
          <div class="stat-icon-wrapper">
            <div class="stat-icon">
              <img src="@/assets/icons/spend.svg" alt="花费图标" />
            </div>
          </div>
        </div>
        <div class="stat-value">
          <span class="stat-currency">¥</span>
          <span class="stat-number">
            {{ props.orderStats?.balance_amount || 0 }}
          </span>
        </div>
      </div>
    </div>

    <!-- 新增会员数量 -->
    <div class="stat-card stat-card-members">
      <div class="stat-decoration"></div>
      <div class="stat-content">
        <div class="stat-header">
          <div class="stat-info">
            <div class="stat-title">新增会员数量</div>
            <div class="stat-subtitle">New Members</div>
          </div>
          <div class="stat-icon-wrapper">
            <div class="stat-icon">
              <img src="@/assets/icons/grid.svg" alt="会员图标" />
            </div>
          </div>
        </div>
        <div class="stat-value">
          <span class="stat-number">
            {{ props.orderStats?.new_member_count || 0 }}
          </span>
          <span class="stat-unit">人</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { OrderStatistics } from '@/types/supabase'

// 定义 props
const props = defineProps<{
  orderStats?: OrderStatistics
}>()
</script>

<style scoped lang="scss">
/* 统计卡片 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
  gap: 20px;

  .stat-card {
    background: white;
    border-radius: 20px;
    position: relative;
    overflow: hidden;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    border: 1px solid rgba(0, 0, 0, 0.06);

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
      .stat-decoration {
        transform: scale(1.1) rotate(10deg);
      }
      .stat-icon-wrapper {
        transform: rotate(-5deg) scale(1.05);
      }
      .stat-number {
        transform: scale(1.02);
      }
    }

    &.stat-card-orders {
      .stat-decoration,
      .stat-icon {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      }
      .stat-icon {
        color: white;
      }
    }

    &.stat-card-revenue {
      .stat-decoration,
      .stat-icon {
        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      }
      .stat-icon {
        color: white;
      }
    }

    &.stat-card-avg {
      .stat-decoration,
      .stat-icon {
        background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
      }
      .stat-icon {
        color: white;
      }
    }

    &.stat-card-wechat {
      .stat-decoration,
      .stat-icon {
        background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
      }
      .stat-icon {
        color: white;
      }
    }

    &.stat-card-balance {
      .stat-decoration,
      .stat-icon {
        background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
      }
      .stat-icon {
        color: white;
      }
    }

    &.stat-card-deposit {
      .stat-decoration,
      .stat-icon {
        background: linear-gradient(135deg, #30cfd0 0%, #330867 100%);
      }
      .stat-icon {
        color: white;
      }
    }

    &.stat-card-spent {
      .stat-decoration,
      .stat-icon {
        background: linear-gradient(135deg, #ff6b6b 0%, #feca57 100%);
      }
      .stat-icon {
        color: white;
      }
    }

    &.stat-card-remaining {
      .stat-decoration,
      .stat-icon {
        background: linear-gradient(135deg, #5f72bd 0%, #9b23ea 100%);
      }
      .stat-icon {
        color: white;
      }
    }

    &.stat-card-members {
      .stat-decoration,
      .stat-icon {
        background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%);
      }
      .stat-icon {
        color: white;
      }
    }

    .stat-decoration {
      position: absolute;
      top: -50px;
      right: -50px;
      width: 150px;
      height: 150px;
      border-radius: 50%;
      opacity: 0.1;
      transition: transform 0.5s ease;
    }

    .stat-content {
      padding: 24px;
      position: relative;
      z-index: 1;
    }

    .stat-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 20px;

      .stat-info {
        .stat-title {
          font-size: 14px;
          font-weight: 600;
          color: var(--text-heading);
          margin-bottom: 4px;
        }
        .stat-subtitle {
          font-size: 11px;
          color: var(--text-subtitle);
          opacity: 0.7;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
      }

      .stat-icon-wrapper {
        transition: transform 0.3s ease;

        .stat-icon {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
          img {
            width: 24px;
            height: 24px;
            filter: brightness(0) invert(1);
          }
        }
      }
    }

    .stat-value {
      display: flex;
      align-items: baseline;
      gap: 4px;

      .stat-currency {
        font-size: 20px;
        font-weight: 600;
        color: var(--text-subtitle);
        opacity: 0.5;
      }

      .stat-number {
        font-size: 28px;
        font-weight: 700;
        color: var(--text-heading);
        letter-spacing: -0.5px;
        transition: transform 0.3s ease;
      }

      .stat-unit {
        font-size: 16px;
        font-weight: 500;
        color: var(--text-subtitle);
        margin-left: 4px;
      }
    }
  }
}
</style>
