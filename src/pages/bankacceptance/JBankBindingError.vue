<template>
  <view class="banbinerr-bg">
    <image class="banbinerr-top" :src="img1" />
    <view class="banbinerr-text-row">友情提示</view>
    <view class="banbinerr-text-row2"
      >尊敬的经销商：<br />
      您好，没有可以绑定的银行, <br />请先确认是否有签约银行！</view
    >
    <view class="banbinerr-button"
      ><view class="banbinerr-button-title">返回</view></view
    >
  </view>
</template>

<script>
import './css/banbinerr.scss'
import img1 from '../../assets/img/bankacceptance/cancel.png'

export default {
  data() {
    return {
      img1
    }
  }
}
</script>

<style></style>
