<template>
   <view class="TAlertVerification" v-show="show">
      <view class="TAlertVerification-cen"
            @tap="cancel"
      >
      </view>
      <view class="TAlertVerification-model">
         <view class="TAlertVerification-title">请输入验证码</view>
         <view class="TAlertVerification-row">
            <view class="TAlertVerification-send">发送至</view>
            <input
              class="TAlertVerification-inputView"
              placeholder="请输入手机号"
              placeholder-class="col_c"
              v-model="form.phone"
            >
         </view>
         <view class="TAlertVerification-row">
            <view class="TAlertVerification-send">验证码</view>
            <input
              class="TAlertVerification-inputView"
              placeholder="请输入验证码"
              placeholder-class="col_c"
              v-model="verificationCode"
            >
         </view>
         <view class="TAlertVerification-row-right-wrap">
            <view class="TAlertVerification-row-right-gap"></view>
            <j-verification-code
              :getMethod="getVerificationCodeByPhone"
            ></j-verification-code>
            <button class="TAlertVerification-row-right-btn"
                    @tap="determine"
            >确定</button>
         </view>

      </view>
   </view>
</template>
<script>
import JVerificationCode from '../common/JVerificationcode';
import JValidate from '@/lib/jValidate/JValidate';
import md5 from 'js-md5';

import {
  mapGetters
} from 'vuex';
import {
  USER
} from '../../store/mutationsTypes';

