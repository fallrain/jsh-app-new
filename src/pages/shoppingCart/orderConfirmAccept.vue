<template>
  <view class="order-confirm-accept">
    <view
      :class="['bg-style',primaryTheme&&'bg-primary']"
      class=""></view>
    <view class="order-accept-head">
      <view class="order-accept-title">
        <i class="iconfont iconshijian"></i>
        订单已批量受理
      </view>
      <view class="order-accept-head-result">
        <view class="order-accept-result-count">
          <view class="w200 text-center">
            <view
              :class="['fs60 text-theme', primaryTheme&&'text-primary']"
              >{{successNum}}</view>
            <view class="fs24 text-666">成功</view>
          </view>
          <view class="w200 text-center">
            <view
              :class="['fs60 text-theme', primaryTheme&&'text-primary']">
              {{failNum}}
            </view>
            <view class="fs24 text-666">失败</view>
          </view>
          <view class="w200 text-center">
            <view
              :class="['fs60 text-theme', primaryTheme&&'text-primary']">
              {{total}}</view>
            <view class="fs24 text-666">合计</view>
          </view>
        </view>
        <view v-if="status === 1" class="order-btn">
          <button @tap="goBackIndex" class="order-btn-back">返回首页</button>
          <button @tap="continueShopping" class="order-btn-goon">继续购物</button>
        </view>
        <view v-if="status === 3" class="order-btn">
          <button @tap="goBackIndex" class="order-btn-back br-primary text-primary">返回首页</button>
          <button @tap="continueShopping" class="order-btn-goon bg-primary">继续购物</button>
        </view>
        <view v-if="status === 2" class="order-btn">
          <button @tap="goBackIndex" class="order-btn-back br-primary text-primary">返回首页</button>
          <button @tap="continueWholeCar" class="order-btn-goon bg-primary">再来一车</button>
        </view>
      </view>
    </view>
    <view v-if="status === 1" class="order-accept-orderlist">
      <j-order-accept-item
        v-for="(item, index) in orderData"
        @orderDetail="orderDetail"
        :orderItem="item"
        :index="index"
        :key="index"
        :status="status"
      >
      </j-order-accept-item>
    </view>
    <view
      v-if="status === 2" class="order-accept-orderlist">
      <j-order-accept-item
        v-for="(item, index) in wholeorderData"
        @orderDetail="orderDetail"
        :orderItem="item"
        :index="index"
        :key="index"
        :status="status"
      >
      </j-order-accept-item>
    </view>
    <view
      v-if="status === 3" class="order-accept-orderlist">
      <j-order-accept-item-ypj
        v-for="(item, index) in wholeorderData"
        :totalMoney="totalMoney"
        :orderItem="item"
        :index="index"
        :key="index"
        :status="status"
      >
      </j-order-accept-item-ypj>
    </view>
  </view>
</template>

<script>
import JOrderAcceptItem from '../../components/shoppingCart/JOrderAcceptItem';
import JOrderAcceptItemYpj from '../../components/shoppingCart/JOrderAcceptItemYpj';
import './css/orderConfirmAccept.scss';

export default {
  name: 'orderConfirmAccept',
  components: {
    JOrderAcceptItem,
    JOrderAcceptItemYpj
  },
  data() {
    return {
      primaryTheme: false,
      status: 1, // 1 购物车、套餐、组合 2 调货
      seqList: '', // 调货购物车下单成功后 订单号
      total: 0,
      successNum: 0,
      failNum: 0,
      orderData: [
      ],
      wholeorderData: [], // 调货数据列表 样品机数据列表
      form: []
    };
  },
  created() {
  },
  onLoad(option) {
    debugger;
    if (option.groupings) {
      this.status = 1;
      this.primaryTheme = false;
      this.form = JSON.parse(option.groupings);
      this.getOrderInfo();
    }
    if (option.seqList) {
      // 调货购物车下单成功之后
      this.status = 2;
      this.primaryTheme = true;
      this.seqList = option.seqList;
      this.wholeorderData = JSON.parse(option.orderData);
      console.log(this.wholeorderData);
      // 处理成功失败数量
      this.computeWholeOrderNum();
    }
    if (option.totalMoney) {
      // 样品机下单成功后结算跳转
      this.status = 3;
      this.primaryTheme = true;
      this.wholeorderData = JSON.parse(option.orderData)[0].orderList;
      this.totalMoney = JSON.parse(option.totalMoney);
      console.log(this.wholeorderData);

      // 处理成功失败数量
      this.computeSampleMachineOrderNum();
    }
  },
  methods: {
    // 获取订单信息
    async getOrderInfo() {
      /* const form = [
        {
          groupingNo: '20200824180216294530'
        }
      ]; */
      const { code, data } = await this.orderService.getOrderInfo(this.form);
      if (code === '1') {
        data.forEach((item) => {
          item.bigOrderDetailList.forEach((v) => {
            if (v.errorMsg && v.errorMsg.indexOf('org.spring') > -1) {
              const index = v.errorMsg.indexOf('org.spring');
              v.errorMsg = v.errorMsg.slice(0, index);
            }
          });
        });
        this.orderData = data;
        // 处理成功失败数量
        this.computeOrderNum();
      }
    },
    // 统计订单成功失败数量
    computeOrderNum() {
      let successNum = 0;
      let failNum = 0;
      this.orderData.forEach((item) => {
        item.bigOrderDetailList.forEach((v) => {
          if (v.status !== '9') {
            // 失败订单
            failNum++;
          } else {
            successNum++;
          }
        });
      });
      this.successNum = successNum;
      this.failNum = failNum;
      this.total = successNum + failNum;
    },
    // 统计整车订单成功失败数量
    computeWholeOrderNum() {
      let successNum = 0;
      let failNum = 0;
      this.wholeorderData.forEach((item) => {
        item.orderList.forEach((v) => {
          if (v.ISFLAG !== '提交成功') {
            failNum++;
          } else {
            successNum++;
          }
        });
      });
      this.failNum = failNum;
      this.successNum = successNum;
      this.total = this.failNum + this.successNum;
    },
    // 统计样品机订单成功失败数量
    computeSampleMachineOrderNum() {
      let successNum = 0;
      let failNum = 0;
      this.wholeorderData.forEach((item) => {
        if (item.ISFLAG !== '提交成功') {
          failNum++;
        } else {
          successNum++;
        }
      });
      this.failNum = failNum;
      this.successNum = successNum;
      this.total = this.failNum + this.successNum;
    },
    // 订单详情
    orderDetail(orderGroup) {
      console.log(orderGroup);
      const data = JSON.stringify(orderGroup);
      uni.navigateTo({
        url: `/pages/shoppingCart/orderConfirmAcceptDetail?orderGroup=${data}&status=${this.status}`
      });
    },
    // 返回首页
    goBackIndex() {
      uni.switchTab({
        url: '/pages/index/index'
      });
    },
    // 继续购物
    continueShopping() {
      if (this.status === 1) {
        uni.navigateTo({
          url: '/pages/goods/goodsList'
        });
      } else {
        uni.navigateTo({
          url: '/pages/sampleMachine/sampleMachineList'
        });
      }
    },
    // 再来一车
    continueWholeCar() {
      uni.navigateTo({
        url: '/pages/transferGoods/transferGoods'
      });
    },
  }
};
</script>

<style scoped>

</style>
