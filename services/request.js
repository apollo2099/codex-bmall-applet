/**
 * 请求层
 * 开发阶段走 mock/server.js 的模拟接口；上线时把 USE_MOCK 改为 false，
 * 并配置 BASE_URL 即可切换到真实后端，业务代码无需改动。
 */
const mockServer = require('../mock/server')

const USE_MOCK = true
const BASE_URL = 'https://api.example.com'

/**
 * 发起请求
 * @param {Object} options
 * @param {string} options.url 形如 '/goods/g1001'
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
    wx.request({
      url: `${BASE_URL}${url}`,
      method,
      data,
      header: { 'content-type': 'application/json' },
      success: (res) => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data)
        } else {
          reject(new Error((res.data && res.data.message) || '网络请求失败'))
        }
      },
      fail: (err) => reject(new Error(err.errMsg || '网络请求失败'))
    })
  })
}

/** 统一错误提示 */
function toastError(err, title = '操作失败') {
  const message = (err && err.message) || title
  wx.showToast({ title: message.slice(0, 30), icon: 'none' })
}

module.exports = { request, toastError, USE_MOCK, BASE_URL }
