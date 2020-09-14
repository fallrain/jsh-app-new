<template>
  <view class="container">
<!--    <view class="uni-flex uni-row" :class="{'st':true,'sticky-fixed':isF}" v-show="isF">-->
<!--      <view @click="checkCut('goods')" style="margin: auto;" :class="{'checkedCut':goodsCheck}">{{tabs[0].name}}</view>-->
<!--      <view @click="checkCut('specs')" style="margin: auto;" :class="{'checkedCut':specsCheck}">{{tabs[1].name}}</view>-->
<!--      <view @click="checkCut('details')" style="margin: auto;" :class="{'checkedCut':detailsCheck}">{{tabs[2].name}}</view>-->
<!--    </view>-->
    <scroll-view class="scroller" style="height: 100vh;" :scroll-into-view="toView" scroll-y="true" scroll-with-animation="true">
   <view  style="margin-top:40px;" id="goods">
     <uni-swiper-dot :info="detailInfo.images" :current="current" :mode="mode" field="content">
       <swiper class="swiper-box" @change="changePic" >
         <swiper-item v-for="(item, index) in detailInfo.images" :key="index">
           <view class="swiper-item">
             <image class="image" :src="item.masterImage" mode="aspectFill"></image>
           </view>
         </swiper-item>
       </swiper>
     </uni-swiper-dot>
   </view>
    <view class="uni-common-mt">
      <view class="uni-flex uni-row padding-15" style="display: flex; justify-content: space-between; align-items: center">
        <view class="larger" style="color: #ed2856">¥ {{detailInfo.product.invoicePrice ? detailInfo.product.invoicePrice : ''}}</view>
        <view class="smaller" style="">建议零售价：¥{{detailInfo.product.recommendsalePrice.toFixed(2)}}</view>
        <view @click="guanZhu" class="col-10 smaller iconfont iconshoucang1" style="color: #ED2856"
              v-if="!ISGUANZHU"></view>
        <view @click="guanZhu" class="col-10 smaller iconfont iconicon3" style="color: #ED2856"
              v-else></view>
      </view>
      <view class="uni-flex uni-row padding-8" style="-webkit-flex-wrap: wrap;flex-wrap: wrap;">
        <view class="text modeller">
          <image v-if="detailInfo.isScf==='1'" src="../../assets/img/orderDetail/rongZi.png" style="width:20px;height:20px;"></image>
          {{detailInfo.product.productName}}
        </view>
      </view>
      <view class="lineHigt"></view>
      <view class="uni-flex uni-row padding-8">
        <view class="text col-40 smaller" style="-webkit-flex: 1;flex: 1;">编&nbsp;&nbsp;&nbsp;码：{{detailInfo.product.productCode}}</view>
        <view class="text smaller" style="-webkit-flex: 1;flex: 1;">型&nbsp;&nbsp;&nbsp;号：{{detailInfo.product.productDescribe}}</view>
      </view>
      <view class="uni-flex uni-row padding-8">
        <view class="text col-40 smaller" style="-webkit-flex: 1;flex: 1;">供&nbsp;&nbsp;&nbsp;价：￥{{detailInfo.price.supplyPrice}}</view>
        <view class="text smaller" style="-webkit-flex: 1;flex: 1;">台&nbsp;&nbsp;&nbsp;返：{{detailInfo.price.rebateMoney}}</view>
      </view>
      <view class="uni-flex uni-row padding-8">
        <view class="text col-40 smaller" style="-webkit-flex: 1;flex: 1;">返&nbsp;&nbsp;&nbsp;利：
          <span v-if="detailInfo.price.rebatePolicy===0">COM</span>
          <span v-else-if="detailInfo.price.rebatePolicy===1">BF</span>
          <span v-else-if="detailInfo.price.rebatePolicy===2">FHQ</span>
          <span v-else-if="detailInfo.price.rebatePolicy===5">BZK</span>
        </view>
        <view class="text smaller" style="-webkit-flex: 1;flex: 1;">直扣率：{{detailInfo.price.rebateRate}}%</view>
      </view>
      <view class="uni-flex uni-row padding-8">
        <view class="text col-40 smaller" style="-webkit-flex: 1;flex: 1;">品&nbsp;&nbsp;&nbsp;牌：{{detailInfo.product.productBrand}}</view>
      </view>
      <view v-show="ActListInfo.length>0" v-if="CheckActivityInfo.length<1" class="uni-flex uni-row padding-8">
        <view class="col text smaller">活&nbsp;&nbsp;&nbsp;动：</view>
        <view class="col-70 text">
          <view :key="ack" @click="showAct" class="smaller product-detail-lei2" v-for="ack in ActListInfo">{{ack}}
          </view>
        </view>
        <view class="col-10 text smaller">
          <view class="text-center iconfont iconyou"></view>
        </view>
      </view>
      <view v-show="ActListInfo.length>0" v-else class="uni-flex uni-row padding-8">
        <view class="col text smaller">活&nbsp;动：</view>
        <view class="col-70 text" @click="showAct">
          <view class="smaller product-detail-lei3">{{CheckActivityInfo.title}}</view>
        </view>
        <view class="col-10 text smaller">
          <view class="text-center iconfont iconyou"></view>
        </view>
      </view>
       <pro-com-act :info="ActInfo" :show.sync="isShowAct" @getNum="getProductDetail" @isCheckAct="checkedAct"></pro-com-act>
      <view class="lineHigt"></view>
      <view class="uni-flex uni-row padding-8">
        <view class="col text smaller">已&nbsp;&nbsp;&nbsp;选：</view>
        <view class="col-70 text" @click="showNum">
          <view class="smaller">{{productNum}}件</view>
        </view>
        <view class="col-10 text smaller">
          <view class="text-center iconfont iconyou"></view>
        </view>
      </view>
      <pro-com-num :show.sync="isShowNum" :stock="stock" :infos="detailInfo" @checkedNum="checkedNum($event, item)"></pro-com-num>
      <view class="uni-flex uni-row padding-8">
        <view class="col text smaller">配送至：</view>
        <view class="col-70 text" @click="showShip('OPEN')">
          <view class="smaller">{{ShipInfo}}</view>
        </view>
        <view class="col-10 text smaller">
          <view class="text-center iconfont iconyou"></view>
        </view>
      </view>
      <pro-com-ship :info="deliveryAddressList" :show.sync="isShowShip" :titles="titles"
                    @checkedShip="checkedShip"></pro-com-ship>
      <view class="lineHigt"></view>
      <view class="uni-flex uni-row">
        <view class="padding-30 col-40 modeller">热门推荐</view>
      </view>
      <view class="uni-flex uni-row">
        <scroll-view class="scroll-view_H" style="min-height: 140px;" scroll-x="true" @scroll="scroll" scroll-left="120">
          <view v-for="ieen in hostList" :key="ieen.productCode" class="scroll-view-item_H">
            <image :src="ieen.imageUrl[0]" style="height: 76px;width: 76px;" @tap="goDetail(ieen)"></image>
            <view>
              <span class="product-detail-lei1">{{ieen.title}}</span>
              <span style="color: #ED2856;font-size: 14px;">￥{{ieen.price}}</span>
            </view>
          </view>
        </scroll-view>
      </view>
