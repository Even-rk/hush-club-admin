<template>
  <div class="coupon-list">
    <div v-if="coupons.length > 0" class="coupons-grid">
      <div
        v-for="coupon in coupons"
        :key="coupon.id"
        class="coupon-card"
        :class="coupon.use_status"
      >
        <div class="coupon-visual">
          <div class="coupon-icon">🎟️</div>
        </div>
        <div class="coupon-details">
          <div class="coupon-header">
            <h4 class="coupon-title">{{ coupon.template_name }}</h4>
            <span class="coupon-status">
              {{ coupon.use_status === 'used' ? '已使用' : '未使用' }}
            </span>
          </div>
          <div class="coupon-body">
            <div class="coupon-info">
              <p class="coupon-discount">
                <span>优惠</span>
                <strong>
                  <!-- 优惠券类型为reduce时，显示满减 -->
                  <template v-if="coupon.coupon_type === 'reduce'">
                    满{{ coupon.threshold_amount }}减{{ coupon.discount_value }}
                  </template>
                  <!-- 优惠券类型为discount时，显示折扣 -->
                  <template v-else-if="coupon.coupon_type === 'discount' && coupon.discount_value">
                    {{ (coupon.discount_value * 10).toFixed(1) }}折
                  </template>
                  <!-- 免费券 -->
                  <template v-else>
                    {{ coupon.description || '指定商品使用' }}
                  </template>
                </strong>
              </p>
              <p v-if="coupon.coupon_type !== 'reduce'" class="coupon-threshold">
                <span>门槛</span>
                <strong>
                  {{ coupon.threshold_amount ? `满${coupon.threshold_amount}元` : '无门槛' }}
                </strong>
              </p>
            </div>
          </div>
          <div class="coupon-footer">
            <p class="coupon-expiry">
              <template v-if="coupon.valid_day === '长期有效'">长期有效</template>
              <template v-else-if="coupon.valid_day">
                有效期至: {{ formatDate(coupon.valid_day, 'YYYY-MM-DD') }}
              </template>
            </p>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="no-coupons">
      <p>该会员暂无优惠券</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import type { MemberCoupon } from '@/types/supabase'
import { formatDate } from '@/utils/format'

defineProps<{
  coupons: MemberCoupon[]
}>()
</script>

<style scoped lang="scss">
.coupon-list {
  margin-top: 20px;
}

.coupons-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.coupon-card {
  display: flex;
  background: var(--bg-white);
  border-radius: 12px; /* smaller radius */
  border: 1px solid transparent;
  box-shadow:
    0 8px 15px -5px rgba(0, 0, 0, 0.08),
    0 3px 5px -2px rgba(0, 0, 0, 0.04);
  transition: all 0.2s ease-in-out;
  overflow: hidden;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 68px; /* adjusted */
    transform: translateY(-50%);
    width: 2px; /* thinner */
    height: calc(100% - 32px); /* adjusted */
    background-image: linear-gradient(to bottom, var(--border-light) 50%, transparent 50%);
    background-size: 100% 8px; /* adjusted */
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow:
      0 12px 20px -8px rgba(0, 0, 0, 0.12),
      0 4px 8px -4px rgba(0, 0, 0, 0.07);
    border-color: var(--primary-color);
  }

  &.used {
    .coupon-visual {
      background: linear-gradient(135deg, #bdc3c7, #2c3e50);
    }
    .coupon-status {
      background-color: #7f8c8d;
      color: #ecf0f1;
    }
    .coupon-details {
      opacity: 0.7;
      background-color: #f9f9f9;
    }
    &:hover {
      transform: none;
      box-shadow:
        0 8px 15px -5px rgba(0, 0, 0, 0.08),
        0 3px 5px -2px rgba(0, 0, 0, 0.04);
    }
  }
}

.coupon-visual {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 70px; /* smaller */
  background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
  color: white;
  font-size: 32px; /* smaller */
  position: relative;
}

.coupon-details {
  flex: 1;
  padding: 16px; /* smaller */
  display: flex;
  flex-direction: column;
  background-color: var(--bg-white);
}

.coupon-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px; /* smaller */
}

.coupon-title {
  font-size: 16px; /* smaller */
  font-weight: 700;
  margin: 0;
  color: var(--text-heading);
  line-height: 1.3;
}

.coupon-status {
  font-size: 10px; /* smaller */
  font-weight: 600;
  padding: 4px 10px; /* smaller */
  border-radius: 12px; /* smaller */
  color: white;
  background-color: var(--success-color);
  flex-shrink: 0;
  margin-left: 8px; /* smaller */
}

.coupon-body {
  flex: 1;
  margin-bottom: 12px; /* smaller */
}

.coupon-info {
  display: flex;
  flex-direction: column;
  gap: 8px; /* smaller */

  p {
    margin: 0;
    display: flex;
    align-items: baseline;
  }

  span {
    font-size: 12px; /* smaller */
    color: var(--text-subtitle);
    margin-right: 8px;
    flex-shrink: 0;
  }

  strong {
    font-size: 14px; /* smaller */
    font-weight: 600;
    color: var(--primary-dark);
  }
}

.coupon-footer {
  border-top: 1px solid var(--border-light);
  padding-top: 10px; /* smaller */
  margin-top: auto;
}

.coupon-expiry {
  font-size: 12px; /* smaller */
  color: var(--text-subtitle);
  margin: 0;
  text-align: right;
}

.no-coupons {
  text-align: center;
  padding: 40px 20px; /* smaller */
  color: var(--text-subtitle);
  background-color: var(--bg-light);
  border-radius: 12px; /* smaller */
  border: 2px dashed var(--border-light);
}
</style>
