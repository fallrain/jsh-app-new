<template>
  <view class="jOveragePay-wrap">
    <view class="jOveragePay-wrap-head j-flex-aic">
      <view class="iconfont iconmoney jOveragePay-wrap-head-icon"></view>
      <view class="jOveragePay-wrap-head-text ml24">余额支付信息</view>
    </view>
    <view class="jOveragePay-cnt">
      <view
        v-for="(item,index) in payerMoneyList"
        :key="index"
        class="jOveragePay-cnt-item">
        <view class="jOveragePay-cnt-item-head j-flex-aic">
          <view class="jOveragePay-cnt-item-head-dot"></view>
          {{item.customerName}}
        </view>
        <view class="jOveragePay-cnt-item-total j-flex-aic">
          <view class="jOveragePay-cnt-item-total-item">
            <view class="jOveragePay-cnt-item-total-text">可用余额：</view>
            <view
              v-if="saleInfo.channelGroup === 'ZY'"
              class="jOveragePay-cnt-item-total-price">¥ {{toFixedNum(item.balance)}}</view>
            <view
              v-if="saleInfo.channelGroup === 'CT'"
              class="jOveragePay-cnt-item-total-price">¥ {{toFixedNum(item.bookbalance)}}</view>
          </view>
          <view class="jOveragePay-cnt-item-total-item-line">
          </view>
          <view class="jOveragePay-cnt-item-total-item">
            <view class="jOveragePay-cnt-item-total-text">待支付金额：</view>
            <view class="jOveragePay-cnt-item-total-price">¥ {{toFixedNum(item.totalMoney)}}</view>
          </view>
          <button
            v-if="compareMoney(item.balance, item.totalMoney)&&saleInfo.channelGroup === 'ZY'"
            type="button"
            class="jOveragePay-cnt-item-total-btn"
          >余额不足，去充值</button>
          <button
            v-if="compareMoney(item.bookbalance, item.totalMoney)&&saleInfo.channelGroup === 'CT'"
            type="button"
            class="jOveragePay-cnt-item-total-btn"
          >余额不足，去充值</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import {
  mapGetters, mapMutations
} from 'vuex';
import {
  USER
} from '../../store/mutationsTypes';

export default {
  name: 'JOveragePay',
  props: {
    // 付款方信息
    payerMoneyList: {
      type: Array,
      default: () => []
    },
  },
  created() {
    console.log(this.payerMoneyList);
  },
  watch: {
    payerMoneyList() {
      console.log(this.payerMoneyList);
    }
  },
  computed: {
    ...mapGetters({
      saleInfo: USER.GET_SALE,
      defaultSendToInf: USER.GET_DEFAULT_SEND_TO
    }),
    compareMoney() {
      return (val1, val2) => (parseFloat(val1) < parseFloat(val2));
    },
    toFixedNum() {
      return function (val) {
        return (Number(val)).toFixed(2);
      };
    }
  },
  methods: {
  },
};
</script>

<style lang="scss">
  .jOveragePay-wrap {
    padding: 24px 0 24px 24px;
    background: #fff;
    box-shadow:0 4px 8px 0 rgba(0,0,0,0.15);
    border-radius:20px;
  }

  .jOveragePay-wrap-head {
    border-bottom: 1px solid #D9D9D9;
    padding-bottom: 24px;
    padding-right: 24px;
    line-height: 40px;
    font-size: 28px;
  }

  .jOveragePay-wrap-head-icon {
    font-size: 36px;
    color: $theme-color;
  }

  .jOveragePay-cnt {
    padding-right: 24px;
  }

  .jOveragePay-cnt-item {
    padding-top: 30px;
    padding-bottom: 30px;
    padding-right: 24px;
    border-bottom: 1px solid #D9D9D9;
  }

  .jOveragePay-cnt-item {

  }

  .jOveragePay-cnt-item-head {
    color: #666;
    font-size: 24px;
    padding-left: 8px;
  }

  .jOveragePay-cnt-item-head-dot {
    flex-shrink: 0;
    width: 8px;
    height: 8px;
    border-radius: 8px;
    background: $theme-color;
    margin-right: 24px;
  }

  .jOveragePay-cnt-item-total{
    margin-top: 12px;
    margin-bottom: 2px;
    padding-left: 36px;
    flex-wrap: wrap;
  }

  .jOveragePay-cnt-item-total-text {
    font-size: 20px;
    line-height: 28px;
    color: #999;
  }

  .jOveragePay-cnt-item-total-price {
    font-size: 32px;
    line-height: 44px;
    color: $theme-color;
  }

  .jOveragePay-cnt-item-total-item-line{
    width: 1px;
    height: 40px;
    background: #E4E4E4;
    margin-left: 18px;
    margin-right: 18px;
  }

  .jOveragePay-cnt-item-total-btn{
    align-self: flex-end;
    display: inline-block;
    color: #fff;
    background: $theme-color;
    font-size: 20px;
    padding-left: 10px;
    padding-right: 10px;
    height: 40px;
    line-height: 40px;
    border-radius: 24px;
    margin-left: auto;
  }
</style>
