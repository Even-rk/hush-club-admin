import { h, render } from 'vue'

interface LoadingOptions {
  text?: string
  background?: string
  spinner?: 'default' | 'dots' | 'pulse' | 'ring'
  size?: 'small' | 'medium' | 'large'
  zIndex?: number
}

interface LoadingInstance {
  close: () => void
}

/**
 * 创建 Loading 实例
 * @param options Loading 配置选项
 * @returns LoadingInstance 实例，包含 close 方法
 */
export const loading = (options: LoadingOptions = {}): LoadingInstance => {
  // 默认配置
  const config = {
    text: '加载中...',
    background: 'rgba(0, 0, 0, 0.5)',
    spinner: 'default' as const,
    size: 'medium' as const,
    zIndex: 9999,
    ...options
  }

  // 创建容器
  const container = document.createElement('div')
  container.className = 'loading-container'
  document.body.appendChild(container)

  // 关闭 Loading
  const close = () => {
    render(null, container)
    if (document.body.contains(container)) {
      document.body.removeChild(container)
    }
  }

  // 获取加载动画
  const getSpinner = (type: string, size: string) => {
    const sizeClass = `spinner-${size}`

    switch (type) {
      case 'dots':
        return h('div', { class: `spinner-dots ${sizeClass}` }, [
          h('div', { class: 'dot' }),
          h('div', { class: 'dot' }),
          h('div', { class: 'dot' })
        ])
      case 'pulse':
        return h('div', { class: `spinner-pulse ${sizeClass}` })
      case 'ring':
        return h('div', { class: `spinner-ring ${sizeClass}` }, [
          h('div'),
          h('div'),
          h('div'),
          h('div')
        ])
      default:
        return h('div', { class: `spinner-default ${sizeClass}` })
    }
  }

  // 创建 Loading 组件
  const LoadingComponent = {
    setup: () => {
      return () => {
        return h(
          'div',
          {
            class: 'loading-overlay',
            style: {
              background: config.background,
              zIndex: config.zIndex
            }
          },
          h('div', { class: 'loading-content' }, [
            getSpinner(config.spinner, config.size),
            config.text && h('div', { class: 'loading-text' }, config.text)
          ])
        )
      }
    }
  }

  // 渲染 Loading
  render(h(LoadingComponent), container)

  // 添加样式（只添加一次）
  if (!document.getElementById('loading-style')) {
    const style = document.createElement('style')
    style.id = 'loading-style'
    style.textContent = `
      .loading-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        backdrop-filter: blur(2px);
        animation: loadingFadeIn 0.2s ease-out;
      }
      
      @keyframes loadingFadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      .loading-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 16px;
      }
      
      .loading-text {
        color: rgba(255, 107, 53, 0.9);
        font-size: 14px;
        font-weight: 500;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
      }
      
      /* 默认旋转加载器 */
      .spinner-default {
        border: 3px solid rgba(255, 107, 53, 0.2);
        border-top: 3px solid rgba(255, 107, 53, 0.8);
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }
      
      .spinner-default.spinner-small {
        width: 24px;
        height: 24px;
      }
      
      .spinner-default.spinner-medium {
        width: 32px;
        height: 32px;
      }
      
      .spinner-default.spinner-large {
        width: 40px;
        height: 40px;
      }
      
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      
      /* 点状加载器 */
      .spinner-dots {
        display: flex;
        gap: 4px;
      }
      
      .spinner-dots .dot {
        background-color: #fff;
        border-radius: 50%;
        animation: dotPulse 1.4s ease-in-out infinite both;
      }
      
      .spinner-dots.spinner-small .dot {
        width: 6px;
        height: 6px;
      }
      
      .spinner-dots.spinner-medium .dot {
        width: 8px;
        height: 8px;
      }
      
      .spinner-dots.spinner-large .dot {
        width: 10px;
        height: 10px;
      }
      
      .spinner-dots .dot:nth-child(1) { animation-delay: -0.32s; }
      .spinner-dots .dot:nth-child(2) { animation-delay: -0.16s; }
      .spinner-dots .dot:nth-child(3) { animation-delay: 0s; }
      
      @keyframes dotPulse {
        0%, 80%, 100% {
          transform: scale(0);
          opacity: 0.5;
        }
        40% {
          transform: scale(1);
          opacity: 1;
        }
      }
      
      /* 脉冲加载器 */
      .spinner-pulse {
        background-color: #fff;
        border-radius: 50%;
        animation: pulse 1.5s ease-in-out infinite;
      }
      
      .spinner-pulse.spinner-small {
        width: 24px;
        height: 24px;
      }
      
      .spinner-pulse.spinner-medium {
        width: 32px;
        height: 32px;
      }
      
      .spinner-pulse.spinner-large {
        width: 40px;
        height: 40px;
      }
      
      @keyframes pulse {
        0% {
          transform: scale(0);
          opacity: 1;
        }
        100% {
          transform: scale(1);
          opacity: 0;
        }
      }
      
      /* 环形加载器 */
      .spinner-ring {
        display: inline-block;
        position: relative;
      }
      
      .spinner-ring.spinner-small {
        width: 24px;
        height: 24px;
      }
      
      .spinner-ring.spinner-medium {
        width: 32px;
        height: 32px;
      }
      
      .spinner-ring.spinner-large {
        width: 40px;
        height: 40px;
      }
      
      .spinner-ring div {
        box-sizing: border-box;
        display: block;
        position: absolute;
        border: 2px solid rgba(255, 107, 53, 0.8);
        border-radius: 50%;
        animation: ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
        border-color: rgba(255, 107, 53, 0.8) transparent transparent transparent;
      }
      
      .spinner-ring.spinner-small div {
        width: 20px;
        height: 20px;
        margin: 2px;
      }
      
      .spinner-ring.spinner-medium div {
        width: 28px;
        height: 28px;
        margin: 2px;
      }
      
      .spinner-ring.spinner-large div {
        width: 36px;
        height: 36px;
        margin: 2px;
      }
      
      .spinner-ring div:nth-child(1) { animation-delay: -0.45s; }
      .spinner-ring div:nth-child(2) { animation-delay: -0.3s; }
      .spinner-ring div:nth-child(3) { animation-delay: -0.15s; }
      
      @keyframes ring {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }
    `
    document.head.appendChild(style)
  }

  return { close }
}

