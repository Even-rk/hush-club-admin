export * from './supabase/SELECT'

// Table组件相关类型定义
export interface TableColumn<T = Record<string, unknown>> {
  // 列键名
  key: keyof T | string
  // 列标题
  title: string
  // 列类型
  type?: 'text' | 'price' | 'status' | 'date' | 'image' | 'custom'
  // 列宽度
  width?: string
  // 数据格式化函数
  formatter?: (value: Date, row: T) => string
  // 状态映射（仅当type为status时使用）
  statusMap?: Record<string, { text: string; className: string }>
  // 是否可排序
  sortable?: boolean
  // 插槽名称（用于自定义内容）
  slot?: string
}

export interface TableAction<T = Record<string, unknown>> {
  // 按钮文本
  text: string
  // 按钮类型
  type?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'
  // 点击事件
  onClick?: (row: T, index: number) => void
  // 是否显示（可以是函数）
  visible?: boolean | ((row: T) => boolean)
  // 是否禁用（可以是函数）
  disabled?: boolean | ((row: T) => boolean)
  // 图标
  icon?: string
}

export interface TableProps<T = Record<string, unknown>> {
  // 表格数据
  data: T[]
  // 列配置
  columns: TableColumn<T>[]
  // 操作列配置
  actions?: TableAction<T>[]
  // 是否显示操作列
  showActions?: boolean
  // 行键
  rowKey?: keyof T | string
  // 是否显示加载状态
  loading?: boolean
  // 空数据提示
  emptyText?: string
  // 表格大小
  size?: 'small' | 'medium' | 'large'
}

// 查询supabase 内存使用量
export interface DatabaseMemoryUsage {
  // 指标名称
  metric_name: string
  // 配额（GB）
  quota_gb: number
  // 配额（MB）
  quota_mb: number
  // 大小（GB）
  size_gb: number
  // 大小（MB）
  size_mb: number
  // 使用率
  usage_percentage: number
}
