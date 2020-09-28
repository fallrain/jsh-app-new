<template>
  <view class="goodsList">
    <view class="goodsList-head-wrap">
      <view class="goodsList-search-tab j-flex-aic">
        <j-search-input
          v-model="filterForm.name"
          @search="silentReSearch"
        ></j-search-input>
        <button
          type="button"
          class="goodsList-search-tab-btn ml22"
          @tap="silentReSearch"
        >搜索
        </button>
      </view>
      <j-head-tab
        class="mb12"
        :tabs="tabs"
        :popTabs="popTabs"
        :tabPickerCheckedIndexList.sync="tabPickerCheckedIndexList"
        @tabClick="tabClick"
        @tabPickerChange="popTabsChange"
        @tabconfirmPup="tabConditionConfirm"
      ></j-head-tab>
    </view>
    <view class="goodsList-mescroll-wrap">
      <mescroll-uni
        :down="jMescrollDownOptions"
        :fixed="false"
        :up="jMescrollUpOptions"
        @down="jMescrollDownCallback"
        @init="mescrollInit"
        @up="upCallback"
        ref="mescrollRef"
      >
        <view class="goodsList-items-wrap" v-if="isShowList">
          <j-goods-item
            v-for="(item,index) in list"
            :key="item.productCode"
            :goods="item"
            :index="index"
            :saletoCode="userInf.customerCode"
            :sendtoCode="defaultSendToInf.customerCode"
            :allPrice="item.$allPrice"
            :userInf="userInf"
            :followState.sync="item.$favorite"
            @change="goodsChange"
            @addCartSuccess="addCartSuccess"
          ></j-goods-item>
        </view>
        <!--      <Exception v-else>-->
        <!--        <slot name="ExcPagTitle2"></slot>-->
        <!--      </Exception>-->
        <view v-else>
          <image
            src="../../assets/img/exception/error-none.png"
            style="width:120px; height:120px;margin:28% 35% 5% 38%;"
          />
          <view class="else-title">
            <view class="else-title-l">非常抱歉</view>
            <text class="else-title-x">没有找到相关的宝贝</text>
            <!--          <button v-show="isReset" @tap="resetAll" class="else-title-reset">重置</button>-->
          </view>
        </view>
      </mescroll-uni>
    </view>

    <j-drawer
      :show.sync="isShowGoodsFilterDrawer"
      @filterConfirm="filterConfirm"
      @filterReset="filterReset"
    >
      <template>
        <j-drawer-filter-item
          v-for="(item,index) in filterList"
          :key="index"
          :filterItem="item"
          :index="index"
          @change="filterListChange"
        ></j-drawer-filter-item>
        <view class="goodsList-drawer-filter-head-ads-wrap">
          <view
            class="goodsList-drawer-filter-head"
            @tap="showDeliveryAddress"
          >
            <view>
              <text>配送至</text>
            </view>
            <i class="iconfont iconyou goodsList-drawer-filter-head-icon-right"></i>
          </view>
          <view
            @tap="showDeliveryAddress"
            class="goodsList-drawer-filter-head-ads"
          >
            ({{curChoseDeliveryAddress.customerCode}}){{curChoseDeliveryAddress.address}}
          </view>
        </view>
        <view class="goodsList-drawer-filter-head-ads-wrap">
          <view class="goodsList-drawer-filter-head">
            <view>
              <text>价格区间</text>
            </view>
          </view>
          <view class="goodsList-drawer-filter-price-range">
            <input
              class="goodsList-drawer-filter-price-ipt"
              type="number"
              placeholder="最低价格"
              v-model="filterForm.lowPrice"
            >
            <view class="goodsList-drawer-filter-price-line"></view>
            <input
              class="goodsList-drawer-filter-price-ipt"
              type="number"
              placeholder="最高价格"
              v-model="filterForm.highPrice"
            >
          </view>
        </view>
      </template>
    </j-drawer>
    <j-choose-delivery-address
      :show.sync="isShowAddressDrawer"
      :list="deliveryAddressList"
      :activeItemName="'item'+curChoseDeliveryAddress.customerCode"
      @change="deliveryAddressListChange"
    ></j-choose-delivery-address>
    <j-goods-hover-button
      :cartNumber="cartNum"
      @toTop="goTop"
    ></j-goods-hover-button>
  </view>
</template>

