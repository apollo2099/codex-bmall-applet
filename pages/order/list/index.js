const orderService = require('../../../services/order')
const cart = require('../../../services/cart')
const { toast, confirm, formatTime } = require('../../../utils/util')

Page({
  data: {
    tabs: orderService.ORDER_STATUS,
    status: 'all',
    orders: [],
    loading: true,
    acting: false
  },

  onLoad(options) {
    const status = options.status || 'all'
    this.setData({ status })
  },

  onShow() {
    this.load()
  },

  onPullDownRefresh() {
    this.load().then(() => wx.stopPullDownRefresh())
  },

  load() {
    this.setData({ loading: true })
    return orderService
      .getOrders(this.data.status)
      .then((res) => {
        const orders = res.list.map((order) => {
          const count = order.goods.reduce((sum, item) => sum + item.count, 0)
          return Object.assign({}, order, {
            count,
            createTimeText: formatTime(order.createdAt),
            canCancel: order.status === 'pending',
            canPay: order.status === 'pending',
            canConfirm: order.status === 'receiving',
            canDelete: order.status === 'done' || order.status === 'canceled',
            canRebuy: order.status === 'done' || order.status === 'canceled'
          })
        })
        this.setData({ orders })
      })
      .catch(() => toast('订单加载失败'))
      .then(() => this.setData({ loading: false }))
  },

  onTabTap(e) {
    const { key } = e.currentTarget.dataset
    if (key === this.data.status) return
    this.setData({ status: key, orders: [] })
    this.load()
  },

  onOrderTap(e) {
    wx.navigateTo({ url: `/pages/order/detail/index?id=${e.currentTarget.dataset.id}` })
  },

  onPay(e) {
    const { id } = e.currentTarget.dataset
    if (this.data.acting) return
    this.setData({ acting: true })
    wx.showLoading({ title: '支付中', mask: true })
    orderService
      .payOrder(id)
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

  onCancel(e) {
    const { id } = e.currentTarget.dataset
    confirm('确定要取消这个订单吗？').then((ok) => {
      if (!ok) return
      orderService.cancelOrder(id).then(() => {
        toast('订单已取消')
        this.load()
      })
    })
  },

  onConfirmReceive(e) {
    const { id } = e.currentTarget.dataset
    confirm('确认已经收到货了吗？').then((ok) => {
      if (!ok) return
      orderService.confirmOrder(id).then(() => {
        toast('交易完成', 'success')
        this.load()
      })
    })
  },

  onDelete(e) {
    const { id } = e.currentTarget.dataset
    confirm('删除后订单不可恢复，确定删除吗？').then((ok) => {
      if (!ok) return
      orderService.deleteOrder(id).then(() => {
        toast('订单已删除')
        this.load()
      })
    })
  },

  /** 再次购买：把订单商品加回购物车 */
  onRebuy(e) {
    const order = this.data.orders.find((item) => item.id === e.currentTarget.dataset.id)
    if (!order) return
    order.goods.forEach((item) => {
      cart.add(
        {
          id: item.goodsId,
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

  onGoShopping() {
    wx.switchTab({ url: '/pages/index/index' })
  },

  /** 阻止操作按钮的点击冒泡到整卡跳转 */
  noop() {
  }
})
