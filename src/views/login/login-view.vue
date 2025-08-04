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
          <input
            v-model="loginForm.email"
            placeholder="请输入邮箱"
            type="email"
            class="form-control"
            required
          />
        </div>
        <div class="form-group">
          <label>密码</label>
          <input
            v-model="loginForm.password"
            placeholder="请输入密码"
            type="password"
            class="form-control"
            required
          />
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

<style lang="scss" scoped>
/* 登录页面样式 */
/* 表单控件样式 */
.form-control {
  display: block;
  width: 100%;
  padding: 10px 14px;
  font-size: 14px;
  line-height: 1.5;
  color: var(--text-primary);
  background-color: var(--bg-white);
  background-clip: padding-box;
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
  transition:
    border-color 0.15s ease-in-out,
    box-shadow 0.15s ease-in-out;
}

.form-control:focus {
  border-color: var(--primary-color);
  outline: 0;
  box-shadow: 0 0 0 3px rgba(var(--primary-rgb), 0.25);
}

.form-control::placeholder {
  color: var(--text-light);
  opacity: 1;
}

.form-control:disabled,
.form-control[readonly] {
  background-color: var(--bg-gray);
  opacity: 1;
}

.login-page {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  z-index: 2000;
}

.login-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: var(--bg-white);
  padding: 40px;
  border-radius: var(--radius);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  width: 90%;
  max-width: 400px;
}

.login-header {
  text-align: center;
  margin-bottom: 32px;
}

.login-header h1 {
  margin: 0 0 8px 0;
  color: var(--primary-color);
  font-size: 28px;
  font-weight: 700;
}

.login-header p {
  margin: 0;
  color: var(--text-secondary);
  font-size: 14px;
}

.login-form {
  margin-bottom: 24px;
}

.login-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 14px;
  font-size: 16px;
  font-weight: 600;
}

.login-footer {
  text-align: center;
  color: var(--text-secondary);
  font-size: 12px;
}
</style>
