<template>
  <view class="retgooque-bg">
    <view class="retgooque-top">
      <view class="retgooque-top-left">
        <view class="retgooque-top-left-title">鉴定结果</view>
        <image class="retgooque-image1" src="../../assets/img/afterSale/3.png" />
      </view>
      <view class="retgooque-top-right">
        <view class="retgooque-top-right-title" @click="open1">筛选</view>
        <image class="retgooque-image1" src="../../assets/img/afterSale/3.png" />
      </view>
    </view>
    <view class="retgooque-box">
      <view class="retgooque-center">
        <view class="retgooque-center-row1">报修单号：21747682314</view>
        <view class="retgooque-center-row2">派工单编号：SCFPJR1904525301J</view>
        <view class="retgooque-center-solid"></view>
        <view class="retgooque-center-row3">
          <view class="retgooque-center-left">商品编码</view>
          <view class="retgooque-center-right">BJ0VN009N</view>
        </view>
        <view class="retgooque-center-row4">
          <view class="retgooque-center-left">产品型号</view>
          <view class="retgooque-center-right">ES60H-P3</view>
        </view>
        <view class="retgooque-center-row4">
          <view class="retgooque-center-left">用户名</view>
          <view class="retgooque-center-right">刘玉德</view>
        </view>
        <view class="retgooque-center-row4">
          <view class="retgooque-center-left">保修时间</view>
          <view class="retgooque-center-right">2019-04-25 11:59:08</view>
        </view>
        <view class="retgooque-center-solid"></view>
        <view class="retgooque-center-row4">
          <view class="retgooque-center-left">
            保修状态:
            <view class="retgooque-center-in">已接受</view>
          </view>

          <view class="retgooque-center-right">
            处理状态:
            <view class="retgooque-center-in">处理完成</view>
          </view>
        </view>
        <view class="retgooque-center-bottom">
          鉴定结果:
          <view class="retgooque-center-in"
            >无机器无机器无机器无机器无机器无机器无机器无机器无机器</view
          >
        </view>
        <view class="retgooque-center-solid2"></view>
        <view class="retgooque-center-row5">
          <view class="retgooque-button-right2" @click="tourl">
            <view class="retgooque-button-title">查看</view>
          </view>
        </view>
      </view>
    </view>
    <view class="retgooque-box">
      <view class="retgooque-center">
        <view class="retgooque-center-row1">报修单号：21747682314</view>
        <view class="retgooque-center-row2">派工单编号：SCFPJR1904525301J</view>
        <view class="retgooque-center-solid"></view>
        <view class="retgooque-center-row3">
          <view class="retgooque-center-left">商品编码</view>
          <view class="retgooque-center-right">BJ0VN009N</view>
        </view>
        <view class="retgooque-center-row4">
          <view class="retgooque-center-left">产品型号</view>
          <view class="retgooque-center-right">ES60H-P3</view>
        </view>
        <view class="retgooque-center-row4">
          <view class="retgooque-center-left">报修时间</view>
          <view class="retgooque-center-right">2019-04-25 11:59:08</view>
        </view>
        <view class="retgooque-center-row4">
          <view class="retgooque-center-left">来源</view>
          <view class="retgooque-center-right">365RRS</view>
        </view>
        <view class="retgooque-center-solid"></view>
        <view class="retgooque-center-row4">
          <view class="retgooque-center-left">
            保修状态:
            <view class="retgooque-center-in">已接受</view>
          </view>

          <view class="retgooque-center-right">
            处理状态:
            <view class="retgooque-center-in">处理完成</view>
          </view>
        </view>
        <view class="retgooque-center-bottom">
          鉴定结果:
          <view class="retgooque-center-in"
            >无机器无机器无机器无机器无机器无机器无机器无机器无机器</view
          >
        </view>
        <view class="retgooque-center-solid2"></view>
        <view class="retgooque-center-row5">
          <view class="retgooque-button-right2">
            <view class="retgooque-button-title">查看</view>
          </view>
        </view>
      </view>
    </view>
    <uni-popup ref="popleft" type="right">
      <Whebuywhescreening></Whebuywhescreening>
    </uni-popup>
  </view>
</template>

<script>
import './css/returngoodsquery.scss';
import Whebuywhescreening from './WhebuywheScreening';

import {
 uniPopup
} from '@dcloudio/uni-ui'
;
export default {
  data() {
    return {

    };
  },
  methods: {
    open1() {
      this.$refs.popleft.open();
    },
    tourl() {
      uni.navigateTo({
        url: '/pages/aftersale/JWhereBuyReturnDetails'
      });
    }
  },
  components: {
    uniPopup,
    Whebuywhescreening
  }
};
</script>

<style></style>
