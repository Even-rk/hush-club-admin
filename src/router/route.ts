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
    component: () => import('@/layout/index.vue')
  }
]

export default routes
