<template>
  <view :key="updateIndex" class="JOrderConfirmAcceptItem">
    <view class="item-head">
      <view
        class="item-head-left text-primary">
        {{index+1}}.订单信息
      </view>
      <!--<view
        @tap="orderDetail"
        class="text-primary item-head-right"
        >
        点击查看详情
      </view>-->
    </view>
    <view>
      <view class="item-content">
        样品机单号：{{orderItem.IBL_KORDERNO}}
      </view>
      <view class="item-content">
        产品名称：{{orderItem.IBL_INVSTD}}
      </view>
      <view class="item-content">
        数量：{{orderItem.IBL_NUM}}
      </view>
      <view class="item-content">
        小计：{{orderItem.IBL_SUMMONEY}}
      </view>
      <view class="item-content">
        下单时间：{{formateDate(orderItem.IBL_CREATETIME.time)}}
      </view>
      <view class="item-content">
        订单状态：{{orderItem.ISFLAG}}
      </view>
      <view v-if="orderItem.IBL_ERRORMESSAGE" class="item-content">
        失败原因：{{orderItem.IBL_ERRORMESSAGE}}
      </view>
    </view>
  </view>
</template>

<script>

export default {
  name: 'JOrderAcceptItemYpj',
  props: {
    status: {
      type: [String, Number]
    },
    // 单个订单
    orderItem: {
      type: Object,
      default: () => {}
    },
    // 索引
    index: {
      type: Number
    },
    // 付款方信息
    payInfoData: {
      type: Object,
      default: () => {}
    },
  },
  data() {
    return {
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
  onLoad() {
  },
  computed: {
    formateDate() {
      return value => this.jshUtil.formatDate(value);
    }
  },
  methods: {
    orderDetail() {
      this.$emit('orderDetail', this.orderItem);
    },
  }
};
</script>

<style lang="scss">
.JOrderConfirmAcceptItem{
  border-radius: 20px;
  background: #fff;
  padding: 24px;
  margin-bottom: 24px;
}
.item-head{
  padding-bottom: 14px;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  color: $theme-color;
  border-bottom: 1px solid #DBDBDB;
  .item-head-left{
    font-size: 30px;
  }
  .item-head-right{
    font-size: 24px;
  }
}
.item-content{
  line-height: 40px;
  font-size: 28px;
  color: #666;
  margin-bottom: 16px;
}
</style>
