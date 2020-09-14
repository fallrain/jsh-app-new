<template>
  <view>
    <view class="transfer-search">
      <j-search-input
          v-model="name"
          @search="silentReSearch"
      ></j-search-input>
      <button
          type="button"
          class="transfer-btn"
          @tap="silentReSearch"
      >搜索
      </button>
    </view>
    <view class="history">
      <view class="history-nav">
        <view class="history-title">历史记录</view>
        <i
          class="iconfont iconlajitong"
          @click="deleteItem"
        ></i>
      </view>
      <view class="history-top">
        <view
          class="history-record"
          v-for="(item,index) in history"
          :key="index"
          @tap="goGoods(item)"
        >
          {{item}}
        </view>
      </view>
    </view>
  </view>
</template>
<script>
import JSearchInput from '../../components/form/JSearchInput';

export default {
  name: 'historical',
  components: {
    JSearchInput
  },
  data() {
    return {
      name: '',
      val: '',
      history: [],
      allMendli: {}
    };
  },
  onLoad(option) {
    const aaa = option.name;
    console.log(aaa);
    this.allMendli = JSON.parse(aaa);
    console.log(this.allMendli);
  },
  created() {
    console.log(localStorage.getItem('history'));
    if (localStorage.getItem('history')) {
      console.log(1111);
      this.history = JSON.parse(localStorage.getItem('history'));
    }
    // this.history = uni.getStorage({
    //   key: 'history'
    // });
    console.log(this.history);
  },
  methods: {
    silentReSearch() {
      /* 静默搜索 */
      // this.mescroll.resetUpScroll(true);
      if ((this.name).trim()) {
        uni.navigateTo({
          url: `/pages/goods/goodsList?name=${this.name}`
        });
        this.val = this.name;
        console.log(this.val);
        if (this.history && this.history.length > 0) { // 有数据的话 判断
          if (this.history.indexOf(this.val) !== -1) { // 有相同的，先删除 再添加
            this.history.splice(this.history.indexOf(this.val), 1);
            this.history.unshift(this.val);
          } else { // 没有相同的 添加
            this.history.unshift(this.val);
          }
        } else { // 没有数据 添加
          console.log(this.history);
          this.history.unshift(this.val);
        }
        if (this.history.length > 10) { // 保留六个值
          this.history.pop();
        }
        localStorage.setItem('history', JSON.stringify(this.history));
        // uni.setStorage({
        //   key: 'history',
        //   data: JSON.stringify(this.history),
        // });
      } else {
        uni.navigateTo({
          url: '/pages/goods/goodsList'
        });
      }
    },
    goGoods(item) {
      uni.navigateTo({
        url: `/pages/goods/goodsList?name=${item}`
      });
    },
    deleteItem() {
      localStorage.removeItem('history');
      this.history = [];
    }
  }


};
</script>

<style scoped>
/deep/ .jSearchInput-wrap{
  margin:24px 22px 24px 24px;
  z-index:100;
}
/deep/ .jSearchInput{
  margin:24px 22px 24px 24px;
  z-index:100;
}
.transfer-search {
  display: flex;
  border-bottom: 1px solid #F5F5F5;
}

.transfer-btn{
  width:160px;
  height:56px;
  background:rgba(237,40,86,1);
  border-radius:28px;
  font-size:28px;
  font-family:PingFangSC-Regular,PingFang SC;
  font-weight:400;
  color:rgba(255,255,255,1);
  line-height:56px;
  z-index: 100;
  margin:24px 24px 24px 0px;
}
.history {
  padding:30px 40px 0px 38px;
}
.history-nav {
  display: flex;
  justify-content: space-between;
  font-size: 32px;
  color: #333;
}
.iconfont {
  font-size: 32px;
  color: #999;
}
.history-top{
  display: flex;
  flex-wrap: wrap;
  margin-top:24px;

}
.history-record {

  color: #666;
  line-height: 56px;
  background: #EFEFEF;
  border-radius: 28px;
  height: 56px;
  font-size: 30px;
  text-align: center;
  margin-right: 40px;
  margin-bottom: 40px;
  padding-left: 20px;
  padding-right: 20px;
}


</style>