<script>
import {
  produce
} from 'immer';
import JGoodsItem from '../../components/goods/JGoodsItem';
import JHeadTab from '../../components/form/JHeadTab';
import JChooseDeliveryAddress from '../../components/goods/JChooseDeliveryAddress';
import JSearchInput from '../../components/form/JSearchInput';
import JDrawer from '../../components/form/JDrawer';
import JDrawerFilterItem from '../../components/form/JDrawerFilterItem';
import MescrollUni from '@/components/plugin/mescroll-uni/mescroll-uni.vue';
import mescrollMixin from '@/components/plugin/mescroll-uni/mescroll-mixins';
import selfMescrollMixin from '@/mixins/mescroll.mixin';
import './css/goodsList.scss';
import {
  getGoodsTag,
  getGoodsType,
  getStockType
} from '@/lib/dataDictionary';
import {
  mapActions,
  mapGetters,
  mapMutations,
} from 'vuex';
import {
  COMMODITY,
  GOODS_LIST,
  SHOPPING_CART,
  USER
} from '../../store/mutationsTypes';
import JGoodsHoverButton from '../../components/goods/JGoodsHoverButton';

export default {
  name: 'goodsList',
  mixins: [
    mescrollMixin,
    selfMescrollMixin
  ],
  components: {
    JGoodsHoverButton,
    JDrawerFilterItem,
    JDrawer,
    JSearchInput,
    JChooseDeliveryAddress,
    JHeadTab,
    JGoodsItem,
    MescrollUni,
  },
  data() {
    return {
      isShowList: true,
      pageCfg: {
        page: {
          pageSize: 15,
          pageNum: 1
        }
      },
      list: [],
      // 是否重置
      isReset: false,
      // 是否展示地址侧边抽屉
      isShowAddressDrawer: false,
      tabs: [
        {
          name: '综合',
          active: true
        },
        {
          name: '最新上架',
          active: false,
          condition: {
            sortDirection: 'desc',
            sortType: 'saletime'
          }
        },
        {
          id: 'price',
          name: '价格',
          icon: [
            'iconpaixujiantoushang',
            'iconpaixujiantouxia'
          ],
          iconClass: '',
          active: false,
          condition: {
            sortDirection: 'desc',
            sortType: 'price'
          }
        },
        {
          name: '筛选',
          icon: [
            'iconshaixuan'
          ],
          handler: 'showFilter',
          noSearch: true,
          noActive: true,
          active: false
        }
      ],
      popTabs: [],
      // 搜索条目选中的index列表
      tabPickerCheckedIndexList: [],
      // 选中的tab筛选数据
      tabConditions: {},
      // 筛选抽屉
      isShowGoodsFilterDrawer: false,
      // 筛选抽屉数据
      filterList: [
        {
          name: '筛选',
          isExpand: true,
          type: 'radio',
          data: []
        },
        {
          name: '标签',
          isExpand: true,
          type: 'radio',
          data: []
        },
        {
          name: '有货商品',
          isExpand: true,
          type: 'radio',
          data: []
        }
      ],
      // 筛选栏表单
      filterForm: {
        // 搜索栏
        name: '',
        // 最低价
        lowPrice: '',
        // 最高价
        highPrice: ''
      },
      // 传递来的filer数据
      filterArgsFromOther: {},
      // 配送地址数据
      deliveryAddressList: [],
      // 当前选中的配送地址
      curChoseDeliveryAddress: {},
      // 上一组搜索对象数据
      preSearchCondition: {},
      //  当前选中的tab
      navigate: [],
    };
  },
  onLoad(options) {
    // 其他页面传递过来的参数
    const {
      categoryCode,
      attributeName,
      attributeValue,
      name,
      // 筛选项
      isFlashSale,
      isBigorder,
      isArbitrage,
      isCompose,
      isNewProduct,
      isSpecialOffer,
      isProject,
      isSample,
      isScf,
    } = options;
    this.tabConditions = {
      categoryCode,
      attributeName,
      attributeValue
    };
    this.filterForm.name = name;
    // 传递来的filter数据
    this.filterArgsFromOther = {
      isFlashSale,
      isBigorder,
      isArbitrage,
      isCompose,
      isNewProduct,
      isSpecialOffer,
      isProject,
      isSample,
      isScf,
    };
  },
  created() {
    this.getPageInf();
  },
  computed: {
    ...mapGetters({
      userInf: USER.GET_SALE,
      defaultSendToInf: USER.GET_DEFAULT_SEND_TO,
      catalogList: COMMODITY.GET_CATALOG_LIST,
      cartNum: SHOPPING_CART.GET_CART_NUM,
    }),
  },
  methods: {
    ...mapMutations([
      USER.UPDATE_DEFAULT_SEND_TO,
      GOODS_LIST.UPDATE_IS_CART_UPDATE
    ]),
    ...mapActions([
      SHOPPING_CART.UPDATE_CART_NUM_ASYNC
    ]),
    resetAll() {
      this.tabConditions = {};
    },
    getPageInf() {
      this.getSaleInfo();
      this.setFilterData();
      this.getDeliveryAddress();
    },
    async getSaleInfo() {
      /* 获取售达方信息 */
      if (!this.userInf || JSON.stringify(this.userInf) === '{}') {
        await this[USER.UPDATE_SALE_ASYNC]();
      }
    },
    silentReSearch() {
      /* 静默搜索 */
      this.mescroll.resetUpScroll(true);
    },
    async upCallback(pages) {
      /* 上推加载 */
      const scrollView = await this.getGoodsList(pages);
      this.mescroll.endBySize(scrollView.pageSize, scrollView.total);
    },
    getSearchCondition(pages) {
      /* 获取不同条件下搜索的传参 */
      console.log(pages);
      let condition = {
        pageNum: pages.num,
        pageSize: pages.size,
        customerCode: this.userInf.customerCode,
        sendTo: this.defaultSendToInf.customerCode,
      };
        // tab条件
      const tab = this.tabs.find(v => v.active);
      // 其他条件
      const filtersMap = {
        name: this.filterForm.name && this.filterForm.name.replace(/\s*/g, '')
      };
        // 右侧筛选栏搜索数据
      this.filterList.forEach((item) => {
        item.data.forEach((v) => {
          if (v.isChecked) {
            filtersMap[v.searchKey || v.key] = v[v.keyAttr] || 1;
          }
        });
      });
      // 最高价格，最低价格
      const {
        lowPrice,
        highPrice
      } = this.filterForm;
      if (lowPrice) {
        filtersMap.lowPrice = lowPrice * 1;
      }
      if (highPrice) {
        filtersMap.highPrice = highPrice * 1;
      }
      // 反转大小
      if (lowPrice !== '' && highPrice !== '' && filtersMap.highPrice < filtersMap.lowPrice) {
        [filtersMap.lowPrice, filtersMap.highPrice] = [filtersMap.highPrice, filtersMap.lowPrice];
        this.filterForm.lowPrice = filtersMap.lowPrice;
        this.filterForm.highPrice = filtersMap.highPrice;
      }
      // 如果存在条件，则塞入条件
      condition = {
        ...condition,
        ...tab.condition,
        ...filtersMap,
        ...this.tabConditions
      };
      return condition;
    },
    genTabCondition(conditions, navigation) {
      /* 组合【搜索tab】的数据 */
      const popTabs = [];
      const tabPickerCheckedIndexList = [];
      conditions.forEach((v, index) => {
        const tab = {
          name: v.name,
          show: false
        };
        // 默认没有选中的搜索条目
        tabPickerCheckedIndexList[index] = null;
        const tabChildren = [];
        tab.children = v.show.forEach((item) => {
          tabChildren.push({
            ...item,
            name: item.show,
          });
          // 设置选中的picker选择条件的下标
          const checkedIndex = navigation.findIndex(nav => nav.code === item.code && nav.show === item.show);
          if (checkedIndex > -1) {
            tabPickerCheckedIndexList[index] = checkedIndex;
          }
        });
        tab.children = tabChildren;
        popTabs.push(tab);
      });
      this.popTabs = popTabs;
      this.tabPickerCheckedIndexList = tabPickerCheckedIndexList;
    },
    genFilterDataOfStock(categoryCode) {
      /* 组合有货商品，并选中 */
      const catalog = this.catalogList.find(v => v.categoryCode.substring(0, 3) === categoryCode.substring(0, 3));
      if (catalog) {
        const data = catalog.stockTypes.map(v => ({
          // 传向接口的key name
          searchKey: 'stockType',
          // 传向接口的key的value的属性
          keyAttr: 'key',
          key: v.stockType,
          value: v.stockType,
          isChecked: false
        }));
        // 如果之前有选中的有货商品，设置选中
        const checkedObj = this.filterList[2].data.find(v => v.isChecked);
        if (checkedObj) {
          const newCheckObj = data.find(v => v.key === checkedObj.key);
          if (newCheckObj) {
            newCheckObj.isChecked = true;
          }
        }
        // 修改有货商品
        this.filterList[2].data = data;
      }
    },
    async getGoodsList(pages) {
      /* 搜索产品列表 */
      // 公共用户信息
      if (pages.num === 1) {
        this.mescroll.scrollTo(0, 100);
      }
      const userInf = this.userInf;
      const defaultSendToInf = this.defaultSendToInf;
      const condition = this.getSearchCondition(pages);
      if (condition.categoryCode) {
        this.genFilterDataOfStock(condition.categoryCode);
      }
      const { code, data } = await this.commodityService.goodsList(condition);
      this.preSearchCondition = condition;
      const scrollView = {};
      if (code === '1') {
        this.navigate = data;
        const {
          // 商品数据
          page,
          // tab类型搜索条件
          condition: dataCondition,
          // 选中的条件
          navigation
        } = data;

        if (!page.result) {
          this.isShowList = false;
        } else {
          this.isShowList = true;
        }
        // 组合tab的搜索条件数据（popTabs）
        this.genTabCondition(dataCondition, navigation);
        // 当前页码的数据
        const curList = page.result.map(v => ({
          ...v,
          number: 1,
          // 库存
          $stock: {},
          // 收藏
          $favorite: false
        }));
        scrollView.pageSize = page.pageSize;
        scrollView.total = page.total;
        // 组合下面3个接口所需的数据
        const productCodes = curList.map(v => v.productCode);
        const priceArgsObj = {
          productCodes,
          saletoCode: userInf.customerCode,
          sendtoCode: defaultSendToInf.customerCode,
        };
          // 获取价格
        const getAllPrice = this.commodityService.getAllPrice(priceArgsObj);
        // 获取库存
        const getStock = this.commodityService.getStock(priceArgsObj);
        // 获取收藏
        const getProductQueryInter = this.productDetailService.productQueryInter({
          productCodes,
          account: userInf.customerCode
        });
        getAllPrice.then((allPriceRes) => {
          if (allPriceRes.code === '1') {
            // 添加价格
            const allPriceData = allPriceRes.data;
            // 注：$为了防止后端属性命名重复，pt为拼音，是为了和后端字段命名保持一致
            curList.forEach((v) => {
              v.$PtPrice = allPriceData[v.productCode].pt;
              v.$allPrice = allPriceData[v.productCode];
            });
            if (pages.num === 1) {
              this.list = [];
              this.$nextTick(() => {
                this.list = curList;
              });
            } else {
              this.list = this.list.concat(curList);
            }
          } else {
            this.mescroll.endErr();
          }
        });
        getStock.then((stockRes) => {
          if (stockRes.code === '1') {
            // 添加库存
            const stockData = stockRes.data;
            curList.forEach((v) => {
              if (stockData[v.productCode].invCode === v.productCode) {
                v.$stock = stockData[v.productCode];
              }
            });
          }
        });
        getProductQueryInter.then((productQueryInterRes) => {
          if (productQueryInterRes.code === '1') {
            // 添加点赞
            const productQueryInterData = productQueryInterRes.data;
            curList.forEach((v) => {
              v.$favorite = !!productQueryInterData.find(productCode => v.productCode === productCode);
            });
          }
        });
        // 未筛选出数据，重置页面
        if (data.condition.length === 0) {
          uni.showModal({
            title: '',
            content: '当前未找到符合筛选条件的数据，请重新选择',
            showCancel: false,
            success: () => {
              this.filterForm.name = '';
              this.tabConditions = {};
              this.filterReset();
              this.mescroll.resetUpScroll(true);
              this.getGoodsList();
            },

          });
        }
      } else {
        this.isShowList = false;
        this.mescroll.endErr();
      }
      return scrollView;
    },
    goodsChange(goods, index) {
      /* 商品数据change */
      this.list[index] = goods;
    },
    addCartSuccess() {
      /* 加购成功 */
      // 更改是否已经加购了的状态
      this[GOODS_LIST.UPDATE_IS_CART_UPDATE](true);
      this[SHOPPING_CART.UPDATE_CART_NUM_ASYNC](this.userInf.customerCode);
    },
    tabClick(tabs, tab, index) {
      /* 顶部双层tab栏目，第一层点击事件 */
      if (!tab.noActive) {
        this.tabs.forEach((v) => {
          v.active = false;
        });
        const curTab = this.tabs[index];
        curTab.active = true;
        // tab为价格的时候，降序升序操作
        if (curTab.id === 'price') {
          const sortDirection = curTab.condition.sortDirection;
          curTab.condition.sortDirection = sortDirection === 'desc' ? 'asc' : 'desc';
          curTab.iconClass = tab.condition.sortDirection;
          curTab.active = true;
          // this.$set(this.tabs, index, tab);
        } else {
          // 重置价格的状态
          const priceTab = this.tabs.find(v => v.id === 'price');
          priceTab.condition.sortDirection = 'desc';
          priceTab.iconClass = '';
        }
      }
      if (!tab.noSearch) {
        this.mescroll.resetUpScroll(true);
      }
      if (tab.handler) {
        this[tab.handler]();
      }
    },
    popTabsChange() {
      // eslint-disable-next-line no-unused-vars
      /* popTabs change */
      // this.popTabs = tabs;
    },
    tabConditionConfirm(tabs, index, choseItem) {
      /* 顶部双层tab栏目，第二层点了条件点确认按钮事件 */
      // 组合tabConditions
      const choseTab = tabs[index];
      const conditions = {};
      // todo 显然，通过名字来判断不合理，但是pc端也是如此，待提bug
      if (choseTab.name === '类目') {
        conditions.categoryCode = choseItem.code;
      } else {
        conditions.attributeName = choseItem.code;
        conditions.attributeValue = choseItem.show;
      }
      this.tabConditions = {
        ...this.tabConditions,
        ...conditions
      };
      this.silentReSearch();
    },
    showFilter() {
      /* 展示filter */
      this.isShowGoodsFilterDrawer = true;
    },
    setFilterData() {
      /* 设置右侧抽屉筛选的数据 */
      // 商品删选类型
      const goodsTypeData = getGoodsType();
      this.filterList[0].data = Object.keys(goodsTypeData).map(key => ({
        key,
        value: goodsTypeData[key],
        isChecked: false
      }));
      // 从其他页面传递来的数据如果有"筛选"选项，则选中
      this.filterList[0].data.forEach((v) => {
        if (this.filterArgsFromOther[v.key]) {
          v.isChecked = true;
        }
      });
      // 商品标签
      const goodsTagData = getGoodsTag();
      this.filterList[1].data = Object.keys(goodsTagData).map(key => ({
        key,
        value: goodsTagData[key],
        isChecked: false
      }));
      // 有货商品
      const stockTypeData = getStockType();
      this.filterList[2].data = Object.keys(stockTypeData).map(key => ({
        // 传向接口的key name
        searchKey: 'stockType',
        // 传向接口的key的value的属性
        keyAttr: 'key',
        key,
        value: stockTypeData[key],
        isChecked: false
      }));
    },
    filterListChange(item, index) {
      /* 抽屉筛选选中change */
      this.$set(this.filterList, index, item);
    },
    filterConfirm() {
      /* 抽屉筛选确认 */
      // 重新搜索
      const condition = this.getSearchCondition({
        num: 1,
        size: this.pageCfg.page.pageSize
      });
      const difKeys = this.jshUtil.findDifKey(this.preSearchCondition, condition);
      // 没有不同则直接返回
      if (!Object.keys(difKeys).length) {
        return;
      }
      this.mescroll.resetUpScroll(true);
    },
    filterReset() {
      /* 抽屉筛选重置 */
      this.filterList.forEach((filterItem, index) => {
        const producer = produce(filterItem, (draft) => {
          draft.data.forEach((v) => {
            v.isChecked = false;
          });
        });
        this.$set(this.filterList, index, producer);
      });

      // 重置最低价 最高价
      this.filterForm.lowPrice = '';
      this.filterForm.highPrice = '';
    },
    showDeliveryAddress() {
      /* 展示配送地址 */
      this.isShowAddressDrawer = true;
    },
    getDeliveryAddress() {
      /* 获取配送地址 */
      return this.customerService.addressesList(1).then(({ code, data }) => {
        if (code === '1') {
          // 配送地址列表
          this.deliveryAddressList = data.map(v => ({
            id: v.customerCode,
            name: `(${v.customerCode})${v.address}`,
            checked: false,
            ...v
          }));
          // 当前配送地址修改(选出默认地址)
          let defaultIndex = data.findIndex(v => v.defaultFlag === 1);
          if (defaultIndex === -1) {
            defaultIndex = 0;
          }
          const curChoseDeliveryAddress = data[defaultIndex];
          // 更新默认送达方store
          this[USER.UPDATE_DEFAULT_SEND_TO](curChoseDeliveryAddress);
          this.deliveryAddressList[defaultIndex].checked = true;
          this.curChoseDeliveryAddress = curChoseDeliveryAddress;
        }
      });
    },
    deliveryAddressListChange(list, item) {
      /* 地址数据改变 */
      this.deliveryAddressList = list;
      this.curChoseDeliveryAddress = item;
      // 更改默认的送达方
      this.customerService.changeDefaultSendTo({
        sendToCode: item.customerCode
      }).then(({ code }) => {
        if (code === '1') {
          // 更改成功之后更新store
          this[USER.UPDATE_DEFAULT_SEND_TO](item);
        }
      });
    },
    goTop() {
      if (this.mescroll) {
        this.mescroll.scrollTo(0, 100);
      }
    }
  }
};
</script>
