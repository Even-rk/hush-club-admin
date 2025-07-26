# Vue3 + TypeScript + Vite 项目

这是一个使用 Vue3、TypeScript 和 Vite 构建的现代化前端项目。

## 技术栈

- Vue 3.5.13 - 渐进式 JavaScript 框架
- TypeScript 5.8.3 - JavaScript 的超集，添加了类型系统
- Vite 6.3.5 - 下一代前端构建工具
- Vue Router 4.3.1 - Vue.js 官方路由
- Pinia 2.1.7 - Vue.js 的状态管理库
- ESLint & Prettier - 代码规范和格式化工具

## 项目结构

```
/
├── public/          # 静态资源目录
├── src/
│   ├── assets/      # 资源文件（CSS、图片等）
│   ├── components/  # 可复用组件
│   ├── router/      # 路由配置
│   ├── store/       # Pinia 状态管理
│   ├── utils/       # 工具函数
│   ├── hooks/       # 方法函数
│   ├── views/       # 页面视图
│   ├── App.vue      # 根组件
│   └── main.ts      # 入口文件
├── index.html       # HTML 模板
├── package.json     # 依赖管理
├── tsconfig.json    # TypeScript 配置
└── vite.config.ts   # Vite 配置
```

## 开发指南

### 安装依赖

```bash
npm install
# 或
yarn
# 或
pnpm install
```

### 运行开发服务器

```bash
npm run dev
# 或
yarn dev
# 或
pnpm dev
```

### 构建生产环境

```bash
npm run build
# 或
yarn build
# 或
pnpm build
```

### 代码规范检查

```bash
npm run lint
# 或
yarn lint
# 或
pnpm lint
```

### 代码格式化

```bash
npm run format
# 或
yarn format
# 或
pnpm format
```

## 功能特点

- 使用 Vue3 Composition API 和 `<script setup>` 语法
- TypeScript 强类型支持
- Vue Router 路由管理
- Pinia 状态管理
- ESLint 和 Prettier 代码规范
- 项目结构清晰，可扩展性强

## 浏览器兼容性

- Chrome
- Firefox
- Safari
- Edge 