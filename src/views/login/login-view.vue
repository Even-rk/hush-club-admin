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

const loginForm = ref({
  username: '',
  password: ''
})

const login = () => {
  console.log(loginForm.value)
}
</script>
