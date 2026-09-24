const checkout = require('../../../services/checkout')
const orderService = require('../../../services/order')
const addressService = require('../../../services/address')
const cart = require('../../../services/cart')
const { toast, confirm } = require('../../../utils/util')

/** 满减规则：满 199 减 20，满 99 减 10 */
function calcDiscount(amount) {
  if (amount >= 199) return 20
  if (amount >= 99) return 10
  return 0
}

Page({
  data: {
    goods: [],
    address: null,
    remark: '',
    payMethod: '微信支付',
    payMethods: ['微信支付', '余额支付'],
    goodsAmount: '0.00',
    freight: '0.00',
    discount: '0.00',
    payAmount: '0.00',
    totalCount: 0,
    submitting: false,
    from: ''
  },

  onLoad(options) {
    this.setData({ from: options.from || '' })
    const goods = checkout.getDraft()
    if (!goods.length) {
      toast('没有待结算的商品')
      setTimeout(() => wx.navigateBack(), 1200)
      return
    }
    this.setData({ goods })
    this.calcAmount()
    this.loadAddress()
  },

  loadAddress() {
    addressService
      .getDefaultAddress()
      .then((address) => this.setData({ address }))
      .catch(() => {})
  },

  /** 金额计算 */
  calcAmount() {
    const goodsAmount = this.data.goods.reduce((sum, item) => sum + item.price * item.count, 0)
    const freight = goodsAmount >= 99 ? 0 : 12
    const discount = calcDiscount(goodsAmount)
    const payAmount = Math.max(0, goodsAmount + freight - discount)
    this.setData({
      goodsAmount: goodsAmount.toFixed(2),
      freight: freight.toFixed(2),
      discount: discount.toFixed(2),
      payAmount: payAmount.toFixed(2),
      totalCount: this.data.goods.reduce((sum, item) => sum + item.count, 0)
    })
  },

  /** 地址页回调：更新选中地址 */
  setSelectedAddress(address) {
    this.setData({ address })
  },

  onChooseAddress() {
    wx.navigateTo({ url: '/pages/user/address/index?select=1' })
  },

  onRemarkInput(e) {
    this.setData({ remark: e.detail.value })
  },

  onPayMethodTap(e) {
    this.setData({ payMethod: e.currentTarget.dataset.method })
  },

  /** 提交订单 */
  onSubmit() {
    if (this.data.submitting) return
    if (!this.data.address) {
      toast('请先选择收货地址')
      return
    }

    this.setData({ submitting: true })
    // 运费与优惠由后端统一计算，这里只提交商品与收货信息
    const items = this.data.goods.map((item) => ({
      productId: Number(item.goodsId),
      count: item.count,
      spec: item.spec
    }))
    const address = this.data.address
    orderService
      .createOrder({
        items,
        address: {
          name: address.name,
          phone: address.phone,
          province: address.province,
          city: address.city,
          district: address.district,
          detail: address.detail
        },
        remark: this.data.remark,
        payMethod: this.data.payMethod
      })
      .then((order) => {
        // 下单成功后清理购物车中对应的商品
        const keys = this.data.goods.map((item) => item.cartKey).filter(Boolean)
        if (keys.length) cart.removeByKeys(keys)
        checkout.clearDraft()
        this.askPay(order)
      })
      .catch((err) => toast(err.message || '下单失败'))
      .then(() => this.setData({ submitting: false }))
  },

  /** 模拟支付流程 */
  askPay(order) {
    confirm(`需支付 ¥${order.payAmount}，是否立即支付？`, '模拟支付').then((ok) => {
      if (!ok) {
        wx.redirectTo({ url: `/pages/order/detail/index?id=${order.id}` })
        return
      }
      wx.showLoading({ title: '支付中', mask: true })
      orderService
        .payOrder(order.id)
        .then(() => {
          wx.hideLoading()
          toast('支付成功', 'success')
          setTimeout(() => {
            wx.redirectTo({ url: `/pages/order/detail/index?id=${order.id}` })
          }, 800)
        })
        .catch((err) => {
          wx.hideLoading()
          toast(err.message || '支付失败')
        })
    })
  }
})