<!--      <view class="lineHigt"></view>-->
      <view class="uni-flex uni-row" id="specs">
        <view class="padding-30 col-40 modeller">规格参数</view>
      </view>
      <pro-specs :attributesMap="detailInfo.attributesMap"></pro-specs>
      <view class="lineHigt"></view>
      <view class="uni-flex uni-row" id="details">
        <view class=" col-40 modeller padding-30">图文详情</view>
      </view>
      <view class="uni-flex uni-row" v-for="(img,index) in detailInfo.longImages" :key="index">
        <image :src="img" mode="widthFix" style="width: 100%;"></image>
      </view>
    </view>
    <view class="product-detail-fot-high"></view>
    <view class="product-detail-foot">
      <pro-com-foot :info.sync="footButtong" @putcar="putcar" @putplay="putplay" @goCarList="goCarList"></pro-com-foot>
    </view>
    </scroll-view>
  </view>
</template>

<script>
import proComNum from '../../components/productDetail/pro-com-num';
import proComAct from '../../components/productDetail/pro-com-act';
import proComShip from '../../components/productDetail/pro-com-ship';
import proSpecs from '../../components/productDetail/pro-specs';
import proComFoot from '../../components/productDetail/pro-com-foot';
import './css/productDetail.scss';
import {
  mapGetters,mapMutations
} from 'vuex';
import {
  USER, GOODS_LIST
} from '../../store/mutationsTypes';

