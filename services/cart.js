/**
 * 购物车服务
 * 数据保存在本地（storage），并通过事件通知页面与自定义 tabBar 刷新。
 */
const storage = require('../utils/storage')
const { createEmitter } = require('../utils/emitter')
const { uid } = require('../utils/util')

const STORAGE_KEY = 'cart'
const emitter = createEmitter()

function readCart() {
  const list = storage.get(STORAGE_KEY, [])
  return Array.isArray(list) ? list : []
}

function writeCart(list) {
  storage.set(STORAGE_KEY, list)
  emitter.emit(list)
  return list
}

/** 同一商品 + 同一规格视为同一条记录 */
function buildKey(goodsId, spec) {
  return `${goodsId}__${spec || 'default'}`
}

function getCart() {
  return readCart()
}

function getCount() {
  return readCart().length
}

function getTotalCount() {
  return readCart().reduce((sum, item) => sum + item.count, 0)
}

function getSelected() {
  return readCart().filter((item) => item.selected)
}

function getSelectedCount() {
  return getSelected().reduce((sum, item) => sum + item.count, 0)
}

/** 已选商品金额 */
function getSelectedAmount() {
  const total = getSelected().reduce((sum, item) => sum + item.price * item.count, 0)
  return total.toFixed(2)
}

/**
 * 加入购物车
 * @param {Object} goods 商品对象
 * @param {string} spec 规格文本，如「星空黑 / 降噪版」
 * @param {number} count 数量
 */
function add(goods, spec = '默认规格', count = 1) {
  const list = readCart()
  const key = buildKey(goods.id, spec)
  const index = list.findIndex((item) => item.key === key)

  if (index > -1) {
    list[index].count += count
    list[index].selected = true
  } else {
    list.unshift({
      key,
      id: uid('cart'),
      goodsId: goods.id,
      title: goods.title,
      subTitle: goods.subTitle,
      emoji: goods.emoji,
      tint: goods.tint,
      cover: goods.cover || '',
      spec,
      price: goods.price,
      originPrice: goods.originPrice,
      count,
      selected: true,
      stock: goods.stock || 99
    })
  }

  writeCart(list)
  return list
}

/** 修改数量 */
function updateCount(key, count) {
  const list = readCart()
  const index = list.findIndex((item) => item.key === key)
  if (index < 0) return list
  const stock = list[index].stock || 99
  list[index].count = Math.max(1, Math.min(count, stock))
  return writeCart(list)
}

/** 切换单个商品选中态 */
function toggleSelect(key) {
  const list = readCart()
  const index = list.findIndex((item) => item.key === key)
  if (index < 0) return list
  list[index].selected = !list[index].selected
  return writeCart(list)
}

/** 全选 / 取消全选 */
function toggleSelectAll(selected) {
  const list = readCart().map((item) => Object.assign({}, item, { selected }))
  return writeCart(list)
}

/** 删除单条 */
function remove(key) {
  return writeCart(readCart().filter((item) => item.key !== key))
}

/** 批量删除 */
function removeMany(keys = []) {
  return writeCart(readCart().filter((item) => keys.indexOf(item.key) < 0))
}

/** 下单成功后移除已购买的记录 */
function removeByKeys(keys = []) {
  return removeMany(keys)
}

/** 清空购物车 */
function clear() {
  return writeCart([])
}

function onChange(handler) {
  return emitter.on(handler)
}

module.exports = {
  STORAGE_KEY,
  getCart,
  getCount,
  getTotalCount,
  getSelected,
  getSelectedCount,
  getSelectedAmount,
  add,
  updateCount,
  toggleSelect,
  toggleSelectAll,
  remove,
  removeMany,
  removeByKeys,
  clear,
  onChange
}
