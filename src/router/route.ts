import type { RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    meta: {
      title: '登录'
    },
    component: () => import('@/views/login/login-view.vue')
  },
  {
    path: '/admin',
    name: 'admin',
    meta: {
      title: '后台管理'
    },
    component: () => import('@/layout/index.vue'),
    children: [
      {
        // 数据概览
        path: '/dashboard',
        name: 'dashboard',
        meta: {
          title: '数据概览'
        },
        component: () => import('@/views/dashboard/dashboard-view.vue')
      },
      {
        // 商品列表
        path: '/products',
        name: 'products',
        meta: {
          title: '商品列表'
        },
        component: () => import('@/views/products/products-view.vue')
      },
      {
        // 商品分类
        path: '/categories',
        name: 'categories',
        meta: {
          title: '商品分类'
        },
        component: () => import('@/views/categories/categories-view.vue')
      },
      {
        // 订单列表
        path: '/orders',
        name: 'orders',
        meta: {
          title: '订单列表'
        },
        component: () => import('@/views/orders/orders-view.vue')
      },
      {
        // 订单统计
        path: '/order-stats',
        name: 'order-stats',
        meta: {
          title: '订单统计'
        },
        component: () => import('@/views/order-stats/order-stats-view.vue')
      },
      {
        // 会员列表
        path: '/members',
        name: 'members',
        meta: {
          title: '会员列表'
        },
        component: () => import('@/views/members/members-view.vue')
      },
      {
        // 会员等级
        path: '/member-levels',
        name: 'member-levels',
        meta: {
          title: '会员等级'
        },
        component: () => import('@/views/member-levels/member-levels-view.vue')
      },
      {
        // 优惠券
        path: '/coupons',
        name: 'coupons',
        meta: {
          title: '优惠券'
        },
        component: () => import('@/views/coupons/coupons-view.vue')
      },
      {
        // 会员配置
        path: '/member-config',
        name: 'member-config',
        meta: {
          title: '会员配置'
        },
        component: () => import('@/views/member-config/member-config-view.vue')
      },
      {
        // 用户列表
        path: '/users',
        name: 'users',
        meta: {
          title: '用户列表'
        },
        component: () => import('@/views/users/users-view.vue')
      }
    ]
  }
]

export default routes
