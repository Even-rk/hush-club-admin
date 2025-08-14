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
  const { error } = await supabase.from('coupons_template').delete().eq('id', id)
  if (error) {
    throw error
  }
  return true
}
