/**
 * 请求层
 * 默认调用真实后端（codex-bmall）。如需离线开发，把 USE_MOCK 改为 true 即可回到本地模拟数据。
 */
const mockServer = require('../mock/server')
const storage = require('../utils/storage')

/** 是否使用本地模拟数据：false = 调用真实后端 */
const USE_MOCK = false

/**
 * 后端地址
 * - 微信开发者工具：用 127.0.0.1 即可（需勾选「不校验合法域名」）
 * - 真机调试：改为电脑的局域网 IP，例如 http://192.168.1.10:8080
 * - 正式环境：改为 https 域名，并在小程序后台配置 request 合法域名
 */
const BASE_URL = 'http://127.0.0.1:8080'

/**
 * 发起请求
 * @param {Object} options
 * @param {string} options.url 形如 '/products/1'
 * @param {string} [options.method] GET / POST / PUT / DELETE
 * @param {Object} [options.data] 请求参数
 */
function request(options) {
  const { url, method = 'GET', data = {} } = options

  if (USE_MOCK) {
    return mockServer.request({ url, method, data }).catch((err) => {
      console.warn('[mock]', method, url, err.message)
      return Promise.reject(err)
    })
  }

  return new Promise((resolve, reject) => {
    const token = storage.get('token', '')
    const header = { 'content-type': 'application/json' }
    if (token) header.Authorization = `Bearer ${token}`

    wx.request({
      url: `${BASE_URL}${url}`,
      method,
      data,
      header,
      success: (res) => {
        const body = res.data
        if (res.statusCode >= 200 && res.statusCode < 300) {
          // 后端统一返回 { code, message, data }
          if (body && typeof body.code !== 'undefined') {
            if (body.code === 200) {
              resolve(body.data)
            } else {
              reject(new Error(body.message || '请求失败'))
            }
          } else {
            resolve(body)
          }
        } else {
          reject(new Error((body && body.message) || `请求失败(${res.statusCode})`))
        }
      },
      fail: (err) => reject(new Error(err.errMsg || '网络请求失败，请确认后端已启动'))
    })
  })
}

/**
 * 拼接查询字符串（自动跳过空值）
 * @param {Object} params 参数对象
 * @returns {string} 形如 a=1&b=2，无参数时返回空串
 */
function buildQuery(params = {}) {
  const query = Object.keys(params)
    .filter((key) => params[key] !== undefined && params[key] !== '' && params[key] !== null)
    .map((key) => `${key}=${encodeURIComponent(params[key])}`)
    .join('&')
  return query ? `?${query}` : ''
}

/** 统一错误提示 */
function toastError(err, title = '操作失败') {
  const message = (err && err.message) || title
  wx.showToast({ title: message.slice(0, 30), icon: 'none' })
}

module.exports = { request, buildQuery, toastError, USE_MOCK, BASE_URL }
