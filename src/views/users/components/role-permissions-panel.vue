<template>
  <div class="content-card permission-card">
    <div class="card-header">
      <div class="card-title-section">
        <div class="card-title">
          <span class="title-icon">🔐</span>
          角色权限配置
        </div>
        <p class="card-description">配置不同角色的系统访问权限</p>
      </div>
    </div>
    <div class="card-body">
      <div class="role-grid-enhanced">
        <div
          v-for="(role, index) in rolePermissionList"
          :key="role.id"
          class="role-card-enhanced"
          :class="`role-${role.role_code.toLowerCase()}`"
        >
          <!-- 角色卡片头部 -->
          <div class="role-card-header">
            <div class="role-info">
              <span class="role-icon">
                {{
                  role.role_code === 'SUPERADMIN' ? '👑' : role.role_code === 'ADMIN' ? '⭐' : '👤'
                }}
              </span>
              <div class="role-text">
                <h3 class="role-name">{{ role.role_name }}</h3>
                <span class="role-code">{{ role.role_code }}</span>
              </div>
            </div>
            <div class="role-actions">
              <template v-if="!editPermission[index].isEdit">
                <button
                  class="btn-icon-only"
                  title="编辑权限"
                  @click="onEditPermission(role.id, index)"
                >
                  ✏️
                </button>
              </template>
              <div v-if="editPermission[index].isEdit" class="edit-actions">
                <button class="btn-icon-text cancel" @click="editPermission[index].isEdit = false">
                  <span>❌</span>
                  取消
                </button>
                <button class="btn-icon-text save" @click="onSavePermission(role.id)">
                  <span>✅</span>
                  保存
                </button>
              </div>
            </div>
          </div>

          <!-- 权限列表 -->
          <div class="role-permissions-container">
            <template v-if="!editPermission[index].isEdit">
              <div class="permission-tags">
                <span
                  v-for="permission in role.permissions"
                  :key="permission.permission_code"
                  class="permission-tag"
                >
                  {{ permission.menu_name }}
                </span>
                <span
                  v-if="!role.permissions || role.permissions.length === 0"
                  class="no-permission"
                >
                  暂无权限
                </span>
              </div>
            </template>

            <template v-if="editPermission[index].isEdit">
              <div class="permission-checkboxes">
                <label
                  v-for="routeItem in routeList"
                  :key="routeItem.permission_code"
                  class="permission-checkbox"
                >
                  <input
                    v-model="selectedPermission"
                    :value="routeItem.permission_code"
                    type="checkbox"
                    class="checkbox-input"
                  />
                  <span class="checkbox-label">{{ routeItem.menu_name }}</span>
                </label>
              </div>
            </template>
          </div>

          <!-- 角色统计 -->
          <div class="role-stats">
            <div class="stat-item">
              <span class="stat-value">{{ role.permissions?.length || 0 }}</span>
              <span class="stat-name">权限数</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">
                {{ userList.filter(u => u.role_id === role.id).length }}
              </span>
              <span class="stat-name">用户数</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { User, RolePermission } from '@/types/supabase'
import { ref } from 'vue'

interface Props {
  rolePermissionList: RolePermission[]
  userList: User[]
  routeList: { menu_name: string; permission_code: string }[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  editPermission: [roleId: number, index: number]
  savePermission: [roleId: number]
}>()

// 编辑权限状态
const editPermission = ref<{ isEdit: boolean }[]>(
  props.rolePermissionList.map(() => ({ isEdit: false }))
)

// 当前选择的权限
const selectedPermission = ref<string[]>([])

// 编辑权限
const onEditPermission = (roleId: number, editIndex: number) => {
  const target = props.rolePermissionList.find(i => i.id === roleId)
  if (!target) {
    selectedPermission.value = []
  } else {
    selectedPermission.value = target.permissions.map(i => i.permission_code)
  }
  // 先关闭所有的
  editPermission.value = editPermission.value.map(() => ({ isEdit: false }))
  // 打开当前的
  editPermission.value[editIndex].isEdit = true

  emit('editPermission', roleId, editIndex)
}

// 保存权限
const onSavePermission = (roleId: number) => {
  emit('savePermission', roleId)
  console.log('保存权限:', roleId, selectedPermission.value)
}
</script>

<style scoped lang="scss">
/* 内容卡片 */
.content-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  margin-bottom: 24px;

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 24px;
    border-bottom: 1px solid var(--border-light);

