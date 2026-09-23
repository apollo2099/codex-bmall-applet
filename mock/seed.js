/**
 * 首次启动时写入演示数据：一条历史订单、一份默认收货地址
 */
const db = require('./db')
const { goodsList } = require('./goods')
const { createOrderNo, uid } = require('../utils/util')

function buildAddress(overrides = {}) {
  return Object.assign(
    {
      id: uid('addr'),
      name: '张小优',
      phone: '13800008888',
      province: '浙江省',
      city: '杭州市',
      district: '余杭区',
      detail: '文一西路 969 号 优选大厦 12 楼',
      isDefault: true
    },
    overrides
  )
}

function buildDemoOrder() {
  const picked = [goodsList[0], goodsList[7]].map((item, index) => ({
    goodsId: item.id,
    title: item.title,
    subTitle: item.subTitle,
    emoji: item.emoji,
    tint: item.tint,
    spec: index === 0 ? '星空黑 / 降噪版' : '原味 / 30 袋',
    price: item.price,
    count: index === 0 ? 1 : 2
  }))
  const goodsAmount = picked.reduce((sum, item) => sum + item.price * item.count, 0)
  const freight = goodsAmount >= 99 ? 0 : 12
  const createdAt = Date.now() - 1000 * 60 * 60 * 26

  return {
    id: uid('order'),
    orderNo: createOrderNo(),
    status: 'receiving',
    statusText: '待收货',
    goods: picked,
    goodsAmount: goodsAmount.toFixed(2),
    freight: freight.toFixed(2),
    discount: '20.00',
    payAmount: (goodsAmount + freight - 20).toFixed(2),
    payMethod: '微信支付',
    remark: '放快递柜即可，谢谢',
    address: buildAddress(),
    createdAt,
    createTime: createdAt,
    payTime: createdAt + 1000 * 60 * 2,
    timeline: [
      { text: '订单已提交', time: createdAt },
      { text: '支付成功', time: createdAt + 1000 * 60 * 2 },
      { text: '商家已发货', time: createdAt + 1000 * 60 * 60 * 6 },
      { text: '包裹运输中，预计明天送达', time: createdAt + 1000 * 60 * 60 * 20 }
    ]
  }
}

function init() {
  if (db.isInited()) return

  if (db.getAddresses().length === 0) {
    db.setAddresses([
      buildAddress(),
      buildAddress({
        id: uid('addr'),
        name: '李小选',
        phone: '13900006666',
        province: '上海市',
        city: '上海市',
        district: '徐汇区',
        detail: '漕溪北路 88 号 3 号楼 2101',
        isDefault: false
      })
    ])
  }

  if (db.getOrders().length === 0) {
    db.setOrders([buildDemoOrder()])
  }

  db.markInited()
}

module.exports = { init, buildAddress }
