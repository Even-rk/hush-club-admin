<template>
  <!-- 用户管理页面 -->
  <div class="user-management-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">
          <span class="title-icon">👥</span>
          系统用户管理
        </h1>
        <p class="page-subtitle">管理系统用户账号、角色权限和访问控制</p>
      </div>
      <button class="btn btn-primary btn-with-icon">
        <span class="btn-icon">✨</span>
        添加用户
      </button>
    </div>

    <!-- 用户统计卡片 -->
    <div v-if="!loading" class="stats-container">
      <div class="stat-card-enhanced stat-total">
        <div class="stat-icon-wrapper">
          <span class="stat-icon">👤</span>
        </div>
        <div class="stat-content">
          <div class="stat-number-large">{{ userList.length }}</div>
          <div class="stat-label-enhanced">系统用户总数</div>
          <div class="stat-trend">
            <span class="trend-badge trend-up">↑ 12%</span>
            <span class="trend-text">较上月</span>
          </div>
        </div>
        <div class="stat-decoration"></div>
      </div>

      <div class="stat-card-enhanced stat-active">
        <div class="stat-icon-wrapper">
          <span class="stat-icon">✅</span>
        </div>
        <div class="stat-content">
          <div class="stat-number-large">
            {{ userList.filter(i => i.status == 'active').length }}
          </div>
          <div class="stat-label-enhanced">活跃用户</div>
          <div class="stat-percentage">
            占比
            {{
              Math.round(
                (userList.filter(i => i.status == 'active').length / userList.length) * 100
              )
            }}%
          </div>
        </div>
        <div class="stat-decoration"></div>
      </div>

      <div class="stat-card-enhanced stat-admin">
        <div class="stat-icon-wrapper">
          <span class="stat-icon">👑</span>
        </div>
        <div class="stat-content">
          <div class="stat-number-large">
            {{ userList.filter(i => [1, 2].includes(i.role_id)).length }}
          </div>
          <div class="stat-label-enhanced">管理员</div>
          <div class="stat-subtitle">包含超管和普通管理员</div>
        </div>
        <div class="stat-decoration"></div>
      </div>

      <div class="stat-card-enhanced stat-disabled">
        <div class="stat-icon-wrapper">
          <span class="stat-icon">🚫</span>
        </div>
        <div class="stat-content">
          <div class="stat-number-large">
            {{ userList.filter(i => i.status == 'inactive').length }}
          </div>
          <div class="stat-label-enhanced">已禁用</div>
          <div v-if="userList.filter(i => i.status == 'inactive').length > 5" class="stat-warning">
            需要清理
          </div>
        </div>
        <div class="stat-decoration"></div>
      </div>
    </div>

    <!-- 用户列表卡片 -->
    <div class="content-card user-list-card">
      <div class="card-header">
        <div class="card-title">用户列表</div>
        <div class="card-tools">
          <button class="tool-btn" title="刷新">
            <span>🔄</span>
          </button>
          <button class="tool-btn" title="导出">
            <span>📥</span>
          </button>
        </div>
      </div>

      <div class="card-body">
        <!-- 搜索和筛选区域 -->
        <div class="search-filter-container">
          <div class="search-box">
            <span class="search-icon">🔍</span>
            <input
              type="text"
              class="search-input-enhanced"
              placeholder="搜索用户名、邮箱或手机号..."
            />
            <button class="search-btn">搜索</button>
          </div>

          <div class="filter-group">
            <div class="filter-item-enhanced">
              <cool-select
                v-model="selectedRole"
                :options="roleOptions"
                class="filter-select-enhanced"
                placeholder="全部角色"
              />
            </div>
            <div class="filter-item-enhanced">
              <cool-select
                v-model="selectedStatus"
                :options="statusOptions"
                class="filter-select-enhanced"
                placeholder="全部状态"
              />
            </div>
            <button class="filter-reset">重置筛选</button>
          </div>
        </div>

        <!-- 用户列表 -->
        <data-table
          :data="userList"
          :columns="userColumns"
          :actions="userActions"
          :loading="loading"
          row-key="id"
          class="user-table"
        />
      </div>
    </div>

    <!-- 权限管理卡片 -->
    <div v-if="!loading" class="content-card permission-card">
      <div class="card-header">
        <div class="card-title-section">
          <div class="card-title">
            <span class="title-icon">🔐</span>
            角色权限配置
          </div>
          <p class="card-description">配置不同角色的系统访问权限</p>
        </div>
      </div>
      <div class="card-body">
        <div class="role-grid-enhanced">
          <div
            v-for="(role, index) in rolePermissionList"
            :key="role.id"
            class="role-card-enhanced"
            :class="`role-${role.role_code.toLowerCase()}`"
          >
            <!-- 角色卡片头部 -->
            <div class="role-card-header">
              <div class="role-info">
                <span class="role-icon">
                  {{
                    role.role_code === 'SUPERADMIN'
                      ? '👑'
                      : role.role_code === 'ADMIN'
                        ? '⭐'
                        : '👤'
                  }}
                </span>
                <div class="role-text">
                  <h3 class="role-name">{{ role.role_name }}</h3>
                  <span class="role-code">{{ role.role_code }}</span>
                </div>
              </div>
              <div class="role-actions">
                <template v-if="!editPermission[index].isEdit">
                  <button
                    class="btn-icon-only"
                    title="编辑权限"
                    @click="editPermissionFn(role.id, index)"
                  >
                    ✏️
                  </button>
                </template>
                <div v-if="editPermission[index].isEdit" class="edit-actions">
                  <button
                    class="btn-icon-text cancel"
                    @click="editPermission[index].isEdit = false"
                  >
                    <span>❌</span>
                    取消
                  </button>
                  <button class="btn-icon-text save" @click="savePermission(role.id)">
                    <span>✅</span>
                    保存
                  </button>
                </div>
              </div>
            </div>

            <!-- 权限列表 -->
            <div class="role-permissions-container">
              <template v-if="!editPermission[index].isEdit">
                <div class="permission-tags">
                  <span
                    v-for="permission in role.permissions"
                    :key="permission.permission_code"
                    class="permission-tag"
                  >
                    {{ permission.menu_name }}
                  </span>
                  <span
                    v-if="!role.permissions || role.permissions.length === 0"
                    class="no-permission"
                  >
                    暂无权限
                  </span>
                </div>
              </template>

              <template v-if="editPermission[index].isEdit">
                <div class="permission-checkboxes">
                  <label
                    v-for="routeItem in routeList"
                    :key="routeItem.permission_code"
                    class="permission-checkbox"
                  >
                    <input
                      v-model="selectedPermission"
                      :value="routeItem.permission_code"
                      type="checkbox"
                      class="checkbox-input"
                    />
                    <span class="checkbox-label">{{ routeItem.menu_name }}</span>
                  </label>
                </div>
              </template>
            </div>

            <!-- 角色统计 -->
            <div class="role-stats">
              <div class="stat-item">
                <span class="stat-value">{{ role.permissions?.length || 0 }}</span>
                <span class="stat-name">权限数</span>
              </div>
              <div class="stat-item">
                <span class="stat-value">
                  {{ userList.filter(u => u.role_id === role.id).length }}
                </span>
                <span class="stat-name">用户数</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reqGetRolePermissionList, reqGetUserList } from '@/api/supabase'
