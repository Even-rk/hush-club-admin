import { useErrorMessage, useSuccessMessage } from 'odos-ui'
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
export const SupabaseLogin = async (data: {
  username: string
  password: string
}): Promise<string | null> => {
  const { username, password } = data
  if (!username || !password) {
    return null
  }

  const { data: user, error } = await supabase
    .from('system_users')
    .select('*')
    .eq('username', username)
    .single()

  if (error || !user) {
    return null
  }

  console.log(await generateBcryptHash(password))

  // 验证 bcrypt 密码哈希
  const isValidPassword = await verifyBcryptPassword(password, user.password_hash)

  if (!isValidPassword) {
    useErrorMessage('账号名或密码错误')
    return null
  }

  const token = btoa(
    JSON.stringify({
      userId: user.id,
      username: user.username,
      timestamp: Date.now()
    })
  )
  useSuccessMessage('登录成功')

  return token
}
