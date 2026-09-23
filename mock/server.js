/**
 * 模拟接口服务
 * 通过简单的「方法 + 路径」路由表模拟后端接口，
 * 参数与返回结构与真实 RESTful 接口保持一致，便于后续替换。
 */
const { categories, banners, goodsList } = require('./goods')
const db = require('./db')
const { delay, createOrderNo, uid } = require('../utils/util')

/* ------------------------------ 工具 ------------------------------ */

function pageOf(list, page = 1, pageSize = 10) {
  const current = Number(page) || 1
  const size = Number(pageSize) || 10
  const start = (current - 1) * size
  const records = list.slice(start, start + size)
  return {
    list: records,
    page: current,
    pageSize: size,
    total: list.length,
    hasMore: start + records.length < list.length
  }
}

function createError(message, code = 400) {
  const err = new Error(message)
  err.code = code
  return err
}

const STATUS_TEXT = {
  pending: '待付款',
  receiving: '待收货',
  done: '已完成',
  canceled: '已取消'
}

/* ------------------------------ 商品 ------------------------------ */

function matchKeyword(item, keyword) {
  if (!keyword) return true
  const text = `${item.title}${item.subTitle}${(item.tags || []).join('')}`.toLowerCase()
  return text.indexOf(String(keyword).toLowerCase()) > -1
}

function sortGoods(list, sort) {
  const result = list.slice()
  if (sort === 'sales') {
    return result.sort((a, b) => b.sales - a.sales)
  }
  if (sort === 'price_asc') {
    return result.sort((a, b) => a.price - b.price)
  }
  if (sort === 'price_desc') {
    return result.sort((a, b) => b.price - a.price)
  }
  return result
}

/* ------------------------------ 路由表 ------------------------------ */

