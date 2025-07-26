import { supabase } from './supabase'
import bcrypt from 'bcryptjs'
import { formatDate } from './format'

/**
 * 验证 bcrypt 密码哈希
 * @param password 明文密码
 * @param hash bcrypt 哈希值
 * @returns 是否验证通过
 */
const verifyBcryptPassword = async (password: string, hash: string): Promise<boolean> => {
  try {
    return await bcrypt.compare(password, hash)
  } catch {
    return false
  }
}

/**
 * 生成 bcrypt 哈希
 * @param password 明文密码
 * @returns bcrypt 哈希值
 */
export const generateBcryptHash = async (password: string): Promise<string> => {
  const saltRounds = 10
  return await bcrypt.hash(password, saltRounds)
}

/**
 * 登录验证函数
 * @param data 登录数据
 * @returns token 字符串，失败返回 null
 */
export const SupabaseLogin = async (data: { username: string; password: string }) => {
  const { username, password } = data
  const { data: user, error } = await supabase
    .from('system_users')
    .select('*')
    .eq('username', username)
    .single()

  if (error || !user) {
    return null
  }

  // 验证 bcrypt 密码哈希
  const isValidPassword = await verifyBcryptPassword(password, user.password_hash)

  if (!isValidPassword) {
    return null
  }

  const token = btoa(
    JSON.stringify({
      userId: user.id,
      username: user.username,
      timestamp: Date.now()
    })
  )

  // 更新表最后一次登录时间
  await supabase
    .from('system_users')
    .update({ last_login_time: formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss') })
    .eq('id', user.id)

  return {
    id: user.id as number,
    token: token as string,
    last_login_time: user.last_login_time as string,
    real_name: user.real_name as string,
    username: user.username as string
  }
}
