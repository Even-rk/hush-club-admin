import supabase from '@/utils/supabase'

// 删除商品
export const reqDeleteProduct = async (id: number) => {
  const { error } = await supabase.from('products').delete().eq('id', id)
  if (error) {
    throw error
  }
  return true
}
