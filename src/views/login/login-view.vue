<template>
  <div class="login-page">
    <!-- 背景装饰 -->
    <div class="bg-decoration">
      <!-- 浮动圆形 -->
      <div class="circle circle-1"></div>
      <div class="circle circle-2"></div>
      <div class="circle circle-3"></div>
      <div class="circle circle-4"></div>
      <div class="circle circle-5"></div>

      <!-- 波浪动画 -->
      <div class="wave-container">
        <svg
          class="waves"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 24 150 28"
          preserveAspectRatio="none"
        >
          <defs>
            <path
              id="wave"
              d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
            />
          </defs>
          <g class="wave-parallax">
            <use href="#wave" x="48" y="0" fill="rgba(255,255,255,0.05)" />
            <use href="#wave" x="48" y="3" fill="rgba(255,255,255,0.03)" />
            <use href="#wave" x="48" y="5" fill="rgba(255,255,255,0.02)" />
            <use href="#wave" x="48" y="7" fill="rgba(255,255,255,0.01)" />
          </g>
        </svg>
      </div>

      <!-- 粒子效果 -->
      <div class="particles">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>

      <!-- 渐变网格 -->
      <div class="gradient-mesh"></div>

      <!-- 光环效果 -->
      <div class="glow-orbs">
        <div class="orb orb-1"></div>
        <div class="orb orb-2"></div>
        <div class="orb orb-3"></div>
      </div>
    </div>

    <div class="login-container">
      <div class="login-header">
        <div class="logo">
          <span class="logo-icon">H</span>
        </div>
        <h1>HUSH CLUB</h1>
        <p>管理后台登录</p>
      </div>

      <form class="login-form" @submit.prevent="login">
        <div class="form-group">
          <input
            id="email"
            v-model="loginForm.phone"
            placeholder=" "
            type="text"
            class="form-control"
            required
          />
          <label for="email" class="form-label">手机号</label>
          <span class="form-highlight"></span>
        </div>

        <div class="form-group">
          <input
            id="password"
            v-model="loginForm.password"
            placeholder=" "
            :type="showPassword ? 'text' : 'password'"
            class="form-control"
            required
          />
          <label for="password" class="form-label">密码</label>
          <span class="form-highlight"></span>
          <button
            type="button"
            class="toggle-password"
            tabindex="-1"
            @click="showPassword = !showPassword"
          >
            <img v-if="showPassword" src="@/assets/icons/eye-open.svg" alt="Hide password" />
            <img v-else src="@/assets/icons/eye-closed.svg" alt="Show password" />
          </button>
        </div>

        <button type="submit" class="login-btn" :disabled="isLoading">
          <span v-show="!isLoading">立即登录</span>
          <span v-show="isLoading" class="loading">
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
          </span>
        </button>
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
import message from '@/utils/message'

const router = useRouter()
const { setUserInfo } = useUserStore()

const loginForm = ref({
  phone: '',
  password: ''
})

const showPassword = ref(false)
const isLoading = ref(false)

const login = async () => {
  isLoading.value = true

  const data = await SupabaseLogin(loginForm.value)
  if (data) {
    setUserInfo(data)
    message.success('登录成功')
    router.push('/dashboard')
  }
  setTimeout(() => {
    isLoading.value = false
  }, 500)
}
</script>

<style lang="scss" scoped>
.login-page {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, var(--primary-light) 0%, var(--primary-color) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  z-index: 2000;
}

