import { h, render } from 'vue'

interface ConfirmOptions {
  title?: string
  content: string
  confirmText?: string
  cancelText?: string
  type?: 'info' | 'warning' | 'error' | 'success'
}

/**
 * 创建确认对话框
 * @param options 对话框配置选项
 * @returns Promise，确认返回 true，取消返回 false
 */
export const confirm = (options: ConfirmOptions): Promise<boolean> => {
  return new Promise(resolve => {
    // 创建容器
    const container = document.createElement('div')
    container.className = 'confirm-dialog-container'
    document.body.appendChild(container)

    // 关闭对话框
    const close = (result: boolean) => {
      render(null, container)
      document.body.removeChild(container)
      resolve(result)
    }

    // 获取图标
    const getIcon = (type: string) => {
      switch (type) {
        case 'warning':
          return h('div', { class: 'confirm-icon warning' }, '⚠️')
        case 'error':
          return h('div', { class: 'confirm-icon error' }, '❌')
        case 'success':
          return h('div', { class: 'confirm-icon success' }, '✅')
        default:
          return h('div', { class: 'confirm-icon info' }, 'ℹ️')
      }
    }

    // 创建确认框组件
    const ConfirmDialog = {
      setup: () => {
        // 返回一个渲染函数，而不是直接返回 VNode
        return () => {
          return h(
            'div',
            {
              class: 'confirm-dialog-overlay',
              onClick: () => {
                // 点击遮罩层关闭
                close(false)
              }
            },
            h('div', { class: 'confirm-dialog', onClick: (e: Event) => e.stopPropagation() }, [
              // 标题
              h('div', { class: 'confirm-header' }, [
                options.type && getIcon(options.type),
                h('div', { class: 'confirm-title' }, options.title || '确认')
              ]),
              // 内容
              h('div', { class: 'confirm-content' }, options.content),
              // 按钮
              h('div', { class: 'confirm-footer' }, [
                h(
                  'button',
                  {
                    class: 'confirm-btn cancel',
                    onClick: () => close(false)
                  },
                  options.cancelText || '取消'
                ),
                h(
                  'button',
                  {
                    class: 'confirm-btn confirm',
                    onClick: () => close(true)
                  },
                  options.confirmText || '确认'
                )
              ])
            ])
          )
        }
      }
    }

    // 渲染确认框
    render(h(ConfirmDialog), container)

    // 添加样式
    if (!document.getElementById('confirm-dialog-style')) {
      const style = document.createElement('style')
      style.id = 'confirm-dialog-style'
      style.textContent = `
        .confirm-dialog-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9999;
          backdrop-filter: blur(2px);
          animation: fadeIn 0.2s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        .confirm-dialog {
          background-color: #fff;
          border-radius: 12px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
          width: 420px;
          padding: 0 20px;
          animation: scaleIn 0.25s ease-out;
          transform-origin: center;
          opacity: 1;
          max-width: 90vw;
        }
        .confirm-header {
          padding: 20px 0;
          display: flex;
          align-items: center;
          margin-bottom: 22px;
        }
        .confirm-icon {
          margin-right: 12px;
          font-size: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .confirm-icon.warning { color: #E6A23C; }
        .confirm-icon.error { color: #F56C6C; }
        .confirm-icon.success { color: #67C23A; }
        .confirm-icon.info { color: #909399; }
        .confirm-title {
          font-size: 20px;
          font-weight: 600;
          color: #303133;
        }
        .confirm-content {
          font-size: 15px;
          color: #606266;
          margin-bottom: 28px;
          line-height: 1.6;
          padding: 0 4px;
          word-break: break-word;
        }
        .confirm-footer {
          display: flex;
          justify-content: flex-end;
          margin-top: 10px;
          padding: 16px 0;
          gap: 12px;
        }
        .confirm-btn {
          padding: 10px 20px;
          font-size: 14px;
          border-radius: var(--radius-md);;
          cursor: pointer;
          border: none;
          transition: all 0.2s ease;
          font-weight: 500;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          min-width: 80px;
        }
        .confirm-btn:focus {
          outline: none;
          box-shadow: 0 0 0 3px rgba(64, 158, 255, 0.2);
        }
        .confirm-btn.cancel {
          background-color: #f4f4f5;
          color: #606266;
        }
        .confirm-btn.cancel:hover {
          background-color: #e9e9eb;
          transform: translateY(-1px);
        }
        .confirm-btn.confirm {
          background-color: var(--primary-light);
          color: #fff;
        }
        .confirm-btn.confirm:hover {
          background-color: var(--primary-color);
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(64, 158, 255, 0.25);
        }
        .confirm-btn:active {
          transform: translateY(0);
        }
      `
      document.head.appendChild(style)
    }
  })
}

/**
 * 快速创建确认对话框
 * @param content 对话框内容
 * @param title 对话框标题，默认为"确认"
 * @returns Promise，确认返回 true，取消返回 false
 */
export const confirmDialog = (content: string, title?: string): Promise<boolean> => {
  return confirm({
    title,
    content,
    type: 'info'
  })
}

/**
 * 创建警告确认对话框
 * @param content 对话框内容
 * @param title 对话框标题，默认为"警告"
 * @returns Promise，确认返回 true，取消返回 false
 */
export const confirmWarning = (content: string, title: string = '警告'): Promise<boolean> => {
  return confirm({
    title,
    content,
    type: 'warning'
  })
}

/**
 * 创建错误确认对话框
 * @param content 对话框内容
 * @param title 对话框标题，默认为"错误"
 * @returns Promise，确认返回 true，取消返回 false
 */
export const confirmError = (content: string, title: string = '错误'): Promise<boolean> => {
  return confirm({
    title,
    content,
    type: 'error'
  })
}

/**
 * 创建成功确认对话框
 * @param content 对话框内容
 * @param title 对话框标题，默认为"成功"
 * @returns Promise，确认返回 true，取消返回 false
 */
export const confirmSuccess = (content: string, title: string = '成功'): Promise<boolean> => {
  return confirm({
    title,
    content,
    type: 'success'
  })
}