/**
 * 显示简单的 Loading
 * @param text 加载文本，默认为"加载中..."
 * @returns LoadingInstance 实例
 */
export const showLoading = (text?: string): LoadingInstance => {
  return loading({ text })
}

/**
 * 显示带有自定义配置的 Loading
 * @param options Loading 配置选项
 * @returns LoadingInstance 实例
 */
export const showCustomLoading = (options: LoadingOptions): LoadingInstance => {
  return loading(options)
}

/**
 * 异步操作的 Loading 包装器
 * @param asyncFn 异步函数
 * @param options Loading 配置选项
 * @returns Promise 包装后的异步函数结果
 */
export const withLoading = async <T>(
  asyncFn: () => Promise<T>,
  options: LoadingOptions = {}
): Promise<T> => {
  const loadingInstance = loading(options)
  try {
    const result = await asyncFn()
    return result
  } finally {
    loadingInstance.close()
  }
}

/**
 * 延迟关闭的 Loading（最小显示时间）
 * @param asyncFn 异步函数
 * @param options Loading 配置选项
 * @param minDuration 最小显示时间（毫秒），默认 500ms
 * @returns Promise 包装后的异步函数结果
 */
export const withMinLoading = async <T>(
  asyncFn: () => Promise<T>,
  options: LoadingOptions = {},
  minDuration: number = 500
): Promise<T> => {
  const loadingInstance = loading(options)
  const startTime = Date.now()

  try {
    const result = await asyncFn()
    const elapsed = Date.now() - startTime
    const remaining = Math.max(0, minDuration - elapsed)

    if (remaining > 0) {
      await new Promise(resolve => setTimeout(resolve, remaining))
    }

    return result
  } finally {
    loadingInstance.close()
  }
}
