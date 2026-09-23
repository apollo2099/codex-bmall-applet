const { splitPrice, formatCount } = require('../../utils/util')

Component({
  options: {
    styleIsolation: 'apply-shared'
  },

  properties: {
    goods: {
      type: Object,
      value: {}
    },
    /** grid：两列网格；list：横向列表 */
    layout: {
      type: String,
      value: 'grid'
    },
    showAdd: {
      type: Boolean,
      value: true
    }
  },

  data: {
    priceInteger: '0',
    priceDecimal: '00',
    salesText: '0',
    tags: []
  },

  observers: {
    goods(goods) {
      if (!goods || !goods.id) return
      const { integer, decimal } = splitPrice(goods.price)
      this.setData({
        priceInteger: integer,
        priceDecimal: decimal,
        salesText: formatCount(goods.sales),
        tags: (goods.tags || []).slice(0, 2)
      })
    }
  },

  methods: {
    onTap() {
      this.triggerEvent('tap', { goods: this.data.goods })
    },

    onAdd(e) {
      this.triggerEvent('add', { goods: this.data.goods, event: e })
    }
  }
})
