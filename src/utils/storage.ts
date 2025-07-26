import { supabase } from './supabase'

/**
 * 上传文件到存储桶
 * @param bucketName 存储桶名称
 * @param filePath 文件路径（存储在存储桶中的路径）
 * @param file 文件对象
 * @returns 上传结果
 */
export const uploadFile = async (bucketName: string, filePath: string, file: File) => {
  const { data, error } = await supabase.storage.from(bucketName).upload(filePath, file, {
    cacheControl: '3600',
    upsert: true
  })
  return { data, error }
}

/**
 * 获取文件公共URL
 * @param bucketName 存储桶名称
 * @param filePath 文件路径
 * @returns 文件URL
 */
export const getPublicUrl = (bucketName: string, filePath: string) => {
  const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath)
  return data.publicUrl
}

/**
 * 下载文件
 * @param bucketName 存储桶名称
 * @param filePath 文件路径
 * @returns 下载结果
 */
export const downloadFile = async (bucketName: string, filePath: string) => {
  const { data, error } = await supabase.storage.from(bucketName).download(filePath)
  return { data, error }
}

/**
 * 列出存储桶中的文件
 * @param bucketName 存储桶名称
 * @param path 路径前缀（可选）
 * @returns 文件列表
 */
export const listFiles = async (bucketName: string, path?: string) => {
  const { data, error } = await supabase.storage.from(bucketName).list(path || '')
  return { data, error }
}

/**
 * 删除文件
 * @param bucketName 存储桶名称
 * @param filePaths 文件路径数组
 * @returns 删除结果
 */
export const deleteFiles = async (bucketName: string, filePaths: string[]) => {
  const { data, error } = await supabase.storage.from(bucketName).remove(filePaths)
  return { data, error }
}

/**
 * 创建签名URL（临时访问链接）
 * @param bucketName 存储桶名称
 * @param filePath 文件路径
 * @param expiresIn 过期时间（秒）
 * @returns 签名URL
 */
export const createSignedUrl = async (bucketName: string, filePath: string, expiresIn: number) => {
  const { data, error } = await supabase.storage
    .from(bucketName)
    .createSignedUrl(filePath, expiresIn)
  return { data, error }
}
