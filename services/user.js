/**
 * 用户相关接口与登录态（对接 codex-bmall 用户服务）
 */
const { request } = require('./request')
const storage = require('../utils/storage')

const TOKEN_KEY = 'token'
const USER_KEY = 'user'

/** 演示手机号：数据库初始化脚本中已存在该用户 */
const DEMO_PHONE = '13800008888'

/**
 * 演示验证码
 * TODO: 接入短信验证码后由用户输入，后端做真实校验
 */
const DEMO_CODE = '123456'

/** 读取本地缓存的用户信息 */
function getCachedUser() {
  return storage.get(USER_KEY, null)
}

/** 是否已登录 */
function isLogin() {
  return !!storage.get(TOKEN_KEY, '') && !!getCachedUser()
}

/** 当前用户 ID，未登录返回 null */
function getUserId() {
  const user = getCachedUser()
  return user ? user.id : null
}

/**
 * 登录：调用后端 /auth/login，未注册手机号后端会自动创建用户
 * @param {string} [phone] 手机号，默认使用演示手机号
 * @returns {Promise<Object>} 用户信息
 */
function login(phone) {
  return request({
    url: '/auth/login',
    method: 'POST',
    data: { phone: phone || DEMO_PHONE, code: DEMO_CODE }
  }).then((data) => {
    storage.set(TOKEN_KEY, data.token)
    storage.set(USER_KEY, data.user)
    return data.user
  })
}

function logout() {
  storage.remove(TOKEN_KEY)
  storage.remove(USER_KEY)
}

/** 获取用户资料（未登录时返回 null） */
function getProfile() {
  const userId = getUserId()
  if (!userId) return Promise.resolve(null)
  return request({ url: `/users/${userId}` }).then((user) => {
    storage.set(USER_KEY, user)
    return user
  })
}

/** 更新用户资料（昵称、头像） */
function updateProfile(data) {
  const userId = getUserId()
  if (!userId) return Promise.reject(new Error('请先登录'))
  return request({ url: `/users/${userId}`, method: 'PUT', data }).then((user) => {
    storage.set(USER_KEY, user)
    return user
  })
}

module.exports = {
  DEMO_PHONE,
  DEMO_CODE,
  getCachedUser,
  isLogin,
  getUserId,
  login,
  logout,
  getProfile,
  updateProfile
}
