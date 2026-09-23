/**
 * 模拟数据库
 * 用本地存储承载「订单 / 收货地址 / 用户」数据，保证重启小程序后数据仍在。
 * 接入真实后端时，本文件可整体删除。
 */
const storage = require('../utils/storage')

const KEYS = {
  orders: 'mock_orders',
  addresses: 'mock_addresses',
  user: 'mock_user',
  inited: 'mock_inited'
}

const DEFAULT_USER = {
  id: 'u_10086',
  nickname: '优选用户',
  avatarEmoji: '🙂',
  phone: '138****8888',
  level: '黄金会员',
  points: 1280,
  couponCount: 6,
  balance: '268.00',
  favorites: 12
}

function read(key, fallback) {
  const value = storage.get(key, null)
  return value === null ? fallback : value
}

function write(key, value) {
  storage.set(key, value)
  return value
}

const db = {
  KEYS,
  DEFAULT_USER,

  getOrders() {
    return read(KEYS.orders, [])
  },

  setOrders(orders) {
    return write(KEYS.orders, orders)
  },

  getAddresses() {
    return read(KEYS.addresses, [])
  },

  setAddresses(list) {
    return write(KEYS.addresses, list)
  },

  getUser() {
    return Object.assign({}, DEFAULT_USER, read(KEYS.user, {}))
  },

  setUser(user) {
    return write(KEYS.user, user)
  },

  isInited() {
    return !!storage.get(KEYS.inited, false)
  },

  markInited() {
    storage.set(KEYS.inited, true)
  },

  /** 清空全部模拟数据，便于演示「首次使用」流程 */
  reset() {
    storage.remove(KEYS.orders)
    storage.remove(KEYS.addresses)
    storage.remove(KEYS.user)
    storage.remove(KEYS.inited)
  }
}

module.exports = db
