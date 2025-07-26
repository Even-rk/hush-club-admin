import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'url'

// 打包分析工具
import { visualizer } from 'rollup-plugin-visualizer'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  plugins: [
    vue({
      // 启用组件内联所有内容（模板、脚本、样式）
      template: {
        compilerOptions: {
          // 配置Vue编译器选项，影响打包结果
          hoistStatic: true
        }
      }
    }),
    visualizer({
      open: false
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
