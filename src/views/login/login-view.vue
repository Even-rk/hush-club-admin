<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-header">
        <h1>HUSH CLUB</h1>
        <p>管理后台登录</p>
      </div>
      <form id="loginForm" class="login-form" @submit.prevent="login">
        <div class="form-group">
          <label>用户名</label>
          <input v-model="loginForm.username" type="text" class="form-control" required />
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

const loginForm = ref({
  username: 'admin',
  password: '123456'
})

const login = async () => {
  const data = await SupabaseLogin(loginForm.value)
  console.log(data)
}
</script>
