<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-header">
        <h1>HUSH CLUB</h1>
        <p>管理后台登录</p>
      </div>
      <form id="loginForm" class="login-form" @submit.prevent="login">
        <div class="form-group">
          <label>邮箱</label>
          <input v-model="loginForm.email" type="email" class="form-control" required />
        </div>
        <div class="form-group">
          <label>密码</label>
          <input v-model="loginForm.password" type="password" class="form-control" required />
        </div>
        <button type="submit" class="btn btn-primary login-btn">登录</button>
      </form>
      <div class="login-footer">
        <p>© 2024 HUSH CLUB. All rights reserved.</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { SupabaseLogin } from '@/utils/auto'
import useUserStore from '@/stores/modules/user-info'
import { useRouter } from 'vue-router'
const router = useRouter()

const loginForm = ref({
  email: 'kwr011024@163.com',
  password: 'kwr102466'
})

const login = async () => {
  const { setUserInfo } = useUserStore()
  const data = await SupabaseLogin(loginForm.value)
  if (data) {
    setUserInfo(data)
    router.push('/dashboard')
  }
}
</script>
