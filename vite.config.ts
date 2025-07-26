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
  },
  build: {
    // css代码分割
    cssCodeSplit: true,
    // 启用最大程度代码分割
    minify: 'terser',
    terserOptions: {
      // 生产环境时移除console
      compress: {
        drop_console: true,
        drop_debugger: true
      },
      format: {
        // 移除注释
        comments: false
      }
    },
    // 编译目标
    target: 'es2015',
    // 禁用源映射
    sourcemap: false,
    // 控制文件名中的哈希值
    rollupOptions: {
      output: {
        // 代码分割策略
        manualChunks: id => {
          if (id.includes('node_modules')) {
            if (id.includes('vue') || id.includes('vue-router')) {
              return 'vendor/vue'
            }
            if (id.includes('axios')) {
              return 'vendor/axios'
            }
            if (id.includes('wujie')) {
              return 'vendor/wujie'
            }
            return 'vendor/index'
          }
          return id.split('src/').pop()
        },
        // 文件命名规则
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash][extname]'
      }
    }
  }
})
