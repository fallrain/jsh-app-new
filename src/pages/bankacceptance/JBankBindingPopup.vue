<template>
  <view class="banbinpop-bg">
    <view class="banbinpop-row1">
      <view class="banbinpop-row1-left">选择银行</view>
      <view class="banbinpop-row1-right">x</view>
    </view>
    <view class="banbinpop-row-space">
      <view
        class="banbinpop-row2"
        v-for="(item, index) in bank"
        :key="item"
        @click="choose(index)"
      >
        <view v-if="clickswitch === index" class="banbinpop-row2-left">
          <view class="banbinpop-color">{{ item }}</view>
        </view>
        <image
          v-if="clickswitch === index"
          :src="img1"
          class="banbinpop-row2-right"
        />
        <view v-else class="banbinpop-row2-left">
          <view class="banbinpop-color2">{{ item }}</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import img1 from '../../assets/img/bankacceptance/tick.png';

export default {
  data() {
    return {
      img1,
      clickswitch: 0,
      bank: [
        '中国农业银行',
        '中国银行',
        '中国工商银行',
        '中国建设银行',
        '兴业银行',
        '交通银行'
      ]
    };
  },
  methods: {
    choose(a) {
      this.clickswitch = a;
    }
  }
};
</script>

<style>
.banbinpop-bg {
  width: 750px;
  background: #ffffff;
  padding-top: 24px;
}
.banbinpop-row1 {
  margin-left: 40px;
  display: flex;
}
.banbinpop-row1-left {
  margin-top: 2px;
  height: 42px;
  font-size: 30px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #333333;
  line-height: 42px;
}
.banbinpop-row1-right {
  margin-left: auto;
  margin-right: 40px;
  height: 44px;
  font-size: 32px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #2283e2;
  line-height: 44px;
}
.banbinpop-row-space {
  margin-top: 46px;
}
.banbinpop-row2 {
  display: flex;
  margin-left: 52px;
  border-bottom: 4px solid #e9e9e9;
}
.banbinpop-row2-left {
  margin-top: 22px;
  margin-left: 4px;
  margin-bottom: 24px;
  height: 48px;
  font-size: 28px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  line-height: 48px;
}
.banbinpop-row2-right {
  margin-top: 32px;
  margin-left: auto;
  margin-right: 52px;
  width: 28px;
  height: 27px;
}
.banbinpop-color {
  color: #2283e2;
}
.banbinpop-color2 {
  color: #666666;
}
</style>
