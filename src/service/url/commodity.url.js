import util from '../util/index';

const baseURL = 'commodity/api';
const urls = {
  // 商品列表
  goodsList: '/product/page',
  // 商品价格
  getAllPrice: '/productPrice/allprice',
  // 商品库存
  getStock: '/productStock/stock',
  // 采购首页列表
  list: '/catalog/list'

};
util.addPrefix(baseURL, urls);
export default urls;
