<template>
  <view class="marketList">
    <j-market-head-tab
      class="mb12"
      :tabs="tabs"
      :typeShow="isShowType"
      :childCheckedIndex.sync="activityIndex"
      @tabClick="tabClick"
      @tabPickerConfirm="tabPickerConfirm"
    ></j-market-head-tab>
    <mescroll-body
      ref="mescrollRef"
      @init="mescrollInit"
      :up="jMescrollUpOptions"
      :down="jMescrollDownOptions"
      @down="jMescrollDownCallback"
      @up="upCallback"
    >
      <view class="marketList-items-wrap">
        <j-activity-item
          v-for="(item,index) in list"
          :key="index"
          :activity="item"
          @activityDetail="activityDetail"
          @goOrder ="goOrder"
          @getNum="getNum"
        ></j-activity-item>
      </view>
    </mescroll-body>
    <j-drawer
      ref="filterDrawer"
      :show.sync="isShowFilterDrawer"
      @filterReset="filterReset"
      @filterConfirm="filterConfirm"
    >
      <view
        :key="item.key"
        v-for="(item) in filterInputs"
        class="marketList-drawer-filter">
        <view class="marketList-drawer-filter-head">
          <view>
            <text>{{item.name}}</text>
          </view>
        </view>
        <view
          class="marketList-drawer-filter-list"
        >
          <input
            class="marketList-drawer-filter-input"
            type="text"
            v-model="item.value"
            :placeholder="`请输入${item.name}`"
          >
        </view>
      </view>
      <view
        v-for="(item,index) in filterList"
        :key="index"
      >
        <view class="marketList-drawer-filter">
          <view class="marketList-drawer-filter-head">
            <view>
              <text>{{item.name}}</text>
              <text class="marketList-drawer-filter-head-tips">{{item.tips}}</text>
            </view>
            <i
              class="iconfont iconxia"
              :class="[
                      !item.isExpand && 'reverse'
                    ]"
              @tap="toggleExpand(item)"
            ></i>
          </view>
          <view
            class="marketList-drawer-filter-list"
            v-show="item.isExpand"
          >
            <view
              v-for="(filterItem,filterIndex) in item.data"
              :key="filterIndex"
              class="marketList-drawer-filter-list-item"
              :class="[filterItem.isChecked && 'active']"
              @tap="choose(filterItem,item.data,item.type)"
            >{{filterItem.value}}
            </view>
          </view>
        </view>
      </view>
      <view class="marketList-drawer-filter-head-ads-wrap">
        <view
          class="marketList-drawer-filter-head"
          @tap="showDeliveryAddress"
        >
          <view>
            <text>配送至</text>
          </view>
          <i class="iconfont iconyou marketList-drawer-filter-head-icon-right"></i>
        </view>
        <view class="marketList-drawer-filter-head-ads">
          ({{currentAdd.addressCode}}){{currentAdd.addressName}}
        </view>
      </view>
    </j-drawer>
    <j-choose-delivery-address
      :activeItemName="'item'+currentAdd.customerCode"
      :show.sync="isShowAddressDrawer"
      :list="addressList"
      @changeAddress="changeAddress"
    ></j-choose-delivery-address>
  </view>
</template>

<script>

import JDrawer from '../../components/form/JDrawer';
import JActivityItem from '../../components/market/JActivityItem';
import JMarketHeadTab from '../../components/market/JMarketHeadTab';
import JChooseDeliveryAddress from '../../components/goods/JChooseDeliveryAddress';
import MescrollBody from '@/components/plugin/mescroll-uni/mescroll-body.vue';
import mescrollMixin from '@/components/plugin/mescroll-uni/mescroll-mixins';
import selfMescrollMixin from '@/mixins/mescroll.mixin';
import './css/marketList.scss';
import {
  mapActions,
  mapMutations,
  mapGetters
} from 'vuex';
import {
  USER, ACTIVITY
} from '../../store/mutationsTypes';

