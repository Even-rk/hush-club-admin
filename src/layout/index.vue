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
          <a href="#" class="nav-item active" @click="showPage('dashboard')">
            <span class="nav-icon">📊</span>
            数据概览
          </a>
        </div>

        <div class="nav-section">
          <div class="nav-section-title">商品管理</div>
          <a href="#" class="nav-item" @click="showPage('products')">
            <span class="nav-icon">☕</span>
            商品列表
          </a>
          <a href="#" class="nav-item" @click="showPage('categories')">
            <span class="nav-icon">📁</span>
            分类管理
          </a>
        </div>

        <div class="nav-section">
          <div class="nav-section-title">订单管理</div>
          <a href="#" class="nav-item" @click="showPage('orders')">
            <span class="nav-icon">📋</span>
            订单列表
          </a>
          <a href="#" class="nav-item" @click="showPage('order-stats')">
            <span class="nav-icon">📈</span>
            订单统计
          </a>
        </div>

        <div class="nav-section">
          <div class="nav-section-title">会员管理</div>
          <a href="#" class="nav-item" @click="showPage('members')">
            <span class="nav-icon">👥</span>
            会员列表
          </a>
          <a href="#" class="nav-item" @click="showPage('member-levels')">
            <span class="nav-icon">🏆</span>
            等级管理
          </a>
        </div>

        <div class="nav-section">
          <div class="nav-section-title">营销管理</div>
          <a href="#" class="nav-item" @click="showPage('coupons')">
            <span class="nav-icon">🎫</span>
            优惠券管理
          </a>
        </div>

        <div class="nav-section">
          <div class="nav-section-title">系统设置</div>
          <a href="#" class="nav-item" @click="showPage('member-config')">
            <span class="nav-icon">⚙️</span>
            会员配置
          </a>
          <a href="#" class="nav-item" @click="showPage('users')">
            <span class="nav-icon">👤</span>
            用户管理
          </a>
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
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup lang="ts">
const showPage = (page: string) => {
  console.log(page)
}
</script>
