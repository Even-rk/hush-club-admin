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
      <button class="btn btn-primary btn-with-icon" @click="openAddUserModal">
        <span class="btn-icon">✨</span>
        添加用户
      </button>
    </div>

    <!-- 用户统计卡片 -->
    <UserStatsCards v-if="!loading" :user-list="userList" />

    <!-- 用户列表卡片 -->
    <div class="content-card user-list-card">
      <div class="card-header">
        <div class="card-title">用户列表</div>
      </div>

      <div class="card-body">
        <!-- 搜索和筛选区域 -->
        <div class="search-filter-container">
          <div class="search-box">
            <span class="search-icon">🔍</span>
            <input
              v-model="search"
              type="text"
              class="search-input-enhanced"
              placeholder="搜索用户名或邮箱..."
              @change="searchChange()"
            />
            <button class="search-btn" @click="searchUser()">搜索</button>
          </div>

          <div class="filter-group">
            <div class="filter-item-enhanced">
              <cool-select
                v-model="selectedRole"
                :options="roleOptions"
                placeholder="全部角色"
                @change="searchUser()"
              />
            </div>
            <div class="filter-item-enhanced">
              <cool-select
                v-model="selectedStatus"
                :options="statusOptions"
                placeholder="全部状态"
                @change="searchUser()"
              />
            </div>
            <button class="btn btn-secondary" @click="resetFilter">重置筛选</button>
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
  </div>

  <!-- 用户弹窗 -->
  <UsersModal
    :visible="showUsersModal"
    :mode="modalMode"
    :user-data="currentUser || ({} as User)"
    @close="showUsersModal = false"
    @success="refreshUserList"
  />

  <!-- 权限管理卡片 -->
  <RolePermissionsPanel
    v-if="!loading"
    :role-permission-list="rolePermissionList"
    :user-list="userList"
    :route-list="routeList"
    @edit-permission="editPermissionFn"
    @save-permission="savePermission"
  />
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
import UserStatsCards from './components/user-stats-cards.vue'
import RolePermissionsPanel from './components/role-permissions-panel.vue'
import message from '@/utils/message'
import UsersModal from './components/users-modal.vue'

// 用户列表
const userList = ref<User[]>([])
// 加载中
const loading = ref(false)

// modal相关状态
const showUsersModal = ref(false)
const modalMode = ref<'add' | 'edit'>('add')
const currentUser = ref<User | null>(null)

// 筛选器状态
const selectedRole = ref()
// 筛选状态
const selectedStatus = ref('')
// 搜索
const search = ref('')

// 角色选项
const roleOptions = ref<{ label: string; value: number }[]>([])

// 状态选项
const statusOptions = [
  { label: '正常', value: 'active' },
  { label: '已禁用', value: 'inactive' }
]
// 角色权限列表
const rolePermissionList = ref<RolePermission[]>([])
// 路由列表
const routeList = ref<{ menu_name: string; permission_code: string }[]>([])

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

// 打开编辑用户弹窗
const openEditUserModal = (user: User) => {
  modalMode.value = 'edit'
  currentUser.value = user
  showUsersModal.value = true
}

// 操作函数
const editUser = (user: User) => {
  openEditUserModal(user)
}

const resetPassword = (user: User) => {
  console.log('重置密码:', user)
}

const viewUser = (user: User) => {
  console.log('查看用户详情:', user)
}

