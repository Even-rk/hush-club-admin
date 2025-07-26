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
