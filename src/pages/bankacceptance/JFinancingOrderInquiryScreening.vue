<template>
  <view class="finordinqscr-bg">
    <view class="finordinqscr-title ">订单编号</view>
    <view class="finordinqscr-input-box">
      <input
        class="finordinqscr-input"
        placeholder-class="finordinqscr-input-plaholsty"
        placeholder="请输入订单编号"
      />
    </view>
    <view class="finordinqscr-space ">
      <view class="finordinqscr-title ">产品型号</view>
      <view class="finordinqscr-input-box"
        ><input
          class="finordinqscr-input"
          placeholder-class="finordinqscr-input-plaholsty"
          placeholder="请输入产品型号"
      /></view>
    </view>
    <view class="finordinqscr-space ">
      <view class="finordinqscr-title ">产品名称</view>
      <view class="finordinqscr-input-box"
        ><input
          class="finordinqscr-input"
          placeholder-class="finordinqscr-input-plaholsty"
          placeholder="请输入产品名称"
      /></view>
    </view>
    <view class="finordinqscr-space ">
      <view class="finordinqscr-title ">产品名称</view>
      <view class="finordinqscr-tag-box">
        <view
          class="finordinqscr-tag"
          v-for="(item, index) in selectdatedata"
          :key="index"
        >
          <view v-if="chooseflag === index" class="finordinqscr-tag3">
            <view class="finordinqscr-tag-text2 "> {{ item }}</view>
          </view>
          <view v-else class="finordinqscr-tag2">
            <view class="finordinqscr-tag-text " @click="switchflag(index)">
              {{ item }}</view
            >
          </view>
        </view>
      </view>
    </view>
    <view class="finordinqscr-space2 ">
      <view class="finordinqscr-title ">状态</view>
      <view class="finordinqscr-tag-box">
        <view
          class="finordinqscr-tag"
          v-for="(item, index) in selectgoodsdata"
          :key="index"
        >
          <view v-if="chooseflag2 === index" class="finordinqscr-tag3">
            <view class="finordinqscr-tag-text2 "> {{ item }}</view>
          </view>
          <view v-else class="finordinqscr-tag2">
            <view class="finordinqscr-tag-text " @click="switchflag2(index)">
              {{ item }}</view
            >
          </view>
        </view>
      </view>
    </view>
    <view class="finordinqscr-space2">
      <view class="finordinqscr-button-left"></view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      chooseflag: 1,
      chooseflag2: 1,
      selectdatedata: [
        '全部时间',
        '最近一周',
        '最近一个月',
        '最近三个月',
        '最近一年'
      ],
      selectgoodsdata: [
        '全部状态',
        '下单成功',
        '可赎货',
        '赎货中',
        '已赎货',
        '取消'
      ]
    };
  },
  methods: {
    switchflag(i) {
      this.chooseflag = i;
    },
    switchflag2(i) {
      this.chooseflag2 = i;
    }
  }
};
</script>

<style>
.finordinqscr-bg {
  width: 608px;
  background: #ffffff;
  padding: 72px 32px;
}
.finordinqscr-title {
  height: 42px;
  font-size: 30px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #333333;
  line-height: 42px;
}
.finordinqscr-input-box {
  margin-top: 24px;
  width: 532px;
  height: 60px;
  background: #ffffff;
  border-radius: 30px;
  border: 2px solid #dbdbdb;
  display: flex;
}
.finordinqscr-input {
  margin-left: 32px;
  margin-top: 14px;
  height: 34px;
  font-size: 24px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  line-height: 34px;
}
.finordinqscr-input-plaholsty {
  color: #dbdbdb;
}
.finordinqscr-space {
  margin-top: 60px;
}
.finordinqscr-space2 {
  margin-top: 28px;
}
.finordinqscr-tag-box {
  margin-top: 18px;
  width: 544px;
  display: flex;
  flex-wrap: wrap;
}
.finordinqscr-tag {
  margin-bottom: 32px;
  margin-right: 32px;
}
.finordinqscr-tag2 {
  width: 160px;
  height: 52px;
  border-radius: 26px;
  background: #f7f7f8;
}
.finordinqscr-tag3 {
  width: 160px;
  height: 52px;
  border-radius: 26px;
  background: #ecf6ff;
}
.finordinqscr-tag-text {
  text-align: center;
  height: 52px;
  font-size: 24px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #666666;
  line-height: 52px;
}
.finordinqscr-tag-text2 {
  text-align: center;
  height: 52px;
  font-size: 24px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #2283e2;
  line-height: 52px;
}
.finordinqscr-tag:nth-child(3n) {
  margin-bottom: 32px;
  margin-right: 0;
}
.finordinqscr-button-left {
  margin-left: 178px;
}
</style>
