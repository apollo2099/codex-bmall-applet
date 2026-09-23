Component({
  options: {
    styleIsolation: 'apply-shared'
  },

  properties: {
    /** 线性图标名（优先于 emoji），如 cart / receipt / search / location */
    icon: {
      type: String,
      value: ''
    },
    emoji: {
      type: String,
      value: '🛒'
    },
    title: {
      type: String,
      value: '这里还空着'
    },
    desc: {
      type: String,
      value: ''
    },
    buttonText: {
      type: String,
      value: ''
    }
  },

  methods: {
    onAction() {
      this.triggerEvent('action')
    }
  }
})
