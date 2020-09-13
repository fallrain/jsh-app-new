import util from '../util/index';

const baseURL = 'customer';
const urls = {
  // 送达方地址列表
  addressesList(status) {
    return `/customers/auxiliary/addresses?status=${status}`;
  },
  // 售后付款方
  afterSalePayer(status) {
    return `/customers/auxiliary/payer?status=${status}`;
  },
  // 收藏的商品的数据
  queryCustomerInterestProductByAccount: '/customer/queryCustomerInterestProductByAccount',
  // 添加收藏
  addInterestProduct: '/customer/addInterestProduct',
  // 取消收藏
  removeInterestProduct: '/customer/removeInterestProduct',
  // 余额支付信息
  inquire: '/customers/payerBalanceList/inquire',
  // 获取售达方信息
  getCustomer: '/customers/auxiliary/customer',
  // 获取送达方信息
  getSendCustomer: '/customers/auxiliary/addresses',
  // 获取送达方信息
  getWarehouse(code) {
    return `/cloud/${code}/warehouse?warehouseFlag=YD`;
  },
  // 获取付款方列表
  getcustomersList(code) {
    return `/customers/${code}/payer`;
  },
  // 获取秘钥
  getSecretkey: '/customer/user/secretkey',
  // 关注商品
  queryCustomerInterestProduct: '/customer/queryCustomerInterestProduct',
  changeDefaultSendTo(sendToCode) {
    /* 切换默认送达方信息 */
    return `/customers/auxiliary/relations/${sendToCode}/default`;
  },
  getAccountMsg: '/api/returnGoodApply/getAccountMsg'
};
util.addPrefix(baseURL, urls);
export default urls;
