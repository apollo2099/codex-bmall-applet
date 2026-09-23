/**
 * 极简事件订阅器，用于跨页面同步状态（如购物车数量、订单刷新）
 */
function createEmitter() {
  const listeners = new Set()

  return {
    /** 订阅，返回取消订阅函数 */
    on(handler) {
      listeners.add(handler)
      return () => listeners.delete(handler)
    },
    off(handler) {
      listeners.delete(handler)
    },
    emit(payload) {
      listeners.forEach((handler) => {
        try {
          handler(payload)
        } catch (err) {
          console.error('[emitter] handler error', err)
        }
      })
    },
    clear() {
      listeners.clear()
    }
  }
}

module.exports = { createEmitter }