export default {
  name: 'JSamplemachineAlert',
  components: {
    // uniPopup,
    JVerificationCode,
  },
  props: {
    isYuncang: {
      type: Boolean,
    },
    show: {
      type: Boolean,
    },
    form: {
      type: Object,
      default: () => {}
    },
    confirmInfo: {
      type: Object,
      default: () => {}
    },
    currentPayer: {
      type: Object,
      default: () => {}
    },
    currentAddress: {
      type: Object,
      default: () => {}
    },
    typpew: {
      type: String
    },
    totalMoney: {
      type: [Number, String]
    }
    // phone: {
    //   type: String
    // }
  },
  data() {
    return {
      verificationCode: '',
      erifyKey: 0,
      // 订单返回数据
      orderData: [],
      // 提交订单单号
      orderNo: ''

    };
  },
  created() {
    console.log(this.confirmInfo);
    console.log(this.currentPayer);
    console.log(this.currentAddress);
    // this.setPageInfo();
    this.getSampleOrder();
  },
  computed: {
    ...mapGetters({
      userInf: USER.GET_USER,
      saleInfo: USER.GET_SALE,
      defaultSendToInf: USER.GET_DEFAULT_SEND_TO, // 售达方信息
      [USER.GET_TOKEN_USER]: USER.GET_TOKEN_USER, // 用户信息
    })
  },
  methods: {
    // 生成样品机单号
    async getSampleOrder() {
      const { code, data } = await this.samplemachineService.getSampleOrder({
        timestamp: Date.parse(new Date())
      });
      if (code === '1' && data.code === '200') {
        this.orderNo = data.data.YBR_SEQ;
      } else {
        uni.showToast({
          title: '样品机单号生成失败，请重试！',
          icon: 'none'
        });
      }
    },
    setPageInfo() {
      this.genVdt();
    },
    genVdt() {
      this.vdt = new JValidate({
        _this: this,
        rules: {
          phone: {
            required: true,
            mobile: true
          },
          verificationCode: {
            required: true
          },
        },
        messages: {
          phone: {
            required: '手机号不能为空',
            mobile: '手机号格式不正确'
          },
          verificationCode: {
            required: '必须输入新手机验证码'
          },
        }
      });
    },
    cancel() {
      this.$emit('update:show', false);
    },

    async getVerificationCode() {
      // 发送验证码
      const { code, data } = await this.samplemachineService.sendMessage({
        account: this.saleInfo.customerCode,
        productCode: this.confirmInfo.code,
        orderNo: this.orderNo,
        whCode: this.confirmInfo.detailList[0].ygsLgort,
        werks: this.confirmInfo.detailList[0].ygsWerks
      });
      if (code === '1') {
        if (data.verifyKey) {
          console.log(data.verifyKey);
          this.erifyKey = data.verifyKey;
        }
        uni.showToast({
          title: '短信发送成功',
        });
      }
    },
    getVerificationCodeByPhone() {
      if (this.form.phone) {
        return this.getVerificationCode();
      }
      uni.showToast({
        title: '原手机号未获取',
        icon: 'none'
      });
    },
    // 点击确定
    async determine() {
      console.log(this.currentPayer);
      console.log(this.currentAddress);
      console.log(this.confirmInfo);
      console.log(this.form);
      if (this.verificationCode) {
        // 提交订单
        /* const { code, data } = await this.transfergoodsService.submitDhOrder({
          timestamp: Date.parse(new Date()),
          longfeiUSERID: Number(this.saleInfo.customerCode),
          orderNo: Number(SEQ),
          verifyCode: Number(this.form.verificationCode),
          verifyKey: `${this.erifyKey}`,
        }); */
        const time = new Date().getTime();
        const beforeSign = `${this.saleInfo.customerCode}${this.verificationCode}${time}${this.confirmInfo.code}1YPJSINGCODE20200814`;
        console.log(beforeSign);
        const signCode = md5(beforeSign);
        console.log(signCode);
        const { code, data } = await this.samplemachineService.submitOrder([
          {
            FACTORYTYPE: '1',
            ISFL: '2',
            ISKPO: '0',
            MAINCHANNEL: this.saleInfo.channel,
            MKTID: this.saleInfo.tradeCode,
            PAYTO_NAME: this.saleInfo.customerName,
            PAYTO_TYPE: this.currentPayer.payerType,
            PRODUCT_MODEL: this.confirmInfo.model,
            SENDTO_ADDRESS: this.currentAddress.address,
            SENDTO_NAME: this.currentAddress.addressName,
            SUBCHANNEL: this.saleInfo.subChannel,
            WHCODE: this.confirmInfo.detailList[0].ygsLgort,
            WHNAME: this.confirmInfo.detailList[0].ygsLgobe,
            YJMFID: this.currentAddress.manageCustomerCode,
            YJMFID_NAME: this.currentAddress.manageCustomerCode,
            actPrice: this.confirmInfo.$allPrice.ActPrice,
            bateMoney: this.confirmInfo.$allPrice.ReBateMoney,
            bateRate: this.confirmInfo.$allPrice.BateRate,
            brand: this.confirmInfo.brand,
            canChange: true,
            invcode: this.confirmInfo.code,
            invsort: this.confirmInfo.detailList[0].ygsSpart,
            invstd: this.confirmInfo.name,
            longfeiMFID: this.currentAddress.addressCode,
            lossPrice: this.confirmInfo.$allPrice.UnitPrice,
            lossRate: this.confirmInfo.$allPrice.ReLossRate,
            maxNum: 1,
            minNum: 0,
            num: 1,
            orderSource: '',
            payto: this.saleInfo.customerCode,
            realPrice: this.confirmInfo.$allPrice.ActPrice,
            searchImage: this.confirmInfo.searchImage,
            seq: this.orderNo,
            summoney: parseFloat(this.totalMoney),
            unitPrice: this.confirmInfo.$allPrice.UnitPrice,
            userId: this.saleInfo.customerCode,
            werks: this.confirmInfo.detailList[0].ygsWerks,
            yuncang: this.isYuncang,
          }
        ], {
          timestamp: time,
          validateCode: '5503',
          verifyCode: this.verificationCode,
          verifyKey: '',
          customerCode: this.saleInfo.customerCode,
          signCode
        });
        if (code === '1' && data.code === '200') {
          uni.showToast({
            title: data.message
          });
          this.getCargoDispose();
        } else {
          uni.showToast({
            title: `${data.message}`,
          });
        }
      } else {
        uni.showToast({
          title: '请输入验证码',
        });
      }
    },
    // 提交订单返回数据
    async getCargoDispose() {
      const dispose = await this.samplemachineService.sampleOrderDispose({
        timestamp: Date.parse(new Date()),
        longfeiUSERID: this.saleInfo.customerCode,
        OrderForm: this.orderNo
      });
      if (dispose.code === '1' && dispose.data.code === '200') {
        const page = dispose.data.data[0];
        if (page) {
          page.orderList.forEach((item) => {
            if (item.ISFLAG == '订单提交中') {
              const _this = this;
              uni.showLoading({
                title: '订单提交中,请稍后。。。'
              });
              setTimeout(() => {
                _this.getCargoDispose();
              }, 1000);
            } else {
              uni.hideLoading();
              this.cancel();
              this.orderData = JSON.stringify(dispose.data.data);
              uni.navigateTo({
                url: `/pages/shoppingCart/orderConfirmAccept?totalMoney=${this.totalMoney}&orderData=${this.orderData}`
              });
            }
          });
        }
      }
    },
  }
};
</script>
<style scoped>
/deep/ .JVerificationCode-send-code {
    font-size: 25px;
    margin-left: -400px;
    margin-top: -15px;
}
.TAlertVerification-row-right-gap {
    display: flex;
}
.TAlertVerification-cen {
    width:100%;
    height:100%;
    position:fixed;
    top:0;
    left: 0;
    background: #ccc;
    opacity: 0.8;
    z-index: 888;
}
.TAlertVerification-model {
    position: fixed;
    width: 80%;
    height: 35%;
    top: 15%;
    padding: 5%;
    left: 10%;
    background: #fff;
    opacity: 1;
    z-index: 889;
}
.TAlertVerification-row {
    display: flex;
    margin-bottom: 30px;

}
.TAlertVerification-title {
    font-size: 30px;
    margin-bottom: 40px;
    margin-top: 40px;
}
.TAlertVerification-send {
    width: 200px;
    height: 70px;
    background: #f9f9f9;
    line-height: 70px;
    text-align: center;
    font-size:26px;
    border:2px solid #c9c9c2;
    color: #333;
}
.TAlertVerification-inputView {
    width: 500px;
    height: 70px;
    font-size:26px;
    line-height: 70px;
    text-align: center;
    border:2px solid #c9c9c2;
    color: #333;
}
.col_c {
    color:#ccc;
}
.TAlertVerification-row-right-btn {
    /* width: 105px; */
    height: 60px;
    line-height: 60px;
    text-align: center;
    color: #333;
    font-size: 26px;
    background: #f9f9f9;
    border:1px solid #ccc;
    border-radius: 10px;
    position: fixed;
    top: 42%;
    left: 70%;
}
</style>
