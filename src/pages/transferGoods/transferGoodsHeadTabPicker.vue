<template>
  <view
    :class="['jHeadTabPicker',show && 'jHeadTabPicker-in']"
    v-reset-position
  >
    <view class="jHeadTabPicker-list">
      <view
        :class="['jHeadTabPicker-item',item.checked && 'active']"
        v-for="(item,index) in value"
        :key="index"
        @tap="choose(item)"
      >
        <view
          :class="['jHeadTabPicker-item-check iconfont icontick']"
        ></view>
        <text class="jHeadTabPicker-item-text j-text-ellipsis">{{item.name}}</text>
      </view>
    </view>
    <view class="jHeadTabPicker-btn-wrap">
      <button
        class="jHeadTabPicker-btn-default"
        type="button"
        @tap="confirm"
      >确定
      </button>
      <button
        class="jHeadTabPicker-btn-primary"
        type="button"
        @tap="reset"
      >重置
      </button>
    </view>
  </view>
</template>

<script>
export default {
  name: 'transferGoodsHeadTabPicker',
  props: {
    // 显示隐藏
    show: {
      type: Boolean,
      default: false
    },
    // 索引
    index: {
      type: [String, Number]
    },
    // picker数据
    value: {
      type: Array,
      default: () => {
      }
    },
    disable: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // disable: false
    };
  },
  directives: {
    // 重新判断组件应该的位置
    resetPosition: {
      inserted(el) {
        const {
          left
        } = el.parentElement.getBoundingClientRect();
        el.style.left = `-${left}px`;
      }
    }
  },
  watch: {
    // 监控show的状态，触发show事件
    show(val) {
      this.$emit('showChange', val);
    }
  },
  methods: {
    close() {
      /* 关闭 */
      this.$emit('update:show', false);
    },
    reset() {
      if (this.disable) {
        return;
      }
      this.value.forEach((v) => {
        v.checked = false;
      });
    },
    confirm() {
      /* 确定 */
      this.close();
      if (this.disable) {
        return;
      }
      this.$emit('confirm', this.index, this.value.find(v => v.checked));
    },
    choose(item) {
      console.log(this.disable);
      if (this.disable) {
        return;
      }
      /* 选中 */
      this.value.forEach((v) => {
        v.checked = false;
      });
      item.checked = true;
      this.$emit('change', this.value, this.index);
    }
  }
};
</script>

<style lang="scss">
  .jHeadTabPicker {
    position: absolute;
    z-index: 98;
    background: #F7F7F8;
    top: 100%;
    width: 100vw;
    min-height: 234px;
    padding-bottom: 80px;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    transform: translateY(-100%);
    transition: transform .3s;
    margin-top: -1px
  }

  .jHeadTabPicker-btn-wrap {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 80px;
  }

  @mixin jHeadTabPicker-btn {
    display: inline-block;
    width: 50%;
    height: 80px;
    line-height: 80px;
    font-size: 24px;
    text-align: center;
    border: 1px solid $theme-color;
    border-top: none;

  }

  .jHeadTabPicker-btn-default {
    @include jHeadTabPicker-btn;
    background: $theme-color;
    color: #fff;
    border-bottom-left-radius: 10px;
  }

  .jHeadTabPicker-btn-primary {
    @include jHeadTabPicker-btn;
    background: #fff;
    color: $theme-color;
    border-bottom-right-radius: 10px;
  }

  .jHeadTabPicker-list {
    display: flex;
    flex-wrap: wrap;
    padding-top: 18px;
    padding-left: 26px;
    padding-right: 26px;
  }

  .jHeadTabPicker-item {
    position: relative;
    width: 25%;
    height: 54px;
    line-height: 54px;
    display: flex;
    align-items: center;
    padding-left: 32px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    &.active {
      .iconfont {
        display: block;
        color: $theme-color;
      }

      .jHeadTabPicker-item-text {
        color: $theme-color;
      }
    }
  }

  .jHeadTabPicker-item-ZC {
    position: relative;
    width: 50%;
    height: 54px;
    line-height: 54px;
    display: flex;
    align-items: center;
    padding-left: 70px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    &.active {
      .iconfont {
        display: block;
        color: $theme-color;
      }

      .jHeadTabPicker-item-text {
        color: $theme-color;
      }
    }
  }

  .jHeadTabPicker-item-check {
    position: absolute;
    top: 50%;
    left: 0;
    display: none;
    transform: translateY(-50%);
    color: $theme-color;
    font-size: 26px;
  }

  .jHeadTabPicker-item-text {
    white-space: nowrap;
    font-size: 24px;
    color: #333;
  }

  .jHeadTabPicker-in {
    transform: translateY(0);
  }
</style>
