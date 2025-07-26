<template>
  <!-- 会员管理页面 -->
  <div class="page">
    <div class="content-card">
      <div class="card-header">
        <div class="card-title">会员管理</div>
        <div class="card-actions">
          <button class="btn btn-secondary">📊 导出会员</button>
          <button class="btn btn-primary" onclick="openMemberModal()">+ 添加会员</button>
        </div>
      </div>
      <div class="card-body">
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-number">2,458</div>
            <div class="stat-label">总会员数</div>
          </div>
          <div class="stat-card">
            <div class="stat-number stat-success">¥458,960</div>
            <div class="stat-label">总充值金额</div>
          </div>
          <div class="stat-card">
            <div class="stat-number stat-primary">¥5,000</div>
            <div class="stat-label">单次最高充值</div>
          </div>
        </div>

        <div class="search-bar">
          <input type="text" class="search-input" placeholder="搜索会员姓名或手机号..." />
          <button class="btn btn-secondary">🔍 搜索</button>
        </div>

        <div class="filters">
          <div class="filter-item">
            <label class="filter-label">会员等级:</label>
            <select class="form-select filter-select">
              <option>全部等级</option>
              <option>普通会员</option>
              <option>银牌会员</option>
              <option>金牌会员</option>
              <option>钻石会员</option>
            </select>
          </div>
          <div class="filter-item">
            <label class="filter-label">注册时间:</label>
            <select class="form-select filter-select">
              <option>全部时间</option>
              <option>最近7天</option>
              <option>最近30天</option>
              <option>最近90天</option>
            </select>
          </div>
        </div>

        <table class="data-table">
          <thead>
            <tr>
              <th>姓名</th>
              <th>手机号</th>
              <th>会员等级</th>
              <th>当前余额</th>
              <th>单次最高充值</th>
              <th>累计消费</th>
              <th>订单数</th>
              <th>注册时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>张先生</td>
              <td>138****8888</td>
              <td>
                <select class="form-select member-level-select">
                  <option>普通会员</option>
                  <option>银牌会员</option>
                  <option selected>金牌会员</option>
                  <option>钻石会员</option>
                </select>
              </td>
              <td>¥580.00</td>
              <td>¥500.00</td>
              <td>¥3,256.80</td>
              <td>128</td>
              <td>2023-08-15</td>
              <td>
                <button class="btn btn-secondary btn-sm" onclick="viewMemberDetail(this)">
                  查看
                </button>
                <button class="btn btn-secondary btn-sm" onclick="editMember(this)">编辑</button>
                <button class="btn btn-primary btn-sm" onclick="openRechargeModal(this)">
                  充值
                </button>
                <button class="btn btn-warning btn-sm" onclick="openMemberCouponModal(this)">
                  优惠券
                </button>
              </td>
            </tr>
            <tr>
              <td>李女士</td>
              <td>139****9999</td>
              <td>
                <select class="form-select member-level-select">
                  <option>普通会员</option>
                  <option selected>银牌会员</option>
                  <option>金牌会员</option>
                  <option>钻石会员</option>
                </select>
              </td>
              <td>¥156.00</td>
              <td>¥200.00</td>
              <td>¥1,425.60</td>
              <td>67</td>
              <td>2024-02-20</td>
              <td>
                <button class="btn btn-secondary btn-sm" onclick="viewMemberDetail(this)">
                  查看
                </button>
                <button class="btn btn-secondary btn-sm" onclick="editMember(this)">编辑</button>
                <button class="btn btn-primary btn-sm" onclick="openRechargeModal(this)">
                  充值
                </button>
                <button class="btn btn-warning btn-sm" onclick="openMemberCouponModal(this)">
                  优惠券
                </button>
              </td>
            </tr>
            <tr>
              <td>王先生</td>
              <td>137****7777</td>
              <td>
                <select class="form-select member-level-select">
                  <option>普通会员</option>
                  <option>银牌会员</option>
                  <option>金牌会员</option>
                  <option selected>钻石会员</option>
                </select>
              </td>
              <td>¥1,280.00</td>
              <td>¥1,000.00</td>
              <td>¥8,765.40</td>
              <td>256</td>
              <td>2022-12-10</td>
              <td>
                <button class="btn btn-secondary btn-sm" onclick="viewMemberDetail(this)">
                  查看
                </button>
                <button class="btn btn-secondary btn-sm" onclick="editMember(this)">编辑</button>
                <button class="btn btn-primary btn-sm" onclick="openRechargeModal(this)">
                  充值
                </button>
                <button class="btn btn-warning btn-sm" onclick="openMemberCouponModal(this)">
                  优惠券
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 会员列表页面逻辑
</script>

<style scoped lang="scss">
.stats-grid {
  margin-bottom: 24px;

  .stat-card {
    background: white;
    padding: 16px;
    border-radius: var(--radius);
    text-align: center;
    border: 1px solid var(--border-color);

    .stat-number {
      font-size: 20px;
      font-weight: 600;
      color: var(--text-secondary);

      &.stat-success {
        color: var(--success-color);
      }

      &.stat-primary {
        color: var(--primary-color);
      }
    }

    .stat-label {
      font-size: 12px;
      color: var(--text-secondary);
    }
  }
}

.member-level-select {
  min-width: 120px;
}
</style>
