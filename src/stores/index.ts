import { createPinia } from 'pinia'

const pinia = createPinia()

export default pinia

// 导出modules目录下的模块
export * from './modules/user-info'
