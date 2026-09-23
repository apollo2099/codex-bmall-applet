const goodsService = require('../../services/goods')
const cart = require('../../services/cart')
const storage = require('../../utils/storage')
const { toast, confirm } = require('../../utils/util')

const HISTORY_KEY = 'search_history'
const HOT_WORDS = ['蓝牙耳机', '卫衣', '蓝莓', '面膜', '瑜伽垫', '手机', '坚果', '跑步鞋']

Page({
  data: {
    keyword: '',
    history: [],
    hotWords: HOT_WORDS,
    results: [],
    searched: false,
    loading: false
  },

  onLoad() {
    this.setData({ history: storage.get(HISTORY_KEY, []) })
  },

  onInput(e) {
    this.setData({ keyword: e.detail.value })
  },

  onConfirm() {
    this.doSearch(this.data.keyword)
  },

  onHistoryTap(e) {
    const { word } = e.currentTarget.dataset
    this.setData({ keyword: word })
    this.doSearch(word)
  },

  onHotTap(e) {
    const { word } = e.currentTarget.dataset
    this.setData({ keyword: word })
    this.doSearch(word)
  },

  onClearHistory() {
    confirm('确定要清空搜索历史吗？').then((ok) => {
      if (!ok) return
      storage.remove(HISTORY_KEY)
      this.setData({ history: [] })
    })
  },

  onClearKeyword() {
    this.setData({ keyword: '', results: [], searched: false })
  },

  /** 执行搜索并写入历史记录 */
  doSearch(keyword) {
    const word = String(keyword || '').trim()
    if (!word) {
      toast('请输入搜索关键词')
      return
    }
    this.setData({ loading: true, searched: true, keyword: word })

    goodsService
      .getGoodsList({ keyword: word, page: 1, pageSize: 50 })
      .then((res) => {
        this.setData({ results: res.list })
        this.saveHistory(word)
      })
      .catch(() => toast('搜索失败，请稍后重试'))
      .then(() => this.setData({ loading: false }))
  },

  saveHistory(word) {
    const history = [word].concat(this.data.history.filter((item) => item !== word)).slice(0, 10)
    storage.set(HISTORY_KEY, history)
    this.setData({ history })
  },

  onGoodsTap(e) {
    wx.navigateTo({ url: `/pages/goods/detail/index?id=${e.detail.goods.id}` })
  },

  onAddCart(e) {
    cart.add(e.detail.goods, '默认规格', 1)
    toast('已加入购物车', 'success')
  }
})
