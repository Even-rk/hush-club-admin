import { Coupon, Member, Product, ProductCategory, User } from '@/types/supabase'
import supabase from '@/utils/supabase'

// 添加商品
export const reqAddProduct = async (product: Omit<Product, 'image_path' | 'image_url'>) => {
  const { data, error } = await supabase.from('products').insert(product)
  if (error) {
    throw error
  }
  return data
}

// 注册用户
export const reqAddUser = async (user: User) => {
  const { data, error } = await supabase.auth.signUp({ email: user.email, password: user.password })
  if (error) {
    throw error
  }
  return data
}

// 添加会员
type NoHave =
  | 'id'
  | 'member_code'
  | 'level_name'
  | 'created_at'
  | 'updated_at'
  | 'order_count'
  | 'coupon_count'
export const reqAddMember = async (member: Omit<Member, NoHave>) => {
  const { data, error } = await supabase.from('members').insert(member)
  if (error) {
    throw error
  }
  return data
}

// 添加优惠券
export const reqAddCoupon = async (
  coupon: Omit<Coupon, 'id' | 'valid_day' | 'created_at' | 'updated_at'>
) => {
  const { data, error } = await supabase.from('coupon_templates').insert(coupon)
  if (error) {
    throw error
  }
  return data
}
