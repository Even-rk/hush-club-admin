<template>
  <!-- 会员列表页面 -->
  <div id="members" class="page active">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="page-title">会员列表</div>
      <div class="page-actions">
        <button class="btn btn-primary">新增会员</button>
        <button class="btn btn-outline">导出会员</button>
      </div>
    </div>

    <!-- 筛选条件 -->
    <div class="content-card">
      <div class="card-body">
        <div class="filter-row">
          <div class="filter-item">
            <label>会员等级</label>
            <select class="form-select">
              <option value="">全部等级</option>
              <option value="bronze">青铜会员</option>
              <option value="silver">白银会员</option>
              <option value="gold">黄金会员</option>
              <option value="platinum">铂金会员</option>
            </select>
          </div>
          <div class="filter-item">
            <label>注册时间</label>
            <input type="date" class="form-input" />
          </div>
          <div class="filter-item">
            <label>手机号</label>
            <input type="text" class="form-input" placeholder="输入手机号" />
          </div>
          <div class="filter-item">
            <button class="btn btn-primary">搜索</button>
            <button class="btn btn-outline">重置</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 会员列表 -->
    <div class="content-card">
      <div class="card-header">
        <div class="card-title">会员列表</div>
        <div class="card-actions">
          <span class="text-muted">共 456 位会员</span>
        </div>
      </div>
      <div class="card-body">
        <table class="data-table">
          <thead>
            <tr>
              <th>会员信息</th>
              <th>等级</th>
              <th>积分</th>
              <th>消费金额</th>
              <th>注册时间</th>
              <th>最后消费</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <div style="display: flex; align-items: center; gap: 12px">
                  <div style="width: 40px; height: 40px; background: var(--primary-color); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 600">张</div>
                  <div>
                    <div>张先生</div>
                    <div class="text-muted">138****8888</div>
                  </div>
                </div>
              </td>
              <td>
                <span class="status-badge status-warning">黄金会员</span>
              </td>
              <td>1,250</td>
              <td>¥2,680</td>
              <td>2024-01-15</td>
              <td>2024-12-01</td>
              <td>
                <div class="action-buttons">
                  <button class="btn btn-sm btn-outline">查看</button>
                  <button class="btn btn-sm btn-primary">编辑</button>
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <div style="display: flex; align-items: center; gap: 12px">
                  <div style="width: 40px; height: 40px; background: var(--success-color); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 600">李</div>
                  <div>
                    <div>李女士</div>
                    <div class="text-muted">139****9999</div>
                  </div>
                </div>
              </td>
              <td>
                <span class="status-badge status-info">白银会员</span>
              </td>
              <td>680</td>
              <td>¥1,450</td>
              <td>2024-02-20</td>
              <td>2024-11-28</td>
              <td>
                <div class="action-buttons">
                  <button class="btn btn-sm btn-outline">查看</button>
                  <button class="btn btn-sm btn-primary">编辑</button>
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <div style="display: flex; align-items: center; gap: 12px">
                  <div style="width: 40px; height: 40px; background: var(--danger-color); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 600">王</div>
                  <div>
                    <div>王先生</div>
                    <div class="text-muted">137****7777</div>
                  </div>
                </div>
              </td>
              <td>
                <span class="status-badge status-success">铂金会员</span>
              </td>
              <td>3,420</td>
              <td>¥5,890</td>
              <td>2023-12-10</td>
              <td>2024-12-01</td>
              <td>
                <div class="action-buttons">
                  <button class="btn btn-sm btn-outline">查看</button>
                  <button class="btn btn-sm btn-primary">编辑</button>
                </div>
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