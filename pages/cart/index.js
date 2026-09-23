const cart = require('../../services/cart')
const goodsService = require('../../services/goods')
const checkout = require('../../services/checkout')
const { toast, confirm } = require('../../utils/util')

Page({
  data: {
    list: [],
    allSelected: true,
    totalAmount: '0.00',
    selectedCount: 0,
    editing: false,
    recommend: []
  },

  onLoad() {
    this.loadRecommend()
    this.unsubscribe = cart.onChange(() => this.refresh())
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 2 })
      this.getTabBar().refreshBadge()
    }
    this.refresh()
  },

  onUnload() {
    if (this.unsubscribe) this.unsubscribe()
  },

  /** 读取购物车并计算小计 */
  refresh() {
    const list = cart.getCart().map((item) =>
      Object.assign({}, item, { subtotal: (item.price * item.count).toFixed(2) })
    )
    this.setData({
      list,
      allSelected: list.length > 0 && list.every((item) => item.selected),
      totalAmount: cart.getSelectedAmount(),
      selectedCount: cart.getSelectedCount()
    })
  },

  loadRecommend() {
    goodsService
      .getRecommendGoods(4)
      .then((list) => this.setData({ recommend: list }))
      .catch(() => {})
  },

  onToggleEdit() {
    this.setData({ editing: !this.data.editing })
  },

  onToggleItem(e) {
    cart.toggleSelect(e.currentTarget.dataset.key)
  },

  onToggleAll() {
    cart.toggleSelectAll(!this.data.allSelected)
  },

  onCountChange(e) {
    const { key } = e.currentTarget.dataset
    cart.updateCount(key, e.detail.value)
  },

  onRemoveItem(e) {
    const { key } = e.currentTarget.dataset
    confirm('确定要删除这件商品吗？').then((ok) => {
      if (!ok) return
      cart.remove(key)
      toast('已删除')
    })
  },

  onRemoveSelected() {
    const keys = this.data.list.filter((item) => item.selected).map((item) => item.key)
    if (!keys.length) {
      toast('请先选择要删除的商品')
      return
    }
    confirm(`确定删除选中的 ${keys.length} 件商品吗？`).then((ok) => {
      if (!ok) return
      cart.removeMany(keys)
      this.setData({ editing: false })
      toast('已删除')
    })
  },

  /** 结算：把已选商品写入结算草稿 */
  onCheckout() {
    const selected = cart.getCart().filter((item) => item.selected)
    if (!selected.length) {
      toast('请先选择要结算的商品')
      return
    }
    checkout.saveDraft(
      selected.map((item) =>
        checkout.toCheckoutItem(
          Object.assign({}, item, { cartKey: item.key }),
          item.spec,
          item.count
        )
      )
    )
    wx.navigateTo({ url: '/pages/order/confirm/index?from=cart' })
  },

  onGoodsTap(e) {
    wx.navigateTo({ url: `/pages/goods/detail/index?id=${e.detail.goods.id}` })
  },

  onAddRecommend(e) {
    cart.add(e.detail.goods, '默认规格', 1)
    toast('已加入购物车', 'success')
  },

  onGoShopping() {
    wx.switchTab({ url: '/pages/index/index' })
  }
})
