<template>
  <view :key="updateIndex"
        :class="['JOrderConfirmItem-par',isCT&&'pb200']">
    <view
      class="jOrderConfirmItem-wrap"
    >
      <view
        class="jOrderConfirmItem"
        v-for="(goods,index) in orderItem.splitOrderDetailList"
        :key="index"
      >
        <view v-if="goods.splitOrderProductList"
              class="jOrderConfirmItem-detail">
          <view class="jOrderConfirmItem-detail-portrait">
            <image
              :src="goods.splitOrderProductList[0].productImageUrl"
            >
            </image>
          </view>
          <view class="jOrderConfirmItem-detail-cnt">
            <view class="jOrderConfirmItem-detail-cnt-title">
              {{goods.splitOrderProductList[0].productName}}
            </view>
            <view class="jOrderConfirmItem-detail-cnt-price-wrap">
              <view class="jOrderConfirmItem-detail-cnt-price">
                ¥{{toFixedNum(goods.splitOrderProductList[0].price)}}
                <view class="jOrderConfirmItem-detail-cnt-text ml10 mr34">
                  *{{goods.splitOrderProductList[0].storeNum}}
                </view>
              </view>
              <view v-if="(goods.stockTypeName === '周承诺'&&orderItem.crowdFundingFlag==='1')
                        ||(goods.stockTypeName === '款先直发'&&orderItem.crowdFundingFlag==='1')"
                    class="jOrderConfirmItem-detail-cnt-text">
                预定金额：{{goods.preAmount}}
              </view>
              <view class="jOrderConfirmItem-detail-cnt-text">预计到货时间：{{goods.planInDate}}</view>
            </view>
          </view>
        </view>
        <view class="jOrderConfirmItem-detail-match-type">
          <j-switch
            :beforeChange="disabledSwitch"
            v-if="goods.splitOrderProductList[0].isCheckCreditModel === '1'"
            :active.sync="goods.splitOrderProductList[0].isCheckCreditModel === '1'"
            inf="信用模式"
          ></j-switch>
          <j-switch
            v-if="goods.isTCTP&&tctpSwitch&&(sendType===2)"
            :active.sync="goods.isTCTP"
            inf="统仓统配"
            @change="isCreditModeChange"
          ></j-switch>
          <j-switch
            :beforeChange="disabledSwitch"
            v-if="goods.splitOrderProductList[0].isCheckKuanXian === '1'"
            :active.sync="goods.splitOrderProductList[0].isCheckKuanXian === '1'"
            inf="款先"
          ></j-switch>
          <j-switch
            :beforeChange="disabledSwitch"
            v-if="goods.splitOrderProductList[0].farWeek === '1'"
            :active.sync="goods.splitOrderProductList[0].isCheckFarWeek === '1'"
            inf="远周次"
          ></j-switch>
          <view class="jOrderConfirmItem-detail-match-type-text ml20">
            <view class="stock-type">
              满足方式：{{goods.stockTypeName}}
            </view>
            <view v-if="goods.stockTypeName !== '周承诺'&&goods.stockTypeName !== '款先直发'"
                  class="store-type">
              {{goods.whCode}}
            </view>
            <!--<view v-else class="dis-flex">
              WD：
              <input v-model="WDval" type="text" class="WD-input">
            </view>-->
          </view>
        </view>
        <view v-if="goods.splitOrderProductList[0].priceType === 'TJ'" class="text-theme">
          特价版本号：{{goods.splitOrderProductList[0].priceVersion}}
        </view>
        <view v-if="goods.splitOrderProductList[0].priceType === 'GC'" class="text-theme">
          工程版本号：{{goods.splitOrderProductList[0].priceVersion}}
        </view>
        <view v-if="isYJ(goods.splitOrderProductList[0].priceType)" class="text-theme">
          样机版本号：{{goods.splitOrderProductList[0].priceVersion}}
        </view>
        <view class="bzAddress" v-if="goods.splitOrderProductList[0].priceType === 'MFJK'
                &&goods.splitOrderProductList[0].priceInfo.deliveryAddr">
          {{goods.splitOrderProductList[0].priceInfo.deliveryAddr}}
        </view>
        <view class="dis-flex">
          <view v-if="orderItem.yunCangType==='yc'" class="yc-flag">云仓</view>
          <view v-if="orderItem.yunCangType==='ydyc'" class="yc-flag">异地云仓</view>
        </view>
        <view class="jOrderConfirmItem-detail-mark-wrap mt24">
          <view class="jOrderConfirmItem-detail-mark-item">
            <view class="jOrderConfirmItem-detail-mark-item-name">
              <text class="jOrderConfirmItem-detail-mark-item-name-star">*</text>付款方
              <view class="jOrderConfirmItem-detail-mark-item-name-icon iconfont iconxia"></view>
            </view>
            <view @tap="showPayer(goods.orderNo)" class="jOrderConfirmItem-detail-mark-item-val">
              <text v-if="currentPayer[goods.orderNo]">{{currentPayer[goods.orderNo].value}}</text>
              <text v-else>请选择付款方</text>
            </view>
          </view>
          <view v-if="goods.splitOrderProductList[0].isBbOrProject
          &&orderItem.yunCangType!=='yc'
          &&orderItem.yunCangType!=='ydyc'
          &&currentPayer[goods.orderNo].payerType !=='98'
          &&currentPayer[goods.orderNo].payerType !=='99'"
                class="jOrderConfirmItem-detail-mark-item">
            <view class="jOrderConfirmItem-detail-mark-item-name">
              <text class="jOrderConfirmItem-detail-mark-item-name-star">*</text>备注信息
              <view class="jOrderConfirmItem-detail-mark-item-name-icon iconfont iconxia"></view>
            </view>
            <view
              @tap="goRemarks(index,goods.splitOrderProductList[0])"
              class="jOrderConfirmItem-detail-mark-item-val">
              <view
                v-if="goods.splitOrderProductList[0].address&&JSON.stringify(goods.splitOrderProductList[0].address)!=='{}'">
                <text>
                  {{goods.splitOrderProductList[0].addressName}}
                </text>
                <text class="detailAddress">
                  查看详情
                </text>
              </view>
              <view v-else>请选择备注信息</view>
            </view>
          </view>
        </view>
        <view class="jOrderConfirmItem-semicircle-wrap jOrderConfirmItem-semicircle-left">
          <view class="jOrderConfirmItem-semicircle"></view>
        </view>
        <view class="jOrderConfirmItem-semicircle-wrap jOrderConfirmItem-semicircle-right">
          <view class="jOrderConfirmItem-semicircle"></view>
        </view>
      </view>
    </view>
    <view :class="['jOrderConfirmItem-total', isCT&&'bottom-20']">
      <view class="dis-flex justify-sb flex-wrap">
        <view class="flex-grow-1 dis-flex">
          <view v-if="orderItem.activityName" class="type-flag">
            <view  v-if="orderItem.activityName.indexOf('反向定制')" class="type-flag">
              反向定制
            </view>
          </view>
          <view v-else class="type-flag">{{activityTypeList[orderItem.activityType]}}</view>
          <view class="jOrderConfirmItem-total-text">{{orderItem.composeOrderNo}}</view>
        </view>
        <view class="dis-flex">
          <view class="jOrderConfirmItem-total-text">共计金额：</view>
          <view class="jOrderConfirmItem-total-price ml20">
            ¥ {{orderItem.totalMoney}}
          </view>
        </view>
      </view>
      <view @tap="chooseInvoice" v-if="isCT" class="dis-flex mt12">
        <view class="w150">开票方：</view>
        <view class="">({{currentinvoice.invoicerCode}}){{currentinvoice.invoicerName}}</view>
        <view class="jOrderConfirmItem-detail-mark-item-name-icon iconfont iconxia"></view>
      </view>
      <view v-if="isCT" class="dis-flex">
        <view class="lh66">采购订单号：</view>
        <u-input
          class="input-style"
          type="text"
          placeholder="请输入采购订单号"
          placeholderStyle="color:#fff;font-size:12px"
          v-model="selfValue"
        ></u-input>
      </view>
    </view>
    <j-pop-picker
      title="付款方"
      :cantCheckedCallback="isNoCanChecked"
      :show.sync="payerPickerShow"
      :options="payerOptions[currentOrderNo]"
      :choseKeys.sync="currentchosePayerOption"
    ></j-pop-picker>
    <j-pop-picker
      title="开票方"
      :isShowSearch="true"
      :show.sync="invoicePickerShow"
      :options="invoiceOptions"
      :choseKeys.sync="currentinvoiceOption"
    ></j-pop-picker>
  </view>
