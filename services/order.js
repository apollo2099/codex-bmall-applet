/**
 * 订单相关接口
 */
const { request } = require('./request')

/** 订单状态枚举 */
const ORDER_STATUS = [
  { key: 'all', label: '全部' },
  { key: 'pending', label: '待付款' },
  { key: 'receiving', label: '待收货' },
  { key: 'done', label: '已完成' }
]

/** 创建订单 */
function createOrder(payload) {
  return request({ url: '/orders', method: 'POST', data: payload })
}

/** 订单列表 */
function getOrders(status = 'all', page = 1, pageSize = 20) {
  return request({ url: `/orders?status=${status}&page=${page}&pageSize=${pageSize}` })
}

/** 各状态订单数量 */
function getOrderCount() {
  return request({ url: '/orders/count' })
}

/** 订单详情 */
function getOrderDetail(id) {
  return request({ url: `/orders/${id}` })
}

/** 支付 */
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

/** 删除订单 */
function deleteOrder(id) {
  return request({ url: `/orders/${id}/delete`, method: 'POST' })
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
