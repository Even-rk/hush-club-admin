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
  silver_member_price?: number
  // 黄金会员价格
  gold_member_price?: number
  // 图片id
  image_id: number
  // 图片地址
  image_url: string
  // 图片路径
  image_path: string
  // 商品名称
  product_name: string
  // 销售数量
  sales_count: number
  // 状态
  status: 'active' | 'inactive'
  // 分类名称
  category_name?: string
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
  // 手机号
  phone: string
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
  id: number
  // 角色名称
  role_name: string
  // 角色code
  role_code: string
  // 权限列表
  permissions: {
    permission_code: string
    menu_name: string
  }[]
}

// 优惠券
export type Coupon = {
  // 优惠券ID
  id: number
  // 优惠券名称
  template_name: string
  // 优惠券类型
  /**
   * reduce 满减
   * discount 折扣
   * free 免费
   */
  coupon_type: 'reduce' | 'discount' | 'free'
  // 优惠券面值 满减 折扣 免费
  discount_value: number
  // 优惠券门槛金额
  threshold_amount: number
  // 优惠券描述
  description: string
  // 有效天数
  vallid_days: number
  // 有效截止时间
  valid_day: string
  // 优惠券状态
  status: 'active' | 'inactive'
  // 创建时间
  created_at: string
  // 更新时间
  updated_at: string
}

// 数据概览
export type DataOverview = {
  // 今日订单金额
  today_order_amount?: number
  // 今日订单数量
  today_order_count?: number
  // 今日会员数量
  today_member_count?: number
  // 客单价格
  today_order_price?: number
  // 昨日订单金额
  yesterday_order_amount?: number
  // 昨日订单数量
  yesterday_order_count?: number
  // 昨日会员数量
  yesterday_member_count?: number
  // 昨日客单价格
  yesterday_order_price?: number
}
