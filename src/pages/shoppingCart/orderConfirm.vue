<template>
  <view class="orderConfirm">
    <view class="bg-style">
    </view>
    <view class="head-tip">
      <i class="iconfont iconjinggao head-tip-icon"></i>
      尊敬的客户，请尽快核对订单，由于产品库位分布不同可能导致拆单，带来不便敬请谅解。
    </view>
    <j-order-confirm-address
      :sendtoCode="dataInfo.sendtoCode"
      :sendtoAddress="dataInfo.sendtoAddress"
      @change="choseSendType"
    ></j-order-confirm-address>
    <view v-if="dataInfo.composeProductList" class="orderConfirm-list">
      <j-order-confirm-item
        v-for="(orderItem,index) in dataInfo.composeProductList"
        :key="index"
        :index="index"
        :tctpSwitch="tctpSwitch"
        @change="goodsChange"
        @payerMoneyInfo="dealPayerMoneyInfo"
        :orderItem="orderItem"
        :payInfoData="payInfoData"
        :billInfoList.sync="billInfoList"
        :sendType="formSubmit.deliveryType"
      ></j-order-confirm-item>
    </view>
    <view v-if="dataInfo.disableComposeProductList" class="mt24">
      <j-failure-order-item
        v-for="(orderItem,index) in dataInfo.disableComposeProductList"
        :key="index"
        :index="index"
        :orderItem="orderItem"
      ></j-failure-order-item>
    </view>
    <view class="mt24">
      <j-overage-pay
        :payerMoneyList="payerMoneyList"
      ></j-overage-pay>
    </view>
    <view class="orderConfirm-btm j-flex-aic">
      <view class="dis-flex">
        <view class="orderConfirm-btm-text">实付总额：</view>
        <view class="orderConfirm-btm-price">¥{{totalMoney}}</view>
      </view>
      <view class="btn-style">
        <button
          type="button"
          class="orderConfirm-btm-btn-cancle ml20"
          @tap="cancle"
        >取消订单</button>
        <button
          v-if="dataInfo.composeProductList"
          type="button"
          class="orderConfirm-btm-btn-sure ml20"
          @tap="next"
        >提交订单</button>
        <button
          v-if="dataInfo.disableComposeProductList"
          type="button"
          class="orderConfirm-btm-btn-sure ml20"
          @tap="goIndex"
        >返回首页</button>
      </view>

    </view>
    <j-modal
      :show.sync="modalShow"
      title="请输入验证码"
      @confirm="submitOrder"
    >
      <template>
        <view class="Verification-model">
          <view class="Verification-row">
            <view class="Verification-send">发送至</view>
            <input
              class="Verification-inputView"
              placeholder="请输入手机号"
              placeholder-class="col_c"
              v-model="linkNum"
            >
          </view>
          <view class="Verification-row">
            <view class="Verification-send">验证码</view>
            <input
              class="Verification-inputView"
              placeholder="请输入验证码"
              placeholder-class="col_c"
              v-model="formSubmit.bestSignVerifyCodeDto.verifyCode"
            >
          </view>
          <view
            class="send-btn">
            <text v-if="!sendMessageStatus" @tap="sendMessage">发送验证码</text>
            <text v-if="sendMessageStatus">{{time}}s后重新发送</text>
          </view>
        </view>
      </template>
    </j-modal>
  </view>
</template>

<script>
import JOrderConfirmAddress from '../../components/shoppingCart/JOrderConfirmAddress';
import JOrderConfirmItem from '../../components/shoppingCart/JOrderConfirmItem';
import JFailureOrderItem from '../../components/shoppingCart/JFailureOrderItem';
import JOveragePay from '../../components/shoppingCart/JOveragePay';
import JModal from '../../components/form/JModal';
import './css/orderConfirm.scss';
import {
  mapGetters, mapMutations
} from 'vuex';
import {
  USER
} from '../../store/mutationsTypes';

