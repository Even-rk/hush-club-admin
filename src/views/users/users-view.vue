<template>
  <!-- 用户列表页面 -->
  <div id="users" class="page active">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="page-title">用户列表</div>
      <div class="page-actions">
        <button class="btn btn-primary">新增用户</button>
        <button class="btn btn-outline">导出用户</button>
      </div>
    </div>

    <!-- 筛选条件 -->
    <div class="content-card">
      <div class="card-body">
        <div class="filter-row">
          <div class="filter-item">
            <label>用户角色</label>
            <select class="form-select">
              <option value="">全部角色</option>
              <option value="admin">管理员</option>
              <option value="staff">员工</option>
              <option value="cashier">收银员</option>
            </select>
          </div>
          <div class="filter-item">
            <label>状态</label>
            <select class="form-select">
              <option value="">全部状态</option>
              <option value="active">在职</option>
              <option value="inactive">离职</option>
              <option value="suspended">停职</option>
            </select>
          </div>
          <div class="filter-item">
            <label>注册时间</label>
            <input type="date" class="form-input" />
          </div>
          <div class="filter-item">
            <label>用户名</label>
            <input type="text" class="form-input" placeholder="输入用户名" />
          </div>
          <div class="filter-item">
            <button class="btn btn-primary">搜索</button>
            <button class="btn btn-outline">重置</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 用户列表 -->
    <div class="content-card">
      <div class="card-header">
        <div class="card-title">用户列表</div>
        <div class="card-actions">
          <span class="text-muted">共 12 位用户</span>
        </div>
      </div>
      <div class="card-body">
        <table class="data-table">
          <thead>
            <tr>
              <th>用户信息</th>
              <th>角色</th>
              <th>部门</th>
              <th>状态</th>
              <th>最后登录</th>
              <th>创建时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <div style="display: flex; align-items: center; gap: 12px">
                  <div style="width: 40px; height: 40px; background: var(--primary-color); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 600">张</div>
                  <div>
                    <div>张经理</div>
                    <div class="text-muted">zhang@hushclub.com</div>
                  </div>
                </div>
              </td>
              <td>
                <span class="status-badge status-primary">管理员</span>
              </td>
              <td>管理部</td>
              <td>
                <span class="status-badge status-success">在职</span>
              </td>
              <td>2024-12-01 14:30</td>
              <td>2024-01-15</td>
              <td>
                <div class="action-buttons">
                  <button class="btn btn-sm btn-outline">编辑</button>
                  <button class="btn btn-sm btn-danger">删除</button>
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <div style="display: flex; align-items: center; gap: 12px">
                  <div style="width: 40px; height: 40px; background: var(--success-color); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 600">李</div>
                  <div>
                    <div>李收银员</div>
                    <div class="text-muted">li@hushclub.com</div>
                  </div>
                </div>
              </td>
              <td>
                <span class="status-badge status-info">收银员</span>
              </td>
              <td>营业部</td>
              <td>
                <span class="status-badge status-success">在职</span>
              </td>
              <td>2024-12-01 13:45</td>
              <td>2024-02-20</td>
              <td>
                <div class="action-buttons">
                  <button class="btn btn-sm btn-outline">编辑</button>
                  <button class="btn btn-sm btn-danger">删除</button>
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <div style="display: flex; align-items: center; gap: 12px">
                  <div style="width: 40px; height: 40px; background: var(--warning-color); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 600">王</div>
                  <div>
                    <div>王员工</div>
                    <div class="text-muted">wang@hushclub.com</div>
                  </div>
                </div>
              </td>
              <td>
                <span class="status-badge status-warning">员工</span>
              </td>
              <td>营业部</td>
              <td>
                <span class="status-badge status-warning">停职</span>
              </td>
              <td>2024-11-28 16:20</td>
              <td>2024-03-10</td>
              <td>
                <div class="action-buttons">
                  <button class="btn btn-sm btn-outline">编辑</button>
                  <button class="btn btn-sm btn-success">启用</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 角色权限说明 -->
    <div class="content-card">
      <div class="card-header">
        <div class="card-title">角色权限说明</div>
      </div>
      <div class="card-body">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px">
          <div style="border: 1px solid var(--border-color); border-radius: 8px; padding: 16px">
            <h4 style="margin: 0 0 12px 0; color: var(--primary-color)">管理员</h4>
            <ul style="margin: 0; padding-left: 20px; color: var(--text-secondary)">
              <li>系统管理权限</li>
              <li>用户管理权限</li>
              <li>数据查看权限</li>
              <li>配置修改权限</li>
            </ul>
          </div>
          <div style="border: 1px solid var(--border-color); border-radius: 8px; padding: 16px">
            <h4 style="margin: 0 0 12px 0; color: var(--info-color)">收银员</h4>
            <ul style="margin: 0; padding-left: 20px; color: var(--text-secondary)">
              <li>订单管理权限</li>
              <li>会员管理权限</li>
              <li>商品查看权限</li>
              <li>基础数据查看</li>
            </ul>
          </div>
          <div style="border: 1px solid var(--border-color); border-radius: 8px; padding: 16px">
            <h4 style="margin: 0 0 12px 0; color: var(--warning-color)">员工</h4>
            <ul style="margin: 0; padding-left: 20px; color: var(--text-secondary)">
              <li>订单查看权限</li>
              <li>会员查看权限</li>
              <li>商品查看权限</li>
              <li>基础数据查看</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 用户列表页面逻辑
</script>