/**
 * 收货地址接口
 */
const { request } = require('./request')

function getAddresses() {
  return request({ url: '/addresses' })
}

function getDefaultAddress() {
  return getAddresses().then((list) => list.find((item) => item.isDefault) || list[0] || null)
}

function addAddress(data) {
  return request({ url: '/addresses', method: 'POST', data })
}

function updateAddress(id, data) {
  return request({ url: `/addresses/${id}`, method: 'PUT', data })
}

function removeAddress(id) {
  return request({ url: `/addresses/${id}`, method: 'DELETE' })
}

module.exports = { getAddresses, getDefaultAddress, addAddress, updateAddress, removeAddress }
