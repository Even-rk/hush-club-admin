import { h, render } from 'vue'

interface MessageOptions {
  content: string
  type?: 'info' | 'warning' | 'error' | 'success'
  duration?: number
}

let messageContainer: HTMLDivElement | null = null

const createMessageContainer = () => {
  if (!messageContainer) {
    messageContainer = document.createElement('div')
    messageContainer.className = 'message-container'
    document.body.appendChild(messageContainer)

    if (!document.getElementById('message-component-style')) {
      const style = document.createElement('style')
      style.id = 'message-component-style'
      style.textContent = `
        .message-container {
          position: fixed;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 10000;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }
        @keyframes message-fade-in {
          from { opacity: 0; transform: translateY(-20px) scale(0.9); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes message-fade-out {
          from { opacity: 1; transform: translateY(0) scale(1); }
          to { opacity: 0; transform: translateY(-20px) scale(0.9); }
        }
        @keyframes progress-bar {
          from { width: 100%; }
          to { width: 0; }
        }
        .message-box {
          --progress-duration: 2000ms;
          display: flex;
          align-items: center;
          padding: 14px 22px;
          border-radius: 10px;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(10px) saturate(1.5);
          -webkit-backdrop-filter: blur(10px) saturate(1.5);
          color: #303133;
          font-size: 15px;
          min-width: 300px;
          max-width: 520px;
          animation: message-fade-in 0.35s cubic-bezier(0.21, 1.02, 0.73, 1) forwards;
          border: 1px solid rgba(255, 255, 255, 0.2);
          position: relative;
          overflow: hidden;
        }
        .message-box::before {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          height: 3px;
          animation: progress-bar var(--progress-duration) linear forwards;
        }
        .message-box.fade-out {
          animation: message-fade-out 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
        .message-icon {
          margin-right: 12px;
          font-size: 20px;
          display: flex;
          align-items: center;
        }
        .message-box.message--info { 
          background: rgba(240, 249, 255, 0.8); 
          border-color: rgba(144, 204, 255, 0.5); 
        }
        .message-box.message--info::before { 
          background-color: #909399; 
        }
        .message-box.message--success { 
          background: rgba(240, 255, 245, 0.8); 
          border-color: rgba(103, 194, 58, 0.5); 
        }
        .message-box.message--success::before { 
          background-color: #67C23A; 
        }
        .message-box.message--warning { 
          background: rgba(253, 246, 236, 0.8); 
          border-color: rgba(230, 162, 60, 0.5); 
        }
        .message-box.message--warning::before { 
          background-color: #E6A23C; 
        }
        .message-box.message--error { 
          background: rgba(254, 240, 240, 0.8); 
          border-color: rgba(245, 108, 108, 0.5); 
        }
        .message-box.message--error::before { 
          background-color: #F56C6C; 
        }
        .message-icon.info { color: #909399; }
        .message-icon.success { color: #67C23A; }
        .message-icon.warning { color: #E6A23C; }
        .message-icon.error { color: #F56C6C; }
        .message-content {
          flex-grow: 1;
          font-weight: 500;
        }
      `
      document.head.appendChild(style)
    }
  }
  return messageContainer
}

const getIcon = (type: string) => {
  switch (type) {
    case 'warning':
      return h('div', { class: 'message-icon warning' }, '⚠️')
    case 'error':
      return h('div', { class: 'message-icon error' }, '❌')
    case 'success':
      return h('div', { class: 'message-icon success' }, '✅')
    default:
      return h('div', { class: 'message-icon info' }, 'ℹ️')
  }
}

const message = (options: MessageOptions | string) => {
  const container = createMessageContainer()
  const messageOptions: MessageOptions =
    typeof options === 'string' ? { content: options } : options

  const { content, type = 'info', duration = 2000 } = messageOptions

  const messageWrapper = document.createElement('div')

  const messageVNode = h(
    'div',
    {
      class: `message-box message--${type}`,
      style: {
        animationDuration: '0.35s',
        animationPlayState: 'running',
        '--progress-duration': `${duration}ms`
      }
    },
    [getIcon(type), h('div', { class: 'message-content' }, content)]
  )

  render(messageVNode, messageWrapper)
  const messageElement = messageWrapper.firstChild as HTMLElement
  container.appendChild(messageElement)

  const close = () => {
    messageElement.classList.add('fade-out')
    messageElement.addEventListener('animationend', () => {
      render(null, messageWrapper)
      if (container.contains(messageElement)) {
        container.removeChild(messageElement)
      }
      if (messageContainer && messageContainer.childNodes.length === 0) {
        document.body.removeChild(messageContainer)
        messageContainer = null
      }
    })
  }

  setTimeout(close, duration)
}

message.success = (content: string, duration?: number) => {
  message({ content, type: 'success', duration })
}

message.warning = (content: string, duration?: number) => {
  message({ content, type: 'warning', duration })
}

message.error = (content: string, duration?: number) => {
  message({ content, type: 'error', duration })
}

message.info = (content: string, duration?: number) => {
  message({ content, type: 'info', duration })
}

export default message
