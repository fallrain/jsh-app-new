<template>
  <view class="finordinq-bg">
    <view class="finordinq-row">
      <view class="finordinq-row-left" @click="openscr">筛选</view>
      <image class="finordinq-row-right" :src="img1" />
    </view>
    <view class="finordinq-box">
      <view class="finordinq-text">
        <view class="finordinq-color">订单编号：21747682314</view>
      </view>
      <view class="finordinq-space">
        <view class="finordinq-line"></view>
      </view>
      <view
        class="finordinq-space2"
        v-for="(item, index) in finordinqlist"
        :key="index"
      >
        <view class="finordinq-row">
          <view class="finordinq-text">
            <view class="finordinq-color2">{{ item.left }}</view>
          </view>
          <view class="finordinq-box-right">
            <view class="finordinq-text">
              <view class="finordinq-color3">{{ item.right }}</view>
            </view>
          </view>
        </view>
      </view>
      <view class="finordinq-space">
        <view class="finordinq-row">
          <view class="finordinq-button">
            <view class="finordinq-buttontext">赎货申请</view>
          </view>
          <view class="finordinq-button2">
            <view class="finordinq-buttontext2">详细信息</view>
          </view>
          <view class="finordinq-button3">
            <view class="finordinq-buttontext3">查看</view>
          </view>
        </view>
      </view>
    </view>
    <uni-popup ref="popright" type="right">
      <finordinq-scr></finordinq-scr>
    </uni-popup>
  </view>
</template>

<script>
import './css/finordinq.scss';
import img1 from '../../assets/img/bankacceptance/screening.png';
import {
 uniPopup 
} from '@dcloudio/uni-ui';
import finordinqScr from './JFinancingOrderInquiryScreening';

export default {
  data() {
    return {
      img1,
      finordinqlist: [
        { left: '银行：', right: '浦发银行' },
        { left: '收货地址：', right: '山东省青岛市市北区南宁路14号' },
        { left: '入库时间：', right: '2020-08-12' },
        { left: '库位：', right: '即墨' },
        { left: '是否套餐：', right: '是' },
        { left: '物流单号：', right: '0088398585' },
        { left: '订单时间：', right: '2020-08-12' },
        { left: '订单金额：', right: '¥ 23456.78' },
        { left: '订单状态：', right: '已赎货' }
      ]
    };
  },
  methods: {
    openscr() {
      this.$refs.popright.open();
    }
  },
  components: {
    uniPopup,
    finordinqScr
  }
};
</script>

<style></style>
