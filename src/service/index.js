import commodityService from './commodity/commodity.service';
import marketService from './market/market.service';
import messageService from './message/message.service';
import productDetailService from './productDetail/productDetail.service';
import mineServer from './mine/mine.server';
import customerService from './customer/customer.service';
import catalogServer from './category/category.service';
import orderServer from './order/order.server';

export default {
  install(Vue) {
    // 全局引用
    Vue.prototype.commodityService = commodityService;
    Vue.prototype.marketService = marketService;
    Vue.prototype.messageService = messageService;
    Vue.prototype.productDetailService = productDetailService;
    Vue.prototype.mineServer = mineServer;
    Vue.prototype.customerService = customerService;
    Vue.prototype.catalogServer = catalogServer;
    Vue.prototype.orderServer = orderServer;
  }
};
