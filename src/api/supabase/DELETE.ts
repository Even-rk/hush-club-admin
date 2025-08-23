import supabase from '@/utils/supabase'
import { delProductImg } from '../upload-img/upload-img'

// 删除商品
export const reqDeleteProduct = async (params: {
  id: number
  image_id?: number
  image_path?: string
}) => {
  const { error } = await supabase.from('products').delete().eq('id', params.id)
  if (error) {
    throw error
  }

  // 是否有image_id
  if (params.image_id) {
    // 删除图片
    await delProductImg({ id: params.image_id, file_path: params.image_path as string })
  }

  return true
}

// 删除分类
export const reqDeleteCategory = async (id: number) => {
  const { error } = await supabase.from('product_categories').delete().eq('id', id)
  if (error) {
    throw error
  }
  return true
}

// 删除优惠券
export const reqDeleteCoupon = async (id: number) => {
  // 先查询并更新优惠券关联订单
  const { error: orderError } = await supabase
    .from('orders')
    .update({ coupon_id: null })
    .eq('coupon_id', id)
  if (orderError) {
    throw orderError
  }

  // 再删除会员关联优惠券
  const { error: couponError } = await supabase
    .from('member_coupons')
    .delete()
    .eq('template_id', id)
  if (couponError) {
    throw couponError
  }

  const { error } = await supabase.from('coupon_templates').delete().eq('id', id)
  if (error) {
    throw error
  }
  return true
}

// 删除会员
export const reqDeleteMember = async (id: number) => {
  // 先删除会员关联优惠券
  const { error: couponError } = await supabase.from('member_coupons').delete().eq('member_id', id)
  if (couponError) {
    throw couponError
  }
  // 再删除会员关联订单
  const { error: orderError } = await supabase.from('orders').delete().eq('member_id', id)
  if (orderError) {
    throw orderError
  }
  // 再删除会员关联反馈
  const { error: feedbackError } = await supabase.from('feedback').delete().eq('member_id', id)
  if (feedbackError) {
    throw feedbackError
  }
  // 再删除会员
  const { error } = await supabase.from('members').delete().eq('id', id)
  if (error) {
    throw error
  }
  return true
}

// 删除用户
export const reqDeleteUser = async (id: number) => {
  const { error } = await supabase.from('system_users').delete().eq('id', id)
  if (error) {
    throw error
  }
  return true
}
