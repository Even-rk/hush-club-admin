<template>
  <transition name="modal-fade">
    <div v-if="visible" class="user-modal-overlay" @click="emit('close')">
      <transition name="modal-scale">
        <div v-if="visible" class="user-modal" @click.stop>
          <!-- 装饰性背景 -->
          <div class="modal-decoration">
            <div class="decoration-circle decoration-circle-1"></div>
            <div class="decoration-circle decoration-circle-2"></div>
          </div>

          <!-- 弹窗头部 -->
          <div class="user-modal-header">
            <div class="header-content">
              <div class="header-icon">
                {{ mode === 'add' ? '👤' : '✏️' }}
              </div>
              <h3 class="modal-title">
                {{ mode === 'add' ? '添加用户' : '编辑用户' }}
              </h3>
            </div>
            <button class="modal-close" @click="emit('close')">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <!-- 弹窗内容 -->
          <div class="user-modal-body">
            <form class="user-form">
              <!-- 用户名 -->
              <div class="form-group">
                <label class="form-label required">用户名</label>
                <input
                  v-model="form.username"
                  type="text"
                  class="form-control"
                  placeholder="请输入用户名"
                  maxlength="50"
                />
              </div>

              <!-- 邮箱 -->
              <div class="form-group">
                <label class="form-label required">手机号</label>
                <input
                  v-model="form.phone"
                  type="email"
                  class="form-control"
                  placeholder="请输入手机号"
                />
              </div>

              <!-- 邮箱 -->
              <div class="form-group">
                <label class="form-label required">密码</label>
                <input
                  v-model="form.password"
                  type="password"
                  class="form-control"
                  placeholder="请输入帐号密码"
                />
              </div>

              <!-- 邮箱 -->
              <div class="form-group">
                <label class="form-label required">权限</label>
                <CoolSelect
                  v-model="form.role_id"
                  :options="roleOptions"
                  placeholder="请选择权限"
                />
              </div>

              <!-- 用户状态 -->
              <div class="form-group">
                <label class="form-label">用户状态</label>
                <div class="radio-group">
                  <label class="radio-item">
                    <input v-model="form.status" type="radio" value="active" />
                    <span class="radio-label">启用</span>
                  </label>
                  <label class="radio-item">
                    <input v-model="form.status" type="radio" value="inactive" />
                    <span class="radio-label">禁用</span>
                  </label>
                </div>
              </div>
            </form>
          </div>

          <!-- 弹窗底部 -->
          <div class="user-modal-footer">
            <button class="btn btn-secondary" @click="emit('close')">
              <span class="btn-icon">❌</span>
              取消
            </button>
            <button class="btn btn-primary" :disabled="loading" @click="submit">
              <span v-if="!loading" class="btn-icon">✅</span>
              <span v-if="loading" class="loading-spinner"></span>
              {{ loading ? '提交中...' : '确定' }}
            </button>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { User } from '@/types/supabase'
import CoolSelect from '@/components/cool-select.vue'

interface Props {
  visible: boolean
  mode?: 'add' | 'edit'
  userData: User
  roleOptions: {
    label: string
    value: number
  }[]
}

interface Emits {
  (e: 'close'): void
  (e: 'success', data: User, mode: 'add' | 'edit'): void
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'add'
})

const emit = defineEmits<Emits>()

// 表单数据
const form = ref({} as User)

// 加载状态
const loading = ref(false)

// 提交表单
const submit = async () => {
  if (!form.value.username?.trim() || !form.value.phone?.trim()) {
    return
  }

  loading.value = true
  try {
    const submitData = {
      ...form.value,
      username: form.value.username.trim(),
      phone: form.value.phone.trim()
    }

    emit('success', submitData as User, props.mode)
  } finally {
    loading.value = false
  }
}

// 初始化表单数据
onMounted(() => {
  if (props.mode === 'add') {
    form.value = {} as User
  } else if (props.userData) {
    form.value = {
      ...form.value,
      username: props.userData.username,
      phone: props.userData.phone,
      status: props.userData.status || 'active'
    }
  }
})
</script>

<style scoped lang="scss">
// 动画效果
@keyframes modalFadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes modalScaleIn {
  from {
    transform: scale(0.9);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

// 过渡动画
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-scale-enter-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-scale-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 1, 1);
}

.modal-scale-enter-from {
  transform: scale(0.9);
  opacity: 0;
}

.modal-scale-leave-to {
  transform: scale(0.9);
  opacity: 0;
}

.user-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  animation: modalFadeIn 0.2s ease;
}

