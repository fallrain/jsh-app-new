<template>
  <view class="shoppingCart">
    <view class="shoppingCart-tab-wrap">
      <j-tab
        :hasRightSlot="true"
        :tabs="tabs"
        @tabClick="tabClick"
      >
        <template #right>
          <view
            @tap="showIndustryPicker"
            class="shoppingCart-tab-picker"
          >
            <text class="mr8">产业</text>
            <i class="iconfont iconxia"></i>
          </view>
        </template>
      </j-tab>
    </view>
    <view>
      <view class="shoppingCart-ads">
        <view class="shoppingCart-ads-total">共{{dataLength.validLength}}件宝贝</view>
        <view
          @tap="showAdsPicker"
          class="shoppingCart-ads-detail"
        >
          <view class="iconfont iconlocal"></view>
          <text>配送至：{{choseSendAddress.name || ''}}</text>
        </view>
      </view>
      <view
        class="shoppingCart-list-filter-text"
        v-if="choseIndustryOptions[0]!=='*' || choseSendAddress.yunCangFlag"
      >
        <!-- {{choseIndustryData[0].value}}产业，-->
        共找到{{dataLength.filterLength}}件产品
      </view>
      <view
        v-show="dataLength.filterLength"
        class="shoppingCart-list-filter"
      >
        <view
          v-for="(goods,index) in shoppingList"
          :key="goods.id"
        >
          <!--筛选出来的产业才显示-->
          <j-shopping-cart-item
            :creditQuotaList="creditQuotaList"
            :defaultSendTo="defaultSendTo"
            :goods="goods"
            :index="index"
            :ref="'shoppingCartItem'+goods.id"
            :userInf="userInf"
            :versionPrice="versionPrice"
            :warehouseFlag="choseSendAddress.yunCangFlag"
            :followState.sync="goods.followState"
            @change="goodsChange"
            @choseOtherVersionsChange="choseOtherVersionsChange($event,index)"
            @numberChange="numberChange($event,index)"
            @del="singleDeleteCart"
            @sign="toSign"
            @updateNumber="refreshShoppingCartList"
            v-show="goods.isValid && goods.$filterIndustryKey === choseIndustryOptions[0]"
          ></j-shopping-cart-item>
        </view>
      </view>
      <view
        class="shoppingCart-list-filter-text"
        v-if="choseIndustryOptions[0]!=='*' || choseSendAddress.yunCangFlag"
      >购物车其他产品
      </view>
      <view
        class="shoppingCart-list"
        v-show="dataLength.notInFilterLength"
      >
        <view
          v-for="(goods,index) in shoppingList"
          :key="goods.id"
        >
          <j-shopping-cart-item
            v-show="goods.isValid && goods.$filterIndustryKey === '*'"
            :ref="'shoppingCartItem'+goods.id"
            :goods="goods"
            :index="index"
            :userInf="userInf"
            :defaultSendTo="defaultSendTo"
            :versionPrice="versionPrice"
            :warehouseFlag="choseSendAddress.yunCangFlag"
            :creditQuotaList="creditQuotaList"
            :followState.sync="goods.followState"
            @change="goodsChange"
            @choseOtherVersionsChange="choseOtherVersionsChange($event,index)"
            @numberChange="numberChange($event,index)"
            @del="singleDeleteCart"
            @updateNumber="refreshShoppingCartList"
            @sign="toSign"
          ></j-shopping-cart-item>
        </view>
        <view
          v-if="shoppingList.length && !shoppingList.filter(v=>v.isValid).length"
          class="shoppingCart-empty"
        >
          没有匹配的相关产品~
        </view>
      </view>
      <view
        v-if="!shoppingList.length"
        class="shoppingCart-empty"
      >
        购物车空空如也~
      </view>
      <view v-show="failureGoodsList.length">
        <j-failure-goods-list
          :list="failureGoodsList"
          @change="failureGoodsListChange"
          @clear="clearFailureGoods"
        ></j-failure-goods-list>
      </view>
      <j-shopping-cart-btm
        :isCheckedAll.sync="isCheckAll"
        :isEdit.sync="isEdit"
        :total="totalGoodsNum"
        :total-price="totalGoodsPrice"
        @checkAll="checkAll"
        @del="deleteCart"
        @follow="multiFollowGoods"
        @submit="submitOrder"
      ></j-shopping-cart-btm>
      <j-address-picker
        :show.sync="isShowAdsPicker"
        :pickerList="sendCustomerList"
        :beforeCheck="adsPickerBeforeCheck"
        :beforeCheckParent="adsPickerBeforeCheckParent"
        @change="sendCustomerListChange"
      ></j-address-picker>
      <m-toast
        :isdistance="true"
        ref="toast"
      ></m-toast>
      <j-pop-picker
        keyName="code"
        title="产业"
        :options="industryGroupData"
        :show.sync="isIndustryPickerShow"
        :choseKeys.sync="choseIndustryOptions"
        @change="industryPickerChange"
      ></j-pop-picker>
    </view>
    <u-modal
      title="海尔产品反向定制协议"
      v-model="isShowSignModel"
      :confirm-text="protocolConfirmText"
    >
      <template #default>
        <scroll-view
          class="shoppingCart-protocol"
          scroll-y
        >
          <view class="shoppingCart-protocol-strong">合同编号：{{signedInf.code}}</view>
          <view class="shoppingCart-protocol-strong">签约时间：{{signedInf.signDate}}</view>
          <view class="shoppingCart-protocol-strong">签约地点：{{signedInf.code}}</view>
          <view class="shoppingCart-protocol-strong">甲方：{{signedInf.jia}}</view>
          <view class="shoppingCart-protocol-strong">乙方：{{signedInf.yi}}</view>
          <view class="shoppingCart-protocol-strong">协议起止日期：{{signedInf.signDate}}至 {{signedInf.signEndDate}}</view>
          <view class="shoppingCart-protocol-cnt">
            <j-big-order-protocol></j-big-order-protocol>
          </view>
        </scroll-view>
      </template>
    </u-modal>
  </view>
