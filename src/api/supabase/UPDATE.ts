import { Coupon, Member, Product, ProductCategory } from '@/types/supabase'
import supabase from '@/utils/supabase'

// 更新商品
export const updateProduct = async (params: {
  id: number
  data: Omit<Product, 'image_path' | 'image_url'>
}) => {
  const { data, error } = await supabase.from('products').update(params.data).eq('id', params.id)
  if (error) {
    throw error
  }
  return data
}

// 更新商品状态
export const updateProductStatus = async (id: number, status: string) => {
  const { data, error } = await supabase
    .from('products')
    .update({ status: status === 'active' ? 'inactive' : 'active' })
    .eq('id', id)
  if (error) {
    throw error
  }
  return data
}

// 更新商品分类
export const updateProductCategory = async (params: {
  id: number
  data: Omit<ProductCategory, 'product_count'>
}) => {
  const { data, error } = await supabase
    .from('product_categories')
    .update(params.data)
    .eq('id', params.id)
  if (error) {
    throw error
  }
  return data
}

// 更新分类状态
export const updateCategoryStatus = async (id: number, status: string) => {
  const { data, error } = await supabase
    .from('product_categories')
    .update({ status: status === 'active' ? 'inactive' : 'active' })
    .eq('id', id)
  if (error) {
    throw error
  }
  return data
}

// 更新会员信息
type NoHave =
  | 'id'
  | 'member_code'
  | 'level_name'
  | 'created_at'
  | 'updated_at'
  | 'order_count'
  | 'coupon_count'
export const updateMemberInfo = async (params: { id: number; data: Omit<Member, NoHave> }) => {
  const { data, error } = await supabase.from('members').update(params.data).eq('id', params.id)
  if (error) {
    throw error
  }
  return data
}

// 更新优惠券
export const updateCoupon = async (params: {
  id: number
  data: Omit<Coupon, 'id' | 'valid_day' | 'created_at' | 'updated_at'>
}) => {
  const { data, error } = await supabase
    .from('coupon_templates')
    .update(params.data)
    .eq('id', params.id)
  if (error) {
    throw error
  }
  return data
}

// 更新优惠券状态
export const updateCouponStatus = async (id: number, status: string) => {
  const { data, error } = await supabase
    .from('coupon_templates')
    .update({ status: status === 'active' ? 'inactive' : 'active' })
    .eq('id', id)
  if (error) {
    throw error
  }
  return data
}

// 会员充值
export const reqRechargeMember = async (params: { member_id: number; amount: number }) => {
  // 1. 查询会员信息
  const { data: member, error: memberError } = await supabase
    .from('members')
    .select('balance, total_recharge')
    .eq('id', params.member_id)
    .single()

  if (memberError) {
    throw memberError
  }

  // 2. 更新会员余额和总充值金额
  const { data, error } = await supabase
    .from('members')
    .update({
      balance: member.balance + params.amount,
      total_recharge: member.total_recharge + params.amount
    })
    .eq('id', params.member_id)

  if (error) {
    throw error
  }

  return data
}

// 发放优惠券
export const reqGrantCouponToMember = async (params: {
  member_id: number
  template_id: number
}) => {
  const { data, error } = await supabase.from('member_coupons').insert({
    member_id: params.member_id,
    template_id: params.template_id,
    status: 'unused'
  })

  if (error) {
    throw error
  }

  return data
}