// 背景装饰动画
.bg-decoration {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;

  // 浮动圆形
  .circle {
    position: absolute;
    border-radius: 50%;
    background: linear-gradient(45deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.2));
    backdrop-filter: blur(5px);
    animation: float 20s infinite ease-in-out;

    &.circle-1 {
      width: 300px;
      height: 300px;
      top: -150px;
      right: -150px;
      animation-delay: 0s;
    }

    &.circle-2 {
      width: 200px;
      height: 200px;
      bottom: -100px;
      left: -100px;
      animation-delay: 5s;
    }

    &.circle-3 {
      width: 150px;
      height: 150px;
      top: 50%;
      left: -75px;
      animation-delay: 10s;
    }

    &.circle-4 {
      width: 250px;
      height: 250px;
      top: 20%;
      right: 10%;
      animation: float 25s infinite ease-in-out reverse;
      animation-delay: 7s;
    }

    &.circle-5 {
      width: 100px;
      height: 100px;
      bottom: 20%;
      right: 15%;
      animation: float 15s infinite ease-in-out;
      animation-delay: 12s;
    }
  }

  // 波浪动画
  .wave-container {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 40vh;
    min-height: 200px;
    max-height: 300px;
    opacity: 0.8;

    .waves {
      position: absolute;
      width: 100%;
      height: 100%;
      bottom: 0;
      left: 0;

      .wave-parallax > use {
        animation: wave-move 25s cubic-bezier(0.55, 0.5, 0.45, 0.5) infinite;

        &:nth-child(1) {
          animation-delay: -2s;
          animation-duration: 20s;
        }

        &:nth-child(2) {
          animation-delay: -3s;
          animation-duration: 15s;
        }

        &:nth-child(3) {
          animation-delay: -4s;
          animation-duration: 13s;
        }

        &:nth-child(4) {
          animation-delay: -5s;
          animation-duration: 25s;
        }
      }
    }
  }

  // 粒子效果
  .particles {
    position: absolute;
    width: 100%;
    height: 100%;
    overflow: hidden;

    span {
      position: absolute;
      display: block;
      background: rgba(255, 255, 255, 0.8);
      border-radius: 50%;
      animation: particle-fall linear infinite;
      box-shadow: 0 0 4px rgba(255, 255, 255, 0.5);

      &:nth-child(1) {
        left: 10%;
        width: 2px;
        height: 2px;
        animation-duration: 18s;
        animation-delay: 0s;
        opacity: 0.6;
      }

      &:nth-child(2) {
        left: 20%;
        width: 3px;
        height: 3px;
        animation-duration: 22s;
        animation-delay: 2s;
        opacity: 0.8;
      }

      &:nth-child(3) {
        left: 35%;
        width: 1px;
        height: 1px;
        animation-duration: 15s;
        animation-delay: 4s;
        opacity: 0.4;
      }

      &:nth-child(4) {
        left: 48%;
        width: 2px;
        height: 2px;
        animation-duration: 20s;
        animation-delay: 1s;
        opacity: 0.7;
      }

      &:nth-child(5) {
        left: 62%;
        width: 3px;
        height: 3px;
        animation-duration: 25s;
        animation-delay: 6s;
        opacity: 0.5;
      }

      &:nth-child(6) {
        left: 75%;
        width: 2px;
        height: 2px;
        animation-duration: 18s;
        animation-delay: 3s;
        opacity: 0.9;
      }

      &:nth-child(7) {
        left: 85%;
        width: 1px;
        height: 1px;
        animation-duration: 23s;
        animation-delay: 5s;
        opacity: 0.6;
      }

      &:nth-child(8) {
        left: 90%;
        width: 2px;
        height: 2px;
        animation-duration: 16s;
        animation-delay: 8s;
        opacity: 0.8;
      }

      &:nth-child(9) {
        left: 5%;
        width: 3px;
        height: 3px;
        animation-duration: 19s;
        animation-delay: 7s;
        opacity: 0.5;
      }

      &:nth-child(10) {
        left: 95%;
        width: 2px;
        height: 2px;
        animation-duration: 21s;
        animation-delay: 9s;
        opacity: 0.7;
      }
    }
  }

  // 渐变网格
  .gradient-mesh {
    position: absolute;
    width: 200%;
    height: 200%;
    top: -50%;
    left: -50%;
    background:
      radial-gradient(circle at 20% 50%, rgba(255, 107, 53, 0.2) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(229, 90, 43, 0.15) 0%, transparent 50%),
      radial-gradient(circle at 40% 20%, rgba(255, 140, 97, 0.1) 0%, transparent 50%);
    animation: gradient-shift 30s ease-in-out infinite;
  }

  // 光环效果
  .glow-orbs {
    position: absolute;
    width: 100%;
    height: 100%;
    pointer-events: none;

    .orb {
      position: absolute;
      border-radius: 50%;
      filter: blur(40px);
      animation: orb-float 20s infinite ease-in-out;

      &.orb-1 {
        width: 300px;
        height: 300px;
        background: radial-gradient(circle, rgba(255, 107, 53, 0.3) 0%, transparent 70%);
        top: 10%;
        left: 10%;
        animation-duration: 25s;
      }

      &.orb-2 {
        width: 400px;
        height: 400px;
        background: radial-gradient(circle, rgba(255, 140, 97, 0.25) 0%, transparent 70%);
        bottom: 10%;
        right: 10%;
        animation-duration: 30s;
        animation-delay: 5s;
      }

      &.orb-3 {
        width: 250px;
        height: 250px;
        background: radial-gradient(circle, rgba(229, 90, 43, 0.35) 0%, transparent 70%);
        top: 40%;
        right: 30%;
        animation-duration: 22s;
        animation-delay: 10s;
      }
    }
  }
}

// 动画关键帧
@keyframes float {
  0%,
  100% {
    transform: translateY(0) rotate(0deg);
    opacity: 0.2;
  }
  25% {
    transform: translateY(-20px) rotate(90deg);
    opacity: 0.3;
  }
  50% {
    transform: translateY(-10px) rotate(180deg);
    opacity: 0.4;
  }
  75% {
    transform: translateY(-30px) rotate(270deg);
    opacity: 0.3;
  }
}

