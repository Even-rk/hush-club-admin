<template>
  <!-- 会员配置页面 -->
  <div id="member-config" class="page active">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="page-title">会员配置</div>
      <div class="page-actions">
        <button class="btn btn-primary">保存配置</button>
      </div>
    </div>

    <!-- 基础配置 -->
    <div class="content-card">
      <div class="card-header">
        <div class="card-title">基础配置</div>
      </div>
      <div class="card-body">
        <div
          style="
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
          "
        >
          <div class="form-group">
            <label>积分规则</label>
            <div style="display: flex; align-items: center; gap: 8px">
              <span>消费</span>
              <input type="number" class="form-input" style="width: 80px" value="1" />
              <span>元获得</span>
              <input type="number" class="form-input" style="width: 80px" value="1" />
              <span>积分</span>
            </div>
          </div>
          <div class="form-group">
            <label>积分有效期</label>
            <div style="display: flex; align-items: center; gap: 8px">
              <input type="number" class="form-input" style="width: 80px" value="365" />
              <span>天</span>
            </div>
          </div>
          <div class="form-group">
            <label>生日优惠</label>
            <select class="form-select">
              <option value="discount">折扣优惠</option>
              <option value="cash">现金优惠</option>
              <option value="free">免费商品</option>
            </select>
          </div>
          <div class="form-group">
            <label>生日优惠值</label>
            <div style="display: flex; align-items: center; gap: 8px">
              <input type="number" class="form-input" style="width: 80px" value="8" />
              <span>折/元</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 等级配置 -->
    <div class="content-card">
      <div class="card-header">
        <div class="card-title">等级配置</div>
      </div>
      <div class="card-body">
        <div
          style="
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
          "
        >
          <div class="form-group">
            <label>自动升级</label>
            <div style="display: flex; align-items: center; gap: 8px">
              <input id="auto-upgrade" type="checkbox" checked />
              <label for="auto-upgrade">启用自动升级</label>
            </div>
          </div>
          <div class="form-group">
            <label>升级提醒</label>
            <div style="display: flex; align-items: center; gap: 8px">
              <input id="upgrade-notify" type="checkbox" checked />
              <label for="upgrade-notify">发送升级提醒</label>
            </div>
          </div>
          <div class="form-group">
            <label>降级保护</label>
            <div style="display: flex; align-items: center; gap: 8px">
              <input type="number" class="form-input" style="width: 80px" value="30" />
              <span>天</span>
            </div>
          </div>
          <div class="form-group">
            <label>积分清零</label>
            <div style="display: flex; align-items: center; gap: 8px">
              <input id="clear-points" type="checkbox" />
              <label for="clear-points">降级时清零积分</label>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 通知配置 -->
    <div class="content-card">
      <div class="card-header">
        <div class="card-title">通知配置</div>
      </div>
      <div class="card-body">
        <div
          style="
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
          "
        >
          <div class="form-group">
            <label>生日提醒</label>
            <div style="display: flex; align-items: center; gap: 8px">
              <input id="birthday-notify" type="checkbox" checked />
              <label for="birthday-notify">发送生日祝福</label>
            </div>
          </div>
          <div class="form-group">
            <label>积分到期提醒</label>
            <div style="display: flex; align-items: center; gap: 8px">
              <input type="number" class="form-input" style="width: 80px" value="7" />
              <span>天前提醒</span>
            </div>
          </div>
          <div class="form-group">
            <label>活动通知</label>
            <div style="display: flex; align-items: center; gap: 8px">
              <input id="activity-notify" type="checkbox" checked />
              <label for="activity-notify">发送活动通知</label>
            </div>
          </div>
          <div class="form-group">
            <label>优惠券通知</label>
            <div style="display: flex; align-items: center; gap: 8px">
              <input id="coupon-notify" type="checkbox" checked />
              <label for="coupon-notify">发送优惠券通知</label>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 高级配置 -->
    <div class="content-card">
      <div class="card-header">
        <div class="card-title">高级配置</div>
      </div>
      <div class="card-body">
        <div
          style="
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
          "
        >
          <div class="form-group">
            <label>积分兑换</label>
            <div style="display: flex; align-items: center; gap: 8px">
              <input id="point-exchange" type="checkbox" checked />
              <label for="point-exchange">启用积分兑换</label>
            </div>
          </div>
          <div class="form-group">
            <label>兑换比例</label>
            <div style="display: flex; align-items: center; gap: 8px">
              <span>100积分 =</span>
              <input type="number" class="form-input" style="width: 80px" value="1" />
              <span>元</span>
            </div>
          </div>
          <div class="form-group">
            <label>推荐奖励</label>
            <div style="display: flex; align-items: center; gap: 8px">
              <input id="referral-reward" type="checkbox" />
              <label for="referral-reward">启用推荐奖励</label>
            </div>
          </div>
          <div class="form-group">
            <label>推荐奖励积分</label>
            <div style="display: flex; align-items: center; gap: 8px">
              <input type="number" class="form-input" style="width: 80px" value="50" />
              <span>积分</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 会员配置页面逻辑
</script>