export default {
  name: 'orderConfirm',
  components: {
    JOveragePay,
    JFailureOrderItem,
    JOrderConfirmItem,
    JOrderConfirmAddress,
    JModal
  },
  data() {
    return {
      tctpSwitch: false,
      totalMoney: 0,
      productGroups: [],
      billInfoList: [],
      show: false,
      modalShow: false,
      formData: {},
      // 结算接口返回数据
      dataInfo: {
      },
      goodsList: [
        [
          {
            isCreditMode: false
          },
          {
            isCreditMode: false
          }
        ]
      ],
      failureGoodsList: [
        [
          {
            isCreditMode: false
          },
          {
            isCreditMode: false
          }
        ]
      ],
      // 付款信息
      payInfoData: {},
      // 选中的
      chosePayerOptions: [],
      // 所有订单的账户支付信息
      totalPayerMoneyInfo: {},
      // 余额支付信息
      payerMoneyList: [],
      // 所有付款方，有可能有重复的
      allPayer: [],
      linkNum: '', // 发送验证码的联系方式
      sendMessageStatus: false, // 是否发送了验证码
      time: 60,
      userInfMianMi: false, // 是否免密
      // 订单提交信息
      formSubmit: {
        deliveryType: 2,
        // 上上签验证信息
        bestSignVerifyCodeDto: {
          note: '',
          verifyCode: '',
          verifyKey: ''
        },
        // 拆单后组信息
        bigOrderInfoList: [],
        saletoCode: ''
      }
    };
  },
  onLoad(option) {
    if (option.formData) {
      this.formData = JSON.parse(option.formData);
      this.formSubmit.saletoCode = this.formData.saletoCode;
      this.onLoadInit();
      console.log(this.formData);
    }
    uni.$on('confirmremarks', (data) => {
      const remarksData = JSON.parse(data);
      const orderIndex = remarksData.orderIndex;
      const productIndex = remarksData.productIndex;
      const obj = this.dataInfo.composeProductList[orderIndex].splitOrderDetailList[productIndex].splitOrderProductList[0];
      obj.address = remarksData.address;
      obj.area = remarksData.area;
      obj.areaCode = remarksData.areaCode;
      obj.city = remarksData.city;
      obj.deliveryYd = remarksData.deliveryYd;
      obj.idCardNo = remarksData.idcardNo;
      obj.iphoneNo = remarksData.iphoneNo;
      obj.isCollectionAddress = remarksData.isCollectionAddress;
      obj.province = remarksData.province;
      obj.userName = remarksData.userName;
      obj.jdWarehouseId = remarksData.jdWarehouseId;
      obj.addressName = remarksData.addressName + remarksData.address;
      console.log(remarksData);
      console.log(this.dataInfo);
    });
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
    }
  },
  watch: {
    sendMessageStatus(val) {
      if (val === true) {
        // 发送了验证码开始倒计时
        const time = setInterval(() => {
          this.time--;
          if (this.time === 0) {
            clearInterval(time);
            this.sendMessageStatus = false;
            this.time = 60;
          }
        }, 1000);
      }
    }
  },
  methods: {
    getTotal(data) {
      let money = 0;
      data.composeProductList.forEach((item) => {
        const state = item.totalPreState;
        if (!state) {
          money += item.totalMoney;
        } else {
          money += 0;
        }
      });
      console.log(money);
      this.totalMoney = Number(money).toFixed(2);
    },
    async onLoadInit() {
      await this.splitOrder();
      await this.getPayInfo();
      await this.getUserInfById();
      await this.getTctpSwitch();
      this.billInfoList = [];
      this.productGroups.forEach((item) => {
        this.getBillInfo(item);
      });
      console.log(this.productGroups);
    },
    // 传统渠道查询开票方
    async getBillInfo(productCode) {
      let arrs = [];
      const sendtoCode = this.formData.sendtoCode;
      const { code, data } = await this.orderService.getBillInfo(sendtoCode, productCode);
      if (code === '1') {
        arrs = JSON.parse(JSON.stringify(this.billInfoList.concat(data)));
      }
      arrs = this.unique(arrs);
      this.billInfoList = JSON.parse(JSON.stringify(arrs));
      this.billInfoList.forEach((item) => {
        item.key = item.invoicerCode;
        item.value = `(${item.invoicerCode})${item.invoicerName}`;
      });
    },
    // 数组去重
    unique(arr) {
      return Array.from(new Set(arr));
    },
    // 拆单
    async splitOrder() {
      this.formData.whetherOrNotAppOrder = true;
      const { code, data } = await this.orderService.splitOrder(this.formData);
      if (code === '1') {
        this.dataInfo = data;
        console.log(this.dataInfo);
        // 如果有款先权限，且没有选中款先 金额为0
        this.dataInfo.composeProductList.forEach((item) => {
          const product = item.splitOrderDetailList[0].splitOrderProductList[0];
          if ((product.kuanXian === '1' && product.isCheckKuanXian === '0')
            || product.isCheckCreditModel === '1'
          ) {
            item.totalPreState = true;
          } else {
            item.totalPreState = false;
          }
        });
        this.getTotal(this.dataInfo);
      }
    },
    // 查询统仓统配白名单
    async getTctpSwitch() {
      const { code } = await this.orderService.getTctpSwitch();
      if (code === '1') {
        this.tctpSwitch = true;
      } else {
        this.tctpSwitch = false;
      }
    },
    dealPayerMoneyInfo(payerMoneyInfoItem) {
      this.totalPayerMoneyInfo = {
        ...this.totalPayerMoneyInfo,
        ...payerMoneyInfoItem
      };
      console.log(this.totalPayerMoneyInfo);
      console.log(this.dataInfo);
      const payerList = [];
      const payerObj = {};
      for (const k in this.totalPayerMoneyInfo) {
        // 重新计算你不同订单付款数量
        const orderNo = k;
        let money = 0;

        this.dataInfo.composeProductList.forEach((item) => {
          item.splitOrderDetailList.forEach((v) => {
            if (v.orderNo === orderNo) {
              if (item.totalPreState === true) {
                money += 0;
              } else {
                if ((v.stockTypeName === '周承诺' && item.crowdFundingFlag === '1')
                  || (v.stockTypeName === '款先直发' && item.crowdFundingFlag === '1')
                ) {
                  money += v.preAmount;
                } else {
                  money += v.totalMoney;
                }
              }
            }
          });
        });
        this.totalPayerMoneyInfo[k].totalMoney = money;
        if (payerObj[this.totalPayerMoneyInfo[k].customerCode]) {
          const totalmoney = parseFloat(payerObj[this.totalPayerMoneyInfo[k].customerCode].totalMoney)
            + parseFloat(this.totalPayerMoneyInfo[k].totalMoney);
          payerObj[this.totalPayerMoneyInfo[k].customerCode].totalMoney = this.jshUtil.formatFloat(totalmoney, 2);
        } else {
          payerObj[this.totalPayerMoneyInfo[k].customerCode] = this.totalPayerMoneyInfo[k];
        }
      }
      for (const k in payerObj) {
        payerList.push(payerObj[k]);
      }
      payerList.forEach((item) => {
        this.allPayer.forEach((v) => {
          if (v.customerCode === item.customerCode) {
            item.balance = v.payerBalance.balance;
            item.bookbalance = v.payerBalance.bookBalance;
            item.payerType = v.payerType;
          }
        });
      });
      this.payerMoneyList = payerList;
      console.log(payerList);
    },
    goodsChange(list, index) {
      /* 商品 change */
      this.$set(this.dataInfo.composeProductList, index, list);
    },
    getPayForm() {
      const payFormArr = [];
      const productGroups = [];
      this.dataInfo.composeProductList.forEach((item) => {
        item.splitOrderDetailList.forEach((v) => {
          const conditionItem = {
            isCheckCreditModel: v.splitOrderProductList[0].isCheckCreditModel,
            orderNo: v.orderNo,
            priceType: v.splitOrderProductList[0].priceType,
            priceVersion: v.splitOrderProductList[0].priceVersion,
            productCode: v.splitOrderProductList[0].productCode,
            productGroup: v.splitOrderProductList[0].productGroup,
            saletoCode: this.dataInfo.saletoCode,
            sendtoCode: this.dataInfo.sendtoCode,
            yunCangFlag: '',
          };
          productGroups.push(v.splitOrderProductList[0].productGroup);
          if (v.isTCTP) {
            conditionItem.yunCangFlag = 'TCTP';
          }
          payFormArr.push(conditionItem);
        });
      });
      this.productGroups = productGroups;
      console.log(payFormArr);
      return payFormArr;
    },
    async getPayInfo() {
      /* 获取支付信息 */
      const condition = this.getPayForm();
      const { code, data } = await this.orderService.paytoInfo(condition);
      console.log(code);
      if (code === '1') {
        let payList = [];
        for (const k in data) {
          this.$set(this.payInfoData, k, data[k]);
          payList = payList.concat(data[k]);
        }
        this.allPayer = payList;
      }
    },
    // 获取上上签验证联系方式
    async getUserInfById() {
      /* 根据客户/海尔编码获取bestSign系统的account(手机/邮箱) */
      const { code, data } = await this.orderService.sendVerify(this.formData.saletoCode);
      if (code === '1') {
        const abc = data.data.account;
        this.linkNum = abc.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
      }
    },
    async getUserInfMianMi() {
      /* 获取免密 */
      const data = await this.orderService.mianMi();
      if (data.code === '1') {
        this.userInfMianMi = data.data;
      }
    },
    // 发送验证码
    async sendMessage() {
      const { code, data } = await this.orderService.send(this.formData.saletoCode);
      if (code === '1') {
        this.sendMessageStatus = true;
        this.formSubmit.bestSignVerifyCodeDto.verifyKey = data.data.verifyKey;
        uni.showToast({
          title: '短信发送成功',
        });
      }
    },
    // 取消订单
    async cancle() {
      console.log(this.dataInfo);
      // const dataArr = this.dataInfo.composeProductList || this.dataInfo.disableComposeProductList;
      const saletoCode = this.dataInfo.sendtoCode;
      const cancleForm = [];
      this.dataInfo.composeProductList.forEach((item) => {
        const groupIngNo = item.composeOrderNo;
        item.splitOrderDetailList.forEach((v) => {
          const itemObj = {
            groupIngNo,
            orderNo: v.orderNo,
            saletoCode
          };
          cancleForm.push(itemObj);
        });
      });
      const { code } = await this.orderService.cancelOrder(cancleForm);
      if (code === '1') {
        const that = this;
        uni.showToast({
          title: '取消订单成功'
        });
        setTimeout(() => {
          that.goIndex();
        }, 1000);
      }
    },
    // 返回首页
    goIndex() {
      uni.switchTab({
        url: '/pages/index/index'
      });
    },
    async next() {
      // 判断是否免密，免密则直接支付否则弹出发送验证码弹窗
      await this.getUserInfMianMi();
      if (this.userInfMianMi) {
        console.log('true,提交');
        this.submitOrder();
      } else {
        this.modalShow = true;
      }
    },
    // 提交订单
    async submitOrder() {
      if (!this.formSubmit.bestSignVerifyCodeDto.verifyCode && !this.userInfMianMi) {
        uni.showToast({
          title: '请输入验证码',
          icon: 'none'
        });
        return;
      }
      let state = true;
      if (this.payerMoneyList.length === 0) {
        uni.showToast({
          title: '未查询到余额信息，请重新下单',
          icon: 'none'
        });
        return;
      }
      this.payerMoneyList.forEach((item) => {
        if (Number(item.balance) < Number(item.totalMoney)
          && Number(item.bookbalance) < Number(item.totalMoney)
        ) {
          uni.showToast({
            title: '余额不足请先充值',
            icon: 'none'
          });
          state = false;
        }
      });
      if (!state) {
        return;
      }
      // 根据拆单结果组合订单提交信息
      const orderList = [];
      const groupingArr = [];
      const productType = this.formData.splitComposeList[0].activityType;
      this.dataInfo.composeProductList.forEach((item) => {
        const billNo = item.billNo;
        const billName = item.billName;
        const conCode = item.conCode;
        const wdNo = item.wdNo;
        const orderItem = {
          groupingNo: item.composeOrderNo,
          orderDetailList: []
        };
        const groupingNoItem = {
          groupingNo: item.composeOrderNo
        };
        groupingArr.push(groupingNoItem);
        item.splitOrderDetailList.forEach((v) => {
          const singleItem = {
            productType,
            isTCTP: v.isTCTP,
            billNo,
            billName,
            conCode,
            wdNo,
            orderNo: v.orderNo,
            stockType: v.stockType,
            province: v.splitOrderProductList[0].province,
            city: v.splitOrderProductList[0].city,
            area: v.splitOrderProductList[0].area,
            areaCode: v.splitOrderProductList[0].areaCode,
            address: v.splitOrderProductList[0].address,
            isBbOrProject: v.splitOrderProductList[0].isBbOrProject,
            priceType: v.splitOrderProductList[0].priceType,
            isCollectionAddress: v.splitOrderProductList[0].isCollectionAddress,
            idCardNo: v.splitOrderProductList[0].idCardNo,
            iphoneNo: v.splitOrderProductList[0].iphoneNo,
            userName: v.splitOrderProductList[0].userName,
            deliveryYd: v.splitOrderProductList[0].deliveryYd,
            isCheckCreditModel: v.splitOrderProductList[0].isCheckCreditModel,
            paytoCode: this.totalPayerMoneyInfo[v.orderNo].customerCode,
            paytoName: this.totalPayerMoneyInfo[v.orderNo].customerName.split(')')[1],
            paytoType: this.totalPayerMoneyInfo[v.orderNo].payerType
          };
          orderItem.orderDetailList.push(singleItem);
        });
        orderList.push(orderItem);
      });
      this.formSubmit.bigOrderInfoList = orderList;
      const { code, data } = await this.orderService.updateOrderInfo(this.formSubmit);
      if (code === '1') {
        console.log(data);
        const groupings = JSON.stringify(groupingArr);
        uni.navigateTo({
          url: `/pages/shoppingCart/orderConfirmAccept?groupings=${groupings}`
        });
      } else if (code === '69') {
        const _this = this;
        // confirm("确认要删除选中订单")
        uni.showModal({
          title: '',
          content: '确认支付失败,原因为:该订单已超时未支付',
          success(res) {
            if (res.confirm) {
              console.log(res);
              _this.goIndex();
            } else if (res.cancel) {
              _this.goIndex();
              console.log('用户点击取消');
            }
          }
        });
      } else {
        uni.showToast({
          title: data.msg,
          icon: 'none'
        });
      }
    },
    choseSendType(types) {
      console.log(types);
      types.forEach((item) => {
        if (item.checked === true) {
          this.formSubmit.deliveryType = item.key;
        }
      });
    }
  }
};
</script>
