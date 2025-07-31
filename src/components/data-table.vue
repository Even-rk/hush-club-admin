<template>
  <div class="data-table-wrapper">
    <!-- 加载状态 -->
    <div v-if="loading" class="table-loading">
      <div class="loading-spinner">
        <div class="spinner"></div>
        <span class="loading-text">加载中...</span>
      </div>
    </div>

    <!-- 表格 -->
    <table v-else class="data-table" :class="[`data-table--${size}`]">
      <thead>
        <tr>
          <th
            v-for="column in columns"
            :key="String(column.key)"
            class="table-cell--left"
            :style="{ width: column.width }"
          >
            {{ column.title }}
          </th>
          <th v-if="showActions" class="table-cell--left">操作</th>
        </tr>
      </thead>
      <tbody>
        <!-- 空数据状态 -->
        <tr v-if="data.length === 0">
          <td :colspan="columns.length + (showActions ? 1 : 0)" class="table-empty">
            <div class="empty-state">
              <div class="empty-icon">📄</div>
              <div class="empty-text">{{ emptyText }}</div>
            </div>
          </td>
        </tr>

        <!-- 数据行 -->
        <tr v-for="(row, rowIndex) in data" :key="getRowKey(row, rowIndex)">
          <td v-for="column in columns" :key="String(column.key)" class="table-cell--left">
            <!-- 插槽内容 -->
            <slot
              v-if="column.slot"
              :name="column.slot"
              :row="row"
              :value="getValue(row, column.key)"
              :index="rowIndex"
            />

            <!-- 图片类型 -->
            <div v-else-if="column.type === 'image'" class="table-image">
              <img
                v-if="getValue(row, column.key)"
                :src="String(getValue(row, column.key))"
                :alt="column.title"
              />
              <span v-else>--</span>
            </div>

            <!-- 价格类型 -->
            <span v-else-if="column.type === 'price'"> ¥{{ getValue(row, column.key) }} </span>

            <!-- 状态类型 -->
            <span
              v-else-if="column.type === 'status'"
              class="status-badge"
              :class="getStatusClass(getValue(row, column.key), column)"
            >
              {{ getStatusText(getValue(row, column.key), column) }}
            </span>

            <!-- 日期类型 -->
            <span v-else-if="column.type === 'date'">
              {{ formatDate(getValue(row, column.key)) }}
            </span>

            <!-- 格式化函数 -->
            <span v-else-if="column.formatter">
              {{ column.formatter(getValue(row, column.key) as Date, row) }}
            </span>

            <!-- 默认文本 -->
            <span v-else>
              <template v-if="typeof getValue(row, column.key) !== 'number'">
                {{ getValue(row, column.key) || '--' }}
              </template>
              <template v-else>
                {{ getValue(row, column.key) }}
              </template>
            </span>
          </td>

          <!-- 操作列 -->
          <td v-if="showActions" class="table-cell--left">
            <div class="table-actions">
              <template v-for="action in actions" :key="action.text">
                <button
                  v-if="isActionVisible(action, row)"
                  class="btn btn-sm"
                  :class="[`btn-${action.type || 'secondary'}`]"
                  :disabled="isActionDisabled(action, row)"
                  @click="action.onClick?.(row, rowIndex)"
                >
                  {{ action.text }}
                </button>
              </template>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts" generic="T extends Record<string, unknown>">
import type { TableColumn, TableAction, TableProps } from '@/types/supabase'

// Props
const props = withDefaults(defineProps<TableProps<T>>(), {
  data: () => [],
  columns: () => [],
  actions: () => [],
  showActions: true,
  rowKey: 'id',
  loading: false,
  emptyText: '暂无数据',
  size: 'medium'
})

// 获取行的唯一标识
const getRowKey = (row: T, index: number): string => {
  if (typeof props.rowKey === 'string') {
    return String(row[props.rowKey]) || String(index)
  }
  return String(row[props.rowKey as keyof T]) || String(index)
}

// 获取行数据的值
const getValue = (row: T, key: keyof T | string): unknown => {
  if (typeof key === 'string') {
    return row[key as keyof T]
  }
  return row[key]
}

// 格式化日期
const formatDate = (dateStr: unknown): string => {
  if (!dateStr) {
    return '--'
  }

  if (typeof dateStr !== 'string') {
    return String(dateStr)
  }

  if (dateStr.includes('T')) {
    return dateStr.split('T')[0]
  }
  return dateStr
}

// 获取状态文本
const getStatusText = (value: unknown, column: TableColumn<T>): string => {
  if (!column.statusMap || !value) {
    return String(value || '--')
  }

  const status = column.statusMap[String(value)]
  return status?.text || String(value)
}

