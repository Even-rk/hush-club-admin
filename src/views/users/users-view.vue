<template>
  <!-- 用户管理页面 -->
  <div class="page">
    <div class="content-card">
      <div class="card-header">
        <div class="card-title">系统用户管理</div>
        <div class="card-actions">
          <button class="btn btn-primary" onclick="openUserModal()">+ 添加用户</button>
        </div>
      </div>
      <div class="card-body">
        <!-- 用户统计 -->
        <div
          style="
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 16px;
            margin-bottom: 24px;
          "
        >
          <div
            style="
              background: rgba(33, 150, 243, 0.1);
              padding: 16px;
              border-radius: var(--radius);
              text-align: center;
            "
          >
            <div style="font-size: 20px; font-weight: 600; color: var(--info-color)">8</div>
            <div style="font-size: 12px; color: var(--text-secondary)">系统用户总数</div>
          </div>
          <div
            style="
              background: rgba(76, 175, 80, 0.1);
              padding: 16px;
              border-radius: var(--radius);
              text-align: center;
            "
          >
            <div style="font-size: 20px; font-weight: 600; color: var(--success-color)">6</div>
            <div style="font-size: 12px; color: var(--text-secondary)">活跃用户</div>
          </div>
          <div
            style="
              background: rgba(255, 193, 7, 0.1);
              padding: 16px;
              border-radius: var(--radius);
              text-align: center;
            "
          >
            <div style="font-size: 20px; font-weight: 600; color: var(--warning-color)">2</div>
            <div style="font-size: 12px; color: var(--text-secondary)">管理员</div>
          </div>
          <div
            style="
              background: rgba(244, 67, 54, 0.1);
              padding: 16px;
              border-radius: var(--radius);
              text-align: center;
            "
          >
            <div style="font-size: 20px; font-weight: 600; color: var(--error-color)">1</div>
            <div style="font-size: 12px; color: var(--text-secondary)">已禁用</div>
          </div>
        </div>

        <!-- 搜索和筛选 -->
        <div class="search-bar">
          <input type="text" class="search-input" placeholder="搜索用户名..." />
          <button class="btn btn-secondary">🔍 搜索</button>
        </div>

        <div class="filters">
          <div class="filter-item">
            <label class="filter-label">角色:</label>
            <select class="form-select filter-select">
              <option>全部角色</option>
              <option>超级管理员</option>
              <option>管理员</option>
              <option>店员</option>
            </select>
          </div>
          <div class="filter-item">
            <label class="filter-label">状态:</label>
            <select class="form-select filter-select">
              <option>全部状态</option>
              <option>正常</option>
              <option>已禁用</option>
            </select>
          </div>
        </div>

        <!-- 用户列表 -->
        <table class="data-table">
          <thead>
            <tr>
              <th>用户名</th>
              <th>角色</th>
              <th>权限组</th>
              <th>最后登录</th>
              <th>创建时间</th>
              <th>状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>admin</td>
              <td>
                <span class="status-badge status-danger">超级管理员</span>
              </td>
              <td>全部权限</td>
              <td>2024-12-01 14:30</td>
              <td>2023-01-15</td>
              <td>
                <span class="status-badge status-success">正常</span>
              </td>
              <td>
                <button class="btn btn-secondary btn-sm" onclick="editUser(this)">编辑</button>
                <button class="btn btn-warning btn-sm">重置密码</button>
              </td>
            </tr>
            <tr>
              <td>manager</td>
              <td>
                <span class="status-badge status-warning">管理员</span>
              </td>
              <td>店铺管理</td>
              <td>2024-12-01 12:15</td>
              <td>2023-03-20</td>
              <td>
                <span class="status-badge status-success">正常</span>
              </td>
              <td>
                <button class="btn btn-secondary btn-sm" onclick="editUser(this)">编辑</button>
                <button class="btn btn-warning btn-sm">重置密码</button>
              </td>
            </tr>
            <tr>
              <td>staff01</td>
              <td>
                <span class="status-badge status-info">店员</span>
              </td>
              <td>订单处理</td>
              <td>2024-12-01 08:30</td>
              <td>2023-03-20</td>
              <td>
                <span class="status-badge status-success">正常</span>
              </td>
              <td>
                <button class="btn btn-secondary btn-sm" onclick="editUser(this)">编辑</button>
                <button class="btn btn-danger btn-sm">禁用</button>
              </td>
            </tr>
            <tr>
              <td>staff02</td>
              <td>
                <span class="status-badge status-info">店员</span>
              </td>
              <td>商品管理</td>
              <td>2024-11-28 18:45</td>
              <td>2023-08-15</td>
              <td>
                <span class="status-badge status-danger">已禁用</span>
              </td>
              <td>
                <button class="btn btn-secondary btn-sm" onclick="editUser(this)">编辑</button>
                <button class="btn btn-success btn-sm">启用</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 权限管理 -->
    <div class="content-card">
      <div class="card-header">
        <div class="card-title">角色权限配置</div>
      </div>
      <div class="card-body">
        <div
          style="
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
          "
        >
          <!-- 超级管理员 -->
          <div
            style="
              border: 2px solid var(--error-color);
              border-radius: var(--radius);
              padding: 16px;
            "
          >
            <div
              style="
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 12px;
              "
            >
              <div style="font-weight: 600; color: var(--error-color)">超级管理员</div>
              <button class="btn btn-secondary btn-sm" onclick="editRolePermissions('superadmin')">
                编辑权限
              </button>
            </div>
            <div
              id="superadmin-permissions"
              style="font-size: 12px; color: var(--text-secondary); line-height: 1.6"
            >
              • 数据概览<br />
              • 商品列表<br />
              • 分类管理<br />
              • 订单列表<br />
              • 订单统计<br />
              • 会员列表<br />
              • 等级管理<br />
              • 优惠券管理<br />
              • 会员配置<br />
              • 用户管理
            </div>
          </div>

          <!-- 管理员 -->
          <div
            style="
              border: 2px solid var(--warning-color);
              border-radius: var(--radius);
              padding: 16px;
            "
          >
            <div
              style="
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 12px;
              "
            >
              <div style="font-weight: 600; color: var(--warning-color)">管理员</div>
              <button class="btn btn-secondary btn-sm" onclick="editRolePermissions('admin')">
                编辑权限
              </button>
            </div>
            <div
              id="admin-permissions"
              style="font-size: 12px; color: var(--text-secondary); line-height: 1.6"
            >
              • 数据概览<br />
              • 商品列表<br />
              • 分类管理<br />
              • 订单列表<br />
              • 订单统计<br />
              • 会员列表<br />
              • 等级管理<br />
              • 优惠券管理
            </div>
          </div>

          <!-- 店员 -->
          <div
            style="border: 2px solid var(--info-color); border-radius: var(--radius); padding: 16px"
          >
            <div
              style="
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 12px;
              "
            >
              <div style="font-weight: 600; color: var(--info-color)">店员</div>
              <button class="btn btn-secondary btn-sm" onclick="editRolePermissions('staff')">
                编辑权限
              </button>
            </div>
            <div
              id="staff-permissions"
              style="font-size: 12px; color: var(--text-secondary); line-height: 1.6"
            >
              • 数据概览<br />
              • 订单列表<br />
              • 会员列表
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 用户列表页面逻辑
</script>