.user-modal {
  background: linear-gradient(135deg, var(--bg-white) 0%, #fafafa 100%);
  border-radius: 20px;
  box-shadow:
    0 25px 50px -12px rgba(0, 0, 0, 0.25),
    0 0 0 1px rgba(0, 0, 0, 0.05);
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
}

// 装饰性背景
.modal-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;

  .decoration-circle {
    position: absolute;
    border-radius: 50%;

    &.decoration-circle-1 {
      width: 300px;
      height: 300px;
      background: radial-gradient(circle, rgba(255, 107, 53, 0.1) 0%, transparent 70%);
      top: -150px;
      right: -150px;
      animation: float 20s infinite ease-in-out;
    }

    &.decoration-circle-2 {
      width: 200px;
      height: 200px;
      background: radial-gradient(circle, rgba(255, 140, 97, 0.08) 0%, transparent 70%);
      bottom: -100px;
      left: -100px;
      animation: float 15s infinite ease-in-out reverse;
    }
  }
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
  }
}

.user-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 28px;
  background: linear-gradient(135deg, var(--primary-light) 0%, var(--primary-color) 100%);
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  }

  .header-content {
    display: flex;
    align-items: center;
    gap: 12px;

    .header-icon {
      width: 36px;
      height: 36px;
      background: rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(10px);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
    }
  }

  .modal-title {
    margin: 0;
    font-size: 20px;
    font-weight: 700;
    color: var(--bg-white);
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .modal-close {
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    color: var(--bg-white);
    cursor: pointer;
    padding: 0;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    transition: all 0.3s ease;

    &:hover {
      background: rgba(255, 255, 255, 0.3);
      transform: rotate(90deg);
    }

    svg {
      width: 20px;
      height: 20px;
    }
  }
}

.user-modal-body {
  padding: 28px;
  overflow-y: auto;
  flex: 1;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: var(--border-color);
    border-radius: 3px;

    &:hover {
      background: var(--text-light);
    }
  }
}

.user-modal-footer {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding: 20px 28px;
  background: linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.02) 100%);
  border-top: 1px solid rgba(0, 0, 0, 0.06);

  .btn {
    min-width: 100px;
    padding: 10px 20px;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    position: relative;
    overflow: hidden;

    .btn-icon {
      font-size: 16px;
      transition: transform 0.3s ease;
    }

    &:hover .btn-icon {
      transform: scale(1.2);
    }

    &.btn-secondary {
      background: linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%);
      color: var(--text-primary);
      border: 1px solid var(--border-color);

      &:hover {
        background: linear-gradient(135deg, #e0e0e0 0%, #d0d0d0 100%);
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }

      &:active {
        transform: translateY(0);
      }
    }

    &.btn-primary {
      background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
      color: white;
      box-shadow: 0 4px 15px rgba(255, 107, 53, 0.3);

      &::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 0;
        height: 0;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: translate(-50%, -50%);
        transition:
          width 0.6s,
          height 0.6s;
      }

      &:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(255, 107, 53, 0.4);

        &::before {
          width: 300px;
          height: 300px;
        }
      }

      &:active:not(:disabled) {
        transform: translateY(0);
      }

      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        box-shadow: none;
      }
    }

    .loading-spinner {
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top: 2px solid white;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
  }
}

// 表单样式
.user-form {
  .form-group {
    margin-bottom: 24px;
    animation: slideInUp 0.4s ease-out;
    animation-fill-mode: both;

    @for $i from 1 through 10 {
      &:nth-child(#{$i}) {
        animation-delay: #{$i * 0.05}s;
      }
    }

    &:last-child {
      margin-bottom: 0;
    }
  }

  .form-label {
    display: block;
    margin-bottom: 8px;
    font-size: 13px;
    font-weight: 600;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.5px;

    &.required::after {
      content: ' *';
      color: var(--primary-color);
      font-size: 14px;
    }
  }

  .form-control {
    width: 100%;
    padding: 10px 14px;
    border: 2px solid var(--border-light);
    border-radius: 10px;
    font-size: 14px;
    background: var(--bg-white);
    transition: all 0.3s ease;

    &:focus {
      outline: none;
      border-color: var(--primary-color);
      box-shadow: 0 0 0 4px rgba(255, 107, 53, 0.1);
      transform: translateY(-2px);
    }

    &::placeholder {
      color: var(--text-light);
      font-size: 13px;
    }

    &:hover:not(:focus) {
      border-color: var(--border-hover);
    }
  }

  .radio-group {
    display: flex;
    gap: 16px;

    .radio-item {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      padding: 8px 16px;
      border: 2px solid var(--border-light);
      border-radius: 10px;
      transition: all 0.3s ease;

      &:hover {
        border-color: var(--primary-light);
        background: rgba(255, 107, 53, 0.05);
      }

      &:has(input:checked) {
        border-color: var(--primary-color);
        background: linear-gradient(
          135deg,
          rgba(255, 107, 53, 0.1) 0%,
          rgba(255, 107, 53, 0.05) 100%
        );
      }

      input[type='radio'] {
        margin: 0;
        accent-color: var(--primary-color);
        width: 16px;
        height: 16px;
      }

      .radio-label {
        font-size: 14px;
        color: var(--text-primary);
        font-weight: 500;
      }
    }
  }
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
