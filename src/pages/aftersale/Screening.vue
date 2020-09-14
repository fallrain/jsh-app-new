<template>
  <view class="scr-bg">
    <view class="scr-row1">产品型号</view>
    <input class="scr-input" />
    <view class="scr-row2">伞下店</view>
    <view class="scr-box">
      <view class="scr-tag" v-for="item in a1" :key="item">
        <view class="scr-title">{{ item }}</view>
      </view>
    </view>
    <view class="scr-allbox">
      <view class="scr-row3">产品组</view>
      <image class="scr-img" src="../../assets/img/afterSale/1.png" />
    </view>
    <view class="scr-box" v-for="(item, index) in a2" :key="index">
      <view class="scr-tag" v-for="(item2, index) in item" :key="index">
        <view class="scr-title">{{ item2 }}</view>
      </view>
    </view>
    <view class="scr-row3">鉴定结果</view>
    <view class="scr-box">
      <view class="scr-tag" v-for="item in a3" :key="item">
        <view class="scr-title">{{ item }}</view>
      </view>
    </view>
    <view class="scr-row3">处理状态</view>
    <view class="scr-box">
      <view class="scr-tag" v-for="item in a4" :key="item">
        <view class="scr-title">{{ item }}</view>
      </view>
    </view>
    <view class="scr-row3">选择时间</view>
    <view class="scr-box">
      <view class="scr-tag" v-for="item in a5" :key="item">
        <view class="scr-title">{{ item }}</view>
      </view>
    </view>
    <view class="scr-row3">选择时间</view>
    <view class="dateinput">
      <view class="dateinput-title">开始时间</view>
      <view class="dateinput-center">至</view>
      <view class="dateinput-title">结束时间</view>
    </view>
  </view>
</template>

<script>
import {
 uniCalendar
} from '@dcloudio/uni-ui';

export default {
  data() {
    return {
      a1: ['全部', '伞下店', '非伞下店'],
      a2: [
        ['冰箱', '洗衣机', '热水器'],
        ['电视机', '电脑', '厨房用品']
      ],
      a3: ['全部', '鉴定中', '鉴定完成'],
      a4: ['全部', '处理中', '处理完成'],
      a5: ['最近三天', '最近二十天', '用户自定义']
    };
  },
  components: {
    uniCalendar
  }
};
</script>

<style>
.scr-bg {
  width: 608px;
  height: 1624px;
  background: rgba(255, 255, 255, 1);
  display: flex;
  flex-direction: column;
}
.scr-row1 {
  margin-left: 32px;
  margin-top: 96px;
  width: 120px;
  height: 42px;
  font-size: 30px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
  line-height: 42px;
}
.scr-input {
  margin-left: 32px;
  margin-top: 24px;
  width: 532px;
  height: 61px;
  background: rgba(255, 255, 255, 1);
  border-radius: 30px;
  border: 2px solid rgba(219, 219, 219, 1);
  font-size: 30px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
  line-height: 42px;
  text-align: center;
}
.scr-row2 {
  margin-left: 32px;
  margin-top: 60px;
  width: 120px;
  height: 42px;
  font-size: 30px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
  line-height: 42px;
}
.scr-row3 {
  margin-left: 32px;
  margin-top: 52px;
  width: 120px;
  height: 42px;
  font-size: 30px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
  line-height: 42px;
}
.scr-img {
  margin-left: auto;
  margin-top: 57px;
  margin-right: 32px;
  width: 32px;
  height: 32px;
}
.scr-allbox {
  display: flex;
}
.scr-box {
  display: flex;
  width: 544px;
}
.scr-tag {
  margin-left: 32px;
  margin-top: 24px;
  margin-bottom: 8px;
  width: 160px;
  height: 53px;
  background: rgba(247, 247, 248, 1);
  border-radius: 26px;
}
.scr-title {
  text-align: center;
  margin-top: 10px;
  font-size: 24px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(102, 102, 102, 1);
  line-height: 34px;
}
.dateinput {
  margin-left: 28px;
  margin-top: 24px;
  width: 532px;
  height: 60px;
  background: rgba(255, 255, 255, 1);
  border-radius: 30px;
  border: 2px solid rgba(219, 219, 219, 1);
  display: flex;
}
.dateinput-title {
  margin: 14px 0 0 32px;
  width: 96px;
  height: 34px;
  font-size: 24px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(219, 219, 219, 1);
  line-height: 34px;
}
.dateinput-center {
  margin-left: 124px;
  margin-top: 8px;
  width: 30px;
  height: 42px;
  font-size: 30px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
  line-height: 42px;
}
</style>
