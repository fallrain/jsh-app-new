<template>
  <view class="banbin-bg">
    <view class="banbin-box">
      <view class="banbin-row">
        <view class="banbin-row-left">绑定银行</view>
        <view class="banbin-row-right" @click="openpop">请选择绑定银行</view>
        <image class="banbin-row-righticon" :src="img1" />
      </view>
    </view>
    <view class="banbin-button">
      <view class="banbin-button-title">取消绑定</view>
    </view>
    <uni-popup ref="popup" type="bottom">
      <banbin-pop></banbin-pop>
    </uni-popup>
  </view>
</template>

<script>
import './css/banbin.scss';
import img1 from '../../assets/img/bankacceptance/right.png';
import {
 uniPopup 
} from '@dcloudio/uni-ui';
import banbinPop from './JBankBindingPopup';

export default {
  data() {
    return {
      img1
    };
  },
  components: {
    uniPopup,
    banbinPop
  },
  methods: {
    openpop() {
      this.$refs.popup.open();
    }
  }
};
</script>

<style></style>
