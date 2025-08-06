<template>
  <div class="admin-layout">
    <!-- 侧边栏 -->
    <div class="sidebar">
      <div class="sidebar-header">
        <div class="logo">HUSH CLUB</div>
        <div class="logo-subtitle">管理后台</div>
      </div>

      <nav class="sidebar-nav">
        <div class="nav-section">
          <div class="nav-section-title">概览</div>
          <router-link
            v-if="permissionList.includes('dashboard')"
            to="/dashboard"
            class="nav-item"
            :class="{ active: $route.name === 'dashboard' }"
          >
            <span class="nav-icon">📊</span>
            数据概览
          </router-link>
        </div>

        <div class="nav-section">
          <div class="nav-section-title">商品管理</div>
          <router-link
            v-if="permissionList.includes('products')"
            to="/products"
            class="nav-item"
            :class="{ active: $route.name === 'products' }"
          >
            <span class="nav-icon">☕</span>
            商品列表
          </router-link>
          <router-link
            v-if="permissionList.includes('categories')"
            to="/categories"
            class="nav-item"
            :class="{ active: $route.name === 'categories' }"
          >
            <span class="nav-icon">📁</span>
            分类管理
          </router-link>
        </div>

        <div class="nav-section">
          <div class="nav-section-title">订单管理</div>
          <router-link
            v-if="permissionList.includes('orders')"
            to="/orders"
            class="nav-item"
            :class="{ active: $route.name === 'orders' }"
          >
            <span class="nav-icon">📋</span>
            订单列表
          </router-link>
          <router-link
            v-if="permissionList.includes('order_stats')"
            to="/order-stats"
            class="nav-item"
            :class="{ active: $route.name === 'order-stats' }"
          >
            <span class="nav-icon">📈</span>
            订单统计
          </router-link>
        </div>

        <div class="nav-section">
          <div class="nav-section-title">会员管理</div>
          <router-link
            v-if="permissionList.includes('members')"
            to="/members"
            class="nav-item"
            :class="{ active: $route.name === 'members' }"
          >
            <span class="nav-icon">👥</span>
            会员列表
          </router-link>
          <router-link
            v-if="permissionList.includes('member_levels')"
            to="/member-levels"
            class="nav-item"
            :class="{ active: $route.name === 'member-levels' }"
          >
            <span class="nav-icon">🏆</span>
            等级管理
          </router-link>
        </div>

        <div class="nav-section">
          <div class="nav-section-title">营销管理</div>
          <router-link
            v-if="permissionList.includes('coupons')"
            to="/coupons"
            class="nav-item"
            :class="{ active: $route.name === 'coupons' }"
          >
            <span class="nav-icon">🎫</span>
            优惠券管理
          </router-link>
        </div>

        <div class="nav-section">
          <div class="nav-section-title">系统设置</div>
          <router-link
            v-if="permissionList.includes('member_config')"
            to="/member-config"
            class="nav-item"
            :class="{ active: $route.name === 'member-config' }"
          >
            <span class="nav-icon">⚙️</span>
            会员配置
          </router-link>
          <router-link
            v-if="permissionList.includes('users')"
            to="/users"
            class="nav-item"
            :class="{ active: $route.name === 'users' }"
          >
            <span class="nav-icon">👤</span>
            用户管理
          </router-link>
        </div>
      </nav>
    </div>

    <!-- 主内容区域 -->
    <div class="main-content">
      <!-- 顶部导航栏 -->
      <div class="top-header">
        <div class="database-memory-usage">
          <template v-if="userInfo.role_code === 'superadmin'">
            <div
              v-for="item in memoryUsage"
              :key="item.metric_name"
              class="database-memory-usage-item"
            >
              <span>{{ item.metric_name }}：</span>
              <span>{{ item.size_gb }}GB/{{ item.quota_gb }}GB</span>
            </div>
          </template>
        </div>
        <!-- 使用量警告 -->
        <template v-if="userInfo.role_code == 'superadmin'">
          <template v-if="memoryUsage.some(i => i.usage_percentage > 90)">
            <div class="danger">当前内存使用量已达警戒线,请联系开发者,进行系统升级！</div>
          </template>
        </template>
        <div class="header">
          <div class="user-menu" @click="toggleDropdown">
            <div class="user-avatar">A</div>
            <div class="user-name">管理员</div>
            <span :class="{ 'dropdown-arrow': true, 'dropdown-arrow--open': showDropdown }">▼</span>

            <!-- 下拉菜单 -->
            <div v-show="showDropdown" class="dropdown-menu">
              <div class="dropdown-item dropdown-item--danger" @click="logout">
                <span class="dropdown-icon">🚪</span>
                退出登录
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 主内容区域 -->
      <div class="content-area">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reqGetDatabaseMemoryUsage, reqGetUserPermission } from '@/api/supabase'
