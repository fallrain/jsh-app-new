<template>
  <view class="mycre-bg">
    <view class="mycre-row" @click="openright">
      <view class="mycre-rowright">筛选</view>
      <image class="mycre-rowright-img" :src="img1" />
    </view>
    <view class="mycre-box">
      <view class="mycre-text">
        <view class="mycre-color">授信额度编号：21747682314</view>
      </view>
      <view class="mycre-space">
        <view class="mycre-text">
          <view class="mycre-color">授信银行：浦发银行</view>
        </view>
      </view>
      <view class="mycre-space2">
        <view class="mycre-line"> </view>
      </view>

      <view
        class="mycre-space3"
        v-for="(item, index) in tabledata"
        :key="index"
      >
        <view class="mycre-row">
          <view class="mycre-text">
            <view class="mycre-color2">{{ item.left }}</view>
          </view>
          <view class="mycre-row-righttext">
            <view class="mycre-text">
              <view class="mycre-color3">{{ item.right }}</view>
            </view>
          </view>
        </view>
      </view>
    </view>
    <uni-popup ref="popleft" type="right"
      ><mycredit-scr></mycredit-scr
    ></uni-popup>
  </view>
</template>

<script>
import './css/mycre.scss';
import img1 from '../../assets/img/bankacceptance/screening.png';
import {
 uniPopup 
} from '@dcloudio/uni-ui';
import mycreditScr from './JMyCreditScreening';

export default {
  data() {
    return {
      img1,
      tabledata: [
        { left: '额度合同开始日期：', right: 'BJ0VN009N' },
        { left: '额度合同结束日期：', right: 'ES60H-P3' },
        { left: '融资模式：', right: '刘玉德' },
        { left: '总额度：', right: '¥ 23234.34' },
        { left: '总敞口：', right: '-' },
        { left: '可用敞口：', right: '-' },
        { left: '可用额度：', right: '¥ 4555.22' }
      ]
    };
  },
  components: {
    uniPopup,
    mycreditScr
  },
  methods: {
    openright() {
      this.$refs.popleft.open();
    }
  }
};
</script>

<style></style>
