<template>
  <view :key="updateIndex" class="marketDetail">
    <view class="marketDetail-order-infor mb24">
      <view class="market-detail-head">
        <view class="title">
          名称：{{currentDetail.name || currentDetail.promotionName || ''}}
        </view>
        <view class="market-type-info">
          <view v-if="currentDetail.activityType === 'taocan'" class="type-info-item">
            <view v-if="currentDetail.proportionType==='1'" class="type-item-left">数量配比：</view>
            <view v-if="currentDetail.proportionType==='2'" class="type-item-left">金额配比：</view>
            <view class="type-item-right">
              {{currentDetail.proportionMain}}:{{currentDetail.proportion}}
            </view>
          </view>
          <view class="type-info-item">
            <view class="type-item-left">
              活动结束时间：
            </view>
            <view class="type-item-right">
              {{formateDate(currentDetail.endDate) || formateDate(currentDetail.expTime) || ''}}
            </view>
          </view>
        </view>
      </view>
      <view
        class="marketDetail-ads-detail br-b-grey"
        @tap="showAdsPicker"
      >
        <view class="iconfont iconlocal"></view>
        <text>配送至：{{currentAdd.name}}</text>
        <view class="iconfont iconyou right-style"></view>
      </view>
      <view v-if="currentDetail.activityType==='taocan'" class="marketDetail-orders br-b-grey">
        <view>
          <view><span class="text-theme fs36">{{limit1.choosedMainNum}}</span>件</view>
          <view>已选主产品</view>
        </view>
        <view>
          <view class=""><span class="text-theme fs36">{{limit1.choosedPBNum}}</span>件</view>
          <view>已选配比产品</view>
        </view>
        <view>
          <view class=""><span class="text-theme fs36">{{computeMain}}</span>件</view>
          <view>还需主产品</view>
        </view>
        <view>
          <view class=""><span class="text-theme fs36">{{computePB}}</span>件</view>
          <view>还需配比产品</view>
        </view>
      </view>
      <view class="marketDetail-requirement fs20">
        <view v-if="currentDetail.spePrice" class="condition-item">
          <view class="key-style">主产品起订金额限定</view> ¥{{currentDetail.spePrice}}
        </view>
        <view v-if="currentDetail.speNum" class="condition-item">
          <view class="key-style">主产品起订数量限定</view>{{currentDetail.speNum}}件
        </view>
        <view v-if="currentDetail.bundlePrice" class="condition-item">
          <view class="key-style">配比产品起订金额限定</view>{{currentDetail.bundlePrice}}件
        </view>
        <view v-if="currentDetail.bundleNum" class="condition-item">
          <view class="key-style">配比产品起订数量限定</view> {{currentDetail.bundleNum}}件
        </view>
        <view v-if="currentDetail.sumNum" class="condition-item">
          <view class="key-style">套餐起订数量限定</view> {{currentDetail.sumNum}}件
        </view>
      </view>
    </view>
    <view class="marketDetail-list">
      <j-product-item
        :groupType="currentDetail.activityType"
        v-for="(goods,index) in currentDetail.products"
        :key="goods.id"
        :goods="goods"
        :index="index"
        @change="goodsChange"
      ></j-product-item>
      <j-product-item
        :groupType="currentDetail.activityType"
        v-for="(goods,index) in currentDetail.pbProducts"
        :key="index"
        :goods="goods"
        :index="index"
        @change="goodsChange"
      ></j-product-item>
    </view>
    <j-product-btm
      :groupType="currentDetail.activityType"
      :conditionStatus="conditionStatus"
      :upperLimit="currentDetail.upperLimit"
      :totalMoney="totalMoney"
      @goOrder="goOrder"
    ></j-product-btm>
    <j-address-picker
      :show.sync="isShowAdsPicker"
      :pickerList="sendCustomerList"
      @change="sendCustomerListChange"
    ></j-address-picker>
  </view>
</template>
<script>
import JProductItem from '../../components/market/JProductItem';
import JProductBtm from '../../components/market/JProductBtm';
import JAddressPicker from '../../components/shoppingCart/JAddressPicker';
import {
  mapGetters
} from 'vuex';
import {
  USER
} from '../../store/mutationsTypes';

import './css/marketDetail.scss';


