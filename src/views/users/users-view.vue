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
        <div class="stats-grid">
          <div class="stat-card stat-info">
            <div class="stat-number">{{ userList.length }}</div>
            <div class="stat-label">系统用户总数</div>
          </div>
          <div class="stat-card stat-success">
            <div class="stat-number">
              {{ userList.filter(i => i.status == 'active').length }}
            </div>
            <div class="stat-label">活跃用户</div>
          </div>
          <div class="stat-card stat-warning">
            <div class="stat-number">
              {{ userList.filter(i => [1, 2].includes(i.role_id)).length }}
            </div>
            <div class="stat-label">管理员</div>
          </div>
          <div class="stat-card stat-error">
            <div class="stat-number">
              {{ userList.filter(i => i.status == 'inactive').length }}
            </div>
            <div class="stat-label">已禁用</div>
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
              <th>邮箱</th>
              <th>最后登录</th>
              <th>创建时间</th>
              <th>状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in userList" :key="user.id">
              <td>{{ user.username }}</td>
              <td>
                <span class="status-badge status-danger">{{ user.role_name }}</span>
              </td>
              <td>{{ user.email }}</td>
              <td>{{ formatDate(user.created_at, 'YYYY-MM-DD HH:mm') }}</td>
              <td>{{ formatDate(user.updated_at, 'YYYY-MM-DD') }}</td>
              <td>
                <span v-if="user.status === 'active'" class="status-badge status-success">
                  正常
                </span>
                <span v-else class="status-badge status-error">禁用</span>
              </td>
              <td>
                <button class="btn btn-secondary btn-sm" onclick="editUser(this)">编辑</button>
                <button class="btn btn-warning btn-sm">重置密码</button>
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
        <div class="role-grid">
          <!-- 超级管理员 -->
          <div class="role-card role-superadmin">
            <div class="role-header">
              <div class="role-title">超级管理员</div>
              <button class="btn btn-secondary btn-sm" onclick="editRolePermissions('superadmin')">
                编辑权限
              </button>
            </div>
            <div id="superadmin-permissions" class="role-permissions">
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
          <div class="role-card role-admin">
            <div class="role-header">
              <div class="role-title">管理员</div>
              <button class="btn btn-secondary btn-sm" onclick="editRolePermissions('admin')">
                编辑权限
              </button>
            </div>
            <div id="admin-permissions" class="role-permissions">
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
          <div class="role-card role-staff">
            <div class="role-header">
              <div class="role-title">店员</div>
              <button class="btn btn-secondary btn-sm" onclick="editRolePermissions('staff')">
                编辑权限
              </button>
            </div>
            <div id="staff-permissions" class="role-permissions">
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
import { reqGetUserList } from '@/api/supabase'
import { User } from '@/types/supabase'
import { formatDate } from '@/utils/format'
import { onMounted, ref } from 'vue'

// 用户列表页面逻辑
const userList = ref<User[]>([])

onMounted(async () => {
  userList.value = await reqGetUserList()
})
</script>

<style scoped lang="scss">
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;

  .stat-card {
    padding: 16px;
    border-radius: var(--radius);
    text-align: center;

    &.stat-info {
      background: rgba(33, 150, 243, 0.1);
    }

    &.stat-success {
      background: rgba(76, 175, 80, 0.1);
    }

    &.stat-warning {
      background: rgba(255, 193, 7, 0.1);
    }

    &.stat-error {
      background: rgba(244, 67, 54, 0.1);
    }

    .stat-number {
      font-size: 20px;
      font-weight: 600;
      color: var(--info-color);
    }

    &.stat-success .stat-number {
      color: var(--success-color);
    }

    &.stat-warning .stat-number {
      color: var(--warning-color);
    }

    &.stat-error .stat-number {
      color: var(--error-color);
    }

    .stat-label {
      font-size: 12px;
      color: var(--text-secondary);
    }
  }
}

.role-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;

  .role-card {
    border: 2px solid var(--info-color);
    border-radius: var(--radius);
    padding: 16px;

    &.role-superadmin {
      border-color: var(--error-color);
    }

    &.role-admin {
      border-color: var(--warning-color);
    }

    &.role-staff {
      border-color: var(--info-color);
    }

    .role-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;

      .role-title {
        font-weight: 600;
        color: var(--info-color);
      }
    }

    &.role-superadmin .role-title {
      color: var(--error-color);
    }

    &.role-admin .role-title {
      color: var(--warning-color);
    }

    &.role-staff .role-title {
      color: var(--info-color);
    }

    .role-permissions {
      font-size: 12px;
      color: var(--text-secondary);
      line-height: 1.6;
    }
  }
}
</style>
