import { createRouter, createWebHashHistory } from 'vue-router'
import routes from './route'
import useUserStore from '@/stores/modules/user-info'

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to, _, next) => {
  const { userInfo } = useUserStore()
  if (to.path === '/login') {
    if (!userInfo.token) {
      next()
    } else {
      next('/dashboard')
    }
  } else if (!userInfo.token) {
    next('/login')
  } else {
    next()
  }
})

export default router
