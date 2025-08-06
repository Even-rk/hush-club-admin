<template>
  <!-- 会员配置页面 -->
  <div class="member-config-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">
          <span class="title-icon">⚙️</span>
          会员配置管理
        </h1>
        <p class="page-subtitle">配置会员等级、充值规则和优惠政策</p>
      </div>
    </div>

    <!-- 会员等级配置 -->
    <div class="content-card">
      <div class="card-header">
        <div class="card-title">会员等级配置</div>
        <div class="card-subtitle">设置不同会员等级的升级条件和优惠力度</div>
      </div>
      <div class="card-body">
        <div class="level-grid">
          <!-- 普通会员 -->
          <div
            v-for="item in memberLevels"
            :key="item.id"
            class="level-card"
            :class="`level-${item.level_code}`"
          >
            <div class="level-header">
              <div class="level-icon">{{ item.level_name.slice(0, 1) }}</div>
              <div class="level-info">
                <div class="level-name">{{ item.level_name }}</div>
                <div class="level-desc">
                  <template v-if="item.level_code == 'normal'">
                    <span>登录微信账号即可成为普通会员</span>
                  </template>
                  <template v-else>
                    <span>单次充值满</span>
                    <span>{{ item.upgrade_condition }}</span>
                    <span>元即可升级为</span>
                    <span>{{ item.level_name }}</span>
                  </template>
                </div>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">
                升级条件
                <template v-if="item.level_code !== 'normal'">(元)</template>
              </label>
              <template v-if="item.level_code === 'normal'">
                <input
                  type="text"
                  class="form-input readonly-input"
                  value="登录微信账号"
                  readonly
                />
              </template>
              <template v-else>
                <div class="upgrade-input">
                  <span>单次充值满</span>
                  <input
                    type="number"
                    class="form-input upgrade-value"
                    :value="item.upgrade_condition"
                  />
                  <span>元</span>
                </div>
              </template>
            </div>

            <div class="form-group">
              <label class="form-label">优惠折扣</label>
              <div class="discount-input">
                <input
                  type="number"
                  class="form-input discount-value"
                  :value="item.discount_rate * 10"
                />
                <span>折 <template v-if="item.level_code == 'normal'">（原价）</template> </span>
              </div>
            </div>
          </div>
        </div>

        <div class="save-button-container">
          <button class="btn btn-primary save-button">保存会员等级配置</button>
        </div>
      </div>
    </div>

    <!-- 充值设置 -->
    <div class="content-card">
      <div class="card-header">
        <div class="card-title">充值系统配置</div>
        <div class="card-subtitle">设置小程序充值相关参数和规则</div>
      </div>
      <div class="card-body">
        <div class="recharge-grid">
          <div>
            <div class="form-group">
              <label class="form-label">充值方式</label>
              <div class="payment-methods">
                <label class="payment-method">
                  <input type="checkbox" checked />
                  <span>微信支付</span>
                </label>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">最小充值金额（元）</label>
              <input type="number" class="form-input" value="10" min="1" />
            </div>

            <div class="form-group">
              <label class="form-label">最大充值金额（元）</label>
              <input type="number" class="form-input" value="5000" min="100" />
            </div>
          </div>

          <div>
            <div class="form-group">
              <label class="form-label">快捷充值金额设置</label>
              <div class="quick-amount-grid">
                <input type="number" class="form-input" value="50" placeholder="金额1" />
                <input type="number" class="form-input" value="100" placeholder="金额2" />
                <input type="number" class="form-input" value="200" placeholder="金额3" />
                <input type="number" class="form-input" value="500" placeholder="金额4" />
                <input type="number" class="form-input" value="1000" placeholder="金额5" />
                <input type="number" class="form-input" value="2000" placeholder="金额6" />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">充值赠送规则</label>
              <div class="bonus-desc">充值满指定金额时额外赠送</div>
              <div class="bonus-input">
                <span>充值满</span>
                <input type="number" class="form-input bonus-value" value="500" />
                <span>元赠送</span>
                <input type="number" class="form-input bonus-value" value="50" />
                <span>元</span>
              </div>
              <div class="bonus-input">
                <span>充值满</span>
                <input type="number" class="form-input bonus-value" value="1000" />
                <span>元赠送</span>
                <input type="number" class="form-input bonus-value" value="150" />
                <span>元</span>
              </div>
            </div>
          </div>
        </div>

        <div class="save-button-container">
          <button class="btn btn-primary save-button">保存充值配置</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reqGetMemberLevels } from '@/api/supabase/SELECT'
