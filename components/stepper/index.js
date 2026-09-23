Component({
  properties: {
    value: {
      type: Number,
      value: 1
    },
    min: {
      type: Number,
      value: 1
    },
    max: {
      type: Number,
      value: 99
    },
    /** small：购物车小尺寸；normal：详情页标准尺寸 */
    size: {
      type: String,
      value: 'small'
    }
  },

  methods: {
    onMinus() {
      const next = this.data.value - 1
      if (next < this.data.min) {
        this.triggerEvent('underflow')
        return
      }
      this.triggerEvent('change', { value: next })
    },

    onPlus() {
      const next = this.data.value + 1
      if (next > this.data.max) {
        wx.showToast({ title: `最多可购买 ${this.data.max} 件`, icon: 'none' })
        return
      }
      this.triggerEvent('change', { value: next })
    },

    onInput(e) {
      const raw = parseInt(e.detail.value, 10)
      if (Number.isNaN(raw)) {
        this.setData({ value: this.data.min })
        this.triggerEvent('change', { value: this.data.min })
        return
      }
      const next = Math.max(this.data.min, Math.min(raw, this.data.max))
      this.triggerEvent('change', { value: next })
    }
  }
})
