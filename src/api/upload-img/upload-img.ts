import supabase from '@/utils/supabase'
import { getPublicUrl, uploadFile, deleteFiles } from '@/utils/storage'

// 存储桶
const bucketName = 'hush-club'

// 上传商品图
export const uploadProductImg = async (file: File) => {
  // 上传商品图
  const { data, error } = await uploadFile(bucketName, `products/${file.name}`, file)
  if (error) {
    throw error
  }

  // 查询记录表是否存在这张图
  const { data: imgData, error: imgError } = await supabase
    .from('storage_files')
    .select('*')
    .eq('file_path', data?.path)
  if (imgError) {
    throw imgError
  }
  // 不存在
  if (!imgData?.length) {
    // 插入记录
    await supabase.from('storage_files').insert({
      file_name: file.name,
      file_path: data?.path,
      mime_type: file.type,
      file_size: file.size,
      bucket_name: bucketName
    })
    // 查询记录表是否存在这张图
    const { data: selectData, error: selectError } = await supabase
      .from('storage_files')
      .select('id')
      .eq('file_path', data?.path)
    if (selectError) {
      throw selectError
    }
    // 查图片地址
    return {
      id: selectData?.[0]?.id,
      image_url: getPublicUrl(bucketName, data?.path as string),
      file_path: data?.path
    }
  } else {
    // 存在直接查图片地址
    return {
      id: imgData?.[0]?.id,
      image_url: getPublicUrl(bucketName, data?.path as string),
      file_path: data?.path
    }
  }
}

// 删除商品图
export const delProductImg = async (params: { id: number; file_path: string }) => {
  // 删除记录表
  await supabase.from('storage_files').delete().eq('id', params.id)
  // 删除文件
  const { data, error } = await deleteFiles(bucketName, [params.file_path])
  if (error) {
    throw error
  }
  return data
}