import { MemberLevel } from '@/types/supabase/SELECT'
import { onMounted, ref } from 'vue'

// 会员配置页面逻辑
const memberLevels = ref<MemberLevel[]>([])

onMounted(async () => {
  memberLevels.value = await reqGetMemberLevels()
})
</script>

<style scoped lang="scss">
/* 会员配置页面 */
.member-config-page {
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
}

/* 表单控件 */
.form-control,
.form-select,
.form-textarea,
.form-input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
  font-family: inherit;
  font-size: 14px;
  transition: border-color 0.3s ease;
}

.form-select {
  padding-right: 32px;
  appearance: none;
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 16px;
}

.form-control:focus,
.form-select:focus,
.form-textarea:focus,
.form-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.form-label {
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
  color: var(--text-primary);
  font-size: 14px;
}

.form-group {
  margin-bottom: 16px;
}

/* 内容卡片样式 */
.content-card {
  background: var(--bg-white);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
  margin-bottom: 24px;
  overflow: hidden;
}

.card-header {
  padding: 20px 24px;
  border-bottom: 1px solid var(--border-light);
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-heading);
  margin-bottom: 4px;
}

.card-subtitle {
  color: var(--text-subtitle);
  font-size: 14px;
}

.card-actions {
  display: flex;
  gap: 12px;
}

.card-body {
  padding: 24px;
}

/* 等级配置卡片 */
.level-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 24px;

  .level-card {
    border: 2px solid var(--border-medium);
    border-radius: var(--radius-lg);
    padding: 24px;
    background: var(--bg-white);
    transition: all 0.3s;

    &:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-lg);
    }

    &.level-silver {
      border-color: var(--silver-color);
      background: linear-gradient(
        135deg,
        rgba(192, 192, 192, 0.05) 0%,
        rgba(192, 192, 192, 0.02) 100%
      );
    }

    &.level-gold {
      border-color: var(--gold-color);
      background: linear-gradient(135deg, rgba(255, 215, 0, 0.05) 0%, rgba(255, 215, 0, 0.02) 100%);
    }

    &.level-diamond {
      border-color: var(--diamond-color);
      background: linear-gradient(
        135deg,
        rgba(179, 136, 255, 0.05) 0%,
        rgba(179, 136, 255, 0.02) 100%
      );
    }

    .level-header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 20px;

      .level-icon {
        width: 48px;
        height: 48px;
        background: var(--text-subtitle);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--bg-white);
        font-weight: 600;
        font-size: 18px;
      }

      .level-info {
        .level-name {
          font-size: 18px;
          font-weight: 600;
          color: var(--text-heading);
        }

        .level-desc {
          font-size: 13px;
          color: var(--text-subtitle);
          margin-top: 4px;
        }
      }
    }

    &.level-silver .level-icon {
      background: linear-gradient(135deg, var(--silver-color) 0%, var(--silver-dark) 100%);
    }

    &.level-silver .level-name {
      background: linear-gradient(135deg, var(--silver-color) 0%, var(--silver-dark) 100%);
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    &.level-gold .level-icon {
      background: linear-gradient(135deg, var(--gold-color) 0%, var(--gold-dark) 100%);
    }

    &.level-gold .level-name {
      background: linear-gradient(135deg, var(--gold-color) 0%, var(--gold-dark) 100%);
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    &.level-diamond .level-icon {
      background: linear-gradient(135deg, var(--diamond-color) 0%, var(--diamond-dark) 100%);
    }

    &.level-diamond .level-name {
      background: linear-gradient(135deg, var(--diamond-color) 0%, var(--diamond-dark) 100%);
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }
}

.readonly-input {
  background: var(--bg-light);
  cursor: not-allowed;
}

.discount-input,
.upgrade-input {
  display: flex;
  align-items: center;
  gap: 8px;

  .discount-value,
  .upgrade-value {
    width: 80px;
  }
}

.save-button-container {
  text-align: center;
  margin-top: 32px;

  .save-button {
    padding: 12px 48px;
    font-size: 16px;
    font-weight: 600;
  }
}

.recharge-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;

  .payment-methods {
    display: flex;
    flex-direction: column;
    gap: 8px;

    .payment-method {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
    }
  }

  .quick-amount-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }

  .bonus-desc {
    font-size: 12px;
    color: var(--text-secondary);
    margin-bottom: 8px;
  }

  .bonus-input {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;

    .bonus-value {
      width: 80px;
    }
  }
}
</style>
