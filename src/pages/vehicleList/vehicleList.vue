<template>
  <view class="vehicleList">
    <view class="vehicleList-tab">
      <view class="vehicle-search j-flex-aic">
        <j-search-input @search="silentReSearch" placeholder="请输入搜索信息" v-model="filterForm.name"></j-search-input>
        <button @tap="silentReSearch" class="vehicle-btn" type="button">搜索</button>
      </view>
      <view>
        <j-head-tab
          :popTabs="popTabs"
          :tabs="tabs"
          @tabClick="tabClick"
          @tabconfirmPup="tabconfirmPup"
          activeItemName="item1"
          class="mb12"
        ></j-head-tab>
      </view>
    </view>
    <view>
      <view class="vehicle-listItem" v-if="vehicleList&&vehicleList.length>0">
        <view :key="index" v-for="(item,index) in vehicleList">
          <vehicle-item :goods="item" :index="index" @addCar="addVehicleCar" @change="vehicleNum"></vehicle-item>
        </view>
      </view>
      <view class="vehicle-listItemEl" v-else>暂无数据~</view>
    </view>
    <j-drawer :show.sync="isShowSeach" @filterConfirm="filterConfirm" @filterReset="filterReset">
      <template>
        <view class="vehicle-drawer-filter-head-ads-wrap">
          <view class="vehicle-drawer-filter-head">
            <view>
              <text>是否限制高端型号</text>
            </view>
            <view
              :class="['vehicle-drawer-filter-status',switchType&&'active']"
            >{{switchType ? '是' : '否'}}</view>
            <j-switch :active.sync="switchType"></j-switch>
          </view>
        </view>
        <j-drawer-filter-item
          :filterItem="item"
          :index="index"
          :key="index"
          @change="filterListChange"
          v-for="(item,index) in filterList"
        ></j-drawer-filter-item>
        <view class="vehicle-drawer-filter-head-ads-wrap">
          <view @tap="showDeliveryAddress" class="vehicle-drawer-filter-head">
            <view>
              <text>配送至</text>
            </view>
            <i class="iconfont iconyou vehicle-drawer-filter-head-icon-right"></i>
          </view>
          <view class="vehicle-drawer-filter-head-ads">{{curChoseDeliveryAddress.name}}</view>
        </view>
        <view class="vehicle-drawer-filter-head-ads-wrap">
          <view class="vehicle-drawer-filter-head">
            <view>
              <text>价格区间</text>
            </view>
          </view>
          <view class="vehicle-drawer-filter-price-range">
            <input
              class="vehicle-drawer-filter-price-ipt"
              placeholder="最低价格"
              type="number"
              v-model="filterForm.lowPrice"
            />
            <view class="vehicle-drawer-filter-price-line"></view>
            <input
              class="vehicle-drawer-filter-price-ipt"
              placeholder="最高价格"
              type="number"
              v-model="filterForm.highPrice"
            />
          </view>
        </view>
      </template>
    </j-drawer>
    <j-choose-delivery-address
      :list="deliveryAddressList"
      :show.sync="isShowAddressDrawer"
      @change="deliveryAddressListChange"
    ></j-choose-delivery-address>
    <view class="vehicle-high"></view>
    <view class="vehicle-foot">
      <vehicle-foot :carNum="carNum" :carType="ZCLX.carNames" :tiJiINfo="tiJiINfo"></vehicle-foot>
    </view>
    <m-toast :isdistance="true" ref="toast"></m-toast>
  </view>
</template>

<script>
import './css/vehicleList.scss';
import JHeadTab from '../../components/form/JHeadTab';
import JSearchInput from '../../components/form/JSearchInput';
import vehicleItem from '../../components/vehicleList/VehicleItem';
import JDrawer from '../../components/form/JDrawer';
import JDrawerFilterItem from '../../components/form/JDrawerFilterItem';
import JSwitch from '../../components/form/JSwitch';
import JChooseDeliveryAddress from '../../components/goods/JChooseDeliveryAddress';
import vehicleFoot from '../../components/vehicleList/VehicleFoot';
import MToast from '@/components/plugin/xuan-popup_2.2/components/xuan-popup/xuan-popup.vue';
import {
  mapGetters,
  mapMutations
} from 'vuex';
import {
  USER
} from '../../store/mutationsTypes';

