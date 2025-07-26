<template>
  <!-- 等级管理页面 -->
  <div id="member-levels" class="page">
    <div class="content-card">
      <div class="card-header">
        <div class="card-title">会员等级管理</div>
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
              text-align: center;
            "
          >
            <div style="font-size: 18px; font-weight: 600; margin-bottom: 12px">普通会员</div>
            <div style="font-size: 14px; color: var(--text-secondary); margin-bottom: 16px">
              登录微信账号即可成为普通会员
            </div>
            <div style="margin-bottom: 16px">
              <div style="font-size: 24px; font-weight: 700; color: var(--text-secondary)">
                1,587
              </div>
              <div style="font-size: 12px; color: var(--text-secondary)">当前人数</div>
            </div>
            <div style="background: var(--bg-gray); padding: 12px; border-radius: var(--radius)">
              <div style="font-size: 14px; font-weight: 600; margin-bottom: 4px">会员权益</div>
              <div style="font-size: 12px; color: var(--text-secondary); line-height: 1.4">
                • 原价购买商品<br />
                • 积分累计功能<br />
                • 基础会员服务
              </div>
            </div>
          </div>

          <!-- 银牌会员 -->
          <div
            style="
              border: 2px solid var(--silver-color);
              border-radius: var(--radius);
              padding: 20px;
              text-align: center;
              background: rgba(192, 192, 192, 0.05);
            "
          >
            <div
              style="
                font-size: 18px;
                font-weight: 600;
                margin-bottom: 12px;
                color: var(--silver-color);
              "
            >
              银牌会员
            </div>
            <div style="font-size: 14px; color: var(--text-secondary); margin-bottom: 16px">
              单次充值满100元即可升级
            </div>
            <div style="margin-bottom: 16px">
              <div style="font-size: 24px; font-weight: 700; color: var(--silver-color)">456</div>
              <div style="font-size: 12px; color: var(--text-secondary)">当前人数</div>
            </div>
            <div
              style="
                background: rgba(192, 192, 192, 0.1);
                padding: 12px;
                border-radius: var(--radius);
              "
            >
              <div style="font-size: 14px; font-weight: 600; margin-bottom: 4px">会员权益</div>
              <div style="font-size: 12px; color: var(--text-secondary); line-height: 1.4">
                • 9.5折优惠价格<br />
                • 生日特惠券<br />
                • 优先客服支持
              </div>
            </div>
          </div>

          <!-- 金牌会员 -->
          <div
            style="
              border: 2px solid var(--gold-color);
              border-radius: var(--radius);
              padding: 20px;
              text-align: center;
              background: rgba(255, 215, 0, 0.05);
            "
          >
            <div
              style="
                font-size: 18px;
                font-weight: 600;
                margin-bottom: 12px;
                color: var(--gold-color);
              "
            >
              金牌会员
            </div>
            <div style="font-size: 14px; color: var(--text-secondary); margin-bottom: 16px">
              单次充值满500元即可升级
            </div>
            <div style="margin-bottom: 16px">
              <div style="font-size: 24px; font-weight: 700; color: var(--gold-color)">326</div>
              <div style="font-size: 12px; color: var(--text-secondary)">当前人数</div>
            </div>
            <div
              style="
                background: rgba(255, 215, 0, 0.1);
                padding: 12px;
                border-radius: var(--radius);
              "
            >
              <div style="font-size: 14px; font-weight: 600; margin-bottom: 4px">会员权益</div>
              <div style="font-size: 12px; color: var(--text-secondary); line-height: 1.4">
                • 8.5折优惠价格<br />
                • 每月专属优惠券<br />
                • VIP专属客服
              </div>
            </div>
          </div>

          <!-- 钻石会员 -->
          <div
            style="
              border: 2px solid var(--primary-color);
              border-radius: var(--radius);
              padding: 20px;
              text-align: center;
              background: var(--secondary-color);
            "
          >
            <div
              style="
                font-size: 18px;
                font-weight: 600;
                margin-bottom: 12px;
                color: var(--primary-color);
              "
            >
              钻石会员
            </div>
            <div style="font-size: 14px; color: var(--text-secondary); margin-bottom: 16px">
              单次充值满1000元即可升级
            </div>
            <div style="margin-bottom: 16px">
              <div style="font-size: 24px; font-weight: 700; color: var(--primary-color)">89</div>
              <div style="font-size: 12px; color: var(--text-secondary)">当前人数</div>
            </div>
            <div
              style="
                background: rgba(255, 107, 53, 0.1);
                padding: 12px;
                border-radius: var(--radius);
              "
            >
              <div style="font-size: 14px; font-weight: 600; margin-bottom: 4px">会员权益</div>
              <div style="font-size: 12px; color: var(--text-secondary); line-height: 1.4">
                • 8折优惠价格<br />
                • 专属定制服务<br />
                • 优先新品体验
              </div>
            </div>
          </div>
        </div>

        <!-- 等级升级日志 -->
        <div class="content-card" style="margin-top: 20px">
          <div class="card-header">
            <div class="card-title">最近等级升级记录</div>
          </div>
          <div class="card-body">
            <table class="data-table">
              <thead>
                <tr>
                  <th>会员姓名</th>
                  <th>手机号</th>
                  <th>原等级</th>
                  <th>新等级</th>
                  <th>充值金额</th>
                  <th>升级时间</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>李女士</td>
                  <td>139****9999</td>
                  <td><span class="status-badge">普通会员</span></td>
                  <td>
                    <span
                      class="status-badge"
                      style="background: rgba(192, 192, 192, 0.1); color: var(--silver-color)"
                      >银牌会员</span
                    >
                  </td>
                  <td>¥120</td>
                  <td>2024-12-01 10:30</td>
                </tr>
                <tr>
                  <td>王先生</td>
                  <td>137****7777</td>
                  <td>
                    <span
                      class="status-badge"
                      style="background: rgba(255, 215, 0, 0.1); color: var(--gold-color)"
                      >金牌会员</span
                    >
                  </td>
                  <td>
                    <span
                      class="status-badge"
                      style="background: var(--secondary-color); color: var(--primary-color)"
                      >钻石会员</span
                    >
                  </td>
                  <td>¥800</td>
                  <td>2024-11-30 16:45</td>
                </tr>
                <tr>
                  <td>刘女士</td>
                  <td>135****5555</td>
                  <td>
                    <span
                      class="status-badge"
                      style="background: rgba(192, 192, 192, 0.1); color: var(--silver-color)"
                      >银牌会员</span
                    >
                  </td>
                  <td>
                    <span
                      class="status-badge"
                      style="background: rgba(255, 215, 0, 0.1); color: var(--gold-color)"
                      >金牌会员</span
                    >
                  </td>
                  <td>¥600</td>
                  <td>2024-11-29 14:20</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 会员等级页面逻辑
</script>