import { User } from '@/types/supabase'
import type { TableColumn, TableAction, RolePermission } from '@/types/supabase'
import { formatDate } from '@/utils/format'
import { onMounted, ref } from 'vue'
import DataTable from '@/components/data-table.vue'
import route from '@/router/route'
import CoolSelect from '@/components/cool-select.vue'

// 用户列表
const userList = ref<User[]>([])
// 加载中
const loading = ref(false)

// 筛选器状态
const selectedRole = ref('')
const selectedStatus = ref('')

// 角色选项
const roleOptions = [
  { label: '全部角色', value: '' },
  { label: '超级管理员', value: 'superadmin' },
  { label: '管理员', value: 'admin' },
  { label: '店员', value: 'staff' }
]

// 状态选项
const statusOptions = [
  { label: '全部状态', value: '' },
  { label: '正常', value: 'active' },
  { label: '已禁用', value: 'inactive' }
]
// 角色权限列表
const rolePermissionList = ref<RolePermission[]>([])
// 编辑权限
const editPermission = ref<{ isEdit: boolean }[]>([])
// 路由列表
const routeList = ref<{ menu_name: string; permission_code: string }[]>([])
// 当前选择的权限
const selectedPermission = ref<string[]>([])

// 表格列配置
const userColumns: TableColumn<User>[] = [
  { key: 'username', title: '用户名' },
  {
    key: 'role_name',
    title: '角色'
  },
  { key: 'email', title: '邮箱' },
  {
    key: 'created_at',
    title: '最后登录',
    formatter: (value: Date) => formatDate(value, 'YYYY-MM-DD HH:mm')
  },
  {
    key: 'updated_at',
    title: '创建时间',
    type: 'date',
    formatter: (value: Date) => formatDate(value, 'YYYY-MM-DD')
  },
  {
    key: 'status',
    title: '状态',
    type: 'status',
    statusMap: {
      active: { text: '正常', className: 'status-success' },
      inactive: { text: '禁用', className: 'status-error' }
    }
  }
]

