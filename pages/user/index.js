const userService = require('../../services/user')
const orderService = require('../../services/order')
const cart = require('../../services/cart')
const db = require('../../mock/db')
const { toast, confirm } = require('../../utils/util')

Page({
  data: {
    user: null,
    isLogin: false,
    counts: { pending: 0, receiving: 0, done: 0 },
    orderEntries: [
      { key: 'pending', label: '待付款', icon: 'credit' },
      { key: 'receiving', label: '待收货', icon: 'truck' },
      { key: 'done', label: '已完成', icon: 'check' },
      { key: 'all', label: '全部订单', icon: 'receipt' }
    ],
    tools: [
      { key: 'address', label: '收货地址', icon: 'location' },
      { key: 'profile', label: '我的资料', icon: 'id-card' },
      { key: 'service', label: '联系客服', icon: 'chat' },
      { key: 'about', label: '关于项目', icon: 'info' },
      { key: 'reset', label: '清空演示数据', icon: 'sparkles' }
    ]
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 3 })
      this.getTabBar().refreshBadge()
    }
    this.refreshUser()
    if (userService.isLogin()) {
      this.loadCounts()
    } else {
      this.setData({ counts: { pending: 0, receiving: 0, done: 0 } })
    }
  },

  refreshUser() {
    const isLogin = userService.isLogin()
    const user = isLogin ? userService.getCachedUser() : null
    this.setData({
      isLogin,
      user,
      phoneText: user ? String(user.phone || '').replace(/(\d{3})\d{4}(\d{4})/, '$1****$2') : ''
    })
    if (isLogin) {
      userService
        .getProfile()
        .then((profile) => {
          if (!profile) return
          this.setData({
            user: profile,
            phoneText: String(profile.phone || '').replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
          })
        })
        .catch(() => {})
    }
  },

  loadCounts() {
    orderService
      .getOrderCount()
      .then((counts) => this.setData({ counts }))
      .catch(() => {})
  },

  /**
   * 登录：输入手机号后调用后端 /auth/login
   * 未注册的手机号后端会自动创建用户
   */
  onLogin() {
    wx.showModal({
      title: '手机号登录',
      editable: true,
      placeholderText: userService.DEMO_PHONE,
      confirmColor: '#1e1e1e',
      success: (res) => {
        if (!res.confirm) return
        const phone = (res.content || '').trim() || userService.DEMO_PHONE
        if (!/^1[3-9]\d{9}$/.test(phone)) {
          toast('手机号格式不正确')
          return
        }
        wx.showLoading({ title: '登录中', mask: true })
        userService
          .login(phone)
          .then((user) => {
            wx.hideLoading()
            getApp().globalData.userInfo = user
            this.refreshUser()
            this.loadCounts()
            toast('登录成功', 'success')
          })
          .catch((err) => {
            wx.hideLoading()
            toast(err.message || '登录失败')
          })
      }
    })
  },

  onLogout() {
    confirm('确定要退出登录吗？').then((ok) => {
      if (!ok) return
      userService.logout()
      getApp().globalData.userInfo = null
      this.setData({ isLogin: false, user: null })
      toast('已退出登录')
    })
  },

  onProfileTap() {
    if (!this.data.isLogin) {
      this.onLogin()
      return
    }
    wx.navigateTo({ url: '/pages/user/profile/index' })
  },

  onOrderEntry(e) {
    const { key } = e.currentTarget.dataset
    if (!userService.isLogin()) {
      toast('请先登录')
      return
    }
    wx.navigateTo({ url: `/pages/order/list/index?status=${key}` })
  },

  onToolTap(e) {
    const { key } = e.currentTarget.dataset
    if (key === 'address') {
      if (!userService.isLogin()) {
        toast('请先登录')
        return
      }
      wx.navigateTo({ url: '/pages/user/address/index' })
      return
    }
    if (key === 'profile') {
      if (!userService.isLogin()) {
        toast('请先登录')
        return
      }
      wx.navigateTo({ url: '/pages/user/profile/index' })
      return
    }
    if (key === 'service') {
      wx.showModal({
        title: '联系客服',
        content: '示例项目未接入客服系统，正式环境可调用 wx.openCustomerServiceChat。',
        showCancel: false,
        confirmColor: '#1e1e1e'
      })
      return
    }
    if (key === 'about') {
      wx.showModal({
        title: '关于优选集市',
        content:
          '一个完整的电商小程序示例：商品浏览、购物车、下单支付、订单管理、用户中心均内置模拟数据，可直接替换为真实接口。',
        showCancel: false,
        confirmColor: '#1e1e1e'
      })
      return
    }
    if (key === 'reset') this.resetData()
  },

  resetData() {
    confirm('将清空购物车、订单、地址与登录状态，确定继续吗？', '清空演示数据').then((ok) => {
      if (!ok) return
      cart.clear()
      db.reset()
      userService.logout()
      this.setData({ isLogin: false, user: null, counts: { pending: 0, receiving: 0, done: 0 } })
      toast('已清空，重启小程序可看到初始演示数据')
    })
  }
})
