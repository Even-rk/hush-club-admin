import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'

const pinia = createPinia()

pinia.use(createPersistedState())

export default pinia

// 导出modules目录下的模块
export * from './modules/user-info'
