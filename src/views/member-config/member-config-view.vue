<template>
  <!-- 会员配置页面 -->
  <div class="page">
    <!-- 会员等级配置 -->
    <div class="content-card">
      <div class="card-header">
        <div class="card-title">会员等级配置</div>
        <div class="card-subtitle">设置不同会员等级的升级条件和优惠力度</div>
      </div>
      <div class="card-body">
        <div class="level-grid">
          <!-- 普通会员 -->
          <div class="level-card level-normal">
            <div class="level-header">
              <div class="level-icon">普</div>
              <div class="level-info">
                <div class="level-name">普通会员</div>
                <div class="level-desc">默认等级</div>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">升级条件</label>
              <input type="text" class="form-input readonly-input" value="登录微信账号" readonly />
            </div>

            <div class="form-group">
              <label class="form-label">优惠折扣</label>
              <div class="discount-input">
                <input
                  type="number"
                  class="form-input discount-value"
                  value="10"
                  step="0.1"
                  readonly
                />
                <span>折（原价）</span>
              </div>
            </div>
          </div>

          <!-- 银牌会员 -->
          <div class="level-card level-silver">
            <div class="level-header">
              <div class="level-icon">银</div>
              <div class="level-info">
                <div class="level-name">银牌会员</div>
                <div class="level-desc">第一级会员</div>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">升级条件（元）</label>
              <div class="upgrade-input">
                <span>单次充值满</span>
                <input type="number" class="form-input upgrade-value" value="100" />
                <span>元</span>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">优惠折扣</label>
              <div class="discount-input">
                <input type="number" class="form-input discount-value" value="9.5" step="0.1" />
                <span>折</span>
              </div>
            </div>
          </div>

          <!-- 金牌会员 -->
          <div class="level-card level-gold">
            <div class="level-header">
              <div class="level-icon">金</div>
              <div class="level-info">
                <div class="level-name">金牌会员</div>
                <div class="level-desc">第二级会员</div>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">升级条件（元）</label>
              <div class="upgrade-input">
                <span>单次充值满</span>
                <input type="number" class="form-input upgrade-value" value="500" />
                <span>元</span>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">优惠折扣</label>
              <div class="discount-input">
                <input type="number" class="form-input discount-value" value="8.5" step="0.1" />
                <span>折</span>
              </div>
            </div>
          </div>

          <!-- 钻石会员 -->
          <div class="level-card level-diamond">
            <div class="level-header">
              <div class="level-icon">钻</div>
              <div class="level-info">
                <div class="level-name">钻石会员</div>
                <div class="level-desc">最高级会员</div>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">升级条件（元）</label>
              <div class="upgrade-input">
                <span>单次充值满</span>
                <input type="number" class="form-input upgrade-value" value="1000" />
                <span>元</span>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">优惠折扣</label>
              <div class="discount-input">
                <input type="number" class="form-input discount-value" value="8.0" step="0.1" />
                <span>折</span>
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
// 会员配置页面逻辑
</script>

<style scoped lang="scss">
.card-subtitle {
  color: var(--text-secondary);
  font-size: 14px;
}

.level-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 24px;

  .level-card {
    border: 2px solid var(--border-color);
    border-radius: var(--radius);
    padding: 20px;
    background: var(--bg-white);

    &.level-silver {
      border-color: var(--silver-color);
      background: rgba(192, 192, 192, 0.05);
    }

    &.level-gold {
      border-color: var(--gold-color);
      background: rgba(255, 215, 0, 0.05);
    }

    &.level-diamond {
      border-color: var(--primary-color);
      background: var(--secondary-color);
    }

    .level-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;

      .level-icon {
        width: 40px;
        height: 40px;
        background: var(--text-secondary);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: 600;
      }

      .level-info {
        .level-name {
          font-size: 18px;
          font-weight: 600;
        }

        .level-desc {
          font-size: 12px;
          color: var(--text-secondary);
        }
      }
    }

    &.level-silver .level-icon {
      background: var(--silver-color);
    }

    &.level-silver .level-name {
      color: var(--silver-color);
    }

    &.level-gold .level-icon {
      background: var(--gold-color);
    }

    &.level-gold .level-name {
      color: var(--gold-color);
    }

    &.level-diamond .level-icon {
      background: var(--primary-color);
    }

    &.level-diamond .level-name {
      color: var(--primary-color);
    }
  }
}

.readonly-input {
  background: var(--bg-gray);
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

  .save-button {
    padding: 12px 32px;
    font-size: 16px;
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
