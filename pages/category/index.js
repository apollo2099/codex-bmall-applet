const goodsService = require('../../services/goods')
const cart = require('../../services/cart')
const { toast } = require('../../utils/util')

Page({
  data: {
    categories: [],
    activeId: '',
    activeName: '',
    goods: [],
    loading: true
  },

  onLoad(options) {
    this.initialCategoryId = options.categoryId || ''
    this.loadCategories()
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 1 })
      this.getTabBar().refreshBadge()
    }
  },

  /** 供首页金刚区跳转时指定分类 */
  setActiveCategory(categoryId) {
    if (!categoryId) return
    const target = this.data.categories.find((item) => item.id === categoryId)
    if (target) this.switchCategory(target)
  },

  loadCategories() {
    this.setData({ loading: true })
    goodsService
      .getCategories()
      .then((categories) => {
        const active =
          categories.find((item) => item.id === this.initialCategoryId) || categories[0] || null
        this.setData({ categories, activeId: active ? active.id : '', activeName: active ? active.name : '' })
        if (active) this.loadGoods(active.id)
      })
      .catch(() => toast('分类加载失败'))
      .then(() => this.setData({ loading: false }))
  },

  onCategoryTap(e) {
    const { id } = e.currentTarget.dataset
    if (id === this.data.activeId) return
    const target = this.data.categories.find((item) => item.id === id)
    this.switchCategory(target)
  },

  switchCategory(category) {
    if (!category) return
    this.setData({ activeId: category.id, activeName: category.name, goods: [] })
    this.loadGoods(category.id)
  },

  loadGoods(categoryId) {
    this.setData({ loading: true })
    return goodsService
      .getGoodsList({ categoryId, page: 1, pageSize: 50 })
      .then((res) => this.setData({ goods: res.list }))
      .catch(() => toast('商品加载失败'))
      .then(() => this.setData({ loading: false }))
  },

  onGoodsTap(e) {
    const { id } = e.detail.goods
    wx.navigateTo({ url: `/pages/goods/detail/index?id=${id}` })
  },

  onAddCart(e) {
    cart.add(e.detail.goods, '默认规格', 1)
    toast('已加入购物车', 'success')
  },

  onSearch() {
    wx.navigateTo({ url: '/pages/search/index' })
  }
})
