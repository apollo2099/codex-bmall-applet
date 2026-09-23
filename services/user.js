/**
 * 用户相关接口与登录态
 */
const { request } = require('./request')
const storage = require('../utils/storage')

const TOKEN_KEY = 'token'
const USER_KEY = 'user'

/** 读取本地缓存的用户信息 */
function getCachedUser() {
  return storage.get(USER_KEY, null)
}

/** 是否已登录 */
function isLogin() {
  return !!storage.get(TOKEN_KEY, '')
}

/**
 * 登录
 * 真实项目里应先调用 wx.login 获取 code，再换取后端 token
 */
function login() {
  return request({ url: '/auth/login', method: 'POST' }).then((user) => {
    storage.set(TOKEN_KEY, user.token)
    storage.set(USER_KEY, user)
    return user
  })
}

function logout() {
  storage.remove(TOKEN_KEY)
  storage.remove(USER_KEY)
}

/** 获取用户资料（未登录时返回 null） */
function getProfile() {
  if (!isLogin()) return Promise.resolve(null)
  return request({ url: '/user/profile' }).then((user) => {
    storage.set(USER_KEY, user)
    return user
  })
}

/** 更新用户资料 */
function updateProfile(data) {
  return request({ url: '/user/profile', method: 'PUT', data }).then((user) => {
    storage.set(USER_KEY, user)
    return user
  })
}

module.exports = { getCachedUser, isLogin, login, logout, getProfile, updateProfile }
