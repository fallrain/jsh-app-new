<template>
  <view class="WheBuyWheScr-bg">
    <view class="WheBuyWheScr-row1">产品型号</view>
    <input class="WheBuyWheScr-input" />
    <view class="WheBuyWheScr-allbox">
      <view class="WheBuyWheScr-row2">产品组</view>
      <image class="WheBuyWheScr-img" src="../../assets/img/afterSale/3.png" />
    </view>
    <view class="WheBuyWheScr-box" v-for="(item, index) in a2" :key="index">
      <view
        class="WheBuyWheScr-tag"
        v-for="(item2, index) in item"
        :key="index"
      >
        <view class="WheBuyWheScr-title">{{ item2 }}</view>
      </view>
    </view>

    <view class="WheBuyWheScr-row3">处理状态</view>
    <view class="WheBuyWheScr-box">
      <view class="WheBuyWheScr-tag" v-for="item in a4" :key="item">
        <view class="WheBuyWheScr-title">{{ item }}</view>
      </view>
    </view>
    <view class="WheBuyWheScr-row3">选择时间</view>
    <view class="WheBuyWheScr-box">
      <view class="WheBuyWheScr-tag" v-for="item in a5" :key="item">
        <view class="WheBuyWheScr-title">{{ item }}</view>
      </view>
    </view>
    <view class="WheBuyWheScr-row3">选择时间</view>
    <view class="dateinput">
      <view class="dateinput-title">开始时间</view>
      <view class="dateinput-center">至</view>
      <view class="dateinput-title">结束时间</view>
    </view>
    <view class="button">
      <view class="button-left">
        <view class="button-ltitle">确定</view>
      </view>
      <view class="button-right">
        <view class="button-rtitle">重置</view>
      </view>
    </view>
  </view>
</template>

<script>

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
      a5: ['最近3天', '最近20天', '用户自定义']
    };
  }
};
</script>

<style>
.WheBuyWheScr-bg {
  width: 608px;
  height: 1624px;
  background: rgba(255, 255, 255, 1);
  display: flex;
  flex-direction: column;
}
.WheBuyWheScr-row1 {
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
.WheBuyWheScr-input {
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
.WheBuyWheScr-row2 {
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
.WheBuyWheScr-row3 {
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
.WheBuyWheScr-img {
  margin-left: auto;
  margin-top: 57px;
  margin-right: 32px;
  width: 32px;
  height: 32px;
}
.WheBuyWheScr-allbox {
  display: flex;
}
.WheBuyWheScr-box {
  display: flex;
  width: 544px;
}
.WheBuyWheScr-tag {
  margin-left: 32px;
  margin-top: 24px;
  margin-bottom: 8px;
  width: 160px;
  height: 53px;
  background: rgba(247, 247, 248, 1);
  border-radius: 26px;
}
.WheBuyWheScr-title {
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
.button {
  margin-left: 210px;
  margin-top: 80px;
  width: 366px;
  height: 66px;
  background: rgba(247, 247, 248, 1);
  border-radius: 33px;
  display: flex;
}
.button-left {
  width: 184px;
  height: 66px;
  background: rgba(34, 131, 226, 1);
  border-radius: 33px 0px 0px 33px;
  display: flex;
}
.button-right {
  width: 184px;
  height: 66px;
  display: flex;
}
.button-ltitle {
  margin-left: 68px;
  margin-top: 16px;
  width: 48px;
  height: 34px;
  font-size: 24px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(255, 255, 255, 1);
  line-height: 34px;
}
.button-rtitle {
  margin-left: 70px;
  margin-top: 16px;
  width: 48px;
  height: 34px;
  font-size: 24px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(102, 102, 102, 1);
  line-height: 34px;
}
</style>
