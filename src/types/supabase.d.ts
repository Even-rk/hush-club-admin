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
  status: string
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
  status: string
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
 */
export type PaymentMethod = 'balance' | 'wechat'

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
  id: number
  order_id: number
  product_id: number
  product_name: string
  unit_price: number
  quantity: number
  subtotal: number
  created_at: string
}

// 会员信息类型
export type Member = {
  id: number
  member_code: string
  real_name: string
  phone: string
  level_id: number
  balance: number
  total_recharge: number
  total_consumption: number
  order_count: number
  points: number
  status: string
  register_time: string
  last_login_time: string | null
  created_at: string
  updated_at: string
}

// 完整订单信息类型
export type OrderDetail = {
  // 订单基础信息
  id: number
  order_no: string
  member_id: number
  total_amount: number
  member_discount: number
  coupon_discount: number
  final_amount: number
  coupon_id: number | null
  status: string
  payment_method: string
  payment_time: string | null
  complete_time: string | null
  remark: string | null
  created_at: string
  updated_at: string
  // 会员信息
  member: Member | null
  // 订单商品明细
  order_items: OrderItem[]
}
