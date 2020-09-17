<template>
  <view class="conoffeeded-bg">
    <view class="conoffeeded-box">
      <view class="conoffeeded-row">POS刷卡手续费扣费确认函</view>
      <view class="conoffeeded-row-bg"></view>
      <view class="conoffeeded-text">
        <view class="conoffeeded-text-1"
          >重庆新日日顺家电销售有限公司青岛分公司 :
          <image class="conoffeeded-right2" :src="img1" />
        </view>
        <view class="conoffeeded-text-space"
          >根据国家发展委员会及中国人民银行—发改价格相关文件规定：贷记卡交易按交易金额
          的千分之六收取手续费，且不封顶；我公司同意在
          <text class="conoffeeded-text-underline">2020年 08月 17日</text
          >至<view class="conoffeeded-text3"
            >请选择时间 <image class="conoffeeded-text3-right" :src="img2"
          /></view>
          <view class="conoffeeded-text-2">
            期间，凡以POS刷卡贷记卡交易方式支付给贵公司的货款，每次刷卡超过信用卡刷卡额
            度（我公司同意贵公司制定的信用卡刷卡额度规则，并认可贵公司设定的信用卡刷卡额度）
            的部分我公司同意贵公司每笔扣除 “超过信用卡刷卡额度部分的千分之三”
            作为POS手
            续费，若因此出现任何法律纠纷，我公司承担全部法律责任。</view
          >
          <view class="conoffeeded-text-1textsty">
            注：若刷信用卡超过额度，POS机会提示超限，是否继续刷卡，点击是将视同同意承担手续费。</view
          >
        </view>
      </view>
      <view class="conoffeeded-row2">
        <view class="conoffeeded-text2">公章：</view>
        <image class="conoffeeded-right" :src="img1" />
      </view>
      <view class="conoffeeded-row-select">请选择公司名称</view>
      <view class="conoffeeded-row3"
        ><view class="conoffeeded-text2">时间：</view>
        <image class="conoffeeded-right" :src="img1"
      /></view>
      <view class="conoffeeded-row-select">请选择时间</view>
    </view>
    <view class="conoffeeded-button">
      <view class="conoffeeded-button-title">发送申请</view>
    </view>
  </view>
</template>

<script>
import './css/conoffeeded.scss';
import img1 from '../../assets/img/bankacceptance/right.png';
import img2 from '../../assets/img/bankacceptance/down2.png';

export default {
  data() {
    return {
      img1,
      img2
    };
  }
};
</script>

<style></style>