@keyframes wave-move {
  0% {
    transform: translate3d(-90px, 0, 0);
  }
  100% {
    transform: translate3d(85px, 0, 0);
  }
}

@keyframes particle-fall {
  0% {
    transform: translateY(0) translateX(0);
    opacity: 1;
  }
  10% {
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) translateX(20px);
    opacity: 0;
  }
}

@keyframes gradient-shift {
  0%,
  100% {
    transform: rotate(0deg) scale(1);
  }
  33% {
    transform: rotate(120deg) scale(1.1);
  }
  66% {
    transform: rotate(240deg) scale(0.9);
  }
}

@keyframes orb-float {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }
  25% {
    transform: translate(30px, -40px) scale(1.1);
  }
  50% {
    transform: translate(-20px, 20px) scale(0.95);
  }
  75% {
    transform: translate(-40px, -20px) scale(1.05);
  }
}

.login-container {
  position: relative;
  background: var(--bg-white);
  backdrop-filter: blur(10px);
  padding: 48px 40px;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-2xl);
  width: 90%;
  max-width: 420px;
  animation: slideUp 0.5s ease-out;
  border: 1px solid var(--border-light);
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// Logo 部分
.login-header {
  text-align: center;
  margin-bottom: 40px;

  .logo {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 80px;
    height: 80px;
    margin: 0 auto 20px;
    background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
    border-radius: var(--radius-xl);
    box-shadow: var(--shadow-primary-lg);
    animation: pulse 2s infinite;

    .logo-icon {
      color: var(--bg-white);
      font-size: 36px;
      font-weight: bold;
      font-family: 'Arial Black', sans-serif;
    }
  }

  h1 {
    margin: 0 0 8px 0;
    color: var(--text-heading);
    font-size: 28px;
    font-weight: 700;
    letter-spacing: 1px;
  }

  p {
    margin: 0;
    color: var(--text-secondary);
    font-size: 14px;
  }
}

@keyframes pulse {
  0% {
    box-shadow: var(--shadow-primary-lg);
  }
  50% {
    box-shadow: var(--shadow-primary);
    transform: scale(1.02);
  }
  100% {
    box-shadow: var(--shadow-primary-lg);
  }
}

// 表单样式
.login-form {
  margin-bottom: 24px;
}

.form-group {
  position: relative;
  margin-bottom: 28px;

  .form-control {
    width: 100%;
    padding: 12px 0;
    font-size: 16px;
    color: var(--text-primary);
    background: transparent;
    border: none;
    border-bottom: 2px solid var(--border-color);
    outline: none;
    transition: all 0.3s;

    &:focus,
    &:not(:placeholder-shown) {
      border-bottom-color: var(--primary-color);

      & + .form-label {
        top: -20px;
        font-size: 12px;
        color: var(--primary-color);
      }

      & ~ .form-highlight {
        width: 100%;
      }
    }
  }

  .form-label {
    position: absolute;
    top: 12px;
    left: 0;
    font-size: 16px;
    color: var(--text-light);
    pointer-events: none;
    transition: all 0.3s;
  }

  .form-highlight {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 2px;
    width: 0;
    background: linear-gradient(90deg, var(--primary-color), var(--primary-dark));
    transition: width 0.3s;
  }

  .toggle-password {
    position: absolute;
    right: 0;
    top: 12px;
    background: none;
    border: none;
    color: var(--primary-color);
    cursor: pointer;
    font-size: 14px;
    padding: 0 4px;
    transition: opacity 0.3s;

    &:hover {
      opacity: 0.8;
    }
  }
}

// 登录按钮
.login-btn {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: var(--shadow-primary-lg);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  // 加载动画
  .loading {
    display: inline-flex;
    align-items: center;
    gap: 4px;

    .dot {
      width: 8px;
      height: 8px;
      background: var(--bg-white);
      border-radius: 50%;
      animation: bounce 1.4s infinite ease-in-out both;

      &:nth-child(1) {
        animation-delay: -0.32s;
      }

      &:nth-child(2) {
        animation-delay: -0.16s;
      }
    }
  }
}

@keyframes bounce {
  0%,
  80%,
  100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}

// 页脚
.login-footer {
  text-align: center;
  margin-top: 32px;

  p {
    margin: 0;
    color: var(--text-light);
    font-size: 12px;
  }
}

// 响应式设计
@media (max-width: 480px) {
  .login-container {
    width: 95%;
    padding: 32px 24px;
  }

  .login-header {
    .logo {
      width: 64px;
      height: 64px;

      .logo-icon {
        font-size: 28px;
      }
    }

    h1 {
      font-size: 24px;
    }
  }

  .form-group {
    margin-bottom: 24px;
  }
}
</style>
