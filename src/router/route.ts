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
      }
    ]
  }
]

export default routes
