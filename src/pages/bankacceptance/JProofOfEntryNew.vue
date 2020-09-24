<template>
  <view class="proofentnew-bg">
    <view class="proofentnew-box">
      <view class="proofentnew-top">承兑入账证明</view>
      <view class="proofentnew-top-bg"></view>
      <view class="proofentnew-bottom">
        今我公司所办银行承兑汇票金额_____________
        <view class="proofentnew-input">请输入金额</view>
        <br />元，单号为：_____________________________，
        <view class="proofentnew-input2">请输入单号</view>
        <br />请将此笔款项入我公司____________________，
        <view class="proofentnew-input3">
          <view class="proofentnew-input3-title">请选择公司名称</view>
          <image :src="down2" class="proofentnew-input3-right" />
        </view>
        <br />敬请贵司财务协助办理，若因此产生的一切纠纷由我司承担。
        <br />特此证明！
      </view>
    </view>
    <view class="proofentnew-button">
      <view class="proofentnew-button-title">发送申请</view>
    </view>
  </view>
</template>

<script>
import './css/proofentnew.scss';
import down2 from '../../assets/img/bankacceptance/down2.png';

export default {
  data() {
    return {
      down2
    };
  }
};
</script>

<style>
</style>