import useUserStore from '@/stores/modules/user-info'
import { supabase } from '@/utils/supabase'
import type { DatabaseMemoryUsage } from '@/types/supabase'
import { storeToRefs } from 'pinia'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { UserInfo } from '@/types/stores'

const { userInfo } = storeToRefs(useUserStore())
const router = useRouter()
//
const memoryUsage = ref<DatabaseMemoryUsage[]>([])

// 下拉菜单显示状态
const showDropdown = ref(false)

// 切换下拉菜单
const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
}

// 退出登录
const logout = async () => {
  showDropdown.value = false
  const { setUserInfo } = useUserStore()
  setUserInfo({} as UserInfo)
  await supabase.auth.signOut()
  router.push('/login')
}

// 菜单权限列表
const permissionList = ref<string[]>([])
onMounted(async () => {
  const permissions = await reqGetUserPermission(userInfo.value.id)
  permissionList.value = permissions

  const memoryUsageData = await reqGetDatabaseMemoryUsage()
  memoryUsage.value = memoryUsageData
})

// 点击其他地方关闭下拉菜单
onMounted(() => {
  document.addEventListener('click', event => {
    const userMenu = document.querySelector('.user-menu')
    if (userMenu && !userMenu.contains(event.target as Node)) {
      showDropdown.value = false
    }
  })
})
</script>

<style lang="scss" scoped>
/* 管理后台布局 */
.admin-layout {
  display: flex;
  min-height: 100vh;
}

/* 侧边栏 */
.sidebar {
  width: var(--sidebar-width);
  background: var(--bg-white);
  box-shadow: var(--shadow-lg);
  position: fixed;
  height: 100vh;
  z-index: 1000;
  overflow-y: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
}

.sidebar-header {
  padding: 24px 20px;
  border-bottom: 1px solid var(--border-color);
  text-align: center;
  position: sticky;
  top: 0;
  background: var(--bg-white);
  z-index: 10;
}

.logo {
  font-size: 24px;
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: 8px;
}

.logo-subtitle {
  font-size: 12px;
  color: var(--text-secondary);
}

.sidebar-nav {
  padding: 20px 0;
}

.nav-section {
  margin-bottom: 24px;
}

.nav-section-title {
  padding: 0 20px;
  font-size: 12px;
  color: var(--text-light);
  text-transform: uppercase;
  font-weight: 600;
  margin-bottom: 8px;
}

.nav-item {
  display: block;
  padding: 12px 20px;
  color: var(--text-secondary);
  text-decoration: none;
  transition: all 0.3s ease;
  border-left: 3px solid transparent;
}

.nav-item:hover,
.nav-item.active {
  background-color: var(--secondary-color);
  color: var(--primary-color);
  border-left-color: var(--primary-color);
}

.nav-icon {
  display: inline-block;
  width: 20px;
  margin-right: 12px;
  text-align: center;
}

/* 主内容区域 */
.main-content {
  flex: 1;
  margin-left: var(--sidebar-width);
  background: var(--bg-gray);
}

/* 顶部导航栏 */
.top-header {
  background: var(--bg-white);
  padding: 16px 24px;
  box-shadow: var(--shadow);
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header {
  display: flex;
  align-items: center;
  gap: 16px;
}

/* 内容区域 */
.content-area {
  padding: 36px;
}

/* 用户菜单 */
.user-menu {
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: var(--radius);
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: var(--bg-gray);
  }
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--primary-color);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
}

.user-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
}

.dropdown-arrow {
  font-size: 12px;
  color: var(--text-secondary);
  transition: transform 0.2s ease;

  &--open {
    transform: rotate(180deg);
  }
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background: var(--bg-white);
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
  box-shadow: var(--shadow-lg);
  z-index: 1000;
  padding: 8px 0;
  margin-top: 4px;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  font-size: 14px;
  color: var(--text-primary);
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: var(--bg-gray);
  }

  &--danger {
    color: var(--error-color);

    &:hover {
      background-color: rgba(244, 67, 54, 0.1);
    }
  }
}

.dropdown-icon {
  font-size: 16px;
}

.database-memory-usage {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 8px 12px;
  border-radius: var(--radius);
  cursor: pointer;
  transition: background-color 0.2s ease;
  font-size: 12px;
  color: var(--text-primary);
  .database-memory-usage-item {
    display: flex;
    align-items: center;
    gap: 8px;
    > span:last-child {
      color: var(--primary-color);
    }
  }
}

.danger {
  color: var(--error-color);
  font-size: 20px;
}
</style>
