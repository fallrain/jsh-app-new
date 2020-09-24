import commodityService from './commodity/commodity.service';
import marketService from './market/market.service';
import messageService from './message/message.service';
import productDetailService from './productDetail/productDetail.service';
import mineServer from './mine/mine.server';
import customerService from './customer/customer.service';
import catalogServer from './category/category.service';
import orderServer from './order/order.server';
import cartService from './cart/cart.service';
import transfergoodsService from './transfergoods/transfergoods.service';
import indexService from './index/index.service';
import trafficService from './traffic/traffic.service';
import samplemachineService from './samplemachine/samplemachine.service';
import vehicleService from './vehicleList/vehicleList.service';
import authService from './auth/auth.service';
import cocService from './coc/coc.service';
import cocSeachService from './cocSearch/cocSearch.service';
import openAccountService from './openAccount/openAccount.service';
import activityService from './activity/activity.service';
import udeskService from './udesk/udesk.service';
import apiVService from './apiV/apiV.service';
import productService from './product/product.service';
import accountService from './account/account.service';

export default {
  install(Vue) {
    // 全局引用
    // 商品服务
    Vue.prototype.commodityService = commodityService;
    // 营销活动服务
    Vue.prototype.marketService = marketService;
    // 消息服务
    Vue.prototype.messageService = messageService;
    // 产品详情服务
    Vue.prototype.productDetailService = productDetailService;
    // 我的服务
    Vue.prototype.mineServer = mineServer;
    // 用户服务
    Vue.prototype.customerService = customerService;
    // 分类服务
    Vue.prototype.catalogServer = catalogServer;
    // 订单服务
    Vue.prototype.orderService = orderServer;
    // 购物车服务
    Vue.prototype.cartService = cartService;
    // 调货列表
    Vue.prototype.transfergoodsService = transfergoodsService;
    // 首页轮播图
    Vue.prototype.indexService = indexService;
    // 样品机服务
    Vue.prototype.samplemachineService = samplemachineService;
    // todo 服务名待定
    Vue.prototype.trafficService = trafficService;
    // 整车列表等功能
    Vue.prototype.vehicleService = vehicleService;
    // 权限相关服务
    Vue.prototype.authService = authService;
    // todo 服务名待定
    Vue.prototype.cocService = cocService;
    // c.jsh账户服务
    Vue.prototype.openAccountService = openAccountService;
    // 首页推荐栏数据
    Vue.prototype.activityService = activityService;
    // 首页客服
    Vue.prototype.udeskService = udeskService;
    // 用户类型
    Vue.prototype.cocSeachService = cocSeachService;
    //  我的-修改手机号apiVService
    Vue.prototype.apiVService = apiVService;
    Vue.prototype.productService = productService;
    //  account字段接口服务
    Vue.prototype.accountService = accountService;
  }
};
