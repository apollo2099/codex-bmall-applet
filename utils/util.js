/**
 * 通用工具方法
 */

/** 金额格式化：12.5 -> 12.50 */
function formatPrice(value) {
  const num = Number(value || 0)
  return num.toFixed(2)
}

/** 金额按整数/小数拆分，便于价格排版 */
function splitPrice(value) {
  const text = formatPrice(value)
  const [integer, decimal] = text.split('.')
  return { integer, decimal }
}

/** 时间戳格式化：yyyy-MM-dd HH:mm */
function formatTime(timestamp, withTime = true) {
  const date = new Date(timestamp)
  const pad = (n) => (n < 10 ? `0${n}` : `${n}`)
  const day = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
  if (!withTime) return day
  return `${day} ${pad(date.getHours())}:${pad(date.getMinutes())}`
}

/** 生成订单号：ORD + 时间 + 随机数 */
function createOrderNo() {
  const date = new Date()
  const pad = (n) => (n < 10 ? `0${n}` : `${n}`)
  const stamp = `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}${pad(
    date.getHours()
  )}${pad(date.getMinutes())}${pad(date.getSeconds())}`
  const random = Math.floor(Math.random() * 9000 + 1000)
  return `ORD${stamp}${random}`
}

/** 简易唯一 id */
function uid(prefix = 'id') {
  return `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`
}

/** 数字千分位：1286 -> 1,286 */
function formatCount(value) {
  const num = Number(value || 0)
  if (num < 10000) return String(num)
  return `${(num / 10000).toFixed(1)}万`
}

/** 延迟，用于模拟网络请求耗时 */
function delay(ms = 300) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/** 轻提示 */
function toast(title, icon = 'none') {
  wx.showToast({ title, icon, duration: 1800 })
}

/** 确认弹窗，返回 Promise<boolean> */
function confirm(content, title = '提示') {
  return new Promise((resolve) => {
    wx.showModal({
      title,
      content,
      confirmColor: '#1e1e1e',
      success: (res) => resolve(!!res.confirm),
      fail: () => resolve(false)
    })
  })
}

/** 深拷贝（仅处理纯数据） */
function clone(value) {
  return JSON.parse(JSON.stringify(value))
}

module.exports = {
  formatPrice,
  splitPrice,
  formatTime,
  createOrderNo,
  uid,
  formatCount,
  delay,
  toast,
  confirm,
  clone
}
