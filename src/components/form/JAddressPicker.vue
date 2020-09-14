<template>
  <uni-popup
    ref="pop"
    type="bottom"
    @change="change">
    <scroll-view
      :scroll-y="true"
    >
      <view @tap="sureVal" class="picker-view-sure">确定</view>
      <picker-view class="picker-view-style" :value="value"
                   :indicator-style="indicatorStyle" @change="bindChange">

        <picker-view-column>
          <view class="item" v-for="(item,index) in addressData.province" :key="index">
            {{item.lafullname}}
          </view>
        </picker-view-column>
        <picker-view-column>
          <view class="item" v-for="(item,index) in addressData.city" :key="index">{{item.lafullname}}</view>
        </picker-view-column>
        <picker-view-column>
          <view class="item" v-for="(item,index) in addressData.area" :key="index">{{item.lafullname}}</view>
        </picker-view-column>
      </picker-view>
    </scroll-view>
  </uni-popup>
</template>
<script>
import {
  uniPopup
} from '@dcloudio/uni-ui';

export default {
  name: 'JAddressPicker',
  components: {
    uniPopup
  },
  props: {
    indicatorStyle: {
      type: [String]
    },
    // 显示隐藏
    show: {
      type: Boolean,
      default: false
    },
    addressData: {
      type: Object,
      default: () => {}
    },
    value: {
      type: Array
    }
  },
  watch: {
    show(val) {
      if (val) {
        this.$refs.pop.open();
      } else {
        this.$refs.pop.close();
      }
    }
  },
  created() {
    console.log(this.addressData);
  },
  methods: {
    change({ show }) {
      this.$emit('update:show', show);
    },
    bindChange(e) {
      const val = e.detail.value;
      this.$emit('changeData', val);
    },
    sureVal() {
      this.$emit('sureVal');
      this.$emit('update:show', false);
    }
  }
};
</script>
<style lang="scss">
.picker-view-sure{
  background: $theme-color;
  color: #fff;
  z-index: 100;
  position: absolute;
  right: 20px;
  top: 20px;
  padding: 10px 20px;
  border-radius: 10px;
}
.picker-view-style{
  position: relative;
  height: 500px;
  background: #fff;
  .item{
    text-align: center;
    line-height: 60px;
  }
}
</style>
