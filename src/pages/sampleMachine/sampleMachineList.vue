<template>
  <view class="sampleMachineList">
    <view class="sampleMachineList-head-wrap">
      <view class="sampleMachineList-search-tab j-flex-aic">
        <j-search-input
          v-model="filterForm.name"
          @search="silentReSearch"
          placeholder="请输入搜索信息"
        ></j-search-input>
        <button
          type="button"
          class="sampleMachineList-search-tab-btn ml22"
          @tap="silentReSearch"
        >搜索
        </button>
      </view>
      <j-market-head-tab
        class="mb12"
        :tabs="tabs"
        :typeShow="isShowType"
        @tabClick="tabClick"
      ></j-market-head-tab>
    </view>
    <mescroll-body
      ref="mescrollRef"
      @init="mescrollInit"
      :up="jMescrollUpOptions"
      :down="jMescrollDownOptions"
      @down="jMescrollDownCallback"
      @up="upCallback"
    >
      <view class="sampleMachineList-items-wrap">
        <j-sample-machine-item
          v-for="(item,index) in list"
          :key="index"
          :goods="item"
          :index="index"
          :saletoCode="userInf.saletoCode"
          :sendtoCode="userInf.sendtoCode"
          :allPrice="item.$allPrice"
          @change="goodsChange"
          @sampleMachineConfirm="sampleMachineConfirm"
        ></j-sample-machine-item>
      </view>
    </mescroll-body>

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
        <view class="sampleMachineList-drawer-filter-head-ads-wrap">
          <view
            class="sampleMachineList-drawer-filter-head"
            @tap="showDeliveryAddress"
          >
            <view>
              <text>配送至</text>
            </view>
            <i class="iconfont iconyou sampleMachineList-drawer-filter-head-icon-right"></i>
          </view>
          <view class="sampleMachineList-drawer-filter-head-ads">
            ({{curChoseDeliveryAddress.addressCode}}){{curChoseDeliveryAddress.address}} </view>
        </view>
      </template>
    </j-drawer>
    <j-choose-delivery-address
      :show.sync="isShowAddressDrawer"
      :list="deliveryAddressList"
      @change="deliveryAddressListChange"
    ></j-choose-delivery-address>
  </view>
</template>

<script>
import JSampleMachineItem from '../../components/sampleMachine/JSampleMachineItem';
import JMarketHeadTab from '../../components/market/JMarketHeadTab';
import JChooseDeliveryAddress from '../../components/goods/JChooseDeliveryAddress';
import JSearchInput from '../../components/form/JSearchInput';
import JDrawer from '../../components/form/JDrawer';
import JDrawerFilterItem from '../../components/form/JDrawerFilterItem';
import MescrollBody from '@/components/plugin/mescroll-uni/mescroll-body.vue';
import mescrollMixin from '@/components/plugin/mescroll-uni/mescroll-mixins';
import selfMescrollMixin from '@/mixins/mescroll.mixin';
import './css/sampleMachineList.scss';
import {
  getGoodsTag,
  getGoodsType
} from '@/lib/dataDictionary';
import {
  mapGetters, mapMutations
} from 'vuex';
import {
  USER
} from '../../store/mutationsTypes';
import {
  produce
} from 'immer';

