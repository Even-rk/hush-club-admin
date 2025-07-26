import type { RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/login-view.vue')
  },
  {
    path: '/admin',
    name: 'admin',
    component: () => import('@/layout/index.vue'),
    children: [
      {
        // 数据概览
        path: '/dashboard',
        name: 'dashboard',
        component: () => import('@/views/dashboard/dashboard-view.vue')
      },
      {
        // 商品列表
        path: '/products',
        name: 'products',
        component: () => import('@/views/products/products-view.vue')
      },
      {
        // 商品分类
        path: '/categories',
        name: 'categories',
        component: () => import('@/views/categories/categories-view.vue')
      },
      {
        // 订单列表
        path: '/orders',
        name: 'orders',
        component: () => import('@/views/orders/orders-view.vue')
      },
      {
        // 订单统计
        path: '/order-stats',
        name: 'order-stats',
        component: () => import('@/views/order-stats/order-stats-view.vue')
      },
      {
        // 会员列表
        path: '/members',
        name: 'members',
        component: () => import('@/views/members/members-view.vue')
      },
      {
        // 会员等级
        path: '/member-levels',
        name: 'member-levels',
        component: () => import('@/views/member-levels/member-levels-view.vue')
      },
      {
        // 优惠券
        path: '/coupons',
        name: 'coupons',
        component: () => import('@/views/coupons/coupons-view.vue')
      },
      {
        // 会员配置
        path: '/member-config',
        name: 'member-config',
        component: () => import('@/views/member-config/member-config-view.vue')
      },
      {
        // 用户列表
        path: '/users',
        name: 'users',
        component: () => import('@/views/users/users-view.vue')
      }
    ]
  }
]

export default routes
