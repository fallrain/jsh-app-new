<template>
  <view class="jProductBtm">
    <view  v-if="groupType === 'zuhe'" class="jProductBtm-left">
      <view class="fs24 text-333">
        合计：<text class="text-theme">￥{{totalMoney*nums}}</text>
      </view>
      <view class="fs20 text-999">
        剩余可购买套数：<text class="text-theme">{{upperLimit}}</text>
      </view>
    </view>
    <view v-if="groupType === 'taocan'" class="jProductBtm-left">
      <view class="fs24 text-333">
        合计：<text class="text-theme">￥{{totalMoney}}</text>
      </view>
    </view>
    <view v-if="groupType === 'zuhe'" class="jProductBtm-right">
      <j-number-box
        @change="goodsNumChange"
      ></j-number-box>
      <button
        @tap="goOrder(true)"
        type="button"
        class="jProductBtm-right-btn active"
      >成套下单</button>
    </view>
    <view v-if="groupType === 'taocan'" class="jProductBtm-right">
      <view class="condition-style" v-if="!conditionStatus">未满足</view>
      <view class="condition-style" v-if="conditionStatus">满足</view>
      <button
        @tap="goOrder(conditionStatus)"
        type="button"
        :class="['jProductBtm-right-btn',conditionStatus&&'active']"
      >成套下单</button>
    </view>
  </view>
</template>

<script>
import './css/JProductBtm.scss';
import JNumberBox from '../common/JNumberBox';

export default {
  name: 'jProductBtm',
  components: {
    JNumberBox
  },
  props: {
    // 全选
    checked: {
      type: Boolean,
      default: false
    },
    groupType: {
      type: [String, Number]
    },
    totalMoney: {
      type: [String, Number]
    },
    upperLimit: {
      type: [String, Number]
    },
    conditionStatus: {
      type: Boolean
    }
  },
  data() {
    return {
      nums: 1
    };
  },
  created() {
    console.log(this.groupType);
    console.log(this.totalMoney);
  },
  methods: {
    choose() {
      const checked = !this.checked;
      this.$emit('update:checked', checked);
      this.$emit('checkAll', checked);
    },
    goodsNumChange({ value }) {
      this.nums = value;
    },
    goOrder(state) {
      if (state === true) {
        this.$emit('goOrder', this.nums);
      } else {
        uni.showToast({
          title: '条件未满足',
          icon: 'none'
        });
      }
    }
  }
};
</script>