export default {
  name: 'sampleMachineList',
  mixins: [
    mescrollMixin,
    selfMescrollMixin
  ],
  components: {
    JDrawerFilterItem,
    JDrawer,
    JSearchInput,
    JChooseDeliveryAddress,
    JMarketHeadTab,
    JSampleMachineItem,
    MescrollBody
  },
  data() {
    return {
      isShowType: false,
      list: [],
      // 是否展示地址侧边抽屉
      isShowAddressDrawer: false,
      tabs: [
        {
          name: '综合',
          active: true,
          noPicker: true
        },
        {
          name: '最新上架',
          active: false,
          noPicker: true,
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
          noPicker: true,
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
      // 筛选抽屉
      isShowGoodsFilterDrawer: false,
      // 筛选抽屉数据
      filterList: [
        {
          name: '品牌',
          isExpand: true,
          type: 'radio',
          data: []
        },
        {
          name: '产品组',
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
      // 配送地址数据
      deliveryAddressList: [],
      // 当前选中的配送地址
      curChoseDeliveryAddress: {}
    };
  },
  created() {
    this.init();
  },
  computed: {
    ...mapGetters({
      userInf: USER.GET_USER,
      saleInfo: USER.GET_SALE,
      defaultSendToInf: USER.GET_DEFAULT_SEND_TO
    }),
  },
  methods: {
    ...mapMutations([
      USER.UPDATE_DEFAULT_SEND_TO
    ]),
    async init() {
      await this.getAddressList();
      await this.queryBrandAndInvsort();
      this.mescroll.resetUpScroll(true);
    },
    async getAddressList() {
      // 获取地址
      const { code, data } = await this.customerService.addressesList('1');
      if (code === '1') {
        data.forEach((item) => {
          item.id = item.customerCode;
          item.name = `(${item.customerCode})${item.address}`;
          if (item.defaultFlag === 1) {
            item.checked = true;
            this.curChoseDeliveryAddress = item;
          }
        });
        if (JSON.stringify(this.curChoseDeliveryAddress) === '{}') {
          this.curChoseDeliveryAddress = data[0];
          data[0].checked = true;
        }
        this.deliveryAddressList = data;
        console.log(this.deliveryAddressList);
      }
      console.log(this.curChoseDeliveryAddress);
      // this.filterForm.saletoCode = this.curChoseDeliveryAddress.customerCode;
      // this.filterForm.sendtoCode = this.curChoseDeliveryAddress.addressCode;
    },
    async queryBrandAndInvsort() {
      const form = {
        timestamp: new Date().getTime(),
        customerCode: this.saleInfo.customerCode
      };
      // 获取产品组和品牌
      const { data } = await this.samplemachineService.queryBrandAndInvsort(form);
      if (data.code === '200') {
        const dataObj = JSON.parse(data.data);
        // 产品组
        dataObj.invsort.forEach((item) => {
          item.isChecked = false;
          item.key = item.CODE;
          item.value = item.NAME;
          item.queryKey = 'group';
        });
        // 品牌
        dataObj.brand.forEach((item) => {
          item.isChecked = false;
          item.key = item.CODE;
          item.value = item.NAME;
          item.queryKey = 'brand';
        });
        this.filterList[0].data = dataObj.brand;
        this.filterList[1].data = dataObj.invsort;
        console.log(this.filterList);
      }
    },
    silentReSearch() {
      /* 静默搜索 */
      this.mescroll.resetUpScroll(true);
    },
    async upCallback(pages) {
      /* 上推加载 */
      const scrollView = await this.getsampleMachineList(pages);
      if (scrollView) {
        this.mescroll.endBySize(scrollView.pageSize, scrollView.total);
      }
    },
    getSearchCondition(pages) {
      console.log(this.curChoseDeliveryAddress);
      if (!this.curChoseDeliveryAddress.addressCode) {
        return false;
      }
      /* 获取不同条件下搜索的传参 */
      let condition = {
        timestamp: new Date().getTime(),
        maktx: '',
        group: '',
        brand: '',
        mktid: '12A02',
        pageNo: pages.num,
        pageSize: pages.size,
        customerCode: this.saleInfo.customerCode,
        sendToCode: this.curChoseDeliveryAddress.addressCode,
      };
        // tab条件
      const tab = this.tabs.find(v => v.active);
      // 其他条件
      const filtersMap = {
        name: this.filterForm.name
      };
        // 右侧筛选栏搜索数据
      this.filterList.forEach((item) => {
        item.data.forEach((v) => {
          if (v.isChecked) {
            condition[v.queryKey] = v.key;
          }
        });
      });
      // 如果存在条件，则塞入条件mei
      condition = {
        ...condition,
        ...tab.condition,
        ...filtersMap
      };
      return condition;
    },
    async getsampleMachineList(pages) {
      /* 搜索产品列表 */
      const condition = this.getSearchCondition(pages);
      if (condition === false) {
        return;
      }
      const { data, code } = await this.samplemachineService.queryInventory(condition);
      let dataObj = {};
      const scrollView = {};
      if (code !== '1') {
        uni.showToast({
          icon: 'none',
          title: '暂无数据!',
          duration: 3000
        });
        this.list = [];
        scrollView.pageSize = 15;
        scrollView.total = 0;
        return scrollView;
      }

      dataObj = data;
      // 当前页码的数据
      const curList = dataObj.list;
      scrollView.pageSize = dataObj.pageSize;
      scrollView.total = dataObj.total;
      console.log(dataObj);
      // 组合下面3个接口所需的数据
      const productCodes = curList.map(v => v.code);
      const priceArgsObj = {
        gbid: productCodes,
        longfeiUSERID: this.saleInfo.customerCode,
        longfeiMFID: this.curChoseDeliveryAddress.addressCode // 送达方地址
      };
      // 获取价格
      const getAllPrice = this.samplemachineService.queryGoodsPrice(priceArgsObj);
      // 获取收藏
      const getProductQueryInter = this.productDetailService.productQueryInter({
        productCodes,
        account: this.saleInfo.customerCode
      });
      const [
        allPriceRes,
        productQueryInterRes
      ] = await Promise.all([getAllPrice, getProductQueryInter]);
      if (allPriceRes.data.code === '200') {
        // 添加价格
        const allPriceData = allPriceRes.data.data;
        // 注：$为了防止后端属性命名重复，pt为拼音，是为了和后端字段命名保持一致
        curList.forEach((v) => {
          v.$allPrice = allPriceData[v.code];
        });
      }
      if (productQueryInterRes.code === '1') {
        // 添加点赞
        const productQueryInterData = productQueryInterRes.data;
        curList.forEach((v) => {
          v.$favorite = !!productQueryInterData.find(productCode => v.code === productCode);
        });
      }
      if (pages.num === 1) {
        this.list = curList;
      } else {
        this.list = this.list.concat(curList);
      }
      console.log(this.list);
      return scrollView;
    },
    async goodsChange(goods, index) {
      /* 商品数据change */
      this.list[index] = goods;
      console.log(goods);
      // 设置商品的收藏状态
      const { code } = await this.productDetailService.productAddInter(
        this.saleInfo.customerCode,
        this.curChoseDeliveryAddress.addressCode,
        goods.CODE
      );
      if (code === '200') {
        this.goods.followState = true;
        this.$emit('change', this.goods, this.index);
      }
    },
    async followGoods() {
      /* 添加关注 */
      const {
        customerCode
      } = this.userInf;
      const { code } = await this.productDetailService.productAddInter(customerCode, customerCode, this.goods.productList[0].productCode);
      if (code === '200') {
        this.goods.followState = true;
        this.$emit('change', this.goods, this.index);
      }
    },
    async unfollowGoods() {
      /* 取消关注 */
      const {
        customerCode
      } = this.userInf;
      const { code } = await this.productDetailService.productRemoveInter({
        account: customerCode,
        customerCode,
        productCodeList: [this.goods.productList[0].productCode]
      });
      if (code === '1') {
        this.goods.followState = false;
        this.$emit('change', this.goods, this.index);
      }
    },
    tabClick(tabs, tab, index) {
      /* 顶部双层tab栏目，第一层点击事件 */
      this.tabs.forEach((v) => {
        v.active = false;
      });
      const curTab = this.tabs[index];
      curTab.active = true;
      // tab为价格的时候，降序升序操作
      if (tab.id === 'price') {
        const sortDirection = tab.condition.sortDirection;
        curTab.condition.sortDirection = sortDirection === 'desc' ? 'asc' : 'desc';
        curTab.iconClass = tab.condition.sortDirection;
      }
      if (!tab.noSearch) {
        this.mescroll.resetUpScroll(true);
      }
      if (tab.handler) {
        this[tab.handler]();
      }
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
      // 商品标签
      const goodsTagData = getGoodsTag();
      this.filterList[1].data = Object.keys(goodsTagData).map(key => ({
        key,
        value: goodsTagData[key],
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
      // 重新搜索
      this.mescroll.resetUpScroll(true);
    },
    showDeliveryAddress() {
      /* 展示配送地址 */
      this.isShowAddressDrawer = true;
    },
    getDeliveryAddress() {
      /* 获取配送地址 */
      this.customerService.addressesList(1).then(({ code, data }) => {
        if (code === '1') {
          // 配送地址列表
          this.deliveryAddressList = data.map(v => ({
            id: v.customerCode,
            name: `(${v.customerCode})${v.address}`
          }));
          console.log(this.deliveryAddressList);
          // 当前配送地址修改
          if (this.deliveryAddressList[0]) {
            this.deliveryAddressList[0].checked = true;
            this.curChoseDeliveryAddress = this.deliveryAddressList[0];
          }
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
    sampleMachineConfirm(confirmInfo) {
      const address = JSON.stringify(this.curChoseDeliveryAddress);
      uni.navigateTo({
        url: `/pages/sampleMachine/sampleMachineConfirm?confirmInfo=${JSON.stringify(confirmInfo)}&address=${address}`
      });
    }
  }
};
</script>