</template>
<script>
import MToast from '@/components/plugin/xuan-popup_2.2/components/xuan-popup/xuan-popup.vue';
import JShoppingCartItem from '../../components/shoppingCart/JShoppingCartItem';
import JShoppingCartBtm from '../../components/shoppingCart/JShoppingCartBtm';
import JFailureGoodsList from '../../components/shoppingCart/JFailureGoodsList';
import JAddressPicker from '../../components/shoppingCart/JAddressPicker';
import JTab from '../../components/common/JTab';
import JPopPicker from '../../components/form/JPopPicker';
import './css/shoppingCart.scss';
import {
  mapActions,
  mapGetters,
  mapMutations
} from 'vuex';
import {
  GOODS_LIST,
  SHOPPING_CART,
  USER
} from '../../store/mutationsTypes';
import OrderSplitCompose from '../../model/OrderSplitCompose';
import OrderSplitComposeProduct from '../../model/OrderSplitComposeProduct';
import {
  getBigOrderSignInf,
  getIndustryGroup,
  getOrdinaryCartActivityType,
  getYj
} from '@/lib/dataDictionary';
import shoppingCartMixin from '@/mixins/shoppingCart/shoppingCart.mixin';
import JBigOrderProtocol from '../../components/shoppingCart/JBigOrderProtocol';

