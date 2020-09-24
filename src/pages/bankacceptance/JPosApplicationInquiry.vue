<template>
  <view class="posappinq-bg">
    <view class="posappinq-row">订单号</view>
    <view class="posappinq-input-box">
      <input
        class="posappinq-input"
        placeholder="请输入产品名称"
        placeholder-class="posappinq-input-plahol"
        v-model="ordernumber"
      />
    </view>
    <view class="posappinq-row2">日期</view>
    <view class="posappinq-input-box">
      <view
        @click="opencalendar(1)"
        class="posappinq-row-left"
        v-if="startdatechild==='开始时间'"
      >{{startdatechild}}</view>
      <view @click="opencalendar(1)" class="posappinq-row-left2" v-else>{{startdatechild}}</view>
      <view class="posappinq-row-center">至</view>
      <view
        @click="opencalendar(2)"
        class="posappinq-row-right"
        v-if="enddatechild==='结束时间'"
      >{{enddatechild}}</view>
      <view @click="opencalendar(2)" class="posappinq-row-left2" v-else>{{enddatechild}}</view>
    </view>
    <view class="posappinq-button-box">
      <view class="posappinq-button-left">
        <view @click="posappinqconfirm(ordernumber)" class="posappinq-button-leftfont">确定</view>
      </view>
      <view class="posappinq-button-right">
        <view @click="posappinqreset" class="posappinq-button-rightfont">重置</view>
      </view>
    </view>
    <!-- <uni-calendar :insert="false" ref="calendar"></uni-calendar> -->
  </view>
</template>

<script>


export default {
  data() {
    return {
      ordernumber: ''
    };
  },
  methods: {
    opencalendar(a) {
      this.$emit('opencalendar', a);
    },
    posappinqconfirm(o) {
      this.$emit('posappinqconfirm', o);
    },
    posappinqreset() {
      this.ordernumber = '';
      this.$emit('posappinqreset');
    }
  },
  props: ['startdatechild', 'enddatechild'],
  components: {

  }
};
</script>

<style>
.posappinq-bg {
  width: 608px;
  height: 1496px;
  background: #ffffff;
  padding-top: 96px;
  padding-left: 32px;
}
.posappinq-row {
  height: 42px;
  font-size: 30px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #333333;
  line-height: 42px;
}
.posappinq-input-box {
  margin-top: 24px;
  width: 532px;
  height: 60px;
  background: #ffffff;
  border-radius: 30px;
  border: 2px solid #dbdbdb;
  display: flex;
}
.posappinq-input {
  margin-left: 32px;
  margin-top: 14px;
  height: 34px;
  font-size: 24px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  line-height: 34px;
}
.posappinq-input-plahol {
  color: #dbdbdb;
}
.posappinq-row2 {
  margin-top: 60px;
  width: 90px;
  height: 42px;
  font-size: 30px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #333333;
  line-height: 42px;
}
.posappinq-row-left {
  margin-left: 32px;
  margin-top: 12px;
  width: 220px;
  height: 34px;
  font-size: 24px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #dbdbdb;
  line-height: 34px;
}
.posappinq-row-left2 {
  margin-left: 32px;
  margin-top: 12px;
  width: 220px;
  height: 34px;
  font-size: 24px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  line-height: 34px;
}
.posappinq-row-center {
  margin-top: 6px;
  height: 42px;
  font-size: 30px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #333333;
  line-height: 42px;
}
.posappinq-row-right {
  margin-left: 32px;
  margin-top: 12px;
  height: 34px;
  font-size: 24px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #dbdbdb;
  line-height: 34px;
}
.posappinq-button-box {
  margin-left: 182px;
  margin-top: 60px;
  display: flex;
}
.posappinq-button-left {
  width: 184px;
  height: 66px;
  background: #2283e2;
  border-radius: 33px 0px 0px 33px;
  display: flex;
}
.posappinq-button-leftfont {
  margin-left: 68px;
  margin-top: 16px;
  height: 34px;
  font-size: 24px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #ffffff;
  line-height: 34px;
}
.posappinq-button-right {
  width: 184px;
  height: 66px;
  background: #f7f7f8;
  border-radius: 0px 33px 33px 0px;
}
.posappinq-button-rightfont {
  margin-left: 70px;
  margin-top: 16px;
  height: 34px;
  font-size: 24px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #666666;
  line-height: 34px;
}
</style>
