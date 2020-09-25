<template>
    <view class="message">
      <messageInfoListTab
          @tabClick="tabClick"
      >
      </messageInfoListTab>
      <view class="message-concent" v-show="tabIndex === 0">
        <view class="uni-flex uni-info" >
          <view class=" message-unread">共{{unread}}条消息未读</view>
          <view @tap="readAll" class=" message-read">全部已读</view>
          <view class=" message-vertical-line"></view>
          <view class=" message-category" @tap="getIsMessage">
            {{ tips }}
          </view>
          <i class="iconfont iconxia message-icon" @tap="getIsMessage"></i>
          <view class="message-list">
            <message-info-list-more :isMessage="isMessage" @messageName="messageName"></message-info-list-more>
          </view>
        </view>
        <mescroll-body
          ref="mescrollRef"
          @init="mescrollInit"
          @up="upCallback"
        >
          <view v-for="(item,index) in messageList" :key="index" class="message-textTalRow" @tap="showDetail(item.pk,item)">
            <view class="message-circular" v-if="isExpand"></view>
            <view class="uni-flex uni-row" >
                <view class="message-littleTitle">{{item.typeNameShow}}</view>
                <view class="message-title">{{item.title}}</view>
                <view class="message-time">{{item.createTime}}</view>
            </view>
            <view class="uni-flex uni-row">
                <view class="message-info">{{item.description}}</view>
                <view class="message-spot isNew" v-show="item.isNew"></view>
            </view>
          </view>
        </mescroll-body>
      </view>
      <view v-show="tabIndex === 1">
        <message-task></message-task>
      </view>
    </view>
</template>
<script>
import messageInfoListTab from './messageInfoListTab';
import messageTask from './messageTask';
import messageInfoListMore from './messageInfoListMore';
import MescrollBody from '@/components/plugin/mescroll-uni/mescroll-body.vue';
import mescrollMixin from '@/components/plugin/mescroll-uni/mescroll-mixins';
import selfMescrollMixin from '@/mixins/mescroll.mixin';
import {
  mapGetters
} from 'vuex';
import {
  USER
} from '@/store/mutationsTypes';

