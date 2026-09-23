const goodsService = require('../../../services/goods')
const cart = require('../../../services/cart')
const { toast } = require('../../../utils/util')

const PAGE_SIZE = 8
const SORTS = [
  { key: 'default', label: '综合' },
  { key: 'sales', label: '销量' },
  { key: 'price_asc', label: '价格 ↑' },
  { key: 'price_desc', label: '价格 ↓' }
]

Page({
  data: {
    sorts: SORTS,
    sort: 'default',
    keyword: '',
    categoryId: '',
    goods: [],
    page: 1,
    hasMore: true,
    loading: true,
    loadingMore: false
  },

  onLoad(options) {
    const keyword = options.keyword ? decodeURIComponent(options.keyword) : ''
    const categoryId = options.categoryId || ''
    wx.setNavigationBarTitle({ title: keyword ? `搜索：${keyword}` : '商品列表' })
    this.setData({ keyword, categoryId })
    this.load(1)
  },

  onPullDownRefresh() {
    this.load(1).then(() => wx.stopPullDownRefresh())
  },

  onReachBottom() {
    if (!this.data.hasMore || this.data.loadingMore) return
    this.setData({ loadingMore: true })
    this.load(this.data.page + 1).finally(() => this.setData({ loadingMore: false }))
  },

  load(page) {
    this.setData({ loading: page === 1 })
    return goodsService
      .getGoodsList({
        page,
        pageSize: PAGE_SIZE,
        sort: this.data.sort,
        keyword: this.data.keyword,
        categoryId: this.data.categoryId
      })
      .then((res) => {
        this.setData({
          goods: page === 1 ? res.list : this.data.goods.concat(res.list),
          page: res.page,
          hasMore: res.hasMore
        })
      })
      .catch(() => toast('商品加载失败'))
      .then(() => this.setData({ loading: false }))
  },

  onSortTap(e) {
    const { key } = e.currentTarget.dataset
    if (key === this.data.sort) return
    this.setData({ sort: key })
    this.load(1)
  },

  onGoodsTap(e) {
    wx.navigateTo({ url: `/pages/goods/detail/index?id=${e.detail.goods.id}` })
  },

  onAddCart(e) {
    cart.add(e.detail.goods, '默认规格', 1)
    toast('已加入购物车', 'success')
  },

  onBackHome() {
    wx.switchTab({ url: '/pages/index/index' })
  }
})
