const orderService = require('../../../services/order')
const cart = require('../../../services/cart')
const { toast, confirm, formatTime } = require('../../../utils/util')

const STATUS_DESC = {
  pending: '请尽快完成支付，超时订单将自动关闭',
  receiving: '商品正在路上，请留意物流信息',
  done: '订单已完成，感谢你的购买',
  canceled: '订单已取消，商品已放回库存'
}

Page({
  data: {
    order: null,
    loading: true,
    timeline: [],
    statusDesc: '',
    acting: false
  },

  onLoad(options) {
    this.orderId = options.id
  },

  onShow() {
    this.load()
  },

  load() {
    this.setData({ loading: true })
    return orderService
      .getOrderDetail(this.orderId)
      .then((order) => {
        const receiver = {
          name: order.receiverName,
          phone: order.receiverPhone,
          address: order.receiverAddress
        }
        this.setData({
          order: Object.assign({}, order, { items: order.items || [], receiver }),
          statusDesc: STATUS_DESC[order.status] || '',
          timeline: this.buildTimeline(order),
          createTimeText: formatTime(order.createdAt),
          payTimeText: order.paidAt ? formatTime(order.paidAt) : '—'
        })
      })
      .catch((err) => toast(err.message || '订单加载失败'))
      .then(() => this.setData({ loading: false }))
  },

  /**
   * 用订单的真实时间节点构建状态时间轴（只展示后端已有的时间，不臆造）
   * @param {Object} order 订单
   * @returns {Array<Object>} 时间轴（倒序）
   */
  buildTimeline(order) {
    const timeline = []
    if (order.createdAt) {
      timeline.push({ text: '订单已提交', timeText: formatTime(order.createdAt) })
    }
    if (order.paidAt) {
      timeline.push({ text: '支付成功', timeText: formatTime(order.paidAt) })
    }
    if (order.status === 'canceled') {
      timeline.push({ text: '订单已取消' })
    }
    if (order.finishedAt) {
      timeline.push({ text: '交易完成', timeText: formatTime(order.finishedAt) })
    }
    return timeline.reverse()
  },

  onCopyOrderNo() {
    wx.setClipboardData({
      data: this.data.order.orderNo,
      success: () => toast('订单号已复制', 'success')
    })
  },

  onPay() {
    if (this.data.acting) return
    this.setData({ acting: true })
    wx.showLoading({ title: '支付中', mask: true })
    orderService
      .payOrder(this.data.order.id)
      .then(() => {
        wx.hideLoading()
        toast('支付成功', 'success')
        this.load()
      })
      .catch((err) => {
        wx.hideLoading()
        toast(err.message || '支付失败')
      })
      .then(() => this.setData({ acting: false }))
  },

  onCancel() {
    confirm('确定要取消这个订单吗？').then((ok) => {
      if (!ok) return
      orderService.cancelOrder(this.data.order.id).then(() => {
        toast('订单已取消')
        this.load()
      })
    })
  },

  onConfirmReceive() {
    confirm('确认已经收到货了吗？').then((ok) => {
      if (!ok) return
      orderService.confirmOrder(this.data.order.id).then(() => {
        toast('交易完成', 'success')
        this.load()
      })
    })
  },

  onDelete() {
    confirm('删除后订单不可恢复，确定删除吗？').then((ok) => {
      if (!ok) return
      orderService.deleteOrder(this.data.order.id).then(() => {
        toast('订单已删除')
        setTimeout(() => wx.navigateBack(), 800)
      })
    })
  },

  onRebuy() {
    ;(this.data.order.items || []).forEach((item) => {
      cart.add(
        {
          id: item.productId,
          title: item.title,
          subTitle: item.subTitle,
          emoji: item.emoji,
          tint: item.tint,
          price: item.price,
          stock: 99
        },
        item.spec,
        item.count
      )
    })
    toast('已加入购物车', 'success')
    setTimeout(() => wx.switchTab({ url: '/pages/cart/index' }), 600)
  },

  onService() {
    toast('客服功能需接入客服消息接口')
  }
})