    .card-title-section {
      .card-title {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 18px;
        font-weight: 600;
        color: var(--text-heading);
        margin: 0;

        .title-icon {
          font-size: 20px;
        }
      }

      .card-description {
        margin: 4px 0 0 0;
        font-size: 13px;
        color: var(--text-subtitle);
      }
    }
  }

  .card-body {
    padding: 24px;
  }
}

/* 角色权限网格 */
.role-grid-enhanced {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
}

/* 增强版角色卡片 */
.role-card-enhanced {
  background: white;
  border: 2px solid var(--border-medium);
  border-radius: 12px;
  padding: 20px;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
    transform: translateY(-2px);
  }

  &.role-superadmin {
    border-color: var(--error-color);
    background: linear-gradient(135deg, rgba(239, 68, 68, 0.05) 0%, transparent 100%);
  }

  &.role-admin {
    border-color: var(--warning-color);
    background: linear-gradient(135deg, rgba(245, 158, 11, 0.05) 0%, transparent 100%);
  }

  &.role-staff {
    border-color: var(--info-color);
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, transparent 100%);
  }

  .role-card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid var(--border-light);

    .role-info {
      display: flex;
      align-items: center;
      gap: 12px;

      .role-icon {
        font-size: 28px;
      }

      .role-text {
        .role-name {
          font-size: 16px;
          font-weight: 600;
          color: var(--text-heading);
          margin: 0 0 4px 0;
        }

        .role-code {
          font-size: 12px;
          color: var(--text-muted);
          font-family: monospace;
        }
      }
    }

    .role-actions {
      .btn-icon-only {
        padding: 6px;
        background: transparent;
        border: none;
        font-size: 16px;
        cursor: pointer;
        opacity: 0.6;
        transition: opacity 0.2s;

        &:hover {
          opacity: 1;
        }
      }

      .edit-actions {
        display: flex;
        gap: 8px;

        .btn-icon-text {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 4px 12px;
          border: none;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;

          span {
            font-size: 14px;
          }

          &.cancel {
            background: var(--error-bg);
            color: var(--error-color);

            &:hover {
              background: var(--error-bg);
            }
          }

          &.save {
            background: var(--success-bg);
            color: var(--success-color);

            &:hover {
              background: var(--success-bg);
            }
          }
        }
      }
    }
  }

  .role-permissions-container {
    min-height: 120px;

    .permission-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;

      .permission-tag {
        padding: 4px 12px;
        background: var(--border-light);
        border-radius: 6px;
        font-size: 13px;
        color: var(--text-dark);
      }

      .no-permission {
        color: var(--text-muted);
        font-style: italic;
        font-size: 13px;
      }
    }

    .permission-checkboxes {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
      gap: 12px;

      .permission-checkbox {
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
        font-size: 13px;
        color: var(--text-dark);

        .checkbox-input {
          width: 16px;
          height: 16px;
          cursor: pointer;
        }

        .checkbox-label {
          user-select: none;
        }

        &:hover {
          color: var(--text-heading);
        }
      }
    }
  }

  .role-stats {
    display: flex;
    gap: 24px;
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid var(--border-light);

    .stat-item {
      display: flex;
      flex-direction: column;
      align-items: center;

      .stat-value {
        font-size: 20px;
        font-weight: 700;
        color: var(--text-heading);
      }

      .stat-name {
        font-size: 12px;
        color: var(--text-muted);
        margin-top: 4px;
      }
    }
  }
}
</style>