const routes = [
  {
    method: 'GET',
    path: '/categories',
    handle: () => categories.map((item) => Object.assign({}, item, { count: goodsList.filter((g) => g.categoryId === item.id).length }))
  },
  {
    method: 'GET',
    path: '/banners',
    handle: () => banners
  },
  {
    method: 'GET',
    path: '/goods',
    handle: ({ query }) => {
      let list = goodsList.slice()
      if (query.categoryId) list = list.filter((item) => item.categoryId === query.categoryId)
      if (query.keyword) list = list.filter((item) => matchKeyword(item, query.keyword))
      if (query.hot) list = list.filter((item) => item.isHot)
      if (query.new) list = list.filter((item) => item.isNew)
      list = sortGoods(list, query.sort)
      return pageOf(list, query.page, query.pageSize)
    }
  },
  {
    method: 'GET',
    path: '/goods/hot',
    handle: ({ query }) => sortGoods(goodsList.filter((item) => item.isHot), 'sales').slice(0, Number(query.limit) || 6)
  },
  {
    method: 'GET',
    path: '/goods/recommend',
    handle: ({ query }) => sortGoods(goodsList, 'sales').slice(0, Number(query.limit) || 10)
  },
  {
    method: 'GET',
    path: '/goods/:id',
    handle: ({ params }) => {
      const goods = goodsList.find((item) => item.id === params.id)
      if (!goods) throw createError('商品不存在或已下架', 404)
      const related = goodsList
        .filter((item) => item.categoryId === goods.categoryId && item.id !== goods.id)
        .slice(0, 4)
      return Object.assign({}, goods, { related })
    }
  },

  /* ------------------------------ 订单 ------------------------------ */
  {
    method: 'POST',
    path: '/orders',
    handle: ({ data }) => {
      const items = (data && data.goods) || []
      if (!items.length) throw createError('订单中没有商品')

      const goodsAmount = items.reduce((sum, item) => sum + item.price * item.count, 0)
      const freight = data.freight !== undefined ? data.freight : goodsAmount >= 99 ? 0 : 12
      const discount = data.discount || 0
      const now = Date.now()

      const order = {
        id: uid('order'),
        orderNo: createOrderNo(),
        status: 'pending',
        statusText: STATUS_TEXT.pending,
        goods: items,
        goodsAmount: goodsAmount.toFixed(2),
        freight: Number(freight).toFixed(2),
        discount: Number(discount).toFixed(2),
        payAmount: (goodsAmount + Number(freight) - Number(discount)).toFixed(2),
        payMethod: data.payMethod || '微信支付',
        remark: data.remark || '',
        address: data.address || null,
        createdAt: now,
        createTime: now,
        payTime: null,
        timeline: [{ text: '订单已提交', time: now }]
      }

      const orders = db.getOrders()
      orders.unshift(order)
      db.setOrders(orders)
      return order
    }
  },
  {
    method: 'GET',
    path: '/orders',
    handle: ({ query }) => {
      let orders = db.getOrders()
      if (query.status && query.status !== 'all') {
        orders = orders.filter((item) => item.status === query.status)
      }
      orders = orders.sort((a, b) => b.createdAt - a.createdAt)
      return pageOf(orders, query.page, query.pageSize || 20)
    }
  },
  {
    method: 'GET',
    path: '/orders/count',
    handle: () => {
      const orders = db.getOrders()
      return {
        pending: orders.filter((item) => item.status === 'pending').length,
        receiving: orders.filter((item) => item.status === 'receiving').length,
        done: orders.filter((item) => item.status === 'done').length
      }
    }
  },
  {
    method: 'GET',
    path: '/orders/:id',
    handle: ({ params }) => {
      const order = db.getOrders().find((item) => item.id === params.id)
      if (!order) throw createError('订单不存在', 404)
      return order
    }
  },
  {
    method: 'POST',
    path: '/orders/:id/:action',
    handle: ({ params }) => {
      const actionMap = {
        pay: { from: ['pending'], to: 'pending', text: '支付成功', statusText: '待发货' },
        cancel: { from: ['pending'], to: 'canceled', text: '订单已取消' },
        confirm: { from: ['receiving'], to: 'done', text: '确认收货，交易完成' },
        delete: { from: ['done', 'canceled'], to: null, text: '订单已删除' }
      }
      const action = actionMap[params.action]
      if (!action) throw createError('不支持的操作')

      const orders = db.getOrders()
      const index = orders.findIndex((item) => item.id === params.id)
      if (index < 0) throw createError('订单不存在', 404)
      const order = orders[index]
      if (action.from.indexOf(order.status) < 0) throw createError('当前订单状态不支持该操作')

      const now = Date.now()
      if (action.to === null) {
        orders.splice(index, 1)
        db.setOrders(orders)
        return { id: params.id, deleted: true }
      }

      if (params.action === 'pay') {
        // 支付成功后进入「待发货/待收货」流程，示例中直接落到待收货
        order.status = 'receiving'
        order.statusText = STATUS_TEXT.receiving
        order.payTime = now
        order.timeline = (order.timeline || []).concat([
          { text: '支付成功', time: now },
          { text: '商家已发货', time: now + 1000 }
        ])
      } else {
        order.status = action.to
        order.statusText = STATUS_TEXT[action.to]
        order.timeline = (order.timeline || []).concat([{ text: action.text, time: now }])
      }

      orders[index] = order
      db.setOrders(orders)
      return order
    }
  },

  /* ------------------------------ 用户 ------------------------------ */
  {
    method: 'POST',
    path: '/auth/login',
    handle: () => Object.assign(db.getUser(), { token: `mock_token_${Date.now()}`, loginAt: Date.now() })
  },
  {
    method: 'GET',
    path: '/user/profile',
    handle: () => db.getUser()
  },
  {
    method: 'PUT',
    path: '/user/profile',
    handle: ({ data }) => db.setUser(Object.assign(db.getUser(), data))
  },

  /* ------------------------------ 收货地址 ------------------------------ */
  {
    method: 'GET',
    path: '/addresses',
    handle: () => db.getAddresses()
  },
  {
    method: 'POST',
    path: '/addresses',
    handle: ({ data }) => {
      const list = db.getAddresses()
      const address = Object.assign({}, data, { id: uid('addr') })
      if (address.isDefault) list.forEach((item) => (item.isDefault = false))
      if (!list.length) address.isDefault = true
      list.push(address)
      db.setAddresses(list)
      return address
    }
  },
  {
    method: 'PUT',
    path: '/addresses/:id',
    handle: ({ params, data }) => {
      const list = db.getAddresses()
      const index = list.findIndex((item) => item.id === params.id)
      if (index < 0) throw createError('地址不存在', 404)
      if (data.isDefault) list.forEach((item) => (item.isDefault = false))
      list[index] = Object.assign({}, list[index], data, { id: params.id })
      db.setAddresses(list)
      return list[index]
    }
  },
  {
    method: 'DELETE',
    path: '/addresses/:id',
    handle: ({ params }) => {
      const list = db.getAddresses()
      const next = list.filter((item) => item.id !== params.id)
      if (next.length && !next.some((item) => item.isDefault)) next[0].isDefault = true
      db.setAddresses(next)
      return { id: params.id, deleted: true }
    }
  }
]

function matchRoute(method, url) {
  const [path, search = ''] = url.split('?')
  const query = {}
  search.split('&').forEach((pair) => {
    if (!pair) return
    const [key, value = ''] = pair.split('=')
    query[decodeURIComponent(key)] = decodeURIComponent(value)
  })

  for (let i = 0; i < routes.length; i += 1) {
    const route = routes[i]
    if (route.method !== method) continue
    const routeParts = route.path.split('/')
    const urlParts = path.split('/')
    if (routeParts.length !== urlParts.length) continue

    const params = {}
    const matched = routeParts.every((part, index) => {
      if (part.charAt(0) === ':') {
        params[part.slice(1)] = urlParts[index]
        return true
      }
      return part === urlParts[index]
    })

    if (matched) return { route, params, query }
  }
  return null
}

/** 执行一次模拟请求，返回 Promise */
async function request({ url, method = 'GET', data = {} }) {
  await delay(180 + Math.random() * 220)
  const matched = matchRoute(method.toUpperCase(), url)
  if (!matched) throw createError(`接口不存在：${method} ${url}`, 404)
  return matched.route.handle({ params: matched.params, query: matched.query, data })
}

module.exports = { request, routes, STATUS_TEXT }
