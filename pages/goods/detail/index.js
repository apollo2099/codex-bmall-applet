const goodsService = require('../../../services/goods')
const cart = require('../../../services/cart')
const checkout = require('../../../services/checkout')
const { toast, splitPrice, formatCount } = require('../../../utils/util')

Page({
  data: {
    goods: null,
    related: [],
    loading: true,
    priceInteger: '0',
    priceDecimal: '00',
    salesText: '0',
    /** 规格弹层 */
    showSku: false,
    /** cart：加入购物车；buy：立即购买 */
    skuMode: 'cart',
    selected: {},
    specText: '',
    count: 1,
    cartCount: 0,
    favorited: false,
    serviceList: [
      { icon: 'truck', text: '满 99 包邮' },
      { icon: 'shield', text: '正品保障' },
      { icon: 'return', text: '7 天无理由' },
      { icon: 'bolt', text: '48h 发货' }
    ]
  },

  onLoad(options) {
    this.goodsId = options.id
    this.loadDetail(options.id)
  },

  onShow() {
    this.setData({ cartCount: cart.getTotalCount() })
  },

  loadDetail(id) {
    this.setData({ loading: true })
    goodsService
      .getGoodsDetail(id)
      .then((goods) => {
        const { integer, decimal } = splitPrice(goods.price)
        // 默认选中每个规格的第一个值
        const selected = {}
        ;(goods.specs || []).forEach((spec) => {
          selected[spec.name] = spec.values[0]
        })
        this.setData({
          goods,
          related: goods.related || [],
          priceInteger: integer,
          priceDecimal: decimal,
          salesText: formatCount(goods.sales),
          selected,
          specText: this.buildSpecText(goods, selected)
        })
        wx.setNavigationBarTitle({ title: goods.title.slice(0, 12) })
      })
      .catch(() => toast('商品加载失败'))
      .then(() => this.setData({ loading: false }))
  },

  buildSpecText(goods, selected) {
    const specs = goods.specs || []
    if (!specs.length) return '默认规格'
    return specs.map((spec) => selected[spec.name]).filter(Boolean).join(' / ')
  },

  /* --------------------------- 规格弹层 --------------------------- */

  openSku(e) {
    const mode = (e.currentTarget.dataset.mode === 'buy' && 'buy') || 'cart'
    this.setData({ showSku: true, skuMode: mode })
  },

  closeSku() {
    this.setData({ showSku: false })
  },

  noop() {},

  onSelectSpec(e) {
    const { name, value } = e.currentTarget.dataset
    const selected = Object.assign({}, this.data.selected, { [name]: value })
    this.setData({
      selected,
      specText: this.buildSpecText(this.data.goods, selected)
    })
  },

  onCountChange(e) {
    this.setData({ count: e.detail.value })
  },

  onConfirmSku() {
    if (this.data.skuMode === 'buy') {
      this.buyNow()
    } else {
      this.addToCart()
    }
  },

  /* --------------------------- 业务动作 --------------------------- */

  addToCart() {
    const { goods, specText, count } = this.data
    cart.add(goods, specText, count)
    this.setData({ showSku: false, cartCount: cart.getTotalCount() })
    toast('已加入购物车', 'success')
  },

  buyNow() {
    const { goods, specText, count } = this.data
    checkout.saveDraft([checkout.toCheckoutItem(goods, specText, count)])
    this.setData({ showSku: false })
    wx.navigateTo({ url: '/pages/order/confirm/index?from=buy' })
  },

  onGoCart() {
    wx.switchTab({ url: '/pages/cart/index' })
  },

  onFavor() {
    const favorited = !this.data.favorited
    this.setData({ favorited })
    toast(favorited ? '已收藏' : '已取消收藏')
  },

  onService() {
    toast('客服功能需接入企业微信或客服消息接口')
  },

  onRelatedTap(e) {
    const { id } = e.detail.goods
    wx.redirectTo({ url: `/pages/goods/detail/index?id=${id}` })
  },

  onAddRelated(e) {
    cart.add(e.detail.goods, '默认规格', 1)
    toast('已加入购物车', 'success')
  }
})
