/**
 * 本地存储封装：统一加前缀，避免与其它小程序数据冲突
 */
const PREFIX = 'ecom_'

function get(key, fallback = null) {
  try {
    const value = wx.getStorageSync(PREFIX + key)
    return value === '' || value === undefined ? fallback : value
  } catch (err) {
    console.error('[storage] get error', key, err)
    return fallback
  }
}

function set(key, value) {
  try {
    wx.setStorageSync(PREFIX + key, value)
  } catch (err) {
    console.error('[storage] set error', key, err)
  }
}

function remove(key) {
  try {
    wx.removeStorageSync(PREFIX + key)
  } catch (err) {
    console.error('[storage] remove error', key, err)
  }
}

module.exports = { get, set, remove, PREFIX }