// 获取状态样式类
const getStatusClass = (value: unknown, column: TableColumn<T>): string => {
  if (!column.statusMap || !value) {
    return ''
  }

  const status = column.statusMap[String(value)]
  return status?.className || ''
}

// 判断操作是否可见
const isActionVisible = (action: TableAction<T>, row: T): boolean => {
  if (typeof action.visible === 'function') {
    return action.visible(row)
  }
  return action.visible !== false
}

// 判断操作是否禁用
const isActionDisabled = (action: TableAction<T>, row: T): boolean => {
  if (typeof action.disabled === 'function') {
    return action.disabled(row)
  }
  return action.disabled === true
}
</script>

<style lang="scss" scoped>
.data-table-wrapper {
  position: relative;
}

.table-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;

  .loading-spinner {
    display: flex;
    align-items: center;
    gap: 12px;
    color: var(--text-secondary);
  }

  .spinner {
    width: 32px;
    height: 32px;
    border: 3px solid var(--border-color);
    border-top: 3px solid var(--primary-color);
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  .loading-text {
    font-size: 14px;
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 16px;

  &--small {
    font-size: 12px;

    th,
    td {
      padding: 8px 12px;
    }
  }

  &--medium {
    font-size: 14px;

    th,
    td {
      padding: 12px 16px;
    }
  }

  &--large {
    font-size: 16px;

    th,
    td {
      padding: 16px 20px;
    }
  }

  th {
    background: var(--bg-gray);
    color: var(--text-primary);
    font-weight: 600;
    border-bottom: 1px solid var(--border-color);
    text-align: left;
  }

  td {
    border-bottom: 1px solid var(--border-color);
    color: var(--text-primary);
    vertical-align: middle;
  }

  tbody tr:hover {
    background: var(--secondary-color);
  }
}

.table-cell {
  &--left {
    text-align: left;
  }

  &--center {
    text-align: center;
  }

  &--right {
    text-align: right;
  }
}

.table-empty {
  text-align: center;
  padding: 60px 20px !important;
  border-bottom: none !important;

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;

    .empty-icon {
      font-size: 48px;
      opacity: 0.5;
    }

    .empty-text {
      font-size: 16px;
      color: var(--text-secondary);
    }
  }
}

.table-image {
  img {
    width: 40px;
    height: 40px;
    object-fit: contain;
    border-radius: 4px;
  }
}

.table-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.status-badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  text-align: center;

  &.status-success {
    background: rgba(76, 175, 80, 0.1);
    color: var(--success-color);
  }

  &.status-warning {
    background: rgba(255, 193, 7, 0.1);
    color: var(--warning-color);
  }

  &.status-error,
  &.status-danger {
    background: rgba(244, 67, 54, 0.1);
    color: var(--error-color);
  }

  &.status-info {
    background: rgba(33, 150, 243, 0.1);
    color: var(--info-color);
  }

  &.status-silver {
    background: rgba(192, 192, 192, 0.1);
    color: var(--silver-color);
  }

  &.status-gold {
    background: rgba(255, 215, 0, 0.1);
    color: var(--gold-color);
  }

  &.status-diamond {
    background: var(--secondary-color);
    color: var(--primary-color);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .data-table {
    font-size: 12px;

    th,
    td {
      padding: 8px 12px;
    }
  }

  .table-actions {
    gap: 4px;

    .btn {
      font-size: 11px;
      padding: 4px 8px;
    }
  }

  .empty-state {
    .empty-icon {
      font-size: 32px;
    }

    .empty-text {
      font-size: 14px;
    }
  }
}

/* 按钮样式优化 */
.btn {
  &.btn-sm {
    padding: 6px 12px;
    font-size: 12px;
    border-radius: var(--radius);
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-weight: 500;
  }

  &.btn-primary {
    background: var(--primary-color);
    color: white;

    &:hover:not(:disabled) {
      background: var(--primary-dark);
    }
  }

  &.btn-secondary {
    flex-shrink: 0;
    background: var(--bg-gray);
    color: var(--text-primary);
    border: 1px solid var(--border-color);

    &:hover:not(:disabled) {
      background: #e0e0e0;
    }
  }

  &.btn-success {
    background: var(--success-color);
    color: white;

    &:hover:not(:disabled) {
      background: #45a049;
    }
  }

  &.btn-warning {
    background: var(--warning-color);
    color: white;

    &:hover:not(:disabled) {
      background: #e6a800;
    }
  }

  &.btn-error,
  &.btn-danger {
    background: var(--error-color);
    color: white;

    &:hover:not(:disabled) {
      background: #d32f2f;
    }
  }

  &.btn-info {
    background: var(--info-color);
    color: white;

    &:hover:not(:disabled) {
      background: #1976d2;
    }
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}
</style>
