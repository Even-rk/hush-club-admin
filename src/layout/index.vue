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
        <div></div>
        <div class="header">
          <div class="user-menu">
            <div class="user-avatar">A</div>
            <div class="user-name">管理员</div>
            <span>▼</span>
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
import { reqGetUserPermission } from '@/api/supabase'
import useUserStore from '@/stores/modules/user-info'
import { storeToRefs } from 'pinia'
import { onMounted, ref } from 'vue'
const { userInfo } = storeToRefs(useUserStore())

// 菜单权限列表
const permissionList = ref<string[]>([])
onMounted(async () => {
  const permissions = await reqGetUserPermission(userInfo.value.id)
  permissionList.value = permissions
})
</script>