</template>

<script>
import JSwitch from '../form/JSwitch';
import JPopPicker from '../form/JPopPicker';
import './css/jOrderConfirmItem.scss';
import {
  mapGetters
} from 'vuex';
import {
  USER
} from '../../store/mutationsTypes';

export default {
  name: 'JOrderConfirmItem',
  components: {
    JSwitch,
    JPopPicker
  },
  props: {
    sendType: {
      type: Number,
      default: 2
    },
    tctpSwitch: {
      type: Boolean
    },
    // 单个订单
    orderItem: {
      type: Object,
      default: () => {
      }
    },
    // 索引
    index: {
      type: Number
    },
    // 索引
    billInfoList: {
      type: Array
    },
    // 付款方信息
    payInfoData: {
      type: Object,
      default: () => {
      }
    },
  },
  data() {
    return {
      currentPayInfoData: {},
      invoicePickerShow: false,
      invoiceOptions: [],
      currentinvoiceOption: [],
      currentinvoice: {},
      selfValue: '',
      isCT: false,
      Bbaddress: {},
      activityTypeList: {
        1: '单品',
        2: '组合',
        3: '抢购',
        4: '套餐',
        5: '成套'
      },
      stockType: {
        1: 'rrs库存',
        2: 'TC共享库存',
        3: '天猫共享库存',
        4: '在途',
        5: 'PTD',
        6: '排产',
        7: '排定',
        8: '基地（生活家电）',
        9: 'JJ直接传安防'
      },
      WDval: '',
      updateIndex: 1,
      baseUrl: process.env.BASE_URL,
      // 配送地址显示隐藏
      payerPickerShow: false,
      // 配送地址options
      payerOptions: {},
      // 选中的
      chosePayerOptions: {},
      currentchosePayerOption: [],
      currentPayer: {},
      currentOrderNo: ''
    };
  },
  created() {
    if (this.saleInfo.channelGroup === 'CT') {
      this.isCT = true;
    } else {
      this.isCT = false;
    }
  },
  watch: {
    selfValue(val) {
      this.orderItem.conCode = val;
    },
    WDval(val) {
      this.orderItem.wdNo = val;
    },
    payInfoData() {
      // 初始化地址信息
      this.currentPayInfoData = JSON.parse(JSON.stringify(this.payInfoData));
      for (const key in this.currentPayInfoData) {
        let initcustomerCode = '';
        let offset = 0;
        this.currentPayInfoData[key].forEach((item, index) => {
          if (item.defaultFlag === '1' && item.isCanChecked) {
            initcustomerCode = item.customerCode;
            offset = index;
          }
          item.balance = item.payerBalance.balance;
          item.key = item.customerCode;
          item.value = `(${item.payerCode}) ${item.payerName}`;
        });
        if (initcustomerCode === '') {
          const arrObj = [];
          // 没有默认付款方选择第一条
          this.currentPayInfoData[key].forEach((item, index) => {
            if (item.isCanChecked) {
              const objItem = {
                initcustomerCode: item.customerCode,
                index
              };
              arrObj.push(objItem);
            }
          });
          if (arrObj.length > 0) {
            initcustomerCode = arrObj[0].customerCode;
            offset = arrObj[0].index;
          }
        }
        // 设置付款列表
        this.$set(this.payerOptions, key, this.currentPayInfoData[key]);
        // 设置初始化选中地址
        this.currentchosePayerOption[0] = initcustomerCode;
        this.$set(this.currentPayer, key, this.currentPayInfoData[key][offset]);
      }
      this.getPayerMoneyInfo();
      console.log(this.payerOptions);
      console.log(this.currentPayer);
      console.log(this.orderItem);
    },
    currentchosePayerOption(val) {
      const currentPayer = this.payerOptions[this.currentOrderNo].find(v => v.customerCode === val[0]);
      this.$set(this.currentPayer, this.currentOrderNo, currentPayer);
      this.orderItem.splitOrderDetailList.forEach((item) => {
        if (item.splitOrderProductList[0].isBbOrProject === true
            && (currentPayer.payerType === '98' || currentPayer.payerType === '99')) {
          uni.showToast({
            title: '融资户暂不支持异地配送下单！',
            icon: 'none'
          });
          item.splitOrderProductList[0].address = '';
          item.splitOrderProductList[0].addressName = '';
          item.splitOrderProductList[0].area = '';
          item.splitOrderProductList[0].areaCode = '';
          item.splitOrderProductList[0].city = '';
          item.splitOrderProductList[0].idCardNo = '';
          item.splitOrderProductList[0].iphoneNo = '';
          item.splitOrderProductList[0].jdWarehouseId = '';
          item.splitOrderProductList[0].province = '';
          item.splitOrderProductList[0].userName = '';
        }
      });
      console.log(this.orderItem);
      this.getPayerMoneyInfo();
    },
    billInfoList() {
      if (this.billInfoList.length === 0) {
        return;
      }
      this.currentinvoiceOption = [];
      this.invoiceOptions = this.billInfoList;
      this.currentinvoiceOption[0] = this.invoiceOptions[0].key;
      this.currentinvoice = this.invoiceOptions[0];
      this.orderItem.billNo = this.currentinvoice.invoicerCode;
      this.orderItem.billName = this.currentinvoice.invoicerName;
      console.log(this.orderItem);
    },
    currentinvoiceOption(val) {
      console.log(val);
      this.invoiceOptions.forEach((item) => {
        if (item.key === val[0]) {
          this.currentinvoice = item;
        }
      });
    }
  },
  computed: {
    ...mapGetters({
      saleInfo: USER.GET_SALE,
      defaultSendToInf: USER.GET_DEFAULT_SEND_TO
    }),
    toFixedNum() {
      return function (val) {
        return (Number(val)).toFixed(2);
      };
    },
    isYJ() {
      return function (val) {
        if (val === 'YJCT' || val === 'YJCY' || val === 'MFJK'
            || val === 'MFYJ' || val === 'YJ') {
          return true;
        }
      };
    },
    getTotalMoneyHJ() {
      let money = 0;
      this.orderItem.splitOrderDetailList.forEach((item) => {
        if (item.splitOrderProductList[0].isCheckCreditModel === '1'
            && this.orderItem.totalPreState) {
          money += item.splitOrderProductList[0].totalMoney;
        } else if (this.orderItem.totalPreState) {
          money += item.splitOrderProductList[0].totalMoney;
        } else {
          money += item.splitOrderProductList[0].totalMoney;
        }
      });
      return this.toFixedNum(money);
    }
  },
  methods: {
    disabledSwitch() {
      /* 禁止switch函数 */
      return false;
    },
    // 不可以选中的付款方
    isNoCanChecked() {
      uni.showToast({
        title: '风险账号005，请联系当地财务解冻',
        icon: 'none'
      });
    },
    // 选择开票方
    chooseInvoice() {
      console.log(1);
      this.currentinvoiceOption = [];
      this.invoiceOptions = this.billInfoList;
      this.invoicePickerShow = true;
      this.currentinvoiceOption[0] = this.invoiceOptions[0].key;
    },
    getPayerMoneyInfo() {
      const currentPayerMoneyInfo = {};
      console.log(this.currentPayer);
      console.log(this.orderItem);
      this.orderItem.splitOrderDetailList.forEach((item) => {
        console.log(item);
        const itemObj = {
          totalMoney: item.totalMoney,
          customerCode: this.currentPayer[item.orderNo].customerCode,
          customerName: `(${this.currentPayer[item.orderNo].customerCode})${this.currentPayer[item.orderNo].customerName}`,
          balance: this.currentPayer[item.orderNo].payerBalance.balance,
          bookbalance: this.currentPayer[item.orderNo].payerBalance.bookbalance,
          payerType: this.currentPayer[item.orderNo].payerType
        };
        if (this.orderItem.totalPreState === true) {
          itemObj.totalMoney = 0;
        }
        currentPayerMoneyInfo[item.orderNo] = itemObj;
      });
      console.log(currentPayerMoneyInfo);
      this.$emit('payerMoneyInfo', currentPayerMoneyInfo);
    },
    showPayer(currentOrderNo) {
      console.log(currentOrderNo);
      console.log(this.currentPayer);
      this.currentOrderNo = currentOrderNo;
      this.currentchosePayerOption[0] = this.currentPayer[currentOrderNo].key;
      /* 展示付款地址 */
      this.payerPickerShow = true;
    },
    goRemarks(index, goodsInfo) {
      const goodInfo = JSON.stringify(goodsInfo);
      uni.navigateTo({
        url: `/pages/shoppingCart/orderConfirmRemarks?orderIndex=${this.index}&productIndex=${index}&goodInfo=${goodInfo}`
      });
    },
    isCreditModeChange() {
      /* switch change */
      this.$emit('change', this.orderItem, this.index);
    },
    goodsChange() {
      /* switch change */
      this.$emit('change', this.orderItem, this.index);
    },
  }
};
</script>

<style scoped>

</style>
