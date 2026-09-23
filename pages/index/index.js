const goodsService = require('../../services/goods')
const cart = require('../../services/cart')
const { toast, formatCount } = require('../../utils/util')

const PAGE_SIZE = 6

Page({
  data: {
    banners: [],
    categories: [],
    hotGoods: [],
    feed: [],
    page: 1,
    hasMore: true,
    loading: true,
    loadingMore: false
  },

  onLoad() {
    this.loadHome()
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 0 })
      this.getTabBar().refreshBadge()
    }
  },

  onPullDownRefresh() {
    this.loadHome().then(() => wx.stopPullDownRefresh())
  },

  onReachBottom() {
    this.loadMore()
  },

  /** 首屏数据 */
  loadHome() {
    this.setData({ loading: true })
    return Promise.all([
      goodsService.getBanners(),
      goodsService.getCategories(),
      goodsService.getHotGoods(8)
    ])
      .then(([banners, categories, hotGoods]) => {
        this.setData({
          banners,
          categories,
          hotGoods: hotGoods.map((item) =>
            Object.assign({}, item, { salesText: formatCount(item.sales) })
          ),
          page: 1
        })
        return this.loadFeed(1)
      })
      .catch((err) => {
        console.error(err)
        toast('首页数据加载失败，请下拉重试')
      })
      .then(() => this.setData({ loading: false }))
  },

  /** 猜你喜欢分页 */
  loadFeed(page) {
    return goodsService
      .getGoodsList({ page, pageSize: PAGE_SIZE, sort: 'sales' })
      .then((res) => {
        this.setData({
          feed: page === 1 ? res.list : this.data.feed.concat(res.list),
          page: res.page,
          hasMore: res.hasMore
        })
      })
  },

  loadMore() {
    if (!this.data.hasMore || this.data.loadingMore || this.data.loading) return
    this.setData({ loadingMore: true })
    this.loadFeed(this.data.page + 1)
      .catch(() => toast('加载失败，请稍后重试'))
      .then(() => this.setData({ loadingMore: false }))
  },

  onSearch() {
    wx.navigateTo({ url: '/pages/search/index' })
  },

  onBannerTap(e) {
    const { goodsId } = e.currentTarget.dataset
    this.toDetail({ detail: { goodsId } })
  },

  onCategoryTap(e) {
    const { id } = e.currentTarget.dataset
    wx.switchTab({
      url: '/pages/category/index',
      success: () => {
        const page = getCurrentPages().pop()
        if (page && page.route === 'pages/category/index') {
          page.setActiveCategory(id)
        }
      }
    })
  },

  onGoodsTap(e) {
    this.toDetail(e)
  },

  /** 商品卡片 / 轮播统一跳转详情 */
  toDetail(e) {
    const goods = (e.detail && e.detail.goods) || {}
    const id = goods.id || (e.detail && e.detail.goodsId)
    if (!id) return
    wx.navigateTo({ url: `/pages/goods/detail/index?id=${id}` })
  },

  onAddCart(e) {
    const { goods } = e.detail
    cart.add(goods, '默认规格', 1)
    toast('已加入购物车', 'success')
  },

  onGoList() {
    wx.switchTab({ url: '/pages/category/index' })
  }
})
