const userService = require('../../../services/user')
const { toast } = require('../../../utils/util')

const AVATARS = ['🙂', '😎', '🐱', '🐼', '🦊', '🐳', '🍀', '🚀']

Page({
  data: {
    user: null,
    avatars: AVATARS,
    nickname: '',
    avatarEmoji: '🙂',
    phone: '',
    saving: false
  },

  onLoad() {
    if (!userService.isLogin()) {
      wx.showModal({
        title: '尚未登录',
        content: '请先返回「我的」页面完成登录',
        showCancel: false,
        success: () => wx.navigateBack()
      })
      return
    }
    userService.getProfile().then((user) => {
      if (!user) return
      this.setData({
        user,
        nickname: user.nickname,
        // 后端字段为 avatar，这里沿用页面内的 avatarEmoji 命名
        avatarEmoji: user.avatar || '🙂',
        phone: user.phone
      })
    })
  },

  onNicknameInput(e) {
    this.setData({ nickname: e.detail.value })
  },

  onAvatarTap(e) {
    this.setData({ avatarEmoji: e.currentTarget.dataset.emoji })
  },

  onSave() {
    const nickname = this.data.nickname.trim()
    if (!nickname) {
      toast('请填写昵称')
      return
    }
    if (this.data.saving) return
    this.setData({ saving: true })
    userService
      .updateProfile({
        nickname,
        avatar: this.data.avatarEmoji
      })
      .then((user) => {
        getApp().globalData.userInfo = user
        this.setData({ user, avatarEmoji: user.avatar || this.data.avatarEmoji })
        toast('资料已更新', 'success')
      })
      .catch(() => toast('保存失败'))
      .then(() => this.setData({ saving: false }))
  }
})
