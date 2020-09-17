<template>
  <view class="finbinbanerr-bg">
    <image class="finbinbanerr-img" :src="img1" />
    <view class="finbinbanerr-text1">友情提示</view>
    <view class="finbinbanerr-text2">
      <br />
      尊敬的经销商：<br />
      您好，您还没有绑定银行，点击下方按钮绑定银行之后再进行融资充值！</view
    >
    <view class="finbinbanerr-button">
      <view class="finbinbanerr-buttontext">绑定银行</view>
    </view>
  </view>
</template>

<script>
import './css/finbinbanerr.scss';
import img1 from '../../assets/img/bankacceptance/cancel.png';

export default {
  data() {
    return {
      img1
    };
  }
};
</script>

<style></style>
