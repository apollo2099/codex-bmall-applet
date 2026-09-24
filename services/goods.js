/**
 * 商品相关接口（对接 codex-bmall 商品服务）
 */
const { request, buildQuery } = require('./request')

/** 分类列表 */
function getCategories() {
  return request({ url: '/categories' })
}

/** 首页轮播 */
function getBanners() {
  return request({ url: '/banners' })
}

/**
 * 商品列表（支持分类、关键词、排序、分页）
 * @param {Object} params { categoryId, keyword, sort, page, pageSize }
 * @returns {Promise<{list: Array, total: number, page: number, hasMore: boolean}>}
 */
function getGoodsList(params = {}) {
  return request({ url: `/products${buildQuery(params)}` })
}

/**
 * 商品详情
 * 后端详情接口不返回相关推荐，这里补一次同分类查询，保证详情页「相关推荐」有真实数据
 * @param {string|number} id 商品 ID
 */
function getGoodsDetail(id) {
  return request({ url: `/products/${id}` }).then((goods) =>
    getGoodsList({ categoryId: goods.categoryId, page: 1, pageSize: 5 })
      .then((res) => {
        goods.related = (res.list || []).filter((item) => String(item.id) !== String(goods.id)).slice(0, 4)
        return goods
      })
      .catch(() => {
        goods.related = []
        return goods
      })
  )
}

/** 热销榜 */
function getHotGoods(limit = 6) {
  return request({ url: `/products/hot?limit=${limit}` })
}

/** 猜你喜欢 / 推荐商品 */
function getRecommendGoods(limit = 10) {
  return request({ url: `/products/recommend?limit=${limit}` })
}

module.exports = {
  getCategories,
  getBanners,
  getGoodsList,
  getGoodsDetail,
  getHotGoods,
  getRecommendGoods
}