export default {
  name: 'marketList',
  mixins: [
    mescrollMixin,
    selfMescrollMixin
  ],
  components: {
    JChooseDeliveryAddress,
    JMarketHeadTab,
    JActivityItem,
    JDrawer,
    MescrollBody
  },
  data() {
    return {
      allNum: 0, // 总套餐数量
      form: {
        activityId: '',
        activityName: '',
        activityType: '',
        isCheckProduct: true,
        pageNum: 1,
        pageSize: 5,
        productCode: '',
        productGroup: [],
        productName: '',
        saletoCode: '',
        sendtoCode: ''
      },
      // 获取库存参数
      stockForm: {
        saletoCode: '',
        sendtoCode: '',
        productCodes: []
      },
      isLoadAddress: false,
      // 活动列表
      list: [
      ],
      // 地址列表
      addressList: [],
      currentAdd: {
        address: '',
        addressCode: '',
        addressName: '',
        channel: '',
        channelGroup: '',
        customerCode: '',
        customerName: '',
        defaultFlag: 0,
        deletedFlag: '',
        hubFlag: '',
        manageCustomerCode: '',
        salesGroupCode: '',
        sbrShopType: '',
        subChannel: '',
        tradeCode: ''
      },
      // 是否展示筛选侧边抽屉
      isShowFilterDrawer: false,
      // 是否展示地址侧边抽屉
      isShowAddressDrawer: false,
      isShowType: false,
      // 选中的活动下标
      activityIndex: null,
      tabs: [
        {
          name: '活动类别',
          icon: 'iconxia',
          show: false,
          handler: 'showType',
          children: [
            { name: '全部', checked: false, key: '' },
            { name: '套餐', checked: false, key: 'taocan' },
            { name: '组合', checked: false, key: 'zuhe' },
            { name: '反向定制', checked: false, key: 'baoxiao' }
          ]
        },
        {
          name: '筛选',
          icon: 'iconshaixuan',
          handler: 'showFilter',
          noActive: true,
        }
      ],
      filterInputs: [
        {
          key: 'productName',
          name: '产品名称',
          value: ''
        },
        {
          key: 'productCode',
          name: '产品编码',
          value: ''
        },
        {
          key: 'activityName',
          name: '活动名称',
          value: ''
        }
      ],
      filterList: [
        {
          name: '产品组',
          key: 'productGroup',
          isExpand: true,
          type: 'checkbox',
          data: [
          ]
        },
        {
          name: '产品状态',
          key: 'isCheckProduct',
          isExpand: true,
          type: 'radio',
          data: [
            {
              key: '1',
              value: '全部',
              isChecked: false
            }, {
              key: '2',
              value: '有效',
              isChecked: true
            }
          ]
        }
      ],
      // 选中的活动条目
      choseActivityItem: {}
    };
  },
  beforeMount() {
    // this.getAddressList();
  },
  onLoad(option) {
    if (option.productCode) {
      this.filterInputs[1].value = option.productCode;
    }
    if (option.activityType) {
      const activity = option.activityType;
      this.tabs[0].children.forEach((item, index) => {
        if (item.key === activity) {
          // 设置选中的活动和选中的活动条目
          this.activityIndex = index;
          this.choseActivityItem = item;
        }
      });
    }
  },
  created() {
    this.form.saletoCode = this.saleInfo.customerCode;
    this.stockForm.saletoCode = this.saleInfo.customerCode;
    this.init();
  },
  computed: {
    ...mapGetters({
      userInf: USER.GET_USER,
      saleInfo: USER.GET_SALE,
      defaultSendToInf: USER.GET_DEFAULT_SEND_TO
    }),
    fomrmateDate() {
      return (val) => {
        this.jshUtil.formatDate(val);
      };
    }
  },
  methods: {
    ...mapMutations([
      USER.UPDATE_DEFAULT_SEND_TO,
      ACTIVITY.UPDATE_ACTIVITY
    ]),
    ...mapActions([
      USER.UPDATE_DEFAULT_SEND_TO_ASYNC
    ]),
    async init() {
      // await this.getAddressList();
      await this.getIndustryList();
    },
    async getIndustryList() {
      // 获取产品组
      const { code, data } = await this.marketService.getIndustryList();
      if (code === '1') {
        data.forEach((item) => {
          item.isChecked = false;
          item.key = item.code;
          item.value = item.codeName;
          item.isChecked = false;
        });
        this.filterList[0].data = data;
      }
    },
    async getActivityList(pages) {
      if (this.saleInfo === 'CT') {
        return;
      }
      const condition = this.getSearchCondition(pages);
      // 获取活动
      const { code, data } = await this.marketService.activityList(condition);
      if (code === '1') {
        data.list.forEach((item) => {
          item.choosedNum = 1;
        });
        if (data.pageNum === 1) {
          this.list = data.list;
        } else {
          this.list = this.list.concat(data.list);
        }
        if (this.list.length === 0) {
          uni.showToast({
            title: '暂无数据！',
            icon: 'none'
          });
        }
      } else {
        this.mescroll.endErr();
      }
      // 当前页码的数据
      const scrollView = {};
      scrollView.pageSize = data.pageSize;
      scrollView.total = data.total;
      return scrollView;
    },
    getSearchCondition(pages) {
      console.log(pages);
      console.log(this.addressList);
      /* 获取不同条件下搜索的传参 */
      const condition = {
        timestamp: new Date().getTime(),
        activityId: '',
        activityName: '',
        activityType: '',
        isCheckProduct: true,
        productCode: '',
        productGroup: [],
        pageNum: pages.num,
        pageSize: pages.size,
        saletoCode: this.saleInfo.customerCode,
        sendtoCode: this.currentAdd.addressCode,
      };
      if (!this.currentAdd.addressCode) {
        condition.sendtoCode = this.defaultSendToInf.addressCode;
      }
      // 活动类别选择后确认
      if (this.choseActivityItem.key !== undefined) {
        condition.activityType = this.choseActivityItem.key;
      }

      this.filterList.forEach((item) => {
        const keyName = item.key;
        let val = '';
        const valArr = [];
        item.data.forEach((item1) => {
          if (item1.isChecked) {
            if (keyName === 'productGroup') {
              valArr.push(item1.key);
            } else if (keyName === 'isCheckProduct') {
              if (item1.key === '1') {
                val = false;
              } else {
                val = true;
              }
            } else {
              val = item1.key;
            }
          }
        });
        if (keyName === 'productGroup') {
          condition[item.key] = valArr;
        } else {
          condition[item.key] = val;
        }
      });
      console.log(this.filterInputs);
      this.filterInputs.forEach((item) => {
        if (item.value) {
          condition[item.key] = item.value;
        }
      });
      return condition;
    },
    async getAddressList() {
      // 获取地址
      const { code, data } = await this[USER.UPDATE_DEFAULT_SEND_TO_ASYNC]();
      // const { code, data } = await this.customerService.addressesList('1');
      if (code === '1') {
        this.addressList = data;
      }
      console.log(this.defaultSendToInf);
      let getdefaultFlag = false;
      this.addressList.forEach((item) => {
        if (item.defaultFlag === 1) {
          this.currentAdd = item;
          getdefaultFlag = true;
          item.checked = true;
        }
      });
      if (!getdefaultFlag) {
        this.currentAdd = this.addressList[0];
      }
      this.form.sendtoCode = this.currentAdd.addressCode;
      this.stockForm.sendtoCode = this.currentAdd.addressCode;
      this.isLoadAddress = true;
      return true;
    },
    changeAddress(addList, current) {
      this.addressList = addList;
      this.currentAdd = current;
      // 更改默认的送达方
      this.customerService.changeDefaultSendTo({
        sendToCode: current.customerCode
      }).then(({ code }) => {
        if (code === '1') {
          // 更改成功之后更新store
          this[USER.UPDATE_DEFAULT_SEND_TO](current);
        }
      });
    },
    tabClick(tabs, tab) {
      if (tab.handler) {
        this[tab.handler]();
      }
    },
    tabPickerConfirm(tabs, choseItem) {
      // 活动类别选择后确认
      // 重新搜索
      this.choseActivityItem = choseItem || {};
      this.mescroll.resetUpScroll(true);
    },
    async upCallback(pages) {
      /* 上推加载 */
      if (!this.isLoadAddress) {
        await this.getAddressList();
      }
      const scrollView = await this.getActivityList(pages);
      this.mescroll.endBySize(scrollView.pageSize, scrollView.total);
    },
    showFilter() {
      /* 展示filter */
      this.isShowFilterDrawer = true;
    },
    showType() {
      /* 展示类别 */
      this.isShowType = !this.isShowType;
    },
    filterReset() {
      /* 抽屉筛选重置 */
      this.filterInputs.forEach((ele) => {
        ele.value = '';
      });
      this.filterList.forEach((item) => {
        console.log(item);
        item.data.forEach((v) => {
          v.isChecked = false;
        });
      });
      // 设置产品状态初始化
      this.filterList[1].data[0].isChecked = true;
      // 重新搜索
      // this.mescroll.resetUpScroll(true);
    },
    filterConfirm() {
      /* 确定 */
      // 重新搜索
      this.mescroll.resetUpScroll(true);
    },
    toggleExpand(item) {
      /* 展开或者收起 */
      item.isExpand = !item.isExpand;
    },
    choose(filterItem, list, type) {
      /* 选择选项 */
      if (type === 'radio') {
        if (!filterItem.isChecked) {
          list.forEach((v) => {
            if (v.isChecked) {
              v.isChecked = false;
            }
          });
          filterItem.isChecked = true;
        }
      } else {
        // 多选翻转
        filterItem.isChecked = !filterItem.isChecked;
      }
    },
    showDeliveryAddress() {
      /* 展示配送地址 */
      this.isShowAddressDrawer = true;
    },
    async activityDetail(currentInfo) {
      const detail = await this.getAllStock(currentInfo);
      this[ACTIVITY.UPDATE_ACTIVITY](detail);
      uni.navigateTo({
        url: '/pages/market/marketDetail'
      });
    },
    // 获取所有产品的库存
    async getAllStock(currentInfo) {
      const arr1 = currentInfo.products;
      const arr2 = currentInfo.pbProducts || [];
      const arr = arr1.concat(arr2);
      let productCodes = [];
      productCodes = arr.map(v => v.productCode);
      this.stockForm.productCodes = productCodes;
      const { code, data } = await this.commodityService.getStock(this.stockForm);
      if (code === '1') {
        this.stockDate = data;
      }
      // 所有产品增加库存数量字段
      currentInfo.products.forEach((item) => {
        item.stockTotalNum = data[item.productCode].stockTotalNum;
        item.choosedNum = 0; // 增加选择数量字段
      });
      if (currentInfo.pbProducts) {
        currentInfo.pbProducts.forEach((item) => {
          item.stockTotalNum = data[item.productCode].stockTotalNum;
          item.choosedNum = 0; // 增加选择数量字段
        });
      }
      return currentInfo;
    },
    // 成套下单
    async goOrder(currentInfo) {
      console.log(this.currentAdd);
      const detail = await this.getAllStock(currentInfo);
      console.log(detail);
      await this.validateProduct(detail);
    },
    // 产品校验
    async validateProduct(currentInfo) {
      console.log(currentInfo);
      const form = {
        saletoCode: this.form.saletoCode,
        sendtoCode: this.currentAdd.addressCode,
        yunCangCode: '',
        yunCangFlag: '',
        splitComposeList: [
          {
            activityType: this.getActivityTypeCode(currentInfo.activityType),
            activityId: currentInfo.id,
            number: currentInfo.choosedNum,
            productList: [
              {
                productCode: 'CBAGD4000',
                number: this.allNum,
                isStock: '1',
                farWeek: '0',
                creditModel: '0',
                isCheckFarWeek: '0',
                isCheckCreditModel: '0',
                farWeekDate: '',
                transferVersion: '',
                priceType: 'PT',
                priceVersion: '',
                productSeries: '',
                kuanXian: '0',
                isCheckKuanXian: '0'
              }],
          }
        ]
      };
      if (this.currentAdd.yunCangFlag) {
        if (this.currentAdd.yunCangFlag === 'yc') {
          // 云仓
          form.yunCangFlag = 'yc';
        } else {
          // 异地云仓
          form.yunCangFlag = 'ydyc';
          form.yunCangCode = this.currentAdd.yunCangCode;
        }
      } else {
        // 送达方地址
        form.sendtoCode = this.currentAdd.addressCode;
      }
      // 订单产品遍历组合
      const productArr = [];
      currentInfo.products.forEach((item) => {
        console.log(item);
        this.allNum = Number(item.promotionNum) * Number(currentInfo.choosedNum);
        const productItem = {
          productCode: item.productCode,
          number: this.allNum,
          isStock: '1',
          farWeek: '0',
          creditModel: '0',
          isCheckFarWeek: '0',
          isCheckCreditModel: '0',
          farWeekDate: '',
          transferVersion: '',
          priceType: 'PT',
          priceVersion: '',
          productSeries: '',
          kuanXian: '0',
          isCheckKuanXian: '0'
        };
        productArr.push(productItem);
      });
      form.splitComposeList[0].productList = productArr;
      const { code, data, msg } = await this.orderService.validateProduct(form, {
        noToast: true
      });
      if (code === '1') {
        const formData = JSON.stringify(form);
        // 产品校验成功
        uni.navigateTo({
          url: `/pages/shoppingCart/orderConfirm?formData=${formData}`
        });
      } else {
        if (!data) {
          uni.showToast({
            title: msg,
            duration: 2000,
            icon: 'none'
          });
        } else {
          uni.showModal({
            title: '提示',
            content: `型号${data[0][0].productCode}，${data[0][0].msg}${data[0][0].productName}`,
            icon: 'none',
            showCancel: false,
            success: () => {}
          });
        }
      }
    },
    // 获取活动类型编码
    getActivityTypeCode(activityType) {
      if (activityType === 'taocan') {
        return 4;
      }
      if (activityType === 'zuhe') {
        return 2;
      }
    }
  }
};
</script>

<style>

</style>
