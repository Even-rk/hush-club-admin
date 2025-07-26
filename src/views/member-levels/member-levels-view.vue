<template>
  <!-- 会员等级页面 -->
  <div id="member-levels" class="page active">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="page-title">会员等级</div>
      <div class="page-actions">
        <button class="btn btn-primary">新增等级</button>
      </div>
    </div>

    <!-- 等级列表 -->
    <div class="content-card">
      <div class="card-header">
        <div class="card-title">等级配置</div>
      </div>
      <div class="card-body">
        <table class="data-table">
          <thead>
            <tr>
              <th>等级名称</th>
              <th>等级图标</th>
              <th>升级条件</th>
              <th>折扣率</th>
              <th>积分倍率</th>
              <th>会员数量</th>
              <th>状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>青铜会员</td>
              <td>
                <div style="width: 24px; height: 24px; background: #cd7f32; border-radius: 50%"></div>
              </td>
              <td>注册即可</td>
              <td>95折</td>
              <td>1.0x</td>
              <td>156</td>
              <td>
                <span class="status-badge status-success">启用</span>
              </td>
              <td>
                <div class="action-buttons">
                  <button class="btn btn-sm btn-outline">编辑</button>
                  <button class="btn btn-sm btn-danger">删除</button>
                </div>
              </td>
            </tr>
            <tr>
              <td>白银会员</td>
              <td>
                <div style="width: 24px; height: 24px; background: #c0c0c0; border-radius: 50%"></div>
              </td>
              <td>消费满500元</td>
              <td>9折</td>
              <td>1.2x</td>
              <td>89</td>
              <td>
                <span class="status-badge status-success">启用</span>
              </td>
              <td>
                <div class="action-buttons">
                  <button class="btn btn-sm btn-outline">编辑</button>
                  <button class="btn btn-sm btn-danger">删除</button>
                </div>
              </td>
            </tr>
            <tr>
              <td>黄金会员</td>
              <td>
                <div style="width: 24px; height: 24px; background: #ffd700; border-radius: 50%"></div>
              </td>
              <td>消费满1000元</td>
              <td>85折</td>
              <td>1.5x</td>
              <td>45</td>
              <td>
                <span class="status-badge status-success">启用</span>
              </td>
              <td>
                <div class="action-buttons">
                  <button class="btn btn-sm btn-outline">编辑</button>
                  <button class="btn btn-sm btn-danger">删除</button>
                </div>
              </td>
            </tr>
            <tr>
              <td>铂金会员</td>
              <td>
                <div style="width: 24px; height: 24px; background: #e5e4e2; border-radius: 50%"></div>
              </td>
              <td>消费满2000元</td>
              <td>8折</td>
              <td>2.0x</td>
              <td>23</td>
              <td>
                <span class="status-badge status-success">启用</span>
              </td>
              <td>
                <div class="action-buttons">
                  <button class="btn btn-sm btn-outline">编辑</button>
                  <button class="btn btn-sm btn-danger">删除</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 等级权益说明 -->
    <div class="content-card">
      <div class="card-header">
        <div class="card-title">等级权益说明</div>
      </div>
      <div class="card-body">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px">
          <div style="border: 1px solid var(--border-color); border-radius: 8px; padding: 16px">
            <h4 style="margin: 0 0 12px 0; color: var(--primary-color)">青铜会员</h4>
            <ul style="margin: 0; padding-left: 20px; color: var(--text-secondary)">
              <li>享受95折优惠</li>
              <li>积分1.0倍率</li>
              <li>生日优惠券</li>
            </ul>
          </div>
          <div style="border: 1px solid var(--border-color); border-radius: 8px; padding: 16px">
            <h4 style="margin: 0 0 12px 0; color: var(--info-color)">白银会员</h4>
            <ul style="margin: 0; padding-left: 20px; color: var(--text-secondary)">
              <li>享受9折优惠</li>
              <li>积分1.2倍率</li>
              <li>免费升级饮品</li>
              <li>生日优惠券</li>
            </ul>
          </div>
          <div style="border: 1px solid var(--border-color); border-radius: 8px; padding: 16px">
            <h4 style="margin: 0 0 12px 0; color: var(--warning-color)">黄金会员</h4>
            <ul style="margin: 0; padding-left: 20px; color: var(--text-secondary)">
              <li>享受85折优惠</li>
              <li>积分1.5倍率</li>
              <li>免费升级饮品</li>
              <li>生日优惠券</li>
              <li>专属客服</li>
            </ul>
          </div>
          <div style="border: 1px solid var(--border-color); border-radius: 8px; padding: 16px">
            <h4 style="margin: 0 0 12px 0; color: var(--success-color)">铂金会员</h4>
            <ul style="margin: 0; padding-left: 20px; color: var(--text-secondary)">
              <li>享受8折优惠</li>
              <li>积分2.0倍率</li>
              <li>免费升级饮品</li>
              <li>生日优惠券</li>
              <li>专属客服</li>
              <li>免费停车</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 会员等级页面逻辑
</script>