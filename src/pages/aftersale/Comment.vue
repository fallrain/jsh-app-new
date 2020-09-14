<template>
  <view class="popup-bg">
    <view class="popup-row1">
      <view class="popup-row1-left">服务评价</view>
      <view class="popup-row1-right" @click="close">x</view>
    </view>
    <view class="popup-row2">亲！您对本次订单的售后服务评价是：</view>
    <view class="popup-row3">
      <view class="popup-row3-left">服务速度:</view>
      <view class="popup-row3-right">
        <image
          class="image2"
          v-for="(item, index) in star"
          :key="index"
          :src="item.aab"
          @click="comment(star, index)"
        />
      </view>
    </view>
    <view class="popup-row4">
      <view class="popup-row3-left">服务态度:</view>
      <view class="popup-row3-right">
        <image
          class="image2"
          v-for="(item, index) in star2"
          :key="index"
          :src="item.aab"
          @click="comment(star2, index)"
        />
      </view>
    </view>
    <view class="popup-row4">
      <view class="popup-row3-left">服务质量:</view>
      <view class="popup-row3-right">
        <image
          class="image2"
          v-for="(item, index) in star3"
          :key="index"
          :src="item.aab"
          @click="comment(star3, index)"
        />
      </view>
    </view>
    <view class="popup-row4">
      <view class="popup-row3-left">评价留言:</view>
    </view>
    <textarea class="text" maxlength="240" />
    <view class="popup-danger"
      >*
      亲，如果您对我们的服务有任何不满意的地方，请您说明清楚问题，以便我们后续解决和改进，谢谢！</view
    >
    <view class="popup-button">
      <view class="button-text">提交</view>
    </view>
  </view>
</template>

<script>
import bg1 from '../../assets/img/afterSale/1.png';
import bg4 from '../../assets/img/afterSale/3.png';

export default {
  data() {
    return {
      star: [
        { aab: bg4 },
        { aab: bg4 },
        { aab: bg4 },
        { aab: bg4 },
        { aab: bg4 }
      ],
      star2: [
        { aab: bg4 },
        { aab: bg4 },
        { aab: bg4 },
        { aab: bg4 },
        { aab: bg4 }
      ],
      star3: [
        { aab: bg4 },
        { aab: bg4 },
        { aab: bg4 },
        { aab: bg4 },
        { aab: bg4 }
      ],
      starnum: -1
    };
  },
  methods: {
    close() {
      this.$emit('close');
    },
    comment(b, a) {
      if (a == this.starnum) {
        return b.forEach((item, index) => {
          if (index <= a) {
            if (item.aab == bg1) {
              item.aab = bg4;
            } else {
              item.aab = bg1;
            }
          }
        });
      }
      this.starnum = a;
      b.forEach((item, index) => {
        if (index <= a) {
          item.aab = bg1;
        } else {
          item.aab = bg4;
        }
      });
    }
  }
};
</script>

<style>
.popup-bg {
  width: 750px;
  height: 858px;
  background: rgba(255, 255, 255, 1);
}
.popup-row1 {
  display: flex;
  height: 70px;
}
.popup-row2 {
  margin-left: 40px;
  margin-top: 52px;
  width: 476px;
  height: 40px;
  font-size: 28px;
  font-family: PingFangSC-Light, PingFang SC;
  font-weight: 300;
  color: rgba(102, 102, 102, 1);
  line-height: 40px;
}
.popup-row3 {
  margin-left: 40px;
  margin-top: 30px;
  display: flex;
  height: 40px;
}
.popup-row4 {
  margin-left: 40px;
  margin-top: 24px;
  display: flex;
  height: 40px;
}

.popup-row1-left {
  margin-left: 40px;
  margin-top: 28px;
  width: 120px;
  height: 42px;
  font-size: 30px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
  line-height: 42px;
}
.popup-row1-right {
  margin-left: 532px;
  margin-top: 26px;
  width: 18px;
  height: 44px;
  font-size: 32px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(237, 40, 86, 1);
  line-height: 44px;
}
.popup-row3-left {
  width: 140px;
  height: 40px;
  font-size: 28px;
  font-family: PingFangSC-Light, PingFang SC;
  font-weight: 300;
  color: rgba(102, 102, 102, 1);
  line-height: 40px;
}
.popup-row3-right {
  margin: 6px 0 4px 26px;
  height: 31px;
  display: flex;
}
.image2 {
  margin-left: 16px;
  width: 32px;
  height: 31px;
}
.text {
  margin-left: 40px;
  margin-top: 16px;
  margin-right: 50px;
  width: 660px;
  height: 112px;
  border: 2px solid rgba(218, 218, 218, 1);
  font-size: 28px;
  font-family: PingFangSC-Light, PingFang SC;
  font-weight: 300;
  color: rgba(102, 102, 102, 1);
  line-height: 40px;
}
.popup-danger {
  margin-left: 48px;
  margin-top: 12px;
  margin-right: 42px;
  width: 660px;
  height: 56px;
  font-size: 20px;
  font-family: PingFangSC-Light, PingFang SC;
  font-weight: 300;
  color: rgba(237, 40, 86, 1);
  line-height: 28px;
}
.popup-button {
  margin: 60px 24px 0 24px;
  width: 702px;
  height: 88px;
  background: rgba(34, 131, 226, 1);
  border-radius: 47px;
  display: flex;
}
.button-text {
  margin-left: 322px;
  margin-top: 24px;
  width: 60px;
  height: 40px;
  font-size: 30px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(255, 255, 255, 1);
  line-height: 40px;
}
</style>