export default {
  name: 'vehicleList',
  components: {
    JHeadTab,
    JSearchInput,
    vehicleItem,
    JDrawer,
    JDrawerFilterItem,
    JSwitch,
    JChooseDeliveryAddress,
    MToast,
    vehicleFoot
  },
  data() {
    return {
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
          active: false
        }
      ],
      popTabs: [
        {
          name: '发货基地',
          show: false,
          typee: 'ZC',
          children: []
        },
        {
          name: '基地拼车',
          show: false,
          typee: 'ZC',
          children: []
        },
        {
          name: '配送类型',
          show: false,
          typee: 'ZC',
          children: []
        },
        {
          name: '整车类型',
          show: false,
          typee: 'ZC',
          children: []
        }
      ],
      isShowSeach: false, // 筛选抽屉
      filterList: [], // 筛选抽屉数据
      filterForm: { // 侧边筛选表单
        name: '', // 搜索栏
        lowPrice: '', // 最低价
        highPrice: '' // 最高价
      },
      switchType: false, // 是否限制高端型号
      isShowAddressDrawer: false, // 是否展示地址侧边抽屉
      deliveryAddressList: [], // 配送地址数据
      curChoseDeliveryAddress: {}, // 当前选中的配送地址
      vehicleList: [], // 整车列表信息
      total: 0, // 整车列表总数
      pageNo: 1, // 整车列表当前页数
      jdCode: '', // 加购参数
      jdName: '', // 加购参数
      jdICCCode: '', // 加购参数
      FHJD: [], // 选中的发货基地
      JDPC: [], // 选中的基地拼车
      PSLX: [], // 选中的配送类型
      ZCLX: [], // 选中的整车类型+车型
      sortTypes: '', // 最新上架跟价格排序
      sortDirection: '', // 最新上架跟价格排序
      brandCheck: '', // 选中的品牌
      leiMu: '', // 选中的类目
      carNum: 0, // 整车购物车数量查询
      xiadanInfo: [], // 下单成功后的数据返回
      tiJiINfo: { // 下单成功之后的体积以及占比
        tiji: 0,
        zhanbi: 0
      }
    };
  },
  computed: {
    ...mapGetters({
      userInf: USER.GET_SALE,
      sendToInf: USER.GET_DEFAULT_SEND_TO,
      saleInf: USER.GET_SALE,
    }),
  },
  onLoad(options) {
    console.log('SSSSSEEEEE');
    console.log(options.SEQ);
    if (options.SEQ && options.SEQ !== undefined) {
      this.SEQ = options.SEQ;
    } else {
      this.queSeq();
    }
  },
  created() {
    console.log('jinyemianshuju');
    console.log(this.userInf);
    console.log(this.sendToInf);
    console.log(this.saleInf);
    if (this.userInf.channelGroup != 'CT') {
      this.queryBaseCode(); // 基地
      this.queryCarNum(); // 整车购物车数量查询
    }
  },
  mounted() {
    // 判断是否传统渠道
    if (this.userInf.channelGroup == 'CT') {
      uni.showModal({
        title: '提示',
        content: '当前客户无整车权限',
        showCancel: false,
      });
    }
  },
  methods: {
    ...mapMutations([
      USER.UPDATE_DEFAULT_SEND_TO
    ]),
    async queSeq() {
      const timetamp = new Date().valueOf();
      const typee = this.userInf.channelGroup;
      const { code, data } = await this.vehicleService.queryNewSeq(timetamp, typee);
      if (code === '1') {
        console.log('整车加购物车获取的SEQ');
        console.log(data.data);
        this.SEQ = data.data;
      }
    },
    async queryCarNum() {
      const timetamp = new Date().valueOf();
      const longfeiUSERID = this.userInf.customerCode;
      const { code, data } = await this.vehicleService.queryCarNum(timetamp, longfeiUSERID);
      if (code === '1') {
        console.log('整车购物车数量查询');
        this.carNum = data.allNum;
      }
    },
    async queryBaseCode() { // 基地
      const { code, data } = await this.vehicleService.queryBaseCode();
      if (code === '1') {
        console.log('基地');
        if (data.code === '200') {
          if (data.data.jd.length > 0) {
            data.data.jd.forEach((inf) => {
              inf.checked = false;
              inf.name = inf.ICC_JDNAME;
              inf.code = inf.ICC_JDCODE;
              inf.type = 'ZCJD';
            });
            this.popTabs[0].children = data.data.jd;
            this.popTabs[0].children[4].checked = true;
            this.FHJD = this.popTabs[0].children[4];
            console.log(this.FHJD);
            this.getDeliveryAddress(); // 基地之后==配送至
          }
          if (data.data.pcb.length > 0) {
            data.data.pcb.forEach((inf) => {
              inf.checked = false;
              inf.name = inf.ICC_JDNAME;
              inf.code = inf.ICC_JDCODE;
              inf.type = 'ZCPC';
            });
            this.popTabs[1].children = data.data.pcb;
          }
        } else {
          console.log(data.message);
        }
      }
    },
    async getDeliveryAddress() {
      const timetamp = new Date().valueOf();
      const customerCode = this.userInf.customerCode;
      const { code, data } = await this.vehicleService.queryCustomerSendto(timetamp, customerCode);
      if (code === '1') {
        console.log('获取配送地址');
        if (data.code === '200') {
          const dataList = JSON.parse(data.data);
          this.deliveryAddressList = dataList.map(v => ({ // 配送地址列表
            id: v.customerCode,
            name: `(${v.customerCode})${v.customerName}`,
            checked: false,
            ...v
          }));
          // 当前配送地址修改(选出默认地址)
          const defaultIndex = dataList.findIndex(v => v.defaultFlag * 1 === 1);
          if (defaultIndex > -1) {
            const curChoseDeliveryAddress = dataList[defaultIndex];
            this.deliveryAddressList[defaultIndex].checked = true;
            this.curChoseDeliveryAddress = curChoseDeliveryAddress;
          }
          this.querySendWay(); // 基地之后+配送至之后==配送类型
        }
      }
    },
    async querySendWay() { // 配送类型
      const timetamp = new Date().valueOf();
      const YDPSJIDI = this.FHJD.ICC_JDCODE;
      const sendtoMktid = this.curChoseDeliveryAddress.tradeCode;
      const sendtoCode = this.curChoseDeliveryAddress.customerCode;
      const longfeiUSERID = this.userInf.customerCode;
      const { code, data } = await this.vehicleService.querySendWay(timetamp, YDPSJIDI, longfeiUSERID, sendtoMktid, sendtoCode);
      if (code === '1') {
        if (data.data.length > 0) {
          data.data.forEach((inf) => {
            inf.checked = false;
            inf.name = `(${inf.sendWayCode})${inf.sendWay}`;
            inf.type = 'ZCPSLX';
          });
        }
        this.popTabs[2].children = data.data;
        this.popTabs[2].children[0].checked = true;
        this.PSLX = this.popTabs[2].children[0];
        console.log('配送类型');
        console.log(this.PSLX);
        this.carLoadType(); // 基地之后+配送至之后+配送类型之后==整车类型+车型
      }
    },
    async carLoadType() { // 整车列表-整车类型+车型
      let brandGroup = '';
      if (this.PSLX.brandGroup) {
        brandGroup = this.PSLX.brandGroup;
      }
      if (this.PSLX.PRODandSWRH && this.PSLX.PRODandSWRH.length > 0) {
        for (let i = 0; i < this.PSLX.PRODandSWRH.length; i++) {
          brandGroup += `${this.PSLX.PRODandSWRH[i].SWRH}:${this.PSLX.PRODandSWRH[i].PROD};`;
        }
      }
      console.log(brandGroup);
      const { code, data } = await this.vehicleService.carType({
        brandProductGroup: brandGroup,
        centerCode: this.curChoseDeliveryAddress.tradeCode,
        deliveryType: this.PSLX.sendWayCode,
        jdCodeList: [this.FHJD.ICC_JDCODE],
        sendtoCode: this.sendToInf.customerCode
      });
      if (code === '1') {
        if (data.length > 0) {
          data.forEach((inf) => {
            inf.checked = false;
            inf.name = inf.carTypeName;
            inf.type = 'ZCLX';
            inf.carNames = inf.carName;
          });
        }
        this.popTabs[3].children = data;
        this.popTabs[3].children[0].checked = true;
        this.ZCLX = this.popTabs[3].children[0];
        console.log('整车类型+车型');
        console.log(this.ZCLX);
        this.queryEs(1);
      }
    },
    async queryEs(pageNo) {
      this.filterList = []; // 右侧筛选品牌类目
      let brandGroup = '';
      if (this.PSLX.brandGroup) {
        brandGroup = this.PSLX.brandGroup;
      }
      if (this.PSLX.PRODandSWRH && this.PSLX.PRODandSWRH.length > 0) {
        for (let i = 0; i < this.PSLX.PRODandSWRH.length; i++) {
          brandGroup += `${this.PSLX.PRODandSWRH[i].PROD}:${this.PSLX.PRODandSWRH[i].SWRH};`;
        }
      }
      const timetamp = new Date().valueOf();
      const userInf = this.userInf;
      const categoryCode = this.leiMu;
      const name = this.filterForm.name;
      const customerCode = userInf.customerCode;
      const dstCode = this.curChoseDeliveryAddress.customerCode; // 配送至获取
      const center = this.curChoseDeliveryAddress.tradeCode; // 配送至获取
      const pageSize = '15';
      const brandName = this.brandCheck;
      const sortDirection = this.sortDirection;
      const sortType = this.sortTypes.replace(/\s+/g, '');
      // const brandGroup = '';
      const productCode = '';
      const highPrice = this.filterForm.highPrice;
      const lowPrice = this.filterForm.lowPrice;
      const farWeekGroup = '';
      const baseCode = this.FHJD.ICC_JDCODE; // 发货基地/基地拼车为空的时候
      const { code, data } = await this.vehicleService.queryEs({
        timetamp,
        categoryCode,
        name,
        pageNum: pageNo,
        pageSize,
        customerCode,
        dstCode,
        center,
        brandName,
        sortDirection,
        sortType,
        brandGroup,
        productCode,
        highPrice,
        lowPrice,
        farWeekGroup,
        baseCode
      });
      if (code === '1') {
        console.log('整车列表');
        if (data.code === '200') {
          console.log(JSON.parse(data.data));
          const aaa = JSON.parse(data.data);
          if (aaa.condition.length > 0) {
            this.filterList = aaa.condition.map(item => ({
              name: item.title,
              isExpand: true,
              type: 'radio',
              data: item.data.map(it => ({
                key: it.Code,
                value: it.Name,
                isChecked: false
              }))
            }));
          }
          console.log(this.filterList);
          try {
            /** **列表数据*** */
            const productCodes = aaa.data.map(v => v.code);
            const priceArgsObj = {
              productCodes,
              saletoCode: this.saleInf.customerCode,
              sendtoCode: this.sendToInf.customerCode,
            };
            const getAllPrice = this.commodityService.getAllPrice(priceArgsObj); // 获取价格
            const getProductQueryInter = this.productDetailService.productQueryInter({ // 获取收藏
              productCodes,
              account: userInf.customerCode
            });
            const [allPriceRes] = await Promise.all([getAllPrice, getProductQueryInter]);
            if (allPriceRes.code === '1') { // 添加价格
              const allPriceData = allPriceRes.data;
              // 注：$为了防止后端属性命名重复，pt为拼音，是为了和后端字段命名保持一致
              aaa.data.forEach((v) => {
                v.$PtPrice = allPriceData[v.code].pt;
                v.$allPrice = allPriceData[v.code];
                v.$num = 1;
              });
            }
          } catch (e) {
            console.log(e);
          }
          if (pageNo === 1) {
            this.vehicleList = [];
          }
          this.vehicleList = this.vehicleList.concat(aaa.data);
          this.pageNo = this.pageNo + 1;
          this.total = aaa.total;
          console.log(aaa);
        } else {
          this.vehicleList = [];
          uni.showToast({
            title: data.message,
            icon: 'none',
            duration: 3000
          });
        }
      }
    },
    onReachBottom() {
      console.log('到底了，该加页了');
      if (this.vehicleList.length > 0 && (this.total > (this.pageNo - 1) * 15)) {
        this.queryEs(this.pageNo);
      } else {
        console.log('到底了，没数了');
      }
    },
    tabconfirmPup(item, index) {
      console.log('777777');
      console.log(item);
      this.queSeq(); // 切换条件之后重新查询单号
      this.FHJD = [];
      this.JDPC = [];
      this.PSLX = [];
      this.ZCLX = [];
      this.popTabs[0].children.forEach((v) => {
        if (v.checked) { // 选中的发货基地
          this.FHJD = v;
        }
      });
      this.popTabs[1].children.forEach((v) => {
        if (v.checked) { // 选中的基地拼车
          this.JDPC = v;
        }
      });
      this.popTabs[2].children.forEach((v) => {
        if (v.checked) { // 选中的配送类型
          this.PSLX = v;
        }
      });
      this.popTabs[3].children.forEach((v) => {
        if (v.checked) { // 选中的整车类型+车型
          this.ZCLX = v;
        }
      });
      if (index === 0 || index === 1) {
        this.querySendWay();
      } else if (index === 2) {
        this.carLoadType();
      } else {
        this.queryEs(1);
      }
    },
    tabClick(tabs, tab, index) {
      console.log('8888888');
      console.log(tabs);
      console.log(tab);
      console.log(index);
      /* 顶部双层tab栏目，第一层点击事件 */
      this.tabs = tabs;
      if (tab.condition) {
        this.sortTypes = tab.condition.sortType;
        this.sortDirection = tab.condition.sortDirection;
      } else {
        this.sortTypes = '';
        this.sortDirection = '';
      }
      // tab为价格的时候，降序升序操作
      if (tab.id === 'price') {
        const sortDirection = tab.condition.sortDirection;
        tab.condition.sortDirection = sortDirection === 'desc' ? 'asc' : 'desc';
        tab.iconClass = tab.condition.sortDirection;
        this.tabs[index] = tab;
      }
      if (tab.handler) {
        this[tab.handler]();
      }
      this.queryEs(1);
    },
    showFilter() {
      /* 展示filter */
      this.isShowSeach = true;
    },
    filterListChange(item, index) {
      /* 抽屉筛选选中change */
      this.$set(this.filterList, index, item);
    },
    filterConfirm() {
      /* 抽屉筛选确认 */
      console.log(this.filterList); // 品牌：类目
      this.brandCheck = '';
      this.leiMu = '';
      this.filterList.forEach((item) => {
        if (item.name === '品牌') {
          item.data.forEach((v1) => {
            if (v1.isChecked) {
              this.brandCheck = v1.key; // 选中的品牌
            }
          });
        } else {
          item.data.forEach((v2) => {
            if (v2.isChecked) {
              this.leiMu = v2.key; // 选中的类目
            }
          });
        }
      });
      // 价格反转大小
      const { lowPrice, highPrice } = this.filterForm;
      if (lowPrice) {
        this.filterForm.lowPrice = lowPrice * 1;
      }
      if (highPrice) {
        this.filterForm.highPrice = highPrice * 1;
      }
      if (lowPrice !== '' && highPrice !== '' && this.filterForm.highPrice < this.filterForm.lowPrice) {
        [this.filterForm.lowPrice, this.filterForm.highPrice] = [this.filterForm.highPrice, this.filterForm.lowPrice];
      }
      this.queryEs(1);
    },
    filterReset() {
      /* 抽屉筛选重置 */
      this.filterForm.highPrice = '';
      this.filterForm.lowPrice = '';
      this.filterList.forEach((item) => {
        item.data.forEach((v) => {
          v.isChecked = false;
        });
      });
    },
    showDeliveryAddress() {
      /* 展示配送地址 */
      this.isShowAddressDrawer = true;
    },
    deliveryAddressListChange(list, item) {
      /* 地址数据改变 */
      this.deliveryAddressList = list;
      this.curChoseDeliveryAddress = item;
    },
    vehicleNum(vehicle, index) {
      /* 商品数据change */
      this.vehicleList[index] = vehicle;
    },
    async addVehicleCar(item, index) {
      /* 商品加购物车change */
      console.log(item);
      console.log(index);
      console.log(this.FHJD);
      console.log(this.JDPC);
      console.log(this.FHJD.length);
      if (this.FHJD.length !== 0) {
        this.jdCode = this.FHJD.ICC_JDCODE;
        this.jdName = this.FHJD.ICC_JDNAME;
        this.jdICCCode = this.FHJD.ICC_JDCODE;
      } else {
        this.jdCode = this.JDPC.ICC_JDCODE;
        this.jdName = this.JDPC.ICC_JDNAME;
        this.jdICCCode = this.JDPC.jdInvsort[0].ISBP_BASEID;
      }
      const timetamp = new Date().valueOf();
      const { code, data } = await this.vehicleService.addToCart({// 加入整车购物车
        ACTPRICE: item.$PtPrice.supplyPrice,
        ADVICEPRICE: item.$PtPrice.supplyPrice,
        BATERATE: item.$PtPrice.rebateRate,
        CARCODE: this.ZCLX.carCode,
        CUSTUMER_TYPE: this.userInf.channelGroup,
        HeightLimit: this.curChoseDeliveryAddress.ISXG,
        IBL_LOSSRATE: 0,
        IBL_PAYTO_TYPE: '00',
        IBL_TFSUMPRICE: 0,
        IBR_JDPC_JDCODENAME: this.jdName,
        IBR_ORDERCHANNEL: this.userInf.channel,
        IBR_SOLDTO_NAME: this.userInf.customerName,
        IBR_SUBCHANNEL: this.userInf.subChannel,
        IBR_YCFLAG: this.PSLX.sendWayCode === 'T' ? 'JSHSW' : '',
        ICC_JDCODE: this.jdICCCode,
        IMG: item.searchImage,
        INVCODE: item.code,
        INVSORT: item.group,
        INVSTD: item.name,
        ISFL: item.$PtPrice.rebatePolicy,
        ISHeightFLAG: this.switchType ? 'Y' : 'N',
        ISKPO: item.$PtPrice.isBB,
        JDPC_JDCODE: this.jdCode,
        JIDICAI: this.userInf.tagCode,
        MKTID: this.userInf.tradeCode,
        NUM: item.$num,
        PRODUCT_MODEL: item.module,
        PRO_BAND: item.brand,
        SENDTO: this.curChoseDeliveryAddress.addressCode,
        SENDTONAME: this.curChoseDeliveryAddress.addressName,
        SENDTO_ADDRESS: this.curChoseDeliveryAddress.address,
        SEQ: this.SEQ,
        UNITPRICE: item.$PtPrice.invoicePrice.toString(),
        USERID: this.userInf.customerCode,
        YJMFID: this.userInf.manageCustomerCode,
        ZCDeliveryType: this.PSLX.sendWayCode,
        ZCDeliveryTypeName: this.PSLX.sendWay,
        ZCTYPECODE: this.ZCLX.carType,
        ZCTYPENAME: this.ZCLX.carTypeName,
        farWeekCode: '',
        timestamp: timetamp
      });
      if (code === '1') {
        if (data.code === '200') {
          this.showAddToCartToast();
          this.xiadanInfo = data.data;
          this.SEQ = data.data.SEQ;
          this.tiJiINfo.tiji = ((this.tiJiINfo.tiji * 1) + (this.xiadanInfo.TIJI * 1)).toFixed(2);
          this.tiJiINfo.zhanbi = (this.tiJiINfo.tiji / (this.xiadanInfo.maxTJ * 1) * 100).toFixed(0);
          this.queryCarNum();
        } else {
          this.xiadanInfo = [];
          uni.showToast({
            title: data.message,
            icon: 'none',
            duration: 3000
          });
        }
      }
    },
    silentReSearch() {
      /* sousuo */
      this.queryEs(1);
    },
    showAddToCartToast() {
      /* 展示添加到购物车提示 */
      this.$refs.toast.open({
        type: 'success',
        content: '加入整车成功',
        timeout: 2000,
      });
    },
  }
};
</script>
