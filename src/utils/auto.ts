import { supabase } from './supabase'
import bcrypt from 'bcryptjs'

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
 * 登录验证函数
 * @param username 用户名
 * @param password 密码
 * @returns token 字符串，失败返回 null
 */
export const login = async (username: string, password: string): Promise<string | null> => {
  if (!username || !password) {
    return null
  }

  const { data: user, error } = await supabase
    .from('System_users')
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

  return token
}
