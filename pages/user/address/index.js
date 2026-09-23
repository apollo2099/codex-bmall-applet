const addressService = require('../../../services/address')
const { toast, confirm } = require('../../../utils/util')

Page({
  data: {
    list: [],
    loading: true,
    /** 选择模式：从确认订单页进入时为 true */
    selectMode: false
  },

  onLoad(options) {
    this.setData({ selectMode: options.select === '1' })
  },

  onShow() {
    this.load()
  },

  load() {
    this.setData({ loading: true })
    return addressService
      .getAddresses()
      .then((list) => this.setData({ list }))
      .catch(() => toast('地址加载失败'))
      .then(() => this.setData({ loading: false }))
  },

  /** 选择地址后回填给上一页（确认订单页） */
  onSelect(e) {
    if (!this.data.selectMode) return
    const address = this.data.list.find((item) => item.id === e.currentTarget.dataset.id)
    const pages = getCurrentPages()
    const prev = pages[pages.length - 2]
    if (prev && address && typeof prev.setSelectedAddress === 'function') {
      prev.setSelectedAddress(address)
    }
    wx.navigateBack()
  },

  onAdd() {
    wx.navigateTo({ url: '/pages/user/address/edit/index' })
  },

  onEdit(e) {
    wx.navigateTo({ url: `/pages/user/address/edit/index?id=${e.currentTarget.dataset.id}` })
  },

  onSetDefault(e) {
    addressService.updateAddress(e.currentTarget.dataset.id, { isDefault: true }).then(() => {
      toast('已设为默认地址')
      this.load()
    })
  },

  onDelete(e) {
    confirm('确定要删除这个收货地址吗？').then((ok) => {
      if (!ok) return
      addressService.removeAddress(e.currentTarget.dataset.id).then(() => {
        toast('已删除')
        this.load()
      })
    })
  },

  /** 阻止操作按钮冒泡到整卡选择 */
  noop() {}
})