export default {
  name: 'ProductDetail',
  components: {
    proComNum,
    proComAct,
    proComShip,
    proSpecs,
    proComFoot
  },
  computed: {
    ...mapGetters({
      userInf: USER.GET_SALE,
      defaultSendTo: USER.GET_DEFAULT_SEND_TO,
    }),
  },
  data() {
    return {
      toView: '',
      productCode: '', // 前页面传入产品编码
      titles: '配送至',
      stock: {}, // 库存
      footButtong: { // 底部按钮是否显示问题
        isSale: false,
        isActi: false,
        isSaleLe: false
      },
      ISGUANZHU: false, // 商品关注
      detailInfo: [], // 商品信息
      tabs: [
        {
          id: 'goods',
          name: '宝贝'
        },
        {
          id: 'specs',
          name: '规格'
        },
        {
          id: 'details',
          name: '详情'
        }
      ],
      goodsCheck: true,
      specsCheck: false,
      detailsCheck: false,
      isF: true, // 顶部导航是否显示
      current: 0, // 轮播图第几张
      mode: 'round', // 轮播图底部按钮样式
      hostList: [], // 热门推荐横向列表
      ActListInfo: [], // 活动列表展示的标签
      ActInfo: [], // 活动列表
      CheckActivityInfo: '', // 选择的活动具体内容
      isShowAct: false, // 活动选择popup是否展示
      isShowNum: false, // 数量页面参数，判断是否展示
      isShowShip: false, // 送达方，是否显示
      deliveryAddressList: [],
      ShipInfo: '', // 页面显示选中的送达方
      productNum: 1, // 商品数量数量
      scrollTop: 0,
      old: {
        scrollTop: 0
      },
      scrollHight: 0,
      goodsHight: 0,
      specsHight: 0,
      detailsHight: 0,
      flash: {},
      addressInfo: ''
    };
  },
  onPageScroll() {
    // if (e.scrollTop > 10) {
    //   this.isF = false;
    //   this.goodsCheck = true;
    //   this.specsCheck = false;
    //   this.detailsCheck = false;
    // } else {
    //   this.isF = true;
    // }
    // this.scrollHight = e.scrollTop;
    // console.log(uni.getSystemInfoSync().screenHeight)
  },
  onLoad(options) {
    this.productCode = options.productCode;
    console.log(options.productCode);
  },
  created() {
    this.addressInfo = this.defaultSendTo;
    this.addressInfo.id = this.defaultSendTo.customerCode;
    (async () => {
      await this.getAllProductActivity(); // 抢单  反向定制数据
    })();

    this.getProductDetail();// 获取产品详情
    this.getHostLost();// 获取热门推荐列表
    this.productQueryInter();// 产品是否关注
    this.productStock();// 获取数量页面的库存字段
    this.getDeliveryAddress();// 获取配送地址列表

  },
  methods: {
    ...mapMutations([
      GOODS_LIST.UPDATE_IS_CART_UPDATE,
    ]),
    move() {
      this.isF = true;
    },
    async getProductDetail() {
      const { code, data } = await this.productDetailService.productDetail({
        code: this.productCode,
        codeSale: this.userInf.customerCode,
        codeSend: this.addressInfo.id
      });
      if (code === '1') {
        this.productNum = 1;
        console.log(data);
        // data.price.invoicePrice = data.price.invoicePrice.toFixed(2);

        // 价格 优先级
        if (!data.product.isSale) {
          if (data.composes.length > 0 && data.arbitrages.length > 0) {
            data.product.invoicePrice = Number(data.composes[0].promotionPrice).toFixed(2);
            console.log(1);
          } else if (data.composes && data.composes.length > 0) { // 组合
            data.product.invoicePrice = Number(data.composes[0].promotionPrice).toFixed(2);
            console.log(2);
          } else if (data.arbitrages && data.arbitrages.length > 0) { // 套餐
            console.log(3);
            data.product.invoicePrice = Number(data.arbitrages[0].promotionPrice).toFixed(2);
          } else {
            console.log(4);
            data.product.invoicePrice = '营销活动进行中';
          }
        } else {
          if (data.flashSales && data.flashSales.length > 0) { // 抢单
            console.log(5);
            data.product.invoicePrice = Number(data.flashSales[0].promotionPrice).toFixed(2);
          } else if (data.bigorders && data.bigorders.length > 0) {
            console.log(5.5);
            data.product.invoicePrice = Number(data.bigorders[0].promotionPrice).toFixed(2);
          } else if (data.composes && data.composes.length > 0) { // 组合
            console.log(6);
            console.log(data.composes[0].promotionPrice);
            data.product.invoicePrice = Number(data.composes[0].promotionPrice).toFixed(2);
          } else if (data.arbitrages && data.arbitrages.length > 0) { // 套餐
            console.log(7);
            data.product.invoicePrice = Number(data.arbitrages[0].promotionPrice).toFixed(2);
          } else if (data.price.invoicePrice) {
            console.log(8);
            data.product.invoicePrice = Number(data.price.invoicePrice).toFixed(2);
          } else {
            console.log(9);
            data.product.invoicePrice = '价格即将公布敬请关注!';
          }
        }

        this.detailInfo = data;
        console.log(this.detailInfo);
        this.footButtong.isSale = this.detailInfo.product.isSale;
        if (this.detailInfo.activities.length > 0) {
          this.detailInfo.activities.forEach((ee) => {
            if (ee === '套餐' || ee === '组合') {
              this.footButtong.isActi = true;
            }
          });
        }
        this.ActListInfo = [];
        this.ActInfo = [];
        if (this.detailInfo.product.isSale && this.detailInfo.tjPrice.tj.length > 0) { // 特价
          this.ActListInfo.push('特价');
          const tj = {
            title: '特价版本',
            isMore: true,
            isSe: true,
            isT: true,
            isC: false,
            list: []
          };
          this.detailInfo.tjPrice.tj.forEach((lis) => {
            const a = {
              titleLe: '特价版本',
              name: lis.versionCode,
              price: Number(lis.invoicePrice).toFixed(2),
              time: lis.endDate,
              kou: lis.rebateRateShow * 100,
              num: lis.usableQty,
              isCheck: false
            };
            tj.list.push(a);
          });
          this.ActInfo.push(tj);
        }
        if (this.detailInfo.tjPrice.gc.length > 0) { // 工程
          this.ActListInfo.push('工程');
          const gc = {
            title: '工程版本',
            isMore: true,
            isSe: true,
            isT: true,
            isC: false,
            list: []
          };
          this.detailInfo.tjPrice.gc.forEach((lis) => {
            const a = {
              titleLe: '工程版本',
              name: lis.versionCode,
              price: Number(lis.invoicePrice).toFixed(2),
              time: lis.endDate,
              kou: lis.rebateRateShow * 100,
              num: lis.usableQty,
              isCheck: false
            };
            gc.list.push(a);
          });
          this.ActInfo.push(gc);
        }
        if (this.detailInfo.tjPrice.yj.length > 0) { // 样机
          this.ActListInfo.push('样机');
          const yj = {
            title: '样机版本',
            isMore: true,
            isSe: true,
            isT: true,
            isC: false,
            list: []
          };
          this.detailInfo.tjPrice.yj.forEach((lis) => {
            const a = {
              titleLe: '样机版本',
              name: lis.versionCode,
              price: Number(lis.invoicePrice).toFixed(2),
              time: lis.endDate,
              kou: lis.rebateRateShow * 100,
              num: lis.usableQty,
              isCheck: false
            };
            yj.list.push(a);
          });
          this.ActInfo.push(yj);
        }
        if (this.detailInfo.arbitrages.length > 0) { // 套餐
          this.ActListInfo.push('套餐');
          const tc = {
            title: '套餐',
            isMore: false,
            isSe: true,
            isT: false,
            isC: false,
            list: []
          };
          this.detailInfo.arbitrages.forEach((lis) => {
            const a = {
              titleLe: '套餐',
              name: lis.activityName,
              time: lis.endTime
            };
            tc.list.push(a);
          });
          this.ActInfo.push(tc);
        }
        if (this.detailInfo.composes.length > 0) { // 组合
          this.ActListInfo.push('组合');
          const zh = {
            title: '组合',
            isMore: false,
            isSe: true,
            isT: false,
            isC: false,
            list: []
          };
          this.detailInfo.composes.forEach((lis) => {
            const a = {
              titleLe: '组合',
              name: lis.activityName,
              time: lis.endTime
            };
            zh.list.push(a);
          });
          this.ActInfo.push(zh);
        }
        // if (this.detailInfo.flashSales.length > 0) { // 抢单
        //   this.ActListInfo.push('抢单');
        //   const qd = {
        //     title: '抢单',
        //     isMore: false,
        //     // isSe: true,
        //     isT: false,
        //     isC: true,
        //     list: []
        //   };
        //   console.log('wwwwwwwwwwwwwwwww', this.flash);
        //   // if (this.flash.graborders && this.flash.graborders.length > 0) {
        //   //   this.flash.graborders.forEach((lis) => {
        //   //     lis.lastUpdateDate = lis.lastUpdateDate.split(' ')[0];
        //   //     const a = {
        //   //       titleLe: '抢单',
        //   //       name: lis.promotionName,
        //   //       time: lis.lastUpdateDate,
        //   //       num: lis.availableQuantity
        //   //     };
        //   //     console.log(a);
        //   //     qd.list.push(a);
        //   //   });
        //   // }
        //   this.ActInfo.push(qd);
        // }
        if (Number(this.detailInfo.isOmsSample)) { // 调货
          this.ActListInfo.push('调货');
          const dh = {
            title: '调货',
            isMore: true,
            isSe: true,
            isC: false,
            isT: false,
            list: []
          };
          this.detailInfo.omsSamples.forEach((lis) => {
            const a = {
              titleLe: '调货',
              name: lis.versionCode,
              time: lis.endDate,
              num: lis.usableQty,
              isCheck: false
            };
            dh.list.push(a);
          });
          this.ActInfo.push(dh);
        }
      }
      console.log(data);
      console.log(this.ActInfo);
      this.ActInfo.forEach((item) => {
        item.list.forEach((item) => {
          item.kou = Number(item.kou).toFixed(2);
          item.time = item.time.split(' ')[0];
          console.log(item.time);
        });
      });
    },
    async getAllProductActivity() {
      const { code, data } = await this.activityService.allProductActivity({
        customerCode: this.userInf.customerCode,
        sendtoCode: this.addressInfo.id,
        productCode: this.productCode
      });
      if (code === '1') {
        console.log('8888888888888', data.graborders);
        this.flash = data;
        console.log(this.flash);
        if (this.detailInfo.flashSales && this.detailInfo.flashSales.length > 0) { // 抢单
          this.ActListInfo.push('抢单');
          const qd = {
            title: '抢单',
            isMore: false,
            isSe: true,
            isT: false,
            isC: true,
            list: []
          };
          console.log('wwwwwwwwwwwwwwwww', this.flash);
          if (this.flash.graborders && this.flash.graborders.length > 0) {
            this.flash.graborders.forEach((lis) => {
              lis.endTime = lis.endTime.split(' ')[0];
              const a = {
                titleLe: '抢单',
                name: lis.promotionName,
                time: lis.endTime,
                num: lis.availableQuantity
              };
              console.log(a);
              qd.list.push(a);
            });
          }
          this.ActInfo.push(qd);
        }
        if (this.detailInfo.bigorders && this.detailInfo.bigorders.length > 0) {
          this.ActListInfo.push('反向定制');
          const fx = {
            title: '反向定制',
            isMore: false,
            isSe: true,
            isT: false,
            isC: true,
            list: []
          };
          if (this.flash.graborders && this.flash.graborders.length > 0) {
            this.flash.graborders.forEach((lis) => {
              lis.endTime = lis.endTime.split(' ')[0];
              const a = {
                titleLe: '抢单',
                name: lis.description,
                time: lis.endTime,
                num: lis.availableQuantity,
                isD: true,
              };
              console.log(a);
              fx.list.push(a);
            });
          }
          this.ActInfo.push(fx);
        }
      }
    },
    async getHostLost() {
      const { code, data } = await this.productDetailService.productHostList(this.userInf.customerCode, this.addressInfo.id);
      if (code === '1') {
        this.hostList = data;
        this.hostList.forEach((item) => {
          item.price = Number(item.price).toFixed(2);
        });
      }
      console.log(data);
    },
    async productQueryInter() {
      const { code, data } = await this.productDetailService.productQueryInter({// 获取关注
        account: this.userInf.customerCode,
        productCodeList: [this.productCode]
      });
      if (code === '1') {
        if (data.length > 0) {
          this.ISGUANZHU = true;
        } else {
          this.ISGUANZHU = false;
        }
      }
    },
    async addGuan() {
      const { code } = await this.productDetailService.productAddInter(this.userInf.customerCode, this.addressInfo.id, this.productCode);
      if (code === '200') {
        this.ISGUANZHU = true;
      }
    },
    goDetail(ieen) {
      console.log(ieen);
      uni.navigateTo({
        url: `/pages/productDetail/productDetail?productCode=${ieen.productCode}`
      });
    },
    async productStock() {
      const { code, data } = await this.productDetailService.productStock({
        productCodes: [this.productCode],
        saletoCode: this.userInf.customerCode,
        sendtoCode: this.addressInfo.id
      });
      if (code === '1') {
        this.stock = data;
        console.log(this.stock);
      }
    },
    guanZhu() {
      if (this.ISGUANZHU) { // 已关注，点击是取消关注
        this.productDetailService.productRemoveInter({
          account: this.userInf.customerCode, // 8700002530_1前台输入的账号名
          productCodeList: [this.productCode]
        }).then(({ code }) => {
          if (code === '1') {
            this.ISGUANZHU = false;
          }
        });
      } else {
        this.addGuan();
      }
    },
    changePic(e) { // 轮播图切换显示
      this.current = e.detail.current;
    },
    scroll(e) { // 滑动
      this.old.scrollTop = e.detail.scrollTop;
    },
    showNum() { // 点击打开页面
      this.isShowNum = true;
    },
    showAct() { // 活动选择页面
      this.isShowAct = true;
    },
    showShip() { // 地址选择页面
      this.isShowShip = true;
    },
    getDeliveryAddress() {
      /* 获取配送地址 */
      this.customerService.addressesList(1).then(({ code, data }) => {
        if (code === '1') {
          // 配送地址列表
          this.deliveryAddressList = data.map(v => ({
            id: v.customerCode,
            name: `(${v.customerCode})${v.address}`,
            checked: false
          }));
          console.log(this.deliveryAddressList);
          this.ShipInfo = `(${this.defaultSendTo.customerCode})${this.defaultSendTo.customerName}`;
          console.log(this.addressInfo);
          this.deliveryAddressList.forEach((item) => {
            if (this.ShipInfo.indexOf(item.id) !== -1) {
              item.checked = true;
              this.addressInfo = item;
            }
          });
          // // 当前配送地址修改
          // if (this.deliveryAddressList[0]) {
          //   this.deliveryAddressList[0].checked = true;
          //   this.ShipInfo = this.deliveryAddressList[0].name;
          // }
        }
      });
    },
    checkedNum(e) { // 数量选择页面
      this.productNum = e;
    },
    checkedAct(e, n) { // 活动选择的内容
      console.log('55555555555', n);
      this.CheckActivityInfo = n;
      console.log(this.CheckActivityInfo);
      if (this.CheckActivityInfo && (this.CheckActivityInfo.titleLe === '工程版本' || this.CheckActivityInfo.titleLe === '样机版本')) {
        console.log(1111111111111111111111111);
        this.footButtong.isSaleLe = true;
      } else {
        this.footButtong.isSaleLe = false;
      }
      this.detailInfo.product.invoicePrice = Number(this.CheckActivityInfo.price).toFixed(2);
      console.log(this.CheckActivityInfo);
      // debugger;
    },
    checkedShip(list, e) { // 选择的地址
      this.ShipInfo = this.deliveryAddressList[e].name;
      this.addressInfo = this.deliveryAddressList[e];
      console.log(this.deliveryAddressList[e]);
      this.deliveryAddressList = list;

      (async () => {
        await this.getAllProductActivity(); // 抢单  反向定制数据
      })();
      this.productStock();// 获取数量页面的库存字段
      this.getAllProductActivity();
      this.getProductDetail();// 获取产品详情
      this.getHostLost();// 获取热门推荐列表
      this.productQueryInter();// 产品是否关注

    },
    checkCut(e) {
      this.toView = e;
      // uni.pageScrollTo({
      //   scrollTop: 0
      // });
      this.goodsCheck = false;
      this.detailsCheck = false;
      this.specsCheck = false;
      if (e === 'goods') {
        this.goodsCheck = true;
      } else if (e === 'details') {
        this.detailsCheck = true;
      } else {
        this.specsCheck = true;
      }
    },
    putcar() {
      if (this.CheckActivityInfo === '') { // 没选活动
        if (this.detailInfo.flashSales.length > 0) { // 有抢单
          this.jiaGou1('PT', 3);
        } else {
          this.jiaGou1('PT', 1);
        }
      } else { // 样机版本?
        if (this.CheckActivityInfo.titleLe === '特价版本') {
          this.jiaGou1('TJ', 1);
        } else if (this.CheckActivityInfo.titleLe === '工程版本') {
          this.jiaGou1('GC', 1);
        } else if (this.CheckActivityInfo.titleLe === '样机版本') {
          let YJ = '';
          this.detailInfo.tjPrice.yj.map((item) => {
            // console.log('qqqqqqqqqq',this.CheckActivityInfo);
            console.log('wwwwwwwwww', item);
            if (this.CheckActivityInfo.name === item.versionCode) {
              YJ = item.priceType.toUpperCase();
            }
          });
          this.jiaGou1(YJ, 1);
        } else if (this.CheckActivityInfo.titleLe === '调货') {
          this.jiaGou1('PT', 1);
        }
      }
    },
    putplay() {
      uni.navigateTo({
        url: `/pages/market/marketList?productCode=${this.productCode}`
      });
    },
    goCarList() {
      console.log('gezhonghuodong');
      uni.reLaunch({
        url: '/pages/shoppingCart/shoppingCart'
      });
    },
    async jiaGou1(pt, num1) { // 加入购物车
      // this.CheckActivityInfo
      let stockV = '';
      if (pt === 'PT') {
        stockV = this.CheckActivityInfo.name;
      } else {
        stockV = '';
      }

      const product = [{ priceType: pt,
        priceVersion: this.CheckActivityInfo.name,
        stockVersion: stockV,
        productCode: this.productCode,
        number: this.productNum }];
      const { code } = await this.cartService.addToCart({
        activityType: num1, // 组合类型(1单品2组合3抢购4套餐5成套)
        number: this.productNum,
        productCode: this.productCode, // 产品编码
        productList: product, // 产品编码
        saletoCode: this.userInf.customerCode, // 售达方编码,
        sendtoCode: this.addressInfo.id, // 送达方编码
      });
      if (code === '1') {
        this.getShoppingCartList();
        uni.showToast({
          title: '加入购物车成功',
          duration: 3000
        });
      } else {
        uni.showToast({
          title: '加入购物车成功失败请重试',
        });
      }
    },
    //  调用购物车列表接口
    async getShoppingCartList() {
      /* 获取购物车数据 */
      const { code, data } = await this.cartService.getShoppingCartListFromCache({
        code: this.userInf.customerCode
      });
      if (code === '1') {
        this[GOODS_LIST.UPDATE_IS_CART_UPDATE](true);
        console.log(1111111);
      }
    }
  }
};

</script>
<style lang="scss">
.container{
  width: 100%;
  display: flex;
  scroll-view{
    //height: 100vh;
    .left{
      font-size: 50rpx;
      line-height: 150rpx;
    }
  }
  > view{
    width: 100%;
    position: fixed;
  }
}
.scroll-view_H {
  min-height: 140px !important;
}
//.uni-scroll-view {
//  min-height: 140px !important;
//}

</style>
