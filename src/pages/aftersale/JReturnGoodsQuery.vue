<template>
  <view class="retgooque-bg">
    <view class="retgooque-top">
      <view class="retgooque-top-left">
        <view class="retgooque-top-left-title">鉴定结果</view>
        <image class="retgooque-image1" src="../../assets/img/afterSale/3.png" />
      </view>
      <view class="retgooque-top-right" @click="open1">
        <view class="retgooque-top-right-title">筛选</view>
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
          <view class="retgooque-button-left" @click="open">
            <view class="retgooque-button-title">评论</view>
          </view>
          <view class="retgooque-button-right" @click="tourl">
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
          <view class="retgooque-button-left">
            <view class="retgooque-button-title">评论</view>
          </view>
          <view class="retgooque-button-right">
            <view class="retgooque-button-title">查看</view>
          </view>
        </view>
      </view>
    </view>
    <uni-popup ref="popup" type="bottom">
      <comment @close="close"></comment>
    </uni-popup>
    <uni-popup ref="popleft" type="right">
      <screening></screening>
    </uni-popup>
  </view>
</template>

<script>
import './css/returngoodsquery.scss';
import comment from './Comment';
import screening from './Screening';
import {
  uniPopup
} from '@dcloudio/uni-ui';

export default {
  data() {
    return {

    };
  },
  methods: {
    open() {
      this.$refs.popup.open();
    },
    close() {
      this.$refs.popup.close();
    },
    open1() {
      this.$refs.popleft.open();
    },
    tourl() {
      uni.navigateTo({
        url: '/pages/aftersale/JReturnDetails'
      });
    }
  },
  components: {
    uniPopup,
    comment,
    screening
  }
};
</script>

<style></style>