export default {
  name: 'shoppingCart',
  components: {
    JBigOrderProtocol,
    JPopPicker,
    JTab,
    JAddressPicker,
    JFailureGoodsList,
    JShoppingCartBtm,
    JShoppingCartItem,
    MToast,
    // transferShoppingCart,
    // vehicleCarList
  },
  mixins: [
    shoppingCartMixin
  ],
  data() {
    return {
      isCreated: false,
      tabs: [
        {
          id: 'gwc',
          name: '购物车',
          active: true
        },
        {
          id: 'zc',
          name: '整车直发',
          active: false
        },
        {
          id: 'zx',
          name: '中心调货',
          active: false
        }
      ],
      // 购物车列表
      shoppingList: [],
      // 筛选的购物车列表
      filterShoppingList: [],
      // 失效产品列表
      failureGoodsList: [],
      // 是否全选
      isCheckAll: false,
      // 是否编辑模式
      isEdit: false,
      // 选中的商品总数
      totalGoodsNum: 0,
      // 选中的商品总价
      totalGoodsPrice: 0.00,
      // 是否显示配送地址选择
      isShowAdsPicker: false,
      // 送达方数据
      sendCustomerList: [],
      // 异地云仓数据
      offSiteData: [],
      // 选中的送达方cy
      choseSendAddress: {},
      // 信用额度列表（以产品大类为维度）
      creditQuotaList: [],
      // 版本价格对象
      versionPrice: {},
      // 产业展示
      isIndustryPickerShow: false,
      // 产业数据
      industryGroupData: [],
      // 选中的产业数据key
      choseIndustryOptions: ['*'],
      // 选中的产业数据
      choseIndustryData: [],
      // 云仓、异地云仓权限对象
      cloudStockStatus: {},
      // 是否显示反向定制签约协议
      isShowSignModel: false,
      // 反向定制签约信息
      signedInf: {},
      // 签约信息确定按钮文字
      protocolConfirmText: ''
    };
  },
  created() {
    // 标记是否第一次进入
    this.isCreated = true;
    this.setPageInfo();
    // 不加入get set
    this.getBigOrderSignInf = getBigOrderSignInf;
    // uni.setTabBarBadge({
    //   index: 2,
    //   text: '2'
    // });
  },
  onShow() {
    uni.showTabBar();
    // 如果已经更新过购物车，则需要刷新下
    if (this.isCartUpdate) {
      // 避免请求两次
      if (this.isCreated) {
        this.reloadPageInfo();
      }
      this[GOODS_LIST.UPDATE_IS_CART_UPDATE](false);
    }
  },
  onPullDownRefresh() {
    /* 重置页面 */
    this.reloadPageInfo().then(() => {
      uni.stopPullDownRefresh();
      this.showToast({
        type: 'success',
        content: '刷新完成'
      });
    });
  },
  computed: {
    ...mapGetters({
      userInf: USER.GET_SALE,
      defaultSendTo: USER.GET_DEFAULT_SEND_TO,
      isCartUpdate: GOODS_LIST.GET_IS_CART_UPDATE,
      cartNum: SHOPPING_CART.GET_CART_NUM,
    }),
    validList() {
      /* 有效的商品列表 */
      return this.shoppingList.filter(v => v.isValid);
    },
    dataLength() {
      /* 数据的长度 */
      const validList = this.validList;
      const validLength = validList.length;
      // 选择的产业的code
      const choseIndustryCode = this.choseIndustryOptions[0];
      const filterLength = this.validList.filter((v) => {
        if (v.$filterIndustryKey === choseIndustryCode) {
          return true;
        }
        return false;
      }).length;
      const notInFilterLength = validLength - filterLength;
      return {
        // 有效商品的长度
        validLength,
        // 有效商品的筛选出的长度
        filterLength,
        // 有效商品的排除筛选出的长度
        notInFilterLength
      };
    }
  },
  methods: {
    ...mapMutations([
      USER.UPDATE_DEFAULT_SEND_TO,
      GOODS_LIST.UPDATE_IS_CART_UPDATE,
    ]),
    ...mapActions([
      USER.UPDATE_DEFAULT_SEND_TO_ASYNC,
      SHOPPING_CART.UPDATE_CART_NUM_ASYNC
    ]),
    setPageInfo() {
      // 送达方数据初始化
      this.resetSendCustomerList();
      // 云仓权限
      this.getCloudStockStateAndGen();
      // 设置产业数据
      this.setIndustry();
      // 送达方
      this.getSendCustomer();
      // 刷新购物车列表缓存
      this.refreshShoppingCartList();
      // 购物车列表（缓存里取）
      this.getShoppingCartList();
      // 获取信用额度
      this.getCreditQuota();
      // 获取特价版本
      this.getSpecialPrice();
      // 重置购物车数量
      this.updateCartNum();
    },
    reloadPageInfo() {
      /* 重载页面信息 */
      // 回到顶部
      uni.pageScrollTo({
        scrollTop: 0,
        duration: 100
      });
      // 送达方数据重置
      this.resetSendCustomerList();
      // 重置送达方
      this.resetSendAddress();
      // 送达方
      this.getSendCustomer();
      // 云仓权限
      const getCloudStockState = this.getCloudStockStateAndGen();
      // 刷新购物车列表缓存
      const getRefreshShoppingCartList = this.refreshShoppingCartList();
      // 购物车列表
      const getShoppingCartList = this.getShoppingCartList();
      // 获取特价版本
      const getSpecialPrice = this.getSpecialPrice();
      // 重置购物车数量
      const updateCartNum = this.updateCartNum();
      // 重置购物车
      this.resetShoppingCartList();
      // 重置结算底栏信息
      this.resetBtmInf();
      //  重置产业
      this.resetIndustry();
      return Promise.all([
        getRefreshShoppingCartList,
        getShoppingCartList,
        getSpecialPrice,
        getCloudStockState,
        updateCartNum
      ]).then(() => true);
    },
    setCartNum() {
      /* 设置购物车数量 */
      const cartNum = this.cartNum;
      if (cartNum) {
        uni.setTabBarBadge({
          index: 3,
          text: `${cartNum}`
        });
      } else {
        uni.removeTabBarBadge({
          index: 3
        });
      }
    },
    resetSendCustomerList() {
      /* 先重置送达方数据 */
      this.sendCustomerList = [
        {
          flag: 'yc',
          name: '云仓',
          checked: false,
          // 没有子元素
          isSingle: true,
          isHide: true
        },
        {
          flag: 'ydyc',
          name: '异地云仓',
          childrenType: 'short',
          isCanBeCheck: false,
          checked: false,
          isExpand: false,
          isShowSearch: true,
          searchValue: '',
          searchKeys: ['name'],
          children: [],
          isHide: true
        },
        {
          flag: 'sale',
          name: '配送至',
          isCanBeCheck: false,
          checked: false,
          isExpand: true,
          childrenType: 'long',
          isShowSearch: true,
          searchValue: '',
          searchKeys: ['address', 'addressCode'],
          children: [],
          isHide: false
        },
      ];
    },
    async getCloudStockStateAndGen() {
      /* 获取云仓权限 */
      const { code, data } = await this.cartService.getCloudStockState(this.userInf.customerCode);
      if (code === '1') {
        this.cloudStockStatus = data;
        // 如果有云仓权限，再查云仓
        if (data.ydzfFlag === 'Y') {
          // 异地云仓
          await this.getWarehouse();
        } else {
          const offSiteCloudStock = this.sendCustomerList.find(v => v.flag === 'ydyc');
          // 显示异地云仓
          offSiteCloudStock.isHide = true;
          // 异地云仓数据
          offSiteCloudStock.children = [];
        }
        // 云仓权限
        const cloudStock = this.sendCustomerList.find(v => v.flag === 'yc');
        if (data.signStatus === 'Y') {
          cloudStock.isHide = false;
        } else {
          cloudStock.isHide = true;
        }
        return data;
      }
      return false;
    },
    setIndustry() {
      // 获取产业并设置数据
      getIndustryGroup().then((data) => {
        const industryGroupData = data.map(v => ({
          ...v,
          value: v.codeName
        }));
        industryGroupData.unshift({
          code: '*',
          value: '全部'
        });
        this.industryGroupData = industryGroupData;
      });
    },
    resetSendAddress() {
      /* 重置送发方 */
      this.choseSendAddress = {};
    },
    resetIndustry() {
      /* 重置产业 */
      this.choseIndustryOptions = ['*'];
    },
    showIndustryPicker() {
      /* 展示产业picker */
      this.isIndustryPickerShow = true;
    },
    industryPickerChange(data, checkedIndustryOptions) {
      /* 产品组picker change */
      // 先回到顶部
      uni.pageScrollTo({
        scrollTop: 0,
      });
      const shoppingList = JSON.parse(JSON.stringify(this.shoppingList));
      this.choseIndustryData = checkedIndustryOptions;
      const industryCode = data[0];
      if (industryCode === '*') {
        shoppingList.forEach((v) => {
          v.$filterIndustryKey = '*';
        });
      } else {
        shoppingList.forEach((v) => {
          if (v.productList[0].industryCode === industryCode) {
            v.$filterIndustryKey = industryCode;
          } else {
            v.$filterIndustryKey = '*';
          }
        });
      }
      this.shoppingList = shoppingList;
      // 更新底栏
      if (this.isCheckAll) {
        this.updateTotal();
      }
      this.isIndustryPickerShow = false;
    },
    resetBtmInf() {
      /* 重置底栏信息 */
      this.isCheckAll = false;
      this.isEdit = false;
      this.totalGoodsNum = 0;
      this.totalGoodsPrice = 0;
    },
    async getWarehouse() {
      /* 获取异地云仓信息 */
      const { code, data } = await this.customerService.getWarehouse({
        customerCode: this.userInf.customerCode,
        warehouseFlag: 'YD'
      });
      if (code === '1') {
        // 存于云仓数据
        this.offSiteData = data;
        const offSite = this.sendCustomerList.find(v => v.flag === 'ydyc');
        // 显示异地云仓
        offSite.isHide = false;
        // 异地云仓数据
        offSite.children = data.map(v => ({
          id: v.code,
          name: v.codeName,
          checked: false,
          yunCangFlag: 'ydyc'
        }));
      }
    },
    async getSendCustomer() {
      /* 获取售达方信息 */
      const { code, data } = await this[USER.UPDATE_DEFAULT_SEND_TO_ASYNC]();
      if (code === '1') {
        const detail = data.map(v => ({
          id: v.addressCode,
          name: `（${v.customerCode}）${v.address}`,
          checked: this.defaultSendTo.customerCode === v.customerCode,
          ...v
        }));
        this.sendCustomerList[2].children = detail;
        // 默认的送达地址
        this.choseSendAddress = {
          sendtoCode: this.defaultSendTo.customerCode,
          name: `（${this.defaultSendTo.customerCode}）${this.defaultSendTo.address}`,
          ...this.defaultSendTo
        };
      }
    },
    resetShoppingCartList() {
      /* 重置购物车列表 */
      this.filterShoppingList = [];
      this.shoppingList = [];
      this.failureGoodsList = [];
    },
    async getShoppingCartList() {
      /* 获取购物车数据 */
      const { code, data } = await this.cartService.getShoppingCartListFromCache({
        code: this.userInf.customerCode
      });
      if (code === '1') {
        // 正常商品
        const shoppingList = [];
        // 失效商品
        const failureGoodsList = [];
        if (data && data.others) {
          data.others.forEach((v) => {
            if (v.composeEnable === 1) {
              shoppingList.push({
                ...v,
                // 有效商品
                isValid: true,
                // 无效时候的错误信息
                $errorMsg: [],
                // 不支持的的版本价格类型（在价格版本选择的时候有用）
                notSupportPriceTypes: [],
                checked: false,
                // 信用模式
                isCreditMode: false,
                // 直发模式
                isDirectMode: false,
                // 远周次模式
                isWeekMode: false,
                $PriceInfo: v.productList[0].priceInfo,
                // 在购物车里更换的其他版本数据，使得计算属性能监控到
                choseOtherVersions: [],
                // 关注状态
                followState: false,
                // 款先模式
                isFundsFirstMode: false,
                // 筛选的产业key
                $filterIndustryKey: '*'
              });
            } else {
              failureGoodsList.push({
                ...v,
                // 此处加入此属性，防止小程序编译出错
                $errorMsg: []
              });
            }
          });
        }
        this.shoppingList = shoppingList;
        this.failureGoodsList = failureGoodsList;
      }
      return true;
    },
    refreshShoppingCartList() {
      /* 刷新购物车数据 */
      // todo 是否需要同步？
      return this.cartService.getShoppingCartList({
        saletoCode: this.userInf.customerCode,
        sendtoCode: this.defaultSendTo.customerCode
      });
    },
    async getCreditQuota() {
      /* 获取各个产品组的信用额度 */
      const { code, data } = await this.trafficService.getXYQuota({
        customerCode: this.userInf.customerCode
      });
      if (code === '1') {
        this.creditQuotaList = data.data || [];
      }
    },
    async getSpecialPrice() {
      /* 获取特价版本 */
      const saletoCode = this.userInf.customerCode;
      const data = await this.cartService.getSpecialPrice({
        saletoCode,
        sendtoCode: this.defaultSendTo.customerCode,
        account: saletoCode,
      });
      this.versionPrice = (data && data) || {};
      return this.versionPrice;
    },
    goodsChange(goods, index) {
      /* 商品数据change */
      this.$set(this.shoppingList, index, goods);
      if (this.isCheckAll) {
        this.updateTotal();
      }
    },
    updateTotal() {
      /* 更新底栏统计 */
      // 更新选择的商品数目
      this.totalGoodsNum = this.countTotalNumber();
      // 更新选择的总商品价格
      this.totalGoodsPrice = this.countTotalPrice();
    },
    checkAll(checked) {
      /* 全部选择回调函数 */
      this.shoppingList.forEach((v) => {
        v.checked = checked;
      });
      this.updateTotal();
    },
    countTotalPrice() {
      /* 计算选择的商品的总价 */
      let totalGoodsPrice = 0;
      this.shoppingList.forEach((v) => {
        if (v.checked && v.isValid) {
          const num = v.number;
          // 获取应该计算的版本数据
          let invoicePrice;
          const versions = this.getPriceVersionData(v);
          const version = versions.find(data => data.priceType);
          // 查找正品样机
          const realExampleProduct = versions.find(vs => vs.$isRealProduct);
          // 1.找不到，但是还有选择的版本，则是版本调货,版本掉货无价格，需要从普通价取
          // 2.正品样机也从普通价格取
          if ((!version && versions.length) || realExampleProduct) {
            invoicePrice = v.$PriceInfo.commonPrice.invoicePrice;
          } else {
            invoicePrice = version.invoicePrice;
          }
          const curTotal = this.jshUtil.arithmetic(invoicePrice, num, 3);
          totalGoodsPrice = this.jshUtil.arithmetic(totalGoodsPrice, curTotal);
          // 正品样机还需要再计算一次，普通价格之和加正品样机价格之和
          if (realExampleProduct) {
            const {
              invoicePrice: realInvoicePrice,
              usableQty
            } = realExampleProduct;
            const curRealTotal = this.jshUtil.arithmetic(realInvoicePrice, usableQty, 3);
            totalGoodsPrice = this.jshUtil.arithmetic(totalGoodsPrice, curRealTotal);
          }
        }
      });
      totalGoodsPrice = this.jshUtil.formatNumber(totalGoodsPrice, 2);
      return totalGoodsPrice;
    },
    countTotalNumber() {
      /* 计算选择的商品的总数 */
      return this.shoppingList.filter(v => v.checked && v.isValid).length;
    },
    failureGoodsListChange(list) {
      this.failureGoodsList = list;
    },
    showAdsPicker() {
      /* 地址选择展示 */
      this.isShowAdsPicker = true;
    },
    checkHasCreditMode() {
      /* 检查是否有开启了信用模式的商品 */
      return !!this.shoppingList.find(v => v.isCreditMode);
    },
    adsPickerBeforeCheckParentBind(...args) {
      return this.adsPickerBeforeCheckParent.call(this, ...args);
    },
    adsPickerBeforeCheckParent(item) {
      /* 云仓点击前置事件 */
      let state = true;
      if (!item.checked && this.checkHasCreditMode()) {
        this.showToast({
          type: 'warn',
          content: '信用产品不支持云仓'
        });
        state = false;
      }
      return state;
    },
    adsPickerBeforeCheckBind(...args) {
      return this.adsPickerBeforeCheck.call(this, ...args);
    },
    adsPickerBeforeCheck({
      item,
      parent,
    }) {
      let state = true;
      if (parent && item && item.yunCangFlag) {
        // 异地云仓
        if (this.checkHasCreditMode()) {
          state = false;
          this.showToast({
            type: 'warn',
            content: '信用产品不支持异地云仓'
          });
        }
      }
      return state;
    },
    sendCustomerListChange(list, detail, parent, isShow, type) {
      /* 地址列表change */
      // changeDefaultSendTo
      this.sendCustomerList = list;
      const choseSendAddressTemp = JSON.parse(JSON.stringify(this.choseSendAddress));
      // 非扩展操作
      if (type !== 'expand') {
        if (parent) {
          if (detail) {
            // 异地云仓
            if (detail.yunCangFlag) {
              this.choseSendAddress = {
                yunCangCode: detail.id,
                yunCangFlag: detail.yunCangFlag,
                name: `（异地云仓）${detail.name}`,
              };
              this.showToast({
                type: 'warn',
                content: '海尔将收取一定托管费用'
              });
            } else {
              // 送达方
              this.choseSendAddress = {
                sendtoCode: detail.id,
                name: detail.name
              };
              // 更改默认的送达方
              this.customerService.changeDefaultSendTo({
                sendToCode: detail.customerCode
              }).then(({ code }) => {
                if (code === '1') {
                  // 更改成功之后更新store
                  this[USER.UPDATE_DEFAULT_SEND_TO](detail);
                  // 更改成功之后更新数据列表
                  this.reloadPageInfo();
                }
              });
            }
          } else {
            if (parent.flag === 'yc') {
              // 普通云仓（只有一个）
              this.choseSendAddress = {
                yunCangCode: '',
                yunCangFlag: 'yc',
                name: '云仓',
              };
              this.showToast({
                type: 'warn',
                content: '海尔将收取一定托管费用'
              });
            } else {
              this.choseSendAddress = {};
            }
          }
        }
      }
      // 如果送达方改变了，包括云仓
      if (choseSendAddressTemp.yunCangFlag !== this.choseSendAddress.yunCangFlag) {
        this.filterValid();
      }
      // 选中之后关闭弹窗
      this.isShowAdsPicker = isShow || false;
    },
    filterValid() {
      /* 筛选有效的商品 */
      const {
        yunCangFlag
      } = this.choseSendAddress;
      if (yunCangFlag) {
        // 如果商品是不支持相关云仓条件的，移入失效产品，原商品列表设置属性isValid为false
        this.shoppingList.forEach((goods) => {
          const {
            activityType,
            productList,
            choseOtherVersions
          } = goods;
          const product = productList[0];
          const {
            stockVersion,
            priceType
          } = product;
          let isValid = true;
          const $errorMsg = [];
          // 云仓、异地云仓不支持版本调货
          if (
            (yunCangFlag === 'yc' || yunCangFlag === 'ydyc')
              && (stockVersion || choseOtherVersions.find(v => v.$isTransfer))
          ) {
            isValid = false;
            $errorMsg.push('版本调货不支持云仓、异地云仓');
          }
          // 异地云仓也不支持折扣样机（样机出样）、反向定制
          if (yunCangFlag === 'ydyc') {
            if (priceType === 'YJCY' || choseOtherVersions.find(v => v.priceType === 'YJCY') || activityType === 5) {
              isValid = false;
              if (activityType === 5) {
                $errorMsg.push('反向定制不支持异地云仓');
              } else {
                $errorMsg.push('折扣样机不支持异地云仓');
              }
            }
          }
          goods.$errorMsg = $errorMsg;

          if (isValid) {
            if (!goods.isValid) {
              // 删除失效产品里的数据
              this.spliceFailureGoodsList(goods.id);
            }
            // 如果云仓或者异地云仓且是有效产品，则需要对已有的版本规格做选择上的处理
            const notSupportPriceTypes = [];
            if (yunCangFlag === 'ydyc') {
              // 如果版本规格里还有折扣样机或者版本调货，那折扣样机、版本调货不可选
              // 折扣样机（样机出样）
              notSupportPriceTypes.push({
                type: 'YJCY',
                msg: '异地云仓不可选择折扣样机'
              });
            }
            if (yunCangFlag === 'yc' || yunCangFlag === 'ydyc') {
              // 下面俩皆代表版本调货
              notSupportPriceTypes.push({
                type: '',
                msg: '云仓或者异地云仓不可选择版本调货'
              },
              {
                type: undefined,
                msg: '云仓或者异地云仓不可选择版本调货'
              });
            }
            // 重置不可选的版本
            goods.notSupportPriceTypes = notSupportPriceTypes;
          } else {
            if (goods.isValid) {
              // 失效产品增加数据
              this.addFailureGoodsList(goods);
            }
          }
          goods.isValid = isValid;
        });
      } else {
        // 非云仓、非异地云仓的时候，
        // 1.需要把shoppingList里的相关isValid为false产品重置为true，
        // 2.删除 failureGoodsList 里的数据
        this.shoppingList.forEach((goods) => {
          if (!goods.isValid) {
            this.spliceFailureGoodsList(goods.id);
            goods.isValid = true;
          }
        });
      }
      // 更新底栏
      if (this.isCheckAll) {
        this.updateTotal();
      }
    },
    addFailureGoodsList(goods) {
      /* 失效产品增加数据 */
      this.failureGoodsList.unshift(goods);
    },
    spliceFailureGoodsList(id) {
      /* 删除失效列表里的数据 */
      const delIndex = this.failureGoodsList.findIndex(v => v.id === id);
      if (delIndex > -1) {
        this.failureGoodsList.splice(delIndex, 1);
      }
    },
    tabClick(tabs) {
      this.tabs = tabs;
      console.log(this.tabs);
      this.tabs.forEach((item) => {
        if (item.active) {
          if (item.name === '整车直发') {
            uni.navigateTo({
              url: '/pages/vehicleList/abnormal'
            });
          }
          if (item.name === '中心调货') {
            uni.navigateTo({
              url: '/pages/transferGoods/transferShoppingCart'
            });
          }
        }
        item.active = false;
        this.tabs[0].active = true;
      });
      console.log(tabs);
    },
    deleteCart(idList) {
      /* 删除购物车里的商品 */
      /**
         * @idList（Array）id的集合，如果传入则使用传入的id
         * */
      let ids;
      if (idList && idList.length) {
        ids = idList;
      } else {
        // 选出选中的商品的id集合
        ids = [];
        this.shoppingList.forEach((v) => {
          if (v.checked) {
            ids.push(v.id);
          }
        });
      }
      if (!ids.length) {
        this.showToast({
          type: 'warn',
          content: '请先选择商品'
        });
        return;
      }
      uni.showModal({
        title: '',
        content: '确认要从购物车移除吗？',
        success: async (res) => {
          if (res.confirm) {
            const { code } = await this.cartService.deleteCart(ids);
            if (code === '1') {
              this.showToast({
                type: 'success',
                content: '删除成功'
              });
              ids.forEach((id) => {
                const index = this.shoppingList.findIndex(v => v.id === id);
                if (index > -1) {
                  this.shoppingList.splice(index, 1);
                }
                const failureIndex = this.failureGoodsList.findIndex(v => v.id === id);
                if (failureIndex > -1) {
                  this.failureGoodsList.splice(failureIndex, 1);
                }
              });
              this.updateCartNum();
            }
          }
        }
      });
    },
    updateCartNum() {
      /* 更新购物车数量 */
      return this[SHOPPING_CART.UPDATE_CART_NUM_ASYNC](this.userInf.customerCode);
    },
    singleDeleteCart(goods) {
      /* 单个移除购物车 */
      const ids = [goods.id];
      this.deleteCart(ids);
    },
    clearFailureGoods() {
      /* 清空购物车的失效产品 */
      const ids = this.failureGoodsList.map(v => v.id);
      this.deleteCart(ids, true);
    },
    multiFollowGoods() {
      // 选出选中的商品的id集合
      const ids = this.shoppingList.filter(v => v.checked);
      if (!ids.length) {
        this.showToast({
          type: 'warn',
          content: '请先选择商品'
        });
        return;
      }
      // todo 接口应该优化
      for (let i = 0; i < ids.length; i++) {
        this.followGoods(ids[i]);
      }
    },
    async followGoods(obj) {
      /* 添加关注 */
      const {
        customerCode
      } = this.userInf;
      const { code } = await this.productDetailService.productAddInter(customerCode, customerCode, obj.productList[0].productCode);
      if (code === '200') {
        this.shoppingList.find(v => obj.id === v.id).followState = true;
        return { code: '1' };
      }
      return { code: '0' };
    },
    async submitOrder() {
      /* 提交订单 */
      const formList = [];
      const len = this.shoppingList.length;
      for (let i = 0; i < len; i++) {
        const product = this.shoppingList[i];
        if (product.checked) {
          const {
            id,
            number,
            productList,
            stockVersion
          } = product;
          if (!number) {
            this.showToast({
              type: 'warn',
              content: '请先选择数量'
            });
            return;
          }
          const shoppingCartItem = this.$refs[`shoppingCartItem${id}`][0];
          // 检查最大可购买数量，超出提示并返回
          const maxNum = shoppingCartItem.maxGoodsNumber;
          if (number > maxNum) {
            uni.showModal({
              title: '提示',
              showCancel: false,
              content: `商品：${productList[0].productName}可购买数量不足，活动剩余可购买数${maxNum}请调整购物车`
            });
            return;
          }
          const form = new OrderSplitCompose({
            ...product,
            composeId: product.id,
            // activityType需要额外处理，具体参加数据字典：getOrdinaryCartActivityType
            activityType: getOrdinaryCartActivityType()[product.activityType]
          });
            // todo 以后应该改成直接从 shoppingCartItem 组件里面取 choseVersions
            // 判断产品的取值的字段名
          let productListName = 'productList';
          // 调货版本号
          let transferVersion;
          // 调货数量
          let transferVersionNumber;
          // 如果选择了版本，则从choseOtherVersions字段取商品
          if (product.choseOtherVersions && product.choseOtherVersions.length) {
            // 是否存在版本调货
            const transfer = product.choseOtherVersions.find(vs => !vs.priceType);
            // 版本调货本质不算版本，只需要在已选的版本里添加调货字段
            if (transfer) {
              transferVersion = transfer.versionCode;
              transferVersionNumber = transfer.num;
              // 如果选择的就版本调货一个，则还是从productList取,多余一个则从choseOtherVersions取
              if (product.choseOtherVersions.length > 1) {
                productListName = 'choseOtherVersions';
              }
            } else {
              productListName = 'choseOtherVersions';
            }
          }
          // 如果stockVersion有值，代表加购的时候有版本调货
          if (stockVersion) {
            transferVersion = stockVersion;
          }
          let orderSplitComposeProductData = {
            // 存在版本调货，则传版本调货提供的数量
            number: transferVersion ? transferVersionNumber : product.number,
            // 是否直发
            isStock: shoppingCartItem.isDirect && product.isDirectMode ? '0' : '1',
          };
            // 远周次参数修改
          const choseWeek = shoppingCartItem.choseWeekKeys.join('');
          if (shoppingCartItem.isWeek) {
            orderSplitComposeProductData.farWeek = '1';
            if (product.isWeekMode) {
              orderSplitComposeProductData.isCheckFarWeek = product.isWeekMode ? '1' : '0';
              if (choseWeek) {
                orderSplitComposeProductData.farWeekDate = choseWeek;
              } else {
                uni.showModal({
                  title: '提示',
                  showCancel: false,
                  content: `商品：${productList[0].productName},未选择远周次日期`
                });
                return;
              }
            } else {
              orderSplitComposeProductData.isCheckFarWeek = '0';
            }
          }

          const {
            channelGroup
          } = this.userInf;
          const formProductList = [];
          product[productListName].forEach((prdt) => {
            // 版本调货不算版本
            if (!prdt.$isTransfer) {
              orderSplitComposeProductData = {
                ...prdt,
                // farWeek: prdt.weekPromise,
                // isCheckFarWeek: '0',
                ...orderSplitComposeProductData,
              };
              // 版本调货版本号
              if (prdt.stockVersion) {
                // 传来的时候如果有版本调货号，则用传来的，因为选了版本调货不可更改
                orderSplitComposeProductData.transferVersion = prdt.stockVersion;
              } else if (transferVersion) {
                // transferVersion代表后来选了版本调货
                orderSplitComposeProductData.transferVersion = transferVersion;
              }
              // 是否包含样机
              const isContainYj = getYj()[prdt.priceType];
              if (isContainYj) {
                // 查找正品样机
                const realProduct = shoppingCartItem.choseVersions.find(v => v.versionCode === prdt.priceVersion);
                if (realProduct && realProduct.$isRealProduct) {
                  // 正品样机的数量需要修改，数量为样机最大数量和实际输入的数量的和
                  const realNumber = realProduct.usableQty + realProduct.realQty;
                  form.number = realNumber;
                  orderSplitComposeProductData.number = realNumber;
                }
              }
              // 传统渠道没有信用模式
              if (channelGroup === 'ZY') {
                // creditModel 如果没信用模式，creditModel字段也得修改，todo 存疑？
                orderSplitComposeProductData.creditModel = !product.isCreditMode ? '0' : prdt.creditModel;
                // 是否信用模式
                orderSplitComposeProductData.isCheckCreditModel = product.isCreditMode ? '1' : '0';
              } else {
                // 是否支持款先
                orderSplitComposeProductData.kuanXian = shoppingCartItem.isFundsFirst ? '1' : '0';
                // 是否打开款先
                if (shoppingCartItem.isFundsFirst) {
                  orderSplitComposeProductData.isCheckKuanXian = product.isFundsFirstMode ? '1' : '0';
                } else {
                  orderSplitComposeProductData.kuanXian = '0';
                  orderSplitComposeProductData.isCheckKuanXian = '1';
                }

                // 传统渠道样机不支持选择款先，默认款先
                if (isContainYj) {
                  orderSplitComposeProductData.kuanXian = '1';
                  orderSplitComposeProductData.isCheckKuanXian = '1';
                }
                // 异地云仓不支持选择款先，默认款先
                if (this.choseSendAddress.yunCangFlag === 'ydyc') {
                  orderSplitComposeProductData.kuanXian = '1';
                  orderSplitComposeProductData.isCheckKuanXian = '1';
                }
              }
              formProductList.push(new OrderSplitComposeProduct(orderSplitComposeProductData));
            }
          });
          form.productList = formProductList;
          formList.push(form);
        }
      }

      if (!formList.length) {
        this.showToast({
          type: 'warn',
          content: '请先选择商品'
        });
        return;
      }
      const form = {
        saletoCode: this.userInf.customerCode,
        sendtoCode: this.defaultSendTo.customerCode,
        splitComposeList: formList,
        yunCangCode: this.choseSendAddress.yunCangCode,
        yunCangFlag: this.choseSendAddress.yunCangFlag
      };
      const { code, data, msg } = await this.orderService.validateProduct(form, {
        noToast: true
      });
      if (code === '1') {
        // 提交订单后也应该刷新购物车变更状态
        this[GOODS_LIST.UPDATE_IS_CART_UPDATE](true);
        const args = JSON.stringify(form);
        // 产品校验成功
        uni.navigateTo({
          url: `/pages/shoppingCart/orderConfirm?formData=${args}`
        });
      } else {
        let content;
        if (data) {
          content = data[0][0].msg || '请求失败';
        } else {
          content = msg || '请求失败';
        }
        uni.showModal({
          title: '',
          content
        });
      }
    },
    toSign() {
      /* 反向定制签约 */
      this.isShowSignModel = true;
      // 获取签约信息
      this.signedInf = {};
      this.customerService.signedInf({
        sendtoCode: this.userInf.customerCode
      }).then(({ code, data }) => {
        if (code === '1') {
          const inf = data || {};
          const curDate = new Date();
          inf.signDate = this.jshUtil.formatDate(curDate, 'yyyy年MM月dd日');
          inf.signEndDate = `${curDate.getFullYear()}年12月31日`;
          this.signedInf = inf;
        }
      });
      this.customerService.sign({
        sendtoCode: this.userInf.customerCode
      }).then(({ code, data }) => {
        if (code === '1') {
          this.protocolConfirmText = {
            0: '请到签章系统签章',
            1: '等待海尔盖章',
            2: '已签约'
          }[data] || '确定';
        }
      });
    },
    numberChange(num, index) {
      /* 数量change */
      this.shoppingList[index].number = num;
      this.shoppingList[index].productList[0].number = num;
    },
    choseOtherVersionsChange(checkedList, index) {
      /* 选择的版本change */
      this.shoppingList[index].choseOtherVersions = checkedList;
    }
  }
};
</script>
