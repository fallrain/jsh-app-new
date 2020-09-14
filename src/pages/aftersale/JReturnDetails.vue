<template>
  <view class="retdet-bg">
    <view class="retdet-box">
      <view class="retdet-row1">
        <view class="retdet-row1-title">报修情况</view>
        <view class="retdet-row1-bg"></view>
      </view>
      <view class="retdet-row">
        <view class="retdet-row-left">客户姓名：</view>
        <view class="retdet-row-right">张三</view>
      </view>
      <view class="retdet-row">
        <view class="retdet-row-left2">联系电话：</view>
        <view class="retdet-row-right2">13909897696</view>
      </view>
      <view class="retdet-row">
        <view class="retdet-row-left3">分类：</view>
        <view class="retdet-row-right2">自有渠道</view>
      </view>
      <view class="retdet-row">
        <view class="retdet-row-left2">机器编码：</view>
        <view class="retdet-row-right2">DH1X50A1101D9BG4600</view>
      </view>
      <view class="retdet-row">
        <view class="retdet-row-left4">付款方：</view>
        <view class="retdet-row-right2">(日日顺)(增)绥中县天宠商场</view>
      </view>
      <view class="retdet-row">
        <view class="retdet-row-left2">明细地址：</view>
        <view class="retdet-row-right2">辽宁省辽宁事绥中县中央路2段13号</view>
      </view>
      <view class="retdet-line"></view>
      <view class="retdet-row2">产品故障描述：</view>
      <view class="retdet-row3">用户反映机器冷冻门门封变形</view>
    </view>
    <view class="retdet-box2">
      <view class="retdet-row1">
        <view class="retdet-row1-title">派工状态</view>
        <view class="retdet-row1-bg"></view>
      </view>
      <view class="retdet-waterline-box">
        <view class="retdet-watlin-left">已抢单</view>
        <view class="retdet-watlin-center">
          <view class="retdet-watlin-img">
            <image src="../../assets/img/afterSale/complate.png" />
          </view>
          <view class="retdet-watlin-line"></view>
        </view>
        <view class="retdet-watlin-right">
          <view class="retdet-watlinrig-title">
            2019-04-29 已经退款
            <br />发票号：9304150912 <br />发票日期：2019-04-29
            <br />发票日期：2019-04-29 <br />发票日期：2019-04-29
            <br />发票日期：2019-04-29
          </view>
        </view>
      </view>
      <view class="retdet-waterline-box2">
        <view class="retdet-watlin-left2">已完成</view>
        <view class="retdet-watlin-center">
          <view class="retdet-watlin-img">
            <image src="../../assets/img/afterSale/complatenot.png" />
          </view>
          <view class="retdet-watlin-line"></view>
        </view>
        <view class="retdet-watlin-right">
          <view class="retdet-watlinrig-title">
            2019-04-29 已经退款
            <br />发票号：9304150912 <br />发票日期：2019-04-29
          </view>
        </view>
      </view>
      <view v-if="indexx == 3" class="retdet-waterline-box2">
        <view class="retdet-watlin-left2">已完成</view>
        <view class="retdet-watlin-center">
          <view class="retdet-watlin-img">
            <image src="../../assets/img/afterSale/complatenot.png" />
          </view>
          <!-- <view class="retdet-watlin-retdet-line"></view> -->
        </view>
        <view class="retdet-watlin-right">
          <view class="retdet-watlinrig-title">
            2019-04-29 已经退款
            <br />发票号：9304150912 <br />发票日期：2019-04-29
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import './css/returndetails.scss';

export default {
  data() {
    return {
      indexx: 3
    };
  }
};
</script>

<style></style>
