<template>
  <!-- 会员配置页面 -->
  <div class="page">
    <!-- 会员等级配置 -->
    <div class="content-card">
      <div class="card-header">
        <div class="card-title">会员等级配置</div>
        <div style="color: var(--text-secondary); font-size: 14px">
          设置不同会员等级的升级条件和优惠力度
        </div>
      </div>
      <div class="card-body">
        <div
          style="
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 20px;
            margin-bottom: 24px;
          "
        >
          <!-- 普通会员 -->
          <div
            style="
              border: 2px solid var(--border-color);
              border-radius: var(--radius);
              padding: 20px;
              background: var(--bg-white);
            "
          >
            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px">
              <div
                style="
                  width: 40px;
                  height: 40px;
                  background: var(--text-secondary);
                  border-radius: 50%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  color: white;
                  font-weight: 600;
                "
              >
                普
              </div>
              <div>
                <div style="font-size: 18px; font-weight: 600">普通会员</div>
                <div style="font-size: 12px; color: var(--text-secondary)">默认等级</div>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">升级条件</label>
              <input
                type="text"
                class="form-input"
                value="登录微信账号"
                readonly
                style="background: var(--bg-gray)"
              />
            </div>

            <div class="form-group">
              <label class="form-label">优惠折扣</label>
              <div style="display: flex; align-items: center; gap: 8px">
                <input
                  type="number"
                  class="form-input"
                  value="10"
                  step="0.1"
                  style="width: 80px"
                  readonly
                />
                <span>折（原价）</span>
              </div>
            </div>
          </div>

          <!-- 银牌会员 -->
          <div
            style="
              border: 2px solid var(--silver-color);
              border-radius: var(--radius);
              padding: 20px;
              background: rgba(192, 192, 192, 0.05);
            "
          >
            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px">
              <div
                style="
                  width: 40px;
                  height: 40px;
                  background: var(--silver-color);
                  border-radius: 50%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  color: white;
                  font-weight: 600;
                "
              >
                银
              </div>
              <div>
                <div style="font-size: 18px; font-weight: 600; color: var(--silver-color)">
                  银牌会员
                </div>
                <div style="font-size: 12px; color: var(--text-secondary)">第一级会员</div>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">升级条件（元）</label>
              <div style="display: flex; align-items: center; gap: 8px">
                <span>单次充值满</span>
                <input type="number" class="form-input" value="100" style="width: 80px" />
                <span>元</span>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">优惠折扣</label>
              <div style="display: flex; align-items: center; gap: 8px">
                <input
                  type="number"
                  class="form-input"
                  value="9.5"
                  step="0.1"
                  style="width: 80px"
                />
                <span>折</span>
              </div>
            </div>
          </div>

          <!-- 金牌会员 -->
          <div
            style="
              border: 2px solid var(--gold-color);
              border-radius: var(--radius);
              padding: 20px;
              background: rgba(255, 215, 0, 0.05);
            "
          >
            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px">
              <div
                style="
                  width: 40px;
                  height: 40px;
                  background: var(--gold-color);
                  border-radius: 50%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  color: white;
                  font-weight: 600;
                "
              >
                金
              </div>
              <div>
                <div style="font-size: 18px; font-weight: 600; color: var(--gold-color)">
                  金牌会员
                </div>
                <div style="font-size: 12px; color: var(--text-secondary)">第二级会员</div>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">升级条件（元）</label>
              <div style="display: flex; align-items: center; gap: 8px">
                <span>单次充值满</span>
                <input type="number" class="form-input" value="500" style="width: 80px" />
                <span>元</span>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">优惠折扣</label>
              <div style="display: flex; align-items: center; gap: 8px">
                <input
                  type="number"
                  class="form-input"
                  value="8.5"
                  step="0.1"
                  style="width: 80px"
                />
                <span>折</span>
              </div>
            </div>
          </div>

          <!-- 钻石会员 -->
          <div
            style="
              border: 2px solid var(--primary-color);
              border-radius: var(--radius);
              padding: 20px;
              background: var(--secondary-color);
            "
          >
            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px">
              <div
                style="
                  width: 40px;
                  height: 40px;
                  background: var(--primary-color);
                  border-radius: 50%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  color: white;
                  font-weight: 600;
                "
              >
                钻
              </div>
              <div>
                <div style="font-size: 18px; font-weight: 600; color: var(--primary-color)">
                  钻石会员
                </div>
                <div style="font-size: 12px; color: var(--text-secondary)">最高级会员</div>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">升级条件（元）</label>
              <div style="display: flex; align-items: center; gap: 8px">
                <span>单次充值满</span>
                <input type="number" class="form-input" value="1000" style="width: 80px" />
                <span>元</span>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">优惠折扣</label>
              <div style="display: flex; align-items: center; gap: 8px">
                <input
                  type="number"
                  class="form-input"
                  value="8.0"
                  step="0.1"
                  style="width: 80px"
                />
                <span>折</span>
              </div>
            </div>
          </div>
        </div>

        <div style="text-align: center">
          <button class="btn btn-primary" style="padding: 12px 32px; font-size: 16px">
            保存会员等级配置
          </button>
        </div>
      </div>
    </div>

    <!-- 充值设置 -->
    <div class="content-card">
      <div class="card-header">
        <div class="card-title">充值系统配置</div>
        <div style="color: var(--text-secondary); font-size: 14px">设置充值相关参数和规则</div>
      </div>
      <div class="card-body">
        <div
          style="
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 24px;
          "
        >
          <div>
            <div class="form-group">
              <label class="form-label">充值方式</label>
              <div style="display: flex; flex-direction: column; gap: 8px">
                <label style="display: flex; align-items: center; gap: 8px; font-size: 14px">
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
              <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px">
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
              <div style="font-size: 12px; color: var(--text-secondary); margin-bottom: 8px">
                充值满指定金额时额外赠送
              </div>
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px">
                <span>充值满</span>
                <input type="number" class="form-input" value="500" style="width: 80px" />
                <span>元赠送</span>
                <input type="number" class="form-input" value="50" style="width: 80px" />
                <span>元</span>
              </div>
              <div style="display: flex; align-items: center; gap: 8px">
                <span>充值满</span>
                <input type="number" class="form-input" value="1000" style="width: 80px" />
                <span>元赠送</span>
                <input type="number" class="form-input" value="150" style="width: 80px" />
                <span>元</span>
              </div>
            </div>
          </div>
        </div>

        <div style="text-align: center; margin-top: 20px">
          <button class="btn btn-primary" style="padding: 12px 32px; font-size: 16px">
            保存充值配置
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 会员配置页面逻辑
</script>
