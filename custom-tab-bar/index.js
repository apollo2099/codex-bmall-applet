const cart = require('../services/cart')

Component({
  data: {
    selected: 0,
    cartCount: 0,
    cartText: '',
    list: [
      { pagePath: '/pages/index/index', text: '首页', icon: 'home' },
      { pagePath: '/pages/category/index', text: '分类', icon: 'grid' },
      { pagePath: '/pages/cart/index', text: '购物车', icon: 'cart' },
      { pagePath: '/pages/user/index', text: '我的', icon: 'user' }
    ]
  },

  lifetimes: {
    attached() {
      this.refreshBadge()
      // 购物车变化时自动刷新角标
      this.unsubscribe = cart.onChange(() => this.refreshBadge())
    },
    detached() {
      if (this.unsubscribe) this.unsubscribe()
    }
  },

  methods: {
    refreshBadge() {
      const count = cart.getTotalCount()
      this.setData({ cartCount: count > 99 ? 99 : count, cartText: count > 99 ? '99+' : String(count) })
    },

    switchTab(e) {
      const { path, index } = e.currentTarget.dataset
      if (index === this.data.selected) return
      wx.switchTab({ url: path })
    }
  }
})
