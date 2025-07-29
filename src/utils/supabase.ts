import { createClient } from '@supabase/supabase-js'

// 从环境变量中获取Supabase URL和匿名密钥
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// 创建Supabase客户端实例
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false
  }
})

// 导出单例模式的客户端
export default supabase
