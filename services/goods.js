/**
 * 商品相关接口
 */
const { request } = require('./request')

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
 * @param {Object} params { categoryId, keyword, sort, hot, new, page, pageSize }
 */
function getGoodsList(params = {}) {
  const query = Object.keys(params)
    .filter((key) => params[key] !== undefined && params[key] !== '' && params[key] !== null)
    .map((key) => `${key}=${encodeURIComponent(params[key])}`)
    .join('&')
  return request({ url: `/goods${query ? `?${query}` : ''}` })
}

/** 商品详情 */
function getGoodsDetail(id) {
  return request({ url: `/goods/${id}` })
}

/** 热销榜 */
function getHotGoods(limit = 6) {
  return request({ url: `/goods/hot?limit=${limit}` })
}

/** 猜你喜欢 */
function getRecommendGoods(limit = 10) {
  return request({ url: `/goods/recommend?limit=${limit}` })
}

module.exports = {
  getCategories,
  getBanners,
  getGoodsList,
  getGoodsDetail,
  getHotGoods,
  getRecommendGoods
}
