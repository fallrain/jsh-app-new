<template>
  <view class="mycrescr-bg">
    <view class="mycrescr-row">
      <view class="mycrescr-row-left">银行</view>
      <image class="mycrescr-row-right" :src="down2" @click="opentag" />
    </view>
    <view class="mycrescr-tag-box">
      <view class="mycrescr-tag" v-for="(item, index) in tagarr2" :key="index">
        <view v-if="clickindex === index" class="mycrescr-tagsty2">
          <view class="mycrescr-tagtext2">{{ item }}</view>
        </view>
        <view v-else class="mycrescr-tagsty" @click="switchindex(index)">
          <view class="mycrescr-tagtext">{{ item }}</view>
        </view>
      </view>
    </view>
    <view class="mycrescr-row2">
      <view class="mycrescr-row-left">融资模式</view>
      <image class="mycrescr-row-right" :src="down2" @click="opentag" />
    </view>
    <view class="mycrescr-tag-box">
      <view class="mycrescr-tag" v-for="(item, index) in tagarr2" :key="index">
        <view v-if="clickindex2 === index" class="mycrescr-tagsty2">
          <view class="mycrescr-tagtext2">{{ item }}</view>
        </view>
        <view v-else class="mycrescr-tagsty" @click="switchindex2(index)">
          <view class="mycrescr-tagtext">{{ item }}</view>
        </view>
      </view>
    </view>
    <view class="mycrescr-row3">
      <view class="mycrescr-row3-left">
        <view class="mycrescr-row3-text">确定</view>
      </view>
      <view class="mycrescr-row3-right">
        <view class="mycrescr-row3-text2">重置</view>
      </view>
    </view>
  </view>
</template>

<script>
import down2 from '../../assets/img/bankacceptance/down2.png';

export default {
  data() {
    return {
      down2,
      tagarr: [
        '建设银行',
        '浦发银行',
        '中国银行',
        '兴业银行',
        '工商银行',
        '交通银行',
        '华夏银行',
        '青岛银行',
        '农业银行',
        '建设银行',
        '浦发银行',
        '中国银行',
        '兴业银行',
        '工商银行',
        '交通银行',
        '华夏银行',
        '青岛银行'
      ],
      tagarr2: [],
      clickindex: 1,
      clickindex2: 1
    };
  },

  methods: {
    gettargrr() {
      this.tagarr2 = this.tagarr.slice(0, 9);
      console.log(this.tagarr2);
      console.log(this.tagarr);
    },
    switchindex(a) {
      this.clickindex = a;
    },
    switchindex2(a) {
      this.clickindex2 = a;
    }
  },
  created() {
    this.gettargrr();
  }
};
</script>

<style>
.mycrescr-bg {
  width: 608px;
  height: 1508px;
  background: #ffffff;
  padding-top: 96px;
}
.mycrescr-row {
  margin-left: 32px;
  display: flex;
}
.mycrescr-row2 {
  margin-left: 28px;
  display: flex;
}
.mycrescr-row3 {
  margin-left: 210px;
  display: flex;
}
.mycrescr-row3-left {
  width: 184px;
  height: 66px;
  background: #2283e2;
  border-radius: 33px 0px 0px 33px;
}
.mycrescr-row3-right {
  margin-left: -2px;
  width: 184px;
  height: 66px;
  background: #f7f7f8;
  border-radius: 0px 33px 33px 0px;
}
.mycrescr-row3-text {
  margin-left: 68px;
  margin-top: 16px;
  height: 34px;
  font-size: 24px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #ffffff;
  line-height: 34px;
}
.mycrescr-row3-text2 {
  margin-left: 70px;
  margin-top: 16px;
  height: 34px;
  font-size: 24px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #666666;
  line-height: 34px;
}
.mycrescr-row-left {
  height: 42px;
  font-size: 30px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #333333;
  line-height: 42px;
}
.mycrescr-row-right {
  margin-top: 6px;
  margin-right: 32px;
  margin-left: auto;
  width: 32px;
  height: 32px;
}
.mycrescr-tag-box {
  margin: 18px 0 28px 32px;
  width: 576px;
  display: flex;
  flex-wrap: wrap;
}
.mycrescr-tag {
  margin-right: 32px;
  margin-bottom: 32px;
}
.mycrescr-tagsty {
  width: 160px;
  background: #f7f7f8;
  height: 52px;
  border-radius: 26px;
  display: flex;
}
.mycrescr-tagsty2 {
  width: 160px;
  background: #ecf6ff;
  height: 52px;
  border-radius: 26px;
  display: flex;
}
.mycrescr-tagtext {
  margin-left: 32px;
  margin-top: 10px;
  height: 34px;
  font-size: 24px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #666666;
  line-height: 34px;
}
.mycrescr-tagtext2 {
  margin-left: 32px;
  margin-top: 10px;
  height: 34px;
  font-size: 24px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #2283e2;
  line-height: 34px;
}
</style>
