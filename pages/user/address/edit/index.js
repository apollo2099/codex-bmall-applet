const addressService = require('../../../../services/address')
const { toast, confirm } = require('../../../../utils/util')

const EMPTY_FORM = {
  name: '',
  phone: '',
  province: '',
  city: '',
  district: '',
  detail: '',
  isDefault: false
}

Page({
  data: {
    form: Object.assign({}, EMPTY_FORM),
    region: [],
    regionText: '请选择省 / 市 / 区',
    isEdit: false,
    submitting: false
  },

  onLoad(options) {
    if (options.id) {
      this.addressId = options.id
      wx.setNavigationBarTitle({ title: '编辑地址' })
      this.setData({ isEdit: true })
      this.loadAddress(options.id)
    }
  },

  loadAddress(id) {
    addressService
      .getAddresses()
      .then((list) => {
        const target = list.find((item) => item.id === id)
        if (!target) return
        this.setData({
          form: target,
          region: [target.province, target.city, target.district],
          regionText: `${target.province} ${target.city} ${target.district}`
        })
      })
      .catch(() => toast('地址加载失败'))
  },

  onInput(e) {
    const { field } = e.currentTarget.dataset
    const form = Object.assign({}, this.data.form, { [field]: e.detail.value })
    this.setData({ form })
  },

  onRegionChange(e) {
    const [province, city, district] = e.detail.value
    const form = Object.assign({}, this.data.form, { province, city, district })
    this.setData({
      form,
      region: e.detail.value,
      regionText: `${province} ${city} ${district}`
    })
  },

  onDefaultChange(e) {
    const form = Object.assign({}, this.data.form, { isDefault: e.detail.value })
    this.setData({ form })
  },

  /** 表单校验，返回错误提示（空字符串表示通过） */
  validate() {
    const { form } = this.data
    if (!form.name.trim()) return '请填写收货人姓名'
    if (!/^1[3-9]\d{9}$/.test(form.phone.trim())) return '请填写正确的手机号'
    if (!form.province) return '请选择所在地区'
    if (!form.detail.trim()) return '请填写详细地址'
    return ''
  },

  onSave() {
    if (this.data.submitting) return
    const error = this.validate()
    if (error) {
      toast(error)
      return
    }

    const payload = Object.assign({}, this.data.form, {
      name: this.data.form.name.trim(),
      phone: this.data.form.phone.trim(),
      detail: this.data.form.detail.trim()
    })

    this.setData({ submitting: true })
    const task = this.data.isEdit
      ? addressService.updateAddress(this.addressId, payload)
      : addressService.addAddress(payload)

    task
      .then(() => {
        toast('保存成功', 'success')
        setTimeout(() => wx.navigateBack(), 700)
      })
      .catch((err) => toast(err.message || '保存失败'))
      .then(() => this.setData({ submitting: false }))
  },

  onDelete() {
    confirm('确定要删除这个收货地址吗？').then((ok) => {
      if (!ok) return
      addressService.removeAddress(this.addressId).then(() => {
        toast('已删除')
        setTimeout(() => wx.navigateBack(), 700)
      })
    })
  }
})
