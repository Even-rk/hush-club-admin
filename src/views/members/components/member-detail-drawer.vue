<template>
  <transition name="modal-fade">
    <div v-if="visible" class="detail-modal-overlay" @click="close">
      <transition name="modal-scale">
        <div v-if="visible" class="detail-modal" @click.stop>
          <!-- 装饰性背景 -->
          <div class="modal-decoration">
            <div class="decoration-circle decoration-circle-1"></div>
            <div class="decoration-circle decoration-circle-2"></div>
          </div>

          <!-- 弹窗头部 -->
          <div class="detail-modal-header">
            <div class="header-content">
              <div class="header-icon">📄</div>
              <h3 class="modal-title">会员详情</h3>
            </div>
            <button class="modal-close" @click="close">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <!-- 弹窗内容 -->
          <div class="detail-modal-body">
            <div v-if="member" class="member-details">
              <div class="detail-grid">
                <div class="detail-item">
                  <span class="label">姓名</span>
                  <span class="value">{{ member.real_name }}</span>
                </div>
                <div class="detail-item">
                  <span class="label">手机号</span>
                  <span class="value">{{ member.phone }}</span>
                </div>
                <div class="detail-item">
                  <span class="label">会员等级</span>
                  <span class="value">{{ member.level_name }}</span>
                </div>
                <div class="detail-item">
                  <span class="label">当前余额</span>
                  <span class="value">¥{{ member.balance }}</span>
                </div>
                <div class="detail-item">
                  <span class="label">最高单次充值</span>
                  <span class="value">¥{{ member.total_recharge }}</span>
                </div>
                <div class="detail-item">
                  <span class="label">累计消费</span>
                  <span class="value">¥{{ member.total_consumption }}</span>
                </div>
                <div class="detail-item">
                  <span class="label">订单数</span>
                  <span class="value">{{ member.order_count }}</span>
                </div>
                <div class="detail-item">
                  <span class="label">优惠券数</span>
                  <span class="value">{{ member.coupon_count }}</span>
                </div>
              </div>
              <div class="coupons-section">
                <h4 class="section-title">会员优惠券</h4>
                <div v-if="isLoadingCoupons" class="loading-state">
                  <p>正在加载优惠券...</p>
                </div>
                <MemberCouponList v-else :coupons="memberCoupons" />
              </div>
            </div>
            <div v-else class="loading-state">
              <p>加载中...</p>
            </div>
          </div>
          <!-- 弹窗底部 -->
          <div class="detail-modal-footer">
            <button class="btn btn-primary" @click="close">
              <span class="btn-icon">✅</span>
              关闭
            </button>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref, onMounted } from 'vue'
import type { Member, MemberCoupon } from '@/types/supabase'
import { reqGetMemberCoupon } from '@/api/supabase/SELECT'
import MemberCouponList from './member-coupon-list.vue'

const props = defineProps<{
  visible: boolean
  member: Member
}>()

const emit = defineEmits(['close'])

const close = () => {
  emit('close')
}

const memberCoupons = ref<MemberCoupon[]>([])
const isLoadingCoupons = ref(false)

onMounted(async () => {
  isLoadingCoupons.value = true
  const data = await reqGetMemberCoupon({
    member_id: props.member.id
  })
  memberCoupons.value = data
  isLoadingCoupons.value = false
})
</script>

<style scoped lang="scss">
// 动画效果
@keyframes modalFadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes modalScaleIn {
  from {
    transform: scale(0.9);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
  }
}

// 过渡动画
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-scale-enter-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-scale-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 1, 1);
}

.modal-scale-enter-from {
  transform: scale(0.9);
  opacity: 0;
}

.modal-scale-leave-to {
  transform: scale(0.9);
  opacity: 0;
}

.detail-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  animation: modalFadeIn 0.2s ease;
}

.detail-modal {
  background: linear-gradient(135deg, var(--bg-white) 0%, #fafafa 100%);
  border-radius: 20px;
  box-shadow:
    0 25px 50px -12px rgba(0, 0, 0, 0.25),
    0 0 0 1px rgba(0, 0, 0, 0.05);
  width: 100%;
  max-width: 600px; // wider for details
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
}

// 装饰性背景
.modal-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;

  .decoration-circle {
    position: absolute;
    border-radius: 50%;

    &.decoration-circle-1 {
      width: 300px;
      height: 300px;
      background: radial-gradient(circle, rgba(255, 107, 53, 0.1) 0%, transparent 70%);
      top: -150px;
      right: -150px;
      animation: float 20s infinite ease-in-out;
    }

    &.decoration-circle-2 {
      width: 200px;
      height: 200px;
      background: radial-gradient(circle, rgba(255, 140, 97, 0.08) 0%, transparent 70%);
      bottom: -100px;
      left: -100px;
      animation: float 15s infinite ease-in-out reverse;
    }
  }
}

.detail-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 28px;
  background: linear-gradient(135deg, var(--primary-light) 0%, var(--primary-color) 100%);
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  }

  .header-content {
    display: flex;
    align-items: center;
    gap: 12px;

    .header-icon {
      width: 36px;
      height: 36px;
      background: rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(10px);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
    }
  }

  .modal-title {
    margin: 0;
    font-size: 20px;
    font-weight: 700;
    color: var(--bg-white);
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .modal-close {
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    color: var(--bg-white);
    cursor: pointer;
    padding: 0;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    transition: all 0.3s ease;

    &:hover {
      background: rgba(255, 255, 255, 0.3);
      transform: rotate(90deg);
    }

    svg {
      width: 20px;
      height: 20px;
    }
  }
}

.detail-modal-body {
  padding: 28px;
  overflow-y: auto;
  flex: 1;
}

.member-details {
  .detail-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }

  .detail-item {
    background: var(--bg-light);
    padding: 16px;
    border-radius: 12px;
    border: 1px solid var(--border-light);
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
      border-color: var(--primary-light);
    }

    .label {
      display: block;
      font-size: 12px;
      font-weight: 600;
      color: var(--text-subtitle);
      margin-bottom: 8px;
      text-transform: uppercase;
    }
    .value {
      font-size: 16px;
      font-weight: 500;
      color: var(--text-heading);
    }
  }
  .detail-item-full {
    grid-column: 1 / -1;
  }
}

.detail-modal-footer {
  display: flex;
  justify-content: flex-end;
  padding: 20px 28px;
  background: linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.02) 100%);
  border-top: 1px solid rgba(0, 0, 0, 0.06);

  .btn {
    min-width: 100px;
    padding: 10px 20px;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    position: relative;
    overflow: hidden;

    .btn-icon {
      font-size: 16px;
    }

    &.btn-primary {
      background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
      color: white;
      box-shadow: 0 4px 15px rgba(255, 107, 53, 0.3);

      &:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(255, 107, 53, 0.4);
      }
    }
  }
}

.loading-state {
  text-align: center;
  padding: 20px;
  color: #888;
}
</style>
