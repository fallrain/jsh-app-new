<template>
  <uni-popup ref="pop" type="bottom" @change="change">
    <view class="mask-ship">
      <view @tap="close" class="top-ship">
        <view class="top-ship-title">{{titles}}</view>
        <view class="top-ship-but">X</view>
      </view>
      <scroll-view
          :scroll-y="true"
          class="filter-drawer-cnt-list"
      >
        <view class="sorrowC-ship">
          <view :key="index" @tap="checkAct(index)" v-for="(ship,index) in info">
            <view class="uni-flex uni-row textSenRow-ship">
              <view class="textTick-ship col-15 iconfont icontick" :class="ship.checked ? 'cheched' :''"></view>
              <view class="textRow-ship col-80" :class="ship.checked ? 'cheched' :''">{{ship.name}}</view>
            </view>
          </view>
          <view class="line-ship"></view>
        </view>
      </scroll-view>
    </view>
  </uni-popup>
</template>

<script>

export default {
  name: 'proComShip',
  components: {
  },
  props: {// 父级传来的数据
    show: {
      type: Boolean,
      default: false
    },
    titles: {
      type: String
    },
    info: {// 图片以及产品数据
      type: Array,
      default() {
        return [];
      }
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
  methods: {
    close() { // 关闭按钮
      console.log(this.info);
      this.$emit('update:show', false);
    },
    change({ show }) {
      this.$emit('update:show', show);
    },
    checkAct(index) { // 选择活动
      this.info.forEach((inf) => {
        inf.checked = false;
      });
      this.info[index].checked = true;
      this.$emit('update:show', false);
      this.$emit('checkedShip', this.info, index);
    },
  }
};
</script>

<style scoped>
.filter-drawer-cnt-list {
  padding-left: 24px;
  max-height: 888px;
  overflow-y: auto;
  padding-top: 18px;
  height: calc(100% - 42px);
  padding-bottom: 40px;
}
/*.filter-drawer-cnt-list::-webkit-scrollbar {*/
/*  display: none;*/
/*}*/
  .mask-ship {
    position: relative;
    padding-top: 10px;
    padding-bottom: 120px;
    background: #fff;
  }
  .top-ship{
    display: flex;
    padding-bottom: 10px;
  }
  .top-ship-title{
    padding-left: 30px;
    padding-right: 75%;
    color: #333333;
    font-weight:500;
    font-size: 30px;
  }
  .top-ship-but{
    font-size: 32px;
    color: #ED2856;
  }
  .sorrowC-ship{
    padding-left: 24px;
    /*max-height: 888px;*/
    height: calc(100% - 42px);
    overflow-y: auto;
  }
  .textSenRow-ship {
    padding: 30px;
  }
  .textRow-ship {
    text-align: left;
    color: #666666;
    font-size: 28px;
  }
  .textTick-ship {
    text-align: center;
    color: #ffffff;
    font-size: 32px;
  }
  .line-ship {
    background-color: #F0F0F0;
    height: 2px;
  }
  .cheched {
    color: #ED2856;
  }

</style>
