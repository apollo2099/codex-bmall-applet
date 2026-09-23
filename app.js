const cart = require('./services/cart')
const user = require('./services/user')
const seed = require('./mock/seed')

App({
  globalData: {
    /** 底部购物车角标数量，由 cart 服务统一维护 */
    cartCount: 0,
    /** 当前登录用户 */
    userInfo: null,
    /** 系统信息，用于自定义导航栏等场景 */
    systemInfo: null
  },

  onLaunch() {
    // 首次启动写入演示数据（收货地址、历史订单），便于直接体验完整流程
    seed.init()

    try {
      this.globalData.systemInfo = wx.getWindowInfo
        ? wx.getWindowInfo()
        : wx.getSystemInfoSync()
    } catch (err) {
      this.globalData.systemInfo = {}
    }

    this.globalData.userInfo = user.getCachedUser()
    this.syncCartBadge()

    // 购物车变化时同步底部角标
    this.cartUnsubscribe = cart.onChange(() => this.syncCartBadge())
  },

  syncCartBadge() {
    const count = cart.getTotalCount()
    this.globalData.cartCount = count
    // 使用自定义 tabBar 时，角标由 custom-tab-bar 组件订阅购物车变化后自行渲染
  }
})