// 编辑权限
const editPermissionFn = (roleId: number, editIndex: number) => {
  console.log('编辑权限:', roleId, editIndex)
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

// 搜索
const searchUser = async (params?: { role?: number; status?: string; query?: string }) => {
  loading.value = true
  try {
    const users = await reqGetUserList({
      role: params?.role || selectedRole.value,
      status: params?.status || selectedStatus.value,
      query: params?.query || search.value
    })
    userList.value = users
  } finally {
    loading.value = false
  }
}

// 打开添加用户弹窗
const openAddUserModal = () => {
  modalMode.value = 'add'
  currentUser.value = null
  showUsersModal.value = true
}

// 刷新用户列表
const refreshUserList = async () => {
  await searchUser()
}

// 重置筛选
const resetFilter = () => {
  if (selectedRole.value || selectedStatus.value) {
    searchUser({
      role: selectedRole.value,
      status: selectedStatus.value,
      query: search.value
    })
  } else {
    message.warning('没有筛选条件')
  }
  selectedRole.value = ''
  selectedStatus.value = ''
  search.value = ''
}

// 查询变化
const searchChange = () => {
  if (!search.value) {
    searchUser()
  }
}
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
    roleOptions.value = rolePermissions.map(i => ({
      label: i.role_name,
      value: i.id
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
/* 用户管理页面样式 */
.user-management-page {
  height: fit-content;
}

/* 页面头部 */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  padding: 24px 32px;
  background: var(--bg-white);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);

  .header-content {
    .page-title {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 28px;
      font-weight: 700;
      color: var(--text-heading);
      margin: 0 0 8px 0;

      .title-icon {
        font-size: 32px;
      }
    }

    .page-subtitle {
      color: var(--text-subtitle);
      font-size: 14px;
      margin: 0;
    }
  }
}

/* 内容卡片 */
.content-card {
  background: var(--bg-white);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
  margin-bottom: 24px;

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 24px;
    border-bottom: 1px solid var(--border-light);

    .card-title-section {
      .card-title {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 18px;
        font-weight: 600;
        color: var(--text-heading);
        margin: 0;

        .title-icon {
          font-size: 20px;
        }
      }

      .card-description {
        margin: 4px 0 0 0;
        font-size: 13px;
        color: var(--text-subtitle);
      }
    }

    .card-title {
      font-size: 18px;
      font-weight: 600;
      color: var(--text-heading);
    }
  }

  .card-body {
    padding: 24px;
  }
}

/* 搜索和筛选容器 */
.search-filter-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  gap: 16px;
  flex-wrap: wrap;

  .search-box {
    position: relative;
    flex: 1;
    max-width: 400px;

    .search-icon {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 16px;
      opacity: 0.5;
    }

    .search-input-enhanced {
      width: 100%;
      padding: 10px 100px 10px 36px;
      border: 1px solid var(--border-medium);
      border-radius: var(--radius-md);
      font-size: 14px;
      transition: all 0.2s;

      &:focus {
        outline: none;
        border-color: var(--primary-color);
        box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
      }
    }

    .search-btn {
      position: absolute;
      right: 4px;
      top: 50%;
      transform: translateY(-50%);
      padding: 6px 16px;
      background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-light) 100%);
      color: var(--bg-white);
      border: none;
      border-radius: var(--radius);
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        background: linear-gradient(135deg, var(--primary-light) 0%, var(--primary-color) 100%);
      }
    }
  }

  .filter-group {
    display: flex;
    gap: 12px;
    align-items: center;

    .filter-item-enhanced {
      min-width: 120px;
    }
  }
}

/* 按钮样式 */
.btn {
  padding: 10px 20px;
  border: none;
  border-radius: var(--radius);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 8px;

  &.btn-primary {
    background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-light) 100%);
    color: var(--bg-white);

    &:hover {
      background: linear-gradient(135deg, var(--primary-light) 0%, var(--primary-color) 100%);
      transform: translateY(-1px);
      box-shadow: var(--shadow-primary);
    }
  }

  &.btn-secondary {
    background: var(--bg-white);
    color: var(--text-subtitle);
    border: 1px solid var(--border-medium);

    &:hover {
      background: var(--bg-light);
      border-color: var(--border-hover);
    }
  }

  &.btn-with-icon {
    .btn-icon {
      font-size: 16px;
    }
  }
}

/* 用户表格样式 */
.user-table {
  :deep(.data-table) {
    border: 1px solid var(--border-medium);
    border-radius: var(--radius);
    overflow: hidden;
  }
}
</style>
