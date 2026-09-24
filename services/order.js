/**
 * 订单相关接口（对接 codex-bmall 订单服务）
 * 订单接口均需要登录后的用户 ID，未登录时直接拒绝并提示。
 */
const { request } = require('./request')
const user = require('./user')

/** 订单状态枚举（与后端 orders.status 一致） */
const ORDER_STATUS = [
  { key: 'all', label: '全部' },
  { key: 'pending', label: '待付款' },
  { key: 'receiving', label: '待收货' },
  { key: 'done', label: '已完成' }
]

/** 取当前用户 ID，未登录时抛错 */
function requireUserId() {
  const userId = user.getUserId()
  if (!userId) {
    throw new Error('请先登录')
  }
  return userId
}

/**
 * 创建订单
 * @param {Object} payload { items: [{productId, count, spec}], address: {...}, remark, payMethod }
 */
function createOrder(payload) {
  let userId
  try {
    userId = requireUserId()
  } catch (err) {
    return Promise.reject(err)
  }
  return request({
    url: '/orders',
    method: 'POST',
    data: Object.assign({ userId }, payload)
  })
}

/**
 * 订单列表
 * @param {string} [status] all / pending / receiving / done
 * @param {number} [page]
 * @param {number} [pageSize]
 */
function getOrders(status = 'all', page = 1, pageSize = 20) {
  return request({
    url: `/orders?${buildOrderQuery({ userId: user.getUserId(), status, page, pageSize })}`
  })
}

/** 各状态订单数量 */
function getOrderCount() {
  return request({ url: `/orders/count?userId=${user.getUserId()}` })
}

/** 订单详情 */
function getOrderDetail(id) {
  return request({ url: `/orders/${id}` })
}

/** 支付订单 */
function payOrder(id) {
  return request({ url: `/orders/${id}/pay`, method: 'POST' })
}

/** 取消订单 */
function cancelOrder(id) {
  return request({ url: `/orders/${id}/cancel`, method: 'POST' })
}

/** 确认收货 */
function confirmOrder(id) {
  return request({ url: `/orders/${id}/confirm`, method: 'POST' })
}

/** 删除订单（后端为 DELETE /orders/{id}?userId=） */
function deleteOrder(id) {
  return request({ url: `/orders/${id}?userId=${user.getUserId()}`, method: 'DELETE' })
}

/**
 * 拼接查询串（内部使用，避免依赖 buildQuery 的额外导出）
 * @param {Object} params 参数
 * @returns {string} 查询串
 */
function buildOrderQuery(params) {
  return Object.keys(params)
    .filter((key) => params[key] !== undefined && params[key] !== '' && params[key] !== null)
    .map((key) => `${key}=${encodeURIComponent(params[key])}`)
    .join('&')
}

module.exports = {
  ORDER_STATUS,
  createOrder,
  getOrders,
  getOrderCount,
  getOrderDetail,
  payOrder,
  cancelOrder,
  confirmOrder,
  deleteOrder
}
