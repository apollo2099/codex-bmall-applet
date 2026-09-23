/**
 * 结算草稿
 * 「立即购买」与「购物车结算」都先把待下单商品写入本地草稿，
 * 确认订单页统一从草稿读取，避免参数在页面间反复传递。
 */
const storage = require('../utils/storage')

const KEY = 'checkout_draft'

function saveDraft(items = []) {
  storage.set(KEY, items)
  return items
}

function getDraft() {
  const list = storage.get(KEY, [])
  return Array.isArray(list) ? list : []
}

function clearDraft() {
  storage.remove(KEY)
}

/** 把商品对象转换成结算条目 */
function toCheckoutItem(goods, spec, count) {
  return {
    cartKey: goods.cartKey || '',
    goodsId: goods.goodsId || goods.id,
    title: goods.title,
    subTitle: goods.subTitle,
    emoji: goods.emoji,
    tint: goods.tint,
    cover: goods.cover || '',
    spec: spec || '默认规格',
    price: goods.price,
    count
  }
}

module.exports = { saveDraft, getDraft, clearDraft, toCheckoutItem }
