// 商品
export type Product = {
  // 商品id
  id: number
  // 分类id
  category_id: number
  // 创建时间
  created_at: string
  // 普通会员价格
  normal_member_price: number
  // 白银会员价格
  silver_member_price: number
  // 黄金会员价格
  gold_member_price: number
  // 图片url
  image_url: string | null
  // 商品名称
  product_name: string
  // 销售数量
  sales_count: number
  // 状态
  status: 'active' | 'inactive'
  // 分类名称
  category_name: string
}

// 商品分类
export type ProductCategory = {
  // 分类id
  id: number
  // 分类名称
  category_name: string
  // 创建时间
  created_at: string
  // 描述
  description: string
  // 关联商品数量
  product_count: number
  // 排序
  sort_order: number
  // 状态
  status: 'active' | 'inactive'
  // 更新时间
  updated_at: string
}

/**
 * 订单状态
 * pending 待支付
 * processing 制作中
 * completed 已完成
 * cancelled 已取消
 */
export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled'

/**
 * 支付方式
 * balance 余额支付
 * wechat 微信支付
 * alipay 支付宝
 */
export type PaymentMethod = 'balance' | 'wechat' | 'alipay'

// 商品订单
export type Order = {
  // 订单ID
  id: number
  // 订单编号
  order_no: string
  // 会员ID
  member_id: number
  // 订单总金额
  total_amount: number
  // 会员折扣
  member_discount: number
  // 优惠券折扣
  coupon_discount: number
  // 最终支付金额
  final_amount: number
  // 使用的优惠券ID
  coupon_id: number | null
  // 订单状态
  status: OrderStatus
  // 支付方式
  payment_method: PaymentMethod
  // 支付时间
  payment_time: string | null
  // 完成时间
  complete_time: string | null
  // 订单备注
  remark: string | null
  // 创建时间
  created_at: string
  // 更新时间
  updated_at: string
}

// 订单商品类型
export type OrderItem = {
  // 商品订单ID
  id: number
  // 商品订单编号
  order_id: number
  // 商品ID
  product_id: number
  // 商品名称
  product_name: string
  // 商品单价
  unit_price: number
  // 购买数量
  quantity: number
  // 小计
  subtotal: number
  // 创建时间
  created_at: string
}

// 会员信息类型
export type Member = {
  // 会员ID
  id: number
  // 会员编号
  member_code: string
  // 会员姓名
  real_name: string
  // 手机号
  phone: string
  // 会员等级ID
  level_id: number
  // 会员等级名称
  level_name: string
  // 余额
  balance: number
  // 单次最高充值总额
  total_recharge: number
  // 消费总额
  total_consumption: number
  // 订单数量
  order_count: number
  // 注册时间
  register_time: string
  // 最后登录时间
  last_login_time: string | null
  // 创建时间
  created_at: string
  // 更新时间
  updated_at: string
}

// 会员等级信息类型
export type MemberLevel = {
  // 会员等级ID
  id: number
  // 会员等级名称
  level_name: string
  // 会员等级编码
  level_code: string
  // 折扣率
  discount_rate: number
  // 会员描述
  description: string
  // 升级条件
  upgrade_condition: string
  // 状态
  status: 'active' | 'inactive'
  // 创建时间
  created_at: string
  // 更新时间
  updated_at: string
  // 会员数量
  member_count: number
}

// 会员更新记录
export type UpdateMember = {
  // 会员ID
  id: number
  // 会员id
  member_id: string
  // 会员姓名
  real_name: string
  // 手机号
  phone: string
  // 原会员等级ID
  original_level_id: number
  // 原会员等级名称
  original_level_name: string
  // 新会员等级ID
  new_level_id: number
  // 新会员等级名称
  new_level_name: string
  // 充值金额
  recharge_amount: number
  // 升级时间
  upgrade_time: string
}

// 完整订单信息类型
export type OrderDetail = {
  // 订单基础信息
  id: number
  // 订单编号
  order_no: string
  // 会员ID
  member_id: number
  // 订单总金额
  total_amount: number
  // 会员折扣
  member_discount: number
  // 优惠券折扣
  coupon_discount: number
  // 最终支付金额
  final_amount: number
  // 使用的优惠券ID
  coupon_id: number | null
  // 订单状态
  status: OrderStatus
  // 支付方式
  payment_method: string
  // 支付时间
  payment_time: string | null
  // 完成时间
  complete_time: string | null
  // 订单备注
  remark: string | null
  // 创建时间
  created_at: string
  // 更新时间
  updated_at: string
  // 会员信息
  member: Member | null
  // 订单商品明细
  order_items: OrderItem[]
}

// 用户信息类型
export type User = {
  // 用户ID
  id: number
  // 用户名
  username: string
  // 密码
  password: string
  // 创建时间
  created_at: string
  // 更新时间
  updated_at: string
  // 邮箱
  email: string
  // 状态
  status: 'active' | 'inactive'
  // 角色
  role_id: number
  // 角色名称
  role_name: string
}

// 角色权限列表
export type RolePermission = {
  // 角色ID
  role_id: number
  // 权限ID
  permission_id: number
}

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
  formatter?: (value: unknown, row: T) => string
  // 状态映射（仅当type为status时使用）
  statusMap?: Record<string, { text: string; className: string }>
  // 是否可排序
  sortable?: boolean
  // 对齐方式
  align?: 'left' | 'center' | 'right'
  // 插槽名称（用于自定义内容）
  slot?: string
}

export interface TableAction<T = Record<string, unknown>> {
  // 按钮文本
  text: string
  // 按钮类型
  type?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'
  // 点击事件
  onClick: (row: T, index: number) => void
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