// 操作函数
const editUser = (user: User) => {
  console.log('编辑用户:', user)
}

const resetPassword = (user: User) => {
  console.log('重置密码:', user)
}

const viewUser = (user: User) => {
  console.log('查看用户详情:', user)
}

// 编辑权限
const editPermissionFn = (roleId: number, editIndex: number) => {
  const target = rolePermissionList.value.find(i => i.id === roleId)
  if (!target) {
    selectedPermission.value = []
  } else {
    selectedPermission.value = target.permissions.map(i => i.permission_code)
  }
  // 先关闭所有的
  editPermission.value = editPermission.value.map(() => ({ isEdit: false }))
  // 打开当前的
  editPermission.value[editIndex].isEdit = true
}

// 保存权限
const savePermission = (roleId: number) => {
  console.log('保存权限:', roleId)
}

// 表格操作配置
const userActions: TableAction<User>[] = [
  {
    text: '编辑',
    type: 'secondary',
    onClick: user => editUser(user)
  },
  {
    text: '重置密码',
    type: 'warning',
    onClick: user => resetPassword(user)
  },
  {
    text: '查看详情',
    type: 'primary',
    onClick: user => viewUser(user)
  }
]

// 加载数据
onMounted(async () => {
  loading.value = true
  try {
    const [users, rolePermissions] = await Promise.all([
      reqGetUserList(),
      reqGetRolePermissionList()
    ])
    userList.value = users
    rolePermissionList.value = rolePermissions
    // 初始化是否编辑
    editPermission.value = rolePermissions.map(() => ({
      isEdit: false
    }))
  } finally {
    loading.value = false
  }

  const routes = route.find(i => i.name === 'admin')?.children
  const routeMap = routes?.map(i => ({
    menu_name: i.meta?.title,
    permission_code: i.name
  }))
  routeList.value = (routeMap as { menu_name: string; permission_code: string }[]) || []
})
</script>

<style scoped lang="scss">
/* 表单控件 */
.form-control,
.form-select,
.form-textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
  font-family: inherit;
  font-size: 14px;
  transition: border-color 0.3s ease;
}

.form-select {
  padding-right: 32px;
  appearance: none;
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 16px;
}

.form-control:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

/* 内容卡片样式 */
.content-card {
  background: var(--bg-white);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  margin-bottom: 24px;
  overflow: hidden;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-color);
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

.card-subtitle {
  font-size: 14px;
  color: var(--text-secondary);
  margin-top: 4px;
}

.card-actions {
  display: flex;
  gap: 12px;
}

.card-body {
  padding: 20px;
}

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

.search-bar {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;

  .search-input {
    flex: 1;
    max-width: 300px;
    padding: 8px 12px;
    border: 1px solid var(--border-color);
    border-radius: var(--radius);
  }
}

.filters {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
  flex-wrap: wrap;

  .filter-item {
    display: flex;
    align-items: center;
    gap: 8px;

    .filter-label {
      font-size: 14px;
      color: var(--text-primary);
      white-space: nowrap;
    }

    .filter-select {
      min-width: 120px;
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

      .btn:last-child {
        margin-right: 0;
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
