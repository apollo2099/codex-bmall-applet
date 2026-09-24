/**
 * 收货地址接口（对接 codex-bmall 用户服务）
 * 地址接口均需要用户 ID，未登录时提示先登录。
 */
const { request } = require('./request')
const user = require('./user')

/** 取当前用户 ID，未登录时抛错 */
function requireUserId() {
  const userId = user.getUserId()
  if (!userId) {
    throw new Error('请先登录')
  }
  return userId
}

/** 地址列表 */
function getAddresses() {
  return request({ url: `/addresses?userId=${user.getUserId()}` })
}

/** 默认地址（无地址时后端返回 null） */
function getDefaultAddress() {
  return request({ url: `/addresses/default?userId=${user.getUserId()}` })
}

/** 新增地址 */
function addAddress(data) {
  let userId
  try {
    userId = requireUserId()
  } catch (err) {
    return Promise.reject(err)
  }
  return request({ url: '/addresses', method: 'POST', data: Object.assign({ userId }, data) })
}

/** 修改地址（传 isDefault: true 即为设为默认） */
function updateAddress(id, data) {
  let userId
  try {
    userId = requireUserId()
  } catch (err) {
    return Promise.reject(err)
  }
  return request({
    url: `/addresses/${id}`,
    method: 'PUT',
    data: Object.assign({ userId }, data)
  })
}

/** 删除地址 */
function removeAddress(id) {
  return request({ url: `/addresses/${id}?userId=${user.getUserId()}`, method: 'DELETE' })
}

module.exports = { getAddresses, getDefaultAddress, addAddress, updateAddress, removeAddress }