export default {
  name: 'marketDetail',
  components: {
    JAddressPicker,
    JProductItem,
    JProductBtm
  },
  data() {
    return {
      specialPrice: false,
      currentAdd: {}, // 当前选中地址
      addressList: [], // 地址列表
      // 送达方数据
      sendCustomerList: [
        {
          flag: 'yc',
          name: '云仓',
          checked: false
        },
        {
          flag: 'ydyc',
          name: '异地云仓',
          childrenType: 'short',
          checked: false,
          isExpand: true,
          children: []
        },
        {
          name: '配送至',
          checked: false,
          isExpand: true,
          childrenType: 'long',
          children: []
        },
      ],
      totalMoney: 0, // 订单所有金额总和
      conditionStatus: false,
      updateIndex: 1,
      stockForm: {
        saletoCode: '',
        sendtoCode: '',
        productCodes: []
      },
      stockDate: {},
      lowestPBMoney: 0, // 配比产品中最低的价格用来计算金额配比时候 还需要选择的配比产品数量
      limit1: {
        choosedMainNum: 0, // 选择主产品的数量
        choosedMainMoney: 0, // 选择主产品的金额
        choosedPBNum: 0, // 选择配比的数量
        choosedPBMoney: 0 // 选择配比的金额
      },
      limit2: {
        choosedMainNum: 0, // 选择主产品的数量
        choosedPBNum: 0, // 选择配比的数量
        choosedMainMoney: 0, // 选择主产品的金额
        choosedPBMoney: 0, // 选择配比的金额
      },
      currentDetail: {},
      // 0 套餐 1 组合
      groupType: 0,
      groupProductNum: 1, // 组合成套下单 数量
      activityList: [
      ],
      // 是否全选
      isCheckAll: false,
      // 是否显示配送地址选择
      isShowAdsPicker: false
    };
  },
  onLoad(option) {
    const { item, saletoCode, sendtoCode } = option;
    this.currentDetail = JSON.parse(item);
    console.log(this.currentDetail);
    this.stockForm.saletoCode = saletoCode;
    this.stockForm.sendtoCode = sendtoCode;
    this.initpage();
    if (this.currentDetail.activityType === 'zuhe') {
      this.getTotalMoney();
    } else {
      if (this.currentDetail.pbProducts) {
        let money = 0;
        this.currentDetail.pbProducts.forEach((v) => {
          if (money > v.priceDto.invoicePrice || money === 0) {
            money = v.priceDto.invoicePrice;
          }
        });
        this.lowestPBMoney = money;
      }
    }
    this.getAllStock();
  },
  computed: {
    ...mapGetters({
      userInf: USER.GET_USER,
      saleInfo: USER.GET_SALE,
      defaultSendToInf: USER.GET_DEFAULT_SEND_TO
    }),
    computeMain() {
      // 主产品比例
      let proportionMain = this.currentDetail.proportionMain;
      if (proportionMain < this.currentDetail.speNum) {
        proportionMain = this.currentDetail.speNum;
      }
      // 存在起订金额
      let needNum = 0;
      if (this.currentDetail.spePrice) {
        // 获取主产品最小价格
        const smallest = this.getSmallest();
        const needMoney = this.currentDetail.spePrice - this.limit1.choosedMainMoney;
        if (needMoney > 0) {
          needNum = Math.ceil(needMoney / smallest);
        }
      }
      console.log(proportionMain);
      let needNum1 = 0;
      if (proportionMain > this.limit1.choosedMainNum) {
        needNum1 = proportionMain - this.limit1.choosedMainNum;
      }
      if (needNum > needNum1) {
        return needNum;
      }
      return needNum1;
    },
    computePB() {
      // 主产品比例
      const proportionMain = this.currentDetail.proportionMain;
      // 配比产品起订数量
      const bundleNum = this.currentDetail.bundleNum;
      /* if (proportionMain < this.currentDetail.speNum) {
        proportionMain = this.currentDetail.speNum;
      } */
      // 配比产品比例
      const proportion = this.currentDetail.proportion;
      let PBnum = 0;
      if (this.currentDetail.proportionType === '2') {
        // 金额配比
        // 需要选择的配比数量
        let needPB = Math.ceil((proportion / this.currentDetail.proportionMain * this.limit1.choosedMainMoney - this.limit1.choosedPBMoney) / this.lowestPBMoney);
        if (needPB < bundleNum) {
          needPB = bundleNum;
        }
        PBnum = needPB - this.limit1.choosedPBNum;
      } else {
        // 数量配比
        PBnum = Math.ceil(proportion / proportionMain * this.limit1.choosedMainNum)
          - this.limit1.choosedPBNum;
      }
      if (PBnum < 0) {
        PBnum = 0;
      }
      return PBnum;
    },
  },
  methods: {
    formateDate(val) {
      if (val) {
        return val.split(' ')[0];
      }
      return '';
    },
    getSmallest() {
      let small = 0;
      this.currentDetail.products.forEach((item) => {
        if (small === 0) {
          small = item.priceDto.invoicePrice;
        } else {
          if (small > item.priceDto.invoicePrice) {
            small = item.priceDto.invoicePrice;
          }
        }
      });
      return small;
    },
    async initpage() {
      await this.getAddressList();
      await this.getWarehouse();
    },
    // 获取所有产品的库存
    async getAllStock() {
      const arr1 = this.currentDetail.products || [];
      const arr2 = this.currentDetail.pbProducts || [];
      const arr = arr1.concat(arr2);
      const productCodes = [];
      console.log(arr);
      arr.forEach((item) => {
        productCodes.push(item.productCode);
      });
      this.stockForm.productCodes = productCodes;
      const { code, data } = await this.commodityService.getStock(this.stockForm);
      if (code === '1') {
        this.stockDate = data;
      }
      // 所有产品增加库存数量字段
      if (this.currentDetail.products) {
        this.currentDetail.products.forEach((item) => {
          item.stockTotalNum = data[item.productCode].stockTotalNum;
          item.choosedNum = 0; // 增加选择数量字段
        });
      }
      if (this.currentDetail.pbProducts) {
        this.currentDetail.pbProducts.forEach((item) => {
          item.stockTotalNum = data[item.productCode].stockTotalNum;
          item.choosedNum = 0; // 增加选择数量字段
        });
      }
      this.updateIndex++;
    },
    goodsChange(goods, index) {
      console.log(goods);
      if (goods.choseOtherVersions && goods.choseOtherVersions.length > 0) {
        this.specialPrice = true;
      } else {
        this.specialPrice = false;
      }
      let totalMoney = 0;
      if (this.groupType === 0) {
        // 套餐活动
        if (goods.productFlag === 'f') {
          this.currentDetail.products[index] = goods;
        } else if (goods.productFlag === 's') {
          this.currentDetail.pbProducts[index] = goods;
        }
        this.currentDetail = JSON.parse(JSON.stringify(this.currentDetail));
        // 更新已选产品数量
        this.limit1.choosedMainNum = 0;
        this.limit1.choosedPBNum = 0;
        this.limit1.choosedMainMoney = 0;
        this.limit1.choosedPBMoney = 0;
        this.currentDetail.products.forEach((item) => {
          this.limit1.choosedMainNum += Number(item.choosedNum);
          this.limit1.choosedMainMoney += (Number(item.choosedNum) * item.priceDto.invoicePrice);
          totalMoney += (Number(item.choosedNum) * item.priceDto.invoicePrice);
        });
        this.currentDetail.pbProducts.forEach((item) => {
          this.limit1.choosedPBNum += Number(item.choosedNum);
          this.limit1.choosedPBMoney += (Number(item.choosedNum) * item.priceDto.invoicePrice);
          totalMoney += (Number(item.choosedNum) * item.priceDto.invoicePrice);
        });
        this.conditionStatus = this.isUpToCondition();
        this.totalMoney = totalMoney.toFixed(2);
      } else {
        this.getTotalMoney();
      }
    },
    // 判断套餐条件是否已经满足
    isUpToCondition() {
      if (this.computeMain === 0 && this.computePB === 0) {
        return true;
      }
    },
    async getWarehouse() {
      console.log(this.defaultSendToInf);
      /* 获取异地云仓信息 */
      const { code, data } = await this.customerService.getWarehouse({
        customerCode: this.saleInfo.customerCode,
        warehouseFlag: 'YD'
      });
      if (code === '1') {
        this.sendCustomerList[1].children = data.map(v => ({
          id: v.code,
          name: v.codeName,
          checked: false
        }));
      }
    },
    // 获取所有地址
    async getAddressList() {
      // 获取地址
      const { code, data } = await this.customerService.addressesList('1');
      if (code === '1') {
        const detail = data.map(v => ({
          sendtoCode: v.addressCode,
          addressName: v.addressName,
          id: v.addressCode,
          name: `（${v.customerCode}）${v.addressName}`,
          checked: false,
          defaultFlag: v.defaultFlag
        }));
        this.sendCustomerList[2].children = detail;
        // 默认的送达地址
        let getdefaultFlag = false;
        detail.forEach((item) => {
          if (item.defaultFlag === 1) {
            this.currentAdd = item;
            item.checked = true;
            getdefaultFlag = true;
          }
        });
        if (!getdefaultFlag) {
          this.currentAdd = detail[0];
        }
        console.log(this.sendCustomerList);
      }
    },
    sendCustomerListChange(list, detail, parent) {
      /* 地址列表change */
      this.sendCustomerList = list;
      // 选中的送达仓库地址
      this.currentAdd = detail || {};
      if (parent) {
        if (detail) {
          // 异地云仓
          if (parent.flag) {
            this.currentAdd = {
              yunCangCode: detail.id,
              yunCangFlag: parent.flag,
              name: detail.name,
            };
          } else {
            // 送达方
            this.currentAdd = {
              sendtoCode: detail.id,
              yunCangCode: detail.id,
              name: detail.name
            };
          }
        } else {
          if (parent.flag === 'yc') {
            // 普通云仓（只有一个）
            this.currentAdd = {
              yunCangCode: '',
              yunCangFlag: 'yc',
              name: '云仓',
            };
          } else {
            this.currentAdd = {};
          }
        }
      }
    },
    getTotalMoney() {
      console.log(this.currentDetail);
      let total = 0;
      this.currentDetail.products.forEach((item) => {
        if (this.specialPrice === true) {
          total = ((parseFloat(item.choseOtherVersions[0].invoicePrice) * parseInt(item.promotionNum))
            + parseFloat(total)).toFixed(2);
        } else {
          total = ((parseFloat(item.priceDto.invoicePrice) * parseInt(item.promotionNum))
            + parseFloat(total)).toFixed(2);
        }
      });
      this.totalMoney = this.jshUtil.formatFloat(total, 2);
    },
    showAdsPicker() {
      /* 地址选择展示 */
      this.isShowAdsPicker = true;
    },
    // 成套下单
    async goOrder(nums) {
      this.groupProductNum = nums;
      console.log(this.currentDetail);
      await this.validateProduct();
    },
    // 产品校验
    async validateProduct() {
      const form = {
        saletoCode: this.saleInfo.customerCode,
        sendtoCode: this.currentAdd.sendtoCode,
        yunCangCode: '',
        yunCangFlag: '',
        splitComposeList: [
          {
            activityType: this.getActivityTypeCode(this.currentDetail.activityType),
            activityId: this.currentDetail.id,
            productList: [],
            number: this.groupProductNum
          }]
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
        form.sendtoCode = this.currentAdd.sendtoCode;
      }
      // 订单产品遍历组合
      const productArr = [];
      this.currentDetail.products.forEach((item) => {
        let productItem = {};
        if (item.choosedNum !== 0) {
          productItem = {
            productCode: item.productCode,
            number: Number(item.choosedNum),
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
        } else if (this.currentDetail.activityType === 'zuhe') {
          productItem = {
            productCode: item.productCode,
            number: item.promotionNum * this.groupProductNum,
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
        }
        if (item.choseOtherVersions && item.choseOtherVersions.length > 0) {
          productItem.priceType = item.choseOtherVersions[0].priceType.toUpperCase();
          productItem.priceVersion = item.choseOtherVersions[0].versionCode;
        }
        if (JSON.stringify(productItem) !== '{}') {
          productArr.push(productItem);
        }
      });
      if (this.currentDetail.pbProducts) {
        this.currentDetail.pbProducts.forEach((item) => {
          if (item.choosedNum !== 0) {
            const productItem = {
              productCode: item.productCode,
              number: Number(item.choosedNum),
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
          }
        });
      }
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
    // 拆单
  }
};
</script>