export default {
  name: 'messageInfoList',
  mixins: [
    mescrollMixin,
    selfMescrollMixin
  ],
  components: {
    messageInfoListTab,
    messageInfoListMore,
    MescrollBody,
    messageTask
  },
  data() {
    return {
      isMessage: false,
      // 未读
      isExpand: true,
      flag: false,
      tabIndex: 0,
      unread: 0,
      messageList: [],
      messageactive: 0,
      filter: {},
      complete: 0,
      tips: '消息提示',
      typeName: '',
    };
  },
  created() {
    console.log(this.tabIndex);
  },
  watch: {
    $route: ['tabClick']
  },
  computed: {
    ...mapGetters({
      saleInfo: USER.GET_SALE,
    })
  },
  onLoad() {
  },
  methods: {
    tabClick(item, index) {
      console.log(index);
      if (index === 0 || index === 1) {
        console.log(11111);
        this.tabIndex = index;
      } else {
        this.tabIndex = 0;
      }
      this.getMessageList();
    },
    messageName(item) {
      console.log(item);
      this.isMessage = false;
      this.tips = item.typeNameShow;
      if (item.typeNameShow === '全部消息') {
        this.filter = {};
      }
      this.typeName = item.typeName;
      console.log(this.typeName);
      this.flag = false;
      this.getMessageList();
    },
    getIsMessage() {
      this.isMessage = !this.isMessage;
    },
    async upCallback(pages) {
      /* 上推加载 */
      console.log('3333333dddddddddddddddddd');
      const scrollView = await this.getMessageList(pages);
      this.mescroll.endBySize(scrollView.pageSize, scrollView.total);
    },
    getSearch(pages) {
      console.log(pages);
    //  获取不同条件下的传参
      let param = {
        pageNum: pages.num,
        pageSize: 10,
        unitId: `${this.saleInfo.customerCode}_admin`,
      };
      if (!this.isExpand && this.flag) {
        this.filter.complete = 1;
        this.filter.createDateStr = '';
      }
      const massTypeName = {};
      if (this.typeName) {
        massTypeName.typeName = this.typeName;
      }
      param = {
        ...param,
        ...this.filter,
        ...massTypeName
      };
      return param;
    },
    async getMessageList(pages) {
      const scrollView = {};
      const param = this.getSearch(pages);
      console.log(param);
      const { code, data } = await this.messageService.messageList(param);
      let curList = [];
      if (code === '1') {
        const {
          list
        } = data;
        scrollView.pageSize = data.pageSize;
        scrollView.total = data.total;
        console.log(scrollView);
        curList = list;
        // this.complete =
        console.log(this.messageList);
        curList.map((item) => {
          // console.log(item);
          let num = 0;
          if (item.complete === 1) {
            this.isExpand = false;
          } else {
            this.isExpand = true;
            num += 1;
          }
          this.unread = num;
        });
        if (pages.num === 1) {
          this.messageList = curList;
        } else {
          this.messageList = this.messageList.concat(curList);
        }
      }
      return scrollView;
    },
    showDetail(id, item) {
      console.log(id, JSON.stringify(item));
      uni.navigateTo({
        url: `/pages/messageInfoList/messageInfoListDetail?id=${id}&item=${JSON.stringify(item)}`
      });
    },
    // 全部已读
    readAll() {
      const _this = this;
      uni.showModal({
        title: '',
        content: '确认全部已读吗',
        success(res) {
          if (res.confirm) {
            console.log(res);
            _this.updateAllMessageRead();
          } else if (res.cancel) {
            console.log('用户点击取消');
          }
        }
      });
    },
    async  updateAllMessageRead() {
      const { code } = await this.messageService.updateAllMessageRead({
        unitId: `${this.saleInfo.customerCode}_admin`
      });
      if (code === '1') {
        this.isExpand = false;
        this.flag = true;
        this.unread = 0;
        this.getMessageList();
      }
    },
    // 未读
    // async getNotReadMessageCount() {
    //   const { code, data } = await this.messageService.getNotReadMessageCount({
    //     unitId: `${this.saleInfo.customerCode}_admin`
    //   });
    //   if (code === '1') {
    //     // console.log('未读   1111');
    //     this.unread = data;
    //   }
    // }


  },
};
</script>
<style lang="scss" scoped>
.message {
  width:750px;
  height:1520px;
  background:rgba(245,245,245,1);

 .message-concent{
    box-sizing:border-box;
    width:750px;
    padding:24px;
    .uni-info{
      .message-unread{
          width:176px;
          height:34px;
          font-size:24px;
          font-family:PingFangSC-Light,PingFang SC;
          font-weight:300;
          color:rgba(102,102,102,1);
          line-height:34px;
          margin:0px 200px 24px 16px;
      }
      .message-read{
        height:34px;
        font-size:24px;
        font-family:PingFangSC-Regular,PingFang SC;
        font-weight:400;
        color:rgba(237,40,86,1);
        line-height:34px;
        margin:0px 34px 24px 16px;
      }
      .message-vertical-line{
        width:2px;
        height:26px;
        background:#C4C4C4;
        margin-top:4px;
      }
      .message-category{
        height:34px;
        font-size:24px;
        font-family:PingFangSC-Regular,PingFang SC;
        font-weight:400;
        color:rgba(237,40,86,1);
        line-height:34px;
        margin:0px 8px 24px 34px;
      }
      .message-list{
        position: absolute;
        z-index: 200;
        right: 24px;
        top: 180px;
      }
      .message-icon{
        font-size:10px;
        color:rgba(237,40,86,1);
        margin-top:10px;
        //position: reletive;
      }
    }

    .message-textTalRow{
      width:702px;
      height:142px;
      background:rgba(255,255,255,1);
      border-radius:20px;
      padding:24px;
      margin-bottom:24px;
      position:relative;
        .message-circular {
          width:15px;
          height:15px;
          border-radius: 10px;
          background: red;
          position: absolute;
          right:20px;
          top:90px;
        }
        .uni-flex{
          text-align:center;
          .message-littleTitle{
            width:88px;
            height:32px;
            background:rgba(237,40,86,1);
            border-radius:17px;
            font-size:16px;
            font-family:PingFangSC-Regular,PingFang SC;
            font-weight:400;
            color:rgba(255,255,255,1);
            line-height:32px;
            margin:8px 12px 8px 0px;
          }

          .message-title{
            width:272px;
            height:48px;
            font-size:34px;
            font-family:PingFangSC-Light,PingFang SC;
            font-weight:300;
            color:rgba(51,51,51,1);
            line-height:48px;
            margin-right:44px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow:ellipsis;
          }
          .message-time{
            width:238px;
            height:34px;
            font-size:24px;
            font-family:PingFangSC-Light,PingFang SC;
            font-weight:300;
            color:rgba(237,40,86,1);
            line-height:34px;
            text-align:right;
            margin:8px 0 6px 0px;
          }
          .message-info{
            width:616px;
            height:34px;
            font-size:24px;
            font-family:PingFangSC-Light,PingFang SC;
            font-weight:300;
            color:rgba(102,102,102,1);
            line-height:34px;
            margin-top:12px;
            white-space:nowrap;
            overflow:hidden;
            text-overflow:ellipsis;
            text-align:left;
          }
          .message-spot{
            width:16px;
            height:16px;
            background:rgba(237,40,86,1);
            margin:24px 0px 8px 22px;
            border-radius:20px;
            text-align:center;
            line-height:16px;
          }
        }

    }
  }
}

</style>
